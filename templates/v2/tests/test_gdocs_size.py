#!/usr/bin/env python3
"""Google Docs import copies must stay under 20 KB."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output"
MAX = 20 * 1024


def main() -> int:
    files = [
        OUT / "Arc_Estimate_Template_v2_gdocs.docx",
        OUT / "Arc_Invoice_Template_v2_gdocs.docx",
    ]
    ok = True
    for path in files:
        if not path.is_file():
            print(f"FAIL: missing {path}")
            return 1
        size = path.stat().st_size
        print(f"{path.name}: {size} bytes")
        if size > MAX:
            print(f"FAIL: {path.name} exceeds {MAX} bytes")
            ok = False
    if ok:
        print("PASS: test_gdocs_size.py")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
