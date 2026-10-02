"""Recalculate a spreadsheet with LibreOffice and read cell values from ODS."""
import subprocess
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from convert_docx import soffice_bin

TABLE_NS = "urn:oasis:names:tc:opendocument:xmlns:table:1.0"
OFFICE_NS = "urn:oasis:names:tc:opendocument:xmlns:office:1.0"
TEXT_NS = "urn:oasis:names:tc:opendocument:xmlns:text:1.0"
NS = {"table": TABLE_NS, "office": OFFICE_NS, "text": TEXT_NS}


def recalc_xlsx_to_values(xlsx_path: Path, sheet_index: int = 0) -> list[list[str | float | None]]:
    """Return row grids of calculated values from the given sheet (0 = first sheet)."""
    out_dir = xlsx_path.parent
    subprocess.run(
        [
            soffice_bin(),
            "--headless",
            "--convert-to",
            "ods",
            "--outdir",
            str(out_dir),
            str(xlsx_path),
        ],
        check=True,
        capture_output=True,
    )
    ods_path = out_dir / f"{xlsx_path.stem}.ods"
    if not ods_path.is_file():
        raise FileNotFoundError(f"LibreOffice did not produce {ods_path}")
    return _ods_sheet_grid(ods_path, sheet_index)


def _cell_value(cell: ET.Element) -> str | float | None:
    vtype = cell.get(f"{{{OFFICE_NS}}}value-type")
    if vtype in ("float", "currency", "percentage"):
        raw = cell.get(f"{{{OFFICE_NS}}}value")
        if raw is not None:
            return float(raw)
    if vtype == "string":
        texts = cell.findall(f".//{{{TEXT_NS}}}p")
        if texts and texts[0].text:
            return texts[0].text
    texts = cell.findall(f".//{{{TEXT_NS}}}p")
    if texts and texts[0].text:
        return texts[0].text
    return None


def _ods_sheet_grid(ods_path: Path, sheet_index: int) -> list[list[str | float | None]]:
    root = ET.fromstring(zipfile.ZipFile(ods_path).read("content.xml"))
    tables = root.findall(f".//{{{TABLE_NS}}}table")
    if sheet_index >= len(tables):
        raise IndexError(f"Sheet {sheet_index} not in ODS")
    table = tables[sheet_index]
    grid: list[list[str | float | None]] = []
    for row in table.findall(f"{{{TABLE_NS}}}table-row"):
        row_vals: list[str | float | None] = []
        for cell in row.findall(f"{{{TABLE_NS}}}table-cell"):
            repeat = int(cell.get(f"{{{TABLE_NS}}}number-columns-repeated", "1"))
            val = _cell_value(cell)
            for _ in range(repeat):
                row_vals.append(val)
        grid.append(row_vals)
    return grid


def amounts_by_label(grid: list[list[str | float | None]]) -> dict[str, float]:
    """Map summary labels (column E) to numeric amounts (column G)."""
    out: dict[str, float] = {}
    for row in grid:
        if len(row) < 5:
            continue
        label = row[4]
        if not isinstance(label, str):
            continue
        amount = None
        if len(row) >= 7 and isinstance(row[6], (int, float)):
            amount = float(row[6])
        elif len(row) >= 6 and isinstance(row[5], (int, float)):
            amount = float(row[5])
        if amount is not None:
            out[label] = amount
    return out


def cell_at(grid: list[list[str | float | None]], row: int, col: int):
    """1-based Excel row/col."""
    if row - 1 >= len(grid):
        return None
    r = grid[row - 1]
    if col - 1 < len(r):
        val = r[col - 1]
        if val is not None:
            return val
    for c in (7, 6, 5):
        if c - 1 < len(r) and isinstance(r[c - 1], (int, float)):
            return r[c - 1]
    for v in reversed(r):
        if isinstance(v, (int, float)):
            return v
    return None
