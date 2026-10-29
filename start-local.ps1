$ErrorActionPreference = 'Stop'
$port = 8000
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }
if (-not $python) {
    Write-Error 'Python 3 was not found. Install Python 3, then run this script again.'
    exit 1
}
Write-Host "Serving this folder at http://localhost:$port"
Write-Host 'Press Ctrl+C to stop the local server.'
if ($python.Name -eq 'py.exe') {
    & $python.Source -3 -m http.server $port --bind 127.0.0.1
} else {
    & $python.Source -m http.server $port --bind 127.0.0.1
}
