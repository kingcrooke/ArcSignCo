#!/usr/bin/env python3
"""Build Google-Docs-friendly DOCX copies (small logo, stripped theme/styles)."""
import re
import shutil
import zipfile
from pathlib import Path

from lib_paths import LOGO_GDOCS, LOGO_GDOCS_JPG, OUT

from generate_arc_templates_v2 import build

GDOCS_MAX_BYTES = 20 * 1024
MINIMAL_STYLES = Path(__file__).resolve().parent / "gdocs_minimal_styles.xml"
NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def _strip_unused_parts(docx_path: Path) -> None:
    """Remove theme, font table, and other bloat from an existing DOCX."""
    tmp = docx_path.with_suffix(".tmp.zip")
    shutil.copy(docx_path, tmp)
    drop_exact = {
        "word/stylesWithEffects.xml",
        "word/fontTable.xml",
        "word/webSettings.xml",
        "word/theme/theme1.xml",
        "word/numbering.xml",
        "docProps/thumbnail.jpeg",
    }
    drop_prefixes = ("customXml/", "word/theme/")
    minimal_styles = MINIMAL_STYLES.read_bytes()
    with zipfile.ZipFile(tmp, "r") as zin:
        with zipfile.ZipFile(docx_path, "w", compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename in drop_exact or any(
                    item.filename.startswith(p) for p in drop_prefixes
                ):
                    continue
                data = zin.read(item.filename)
                if item.filename == "[Content_Types].xml":
                    for part in (
                        "theme1.xml",
                        "fontTable.xml",
                        "webSettings.xml",
                        "stylesWithEffects.xml",
                        "numbering.xml",
                    ):
                        data = re.sub(
                            rf'<Override[^>]+PartName="/word/{part}"[^/]*/>'.encode(),
                            b"",
                            data,
                        )
                    data = re.sub(
                        rb'<Override[^>]+PartName="/docProps/thumbnail\.jpeg"[^/]*/>',
                        b"",
                        data,
                    )
                if item.filename == "word/_rels/document.xml.rels":
                    for target in ("theme/theme1.xml", "fontTable.xml", "numbering.xml"):
                        data = re.sub(
                            rf'<Relationship[^>]+Target="{target}"[^/]*/>'.encode(),
                            b"",
                            data,
                        )
                if item.filename == "word/styles.xml":
                    data = minimal_styles
                if item.filename == "word/document.xml":
                    data = _compact_document_xml(data)
                if item.filename == "word/settings.xml":
                    data = b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'
                zout.writestr(item, data)
    tmp.unlink(missing_ok=True)


def _compact_document_xml(data: bytes) -> bytes:
    """Shrink document.xml for smaller gdocs packages."""
    text = data.decode("utf-8")
    text = re.sub(r'\s+w14:[^=]+="[^"]*"', "", text)
    text = re.sub(r'\s+w15:[^=]+="[^"]*"', "", text)
    text = re.sub(r'\s+w:rsid\w+="[0-9A-F]+"', "", text)
    text = re.sub(r"<w:proofErr[^/]*/>", "", text)
    return text.encode("utf-8")


def _replace_logo(docx_path: Path, logo: Path) -> None:
    logo_bytes = logo.read_bytes()
    tmp = docx_path.with_suffix(".logo.zip")
    with zipfile.ZipFile(docx_path, "r") as zin:
        media = [n for n in zin.namelist() if n.startswith("word/media/")]
        if not media:
            raise RuntimeError(f"No media in {docx_path}")
        old_name = media[0]
        new_name = "word/media/image1.jpeg"
        with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == old_name:
                    continue
                data = zin.read(item.filename)
                if item.filename == "word/_rels/document.xml.rels":
                    data = data.replace(old_name.split("/")[-1].encode(), b"image1.jpeg")
                if item.filename == "[Content_Types].xml":
                    data = data.replace(b"image/png", b"image/jpeg")
                if item.filename == "word/document.xml":
                    data = data.replace(old_name.split("/")[-1].encode(), b"image1.jpeg")
                    data = data.replace(b"image/png", b"image/jpeg")
                zout.writestr(item, data)
            zout.writestr(new_name, logo_bytes)
    tmp.replace(docx_path)


def optimize_gdocs(docx_path: Path) -> None:
    _replace_logo(docx_path, LOGO_GDOCS_JPG if LOGO_GDOCS_JPG.is_file() else LOGO_GDOCS)
    _strip_unused_parts(docx_path)
    size = docx_path.stat().st_size
    if size > GDOCS_MAX_BYTES:
        raise RuntimeError(f"{docx_path.name} is {size} bytes (max {GDOCS_MAX_BYTES})")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for kind in ("estimate", "invoice"):
        src = build(kind, logo_path=LOGO_GDOCS, suffix="_gdocs", logo_width_inches=1.85)
        optimize_gdocs(src)
        print(src, src.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
