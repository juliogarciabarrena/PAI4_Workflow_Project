#!/usr/bin/env bash
set -euo pipefail

SCAN_TYPE="$1"
REPORT_FILE="$2"
TEST_TITLE="$3"

if [ ! -f "$REPORT_FILE" ]; then
  echo "No existe el reporte: $REPORT_FILE"
  exit 1
fi

echo "Subiendo reporte a DefectDojo"
echo "Scan type: $SCAN_TYPE"
echo "Reporte: $REPORT_FILE"
echo "Test title: $TEST_TITLE"

curl --fail-with-body -sS -X POST "${DEFECTDOJO_URL}/api/v2/reimport-scan/" \
  -H "Authorization: Token ${DEFECTDOJO_TOKEN}" \
  -H "accept: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -F "scan_type=${SCAN_TYPE}" \
  -F "file=@${REPORT_FILE}" \
  -F "product_type_name=DevSecOps" \
  -F "product_name=Astronomy App" \
  -F "engagement_name=GitHub Actions DevSecOps" \
  -F "test_title=${TEST_TITLE}" \
  -F "auto_create_context=true" \
  -F "close_old_findings=true" \
  -F "deduplication_on_engagement=true" \
  -F "active=true" \
  -F "verified=false"