#!/usr/bin/env bash
# Regenerate all Arc Signage v2 template outputs.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
export PYTHONPATH="${ROOT}/scripts:${PYTHONPATH:-}"

install_libreoffice_user() {
  local prefix="${HOME}/libreoffice-prefix"
  local ver="25.8.7"
  local soffice="${prefix}/opt/libreoffice${ver%.*}/program/soffice"
  if [[ -x "${soffice}" ]]; then
    export PATH="$(dirname "${soffice}"):${PATH}"
    return 0
  fi
  echo "LibreOffice not found; installing to ${prefix} (one-time)..."
  local tmp
  tmp="$(mktemp -d)"
  curl -fsSL -o "${tmp}/lo.tar.gz" \
    "https://download.documentfoundation.org/libreoffice/stable/${ver}/deb/x86_64/LibreOffice_${ver}_Linux_x86-64_deb.tar.gz"
  tar -xzf "${tmp}/lo.tar.gz" -C "${tmp}"
  mkdir -p "${prefix}"
  shopt -s nullglob
  for deb in "${tmp}"/LibreOffice_*/DEBS/libobasis*.deb "${tmp}"/LibreOffice_*/DEBS/libreoffice*.deb; do
    dpkg-deb -x "${deb}" "${prefix}"
  done
  export PATH="${prefix}/opt/libreoffice25.8/program:${PATH}"
  rm -rf "${tmp}"
}

if ! command -v soffice >/dev/null 2>&1; then
  install_libreoffice_user
fi

python3 -m pip install -q -r "${ROOT}/requirements.txt"
mkdir -p "${ROOT}/output"

python3 "${ROOT}/scripts/generate_arc_templates_v2.py"
python3 "${ROOT}/scripts/generate_arc_gdocs_v2.py"
python3 "${ROOT}/scripts/generate_arc_calculator_v2.py"

echo "Build complete. Outputs in ${ROOT}/output/"
