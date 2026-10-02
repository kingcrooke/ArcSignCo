#!/usr/bin/env python3
"""Structure checks for Arc v2 DOCX templates."""
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output"
W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W_NS}
DRAWING_NS = {
    "w": W_NS,
    "wps": "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
    "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006",
}


def analyze_docx(path: Path) -> dict:
    with zipfile.ZipFile(path) as zf:
        doc = zf.read("word/document.xml")
    root = ET.fromstring(doc)
    tables = root.findall(".//{%s}tbl" % W_NS)
    textboxes = root.findall(".//{%s}txbxContent" % W_NS)
    drawings = root.findall(".//{%s}drawing" % W_NS)
    # Inline pictures only (no anchors)
    anchors = root.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}anchor")
    pics = root.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/picture}pic")
    media_count = 0
    with zipfile.ZipFile(path) as zf:
        media_count = sum(1 for n in zf.namelist() if n.startswith("word/media/"))
    return {
        "tables": len(tables),
        "textboxes": len(textboxes),
        "drawings": len(drawings),
        "anchors": len(anchors),
        "pictures": len(pics),
        "media_files": media_count,
    }


def main() -> int:
    files = [
        OUT / "Arc_Estimate_Template_v2.docx",
        OUT / "Arc_Invoice_Template_v2.docx",
    ]
    ok = True
    for path in files:
        if not path.is_file():
            print(f"FAIL: missing {path}")
            return 1
        stats = analyze_docx(path)
        print(f"{path.name}: {stats}")
        if stats["textboxes"] != 0:
            print(f"FAIL: {path.name} has text boxes")
            ok = False
        if stats["anchors"] != 0:
            print(f"FAIL: {path.name} has floating anchors")
            ok = False
        if stats["media_files"] != 1:
            print(f"FAIL: {path.name} expected 1 media file, got {stats['media_files']}")
            ok = False
        if stats["tables"] < 5:
            print(f"FAIL: {path.name} expected multiple tables, got {stats['tables']}")
            ok = False
    if ok:
        print("PASS: test_docx_structure.py")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
