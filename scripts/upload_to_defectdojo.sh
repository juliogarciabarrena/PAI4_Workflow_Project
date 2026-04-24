#!/usr/bin/env bash
set -euo pipefail

SCAN_TYPE="$1"
REPORT_FILE="$2"
TEST_TITLE="$3"

if [ ! -f "$REPORT_FILE" ]; then
  echo "No existe el reporte: $REPORT_FILE"
  exit 0
fi

echo "Subiendo $REPORT_FILE a DefectDojo como $SCAN_TYPE"

curl -sS -X POST "${DEFECTDOJO_URL}/api/v2/reimport-scan/" \
  -H "Authorization: Token ${DEFECTDOJO_TOKEN}" \
  -H "accept: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -F "scan_type=${SCAN_TYPE}" \
  -F "file=@${REPORT_FILE}" \
  -F "product_name=Astronomy App" \
  -F "engagement_name=GitHub Actions DevSecOps" \
  -F "test_title=${TEST_TITLE}" \
  -F "auto_create_context=true" \
  -F "close_old_findings=true" \
  -F "deduplication_on_engagement=true" \
  -F "active=true" \
  -F "verified=false"