#!/usr/bin/env python3
"""Convert DOCX to PDF and page-1 PNG via LibreOffice + PyMuPDF."""
import os
import shutil
import subprocess
from pathlib import Path


def soffice_bin() -> str:
    env = os.environ.get("SOFFICE")
    if env and Path(env).is_file():
        return env
    for name in ("soffice", "libreoffice"):
        p = shutil.which(name)
        if p:
            return p
    lo = Path.home() / "libreoffice-prefix/opt/libreoffice25.8/program/soffice"
    if lo.is_file():
        return str(lo)
    raise RuntimeError("LibreOffice (soffice) not found; set SOFFICE or install LibreOffice")


def docx_to_pdf(docx_path: Path, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            soffice_bin(),
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            str(out_dir),
            str(docx_path),
        ],
        check=True,
        capture_output=True,
    )
    pdf = out_dir / f"{docx_path.stem}.pdf"
    if not pdf.is_file():
        raise FileNotFoundError(f"Expected PDF at {pdf}")
    return pdf


def pdf_first_page_png(pdf_path: Path, png_path: Path, dpi: int = 110) -> Path:
    import pymupdf

    doc = pymupdf.open(pdf_path)
    if len(doc) != 1:
        raise ValueError(f"{pdf_path.name}: expected 1 page, got {len(doc)}")
    page = doc[0]
    zoom = dpi / 72.0
    mat = pymupdf.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    pix.save(str(png_path))
    doc.close()
    return png_path


def convert_docx(docx_path: Path, out_dir: Path | None = None) -> tuple[Path, Path]:
    out_dir = out_dir or docx_path.parent
    pdf = docx_to_pdf(docx_path, out_dir)
    png = out_dir / f"{docx_path.stem}.png"
    pdf_first_page_png(pdf, png)
    return pdf, png
