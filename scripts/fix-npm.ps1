$ErrorActionPreference = 'Stop'

Write-Host '[1/5] Limpiando cache local previa...'
if (Test-Path .npm-cache) {
  Remove-Item -Recurse -Force .npm-cache
}

Write-Host '[2/5] Configurando cache local del proyecto...'
cmd /c npm config set cache .npm-cache --location=project

Write-Host '[3/5] Reinstalando dependencias (sin audit/fund)...'
cmd /c npm install --cache .npm-cache --no-audit --no-fund

Write-Host '[4/5] Verificando build Angular...'
cmd /c npm run build

Write-Host '[5/5] Listo. Puedes arrancar con: npm start'
