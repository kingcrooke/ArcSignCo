"""Shared paths for Arc Signage v2 template build."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
OUT = ROOT / "output"
LOGO = ASSETS / "arc_logo_navy_cropped.png"
LOGO_GDOCS = ASSETS / "arc_logo_gdocs.png"
LOGO_GDOCS_JPG = ASSETS / "arc_logo_gdocs.jpg"
