#!/usr/bin/env python3
"""PDF text checks for Arc v2 templates."""
import re
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output"

LICENSE_PATTERNS = [
    re.compile(r"license\s*(#|no\.?|number)", re.I),
    re.compile(r"\bLIC\s*#", re.I),
    re.compile(r"sign\s*license", re.I),
]


def pdf_text(path: Path) -> str:
    doc = pymupdf.open(path)
    return "\n".join(page.get_text() for page in doc)


def count_substring(text: str, needle: str) -> int:
    return text.count(needle)


def main() -> int:
    est_pdf = OUT / "Arc_Estimate_Template_v2.pdf"
    inv_pdf = OUT / "Arc_Invoice_Template_v2.pdf"
    for p in (est_pdf, inv_pdf):
        if not p.is_file():
            print(f"FAIL: missing {p}")
            return 1

    est = pdf_text(est_pdf)
    inv = pdf_text(inv_pdf)

    errors = []

    post_est = count_substring(est, "83 Post")
    post_inv = count_substring(inv, "83 Post")
    if post_est != 0:
        errors.append(f"estimate PDF: '83 Post' count {post_est}, expected 0")
    if post_inv != 1:
        errors.append(f"invoice PDF: '83 Post' count {post_inv}, expected 1")

    for label, text in (("estimate", est), ("invoice", inv)):
        if "917" in text:
            errors.append(f"{label} PDF: contains forbidden '917'")
        if re.search(r"Net\s*7", text, re.I):
            errors.append(f"{label} PDF: contains 'Net 7'")
        for pat in LICENSE_PATTERNS:
            if pat.search(text):
                errors.append(f"{label} PDF: possible license number ({pat.pattern})")

    if errors:
        for e in errors:
            print(f"FAIL: {e}")
        return 1

    print("PASS: test_pdf_content.py")
    print(f"  estimate: 83 Post=0, no 917/Net 7/license")
    print(f"  invoice: 83 Post=1, no 917/Net 7/license")
    return 0


if __name__ == "__main__":
    sys.exit(main())
