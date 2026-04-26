param(
    [string]$ScanType,
    [string]$ReportFile,
    [string]$TestTitle,
    [string]$EngagementName = "GitHub Actions DevSecOps"
)

$ProductTypeName = "DevSecOps"
$ProductName = "Astronomy App"

if (-not $env:DEFECTDOJO_URL) {
    Write-Error "Falta DEFECTDOJO_URL"
    exit 1
}

if (-not $env:DEFECTDOJO_TOKEN) {
    Write-Error "Falta DEFECTDOJO_TOKEN"
    exit 1
}

if (-not (Test-Path $ReportFile)) {
    Write-Error "No existe el reporte: $ReportFile"
    exit 1
}

Write-Host "Subiendo reporte a DefectDojo"
Write-Host "Scan type: $ScanType"
Write-Host "Reporte: $ReportFile"
Write-Host "Product type: $ProductTypeName"
Write-Host "Product: $ProductName"
Write-Host "Engagement: $EngagementName"
Write-Host "Test title: $TestTitle"

curl.exe --fail-with-body -sS -X POST "$env:DEFECTDOJO_URL/api/v2/reimport-scan/" `
  -H "Authorization: Token $env:DEFECTDOJO_TOKEN" `
  -H "accept: application/json" `
  -H "ngrok-skip-browser-warning: true" `
  -F "scan_type=$ScanType" `
  -F "file=@$ReportFile" `
  -F "product_type_name=$ProductTypeName" `
  -F "product_name=$ProductName" `
  -F "engagement_name=$EngagementName" `
  -F "test_title=$TestTitle" `
  -F "auto_create_context=true" `
  -F "close_old_findings=true" `
  -F "deduplication_on_engagement=true" `
  -F "active=true" `
  -F "verified=false"