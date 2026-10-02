#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PYTHONPATH="${ROOT}/scripts:${PYTHONPATH:-}"
export PATH="${HOME}/libreoffice-prefix/opt/libreoffice25.8/program:${PATH}"

failed=0
for t in test_pdf_content.py test_docx_structure.py test_docx_edit.py test_gdocs_size.py test_calculator.py; do
  echo "==> ${t}"
  if ! python3 "${ROOT}/tests/${t}"; then
    failed=1
  fi
done
if [[ "${failed}" -ne 0 ]]; then
  echo "Some tests failed."
  exit 1
fi
echo "All tests passed."
