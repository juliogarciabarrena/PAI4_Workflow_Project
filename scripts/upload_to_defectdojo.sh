#!/usr/bin/env bash
set -euo pipefail

SCAN_TYPE="$1"
REPORT_FILE="$2"
TEST_TITLE="$3"
ENGAGEMENT_NAME="${4:-GitHub Actions DevSecOps}"

PRODUCT_TYPE_NAME="${PRODUCT_TYPE_NAME:-DevSecOps}"
PRODUCT_NAME="${PRODUCT_NAME:-Astronomy App}"

if [ ! -f "$REPORT_FILE" ]; then
  echo "No existe el reporte: $REPORT_FILE"
  exit 1
fi

if [ -z "${DEFECTDOJO_URL:-}" ]; then
  echo "Falta DEFECTDOJO_URL"
  exit 1
fi

if [ -z "${DEFECTDOJO_TOKEN:-}" ]; then
  echo "Falta DEFECTDOJO_TOKEN"
  exit 1
fi

echo "Subiendo reporte a DefectDojo"
echo "Scan type: $SCAN_TYPE"
echo "Reporte: $REPORT_FILE"
echo "Product type: $PRODUCT_TYPE_NAME"
echo "Product: $PRODUCT_NAME"
echo "Engagement: $ENGAGEMENT_NAME"
echo "Test title: $TEST_TITLE"

curl --fail-with-body -sS -X POST "${DEFECTDOJO_URL}/api/v2/reimport-scan/" \
  -H "Authorization: Token ${DEFECTDOJO_TOKEN}" \
  -H "accept: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -F "scan_type=${SCAN_TYPE}" \
  -F "file=@${REPORT_FILE}" \
  -F "product_type_name=${PRODUCT_TYPE_NAME}" \
  -F "product_name=${PRODUCT_NAME}" \
  -F "engagement_name=${ENGAGEMENT_NAME}" \
  -F "test_title=${TEST_TITLE}" \
  -F "auto_create_context=true" \
  -F "close_old_findings=true" \
  -F "deduplication_on_engagement=true" \
  -F "active=true" \
  -F "verified=false"