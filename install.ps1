#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de instalación automática para CasiNO
    
.DESCRIPTION
    Instala todas las dependencias y verifica que el proyecto funciona correctamente.
    
.EXAMPLE
    .\install.ps1
#>

$ErrorActionPreference = 'Continue'

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🎰 CASINO - Instalación Automática" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] package.json no encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, asegúrate de ejecutar este script desde la raíz del proyecto:" -ForegroundColor Yellow
    Write-Host "  Web_CasiNO_DAWA_HectorToniAlvaro/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Paso 1: Limpiar cache
Write-Host "[1/5] Limpiando cache anterior..." -ForegroundColor Yellow
npm cache clean --force 2>$null

# Paso 2: Instalar dependencias
Write-Host "[2/5] Instalando dependencias (esto puede tardar 1-2 minutos)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Fallo al instalar dependencias" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Paso 3: Audit fix
Write-Host "[3/5] Verificando seguridad (npm audit fix)..." -ForegroundColor Yellow
npm audit fix --silent 2>$null

# Paso 4: Verificar build
Write-Host "[4/5] Verificando que el build funciona..." -ForegroundColor Yellow
npm run build 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Build verificado correctamente" -ForegroundColor Green
} else {
    Write-Host "[WARNING] El build falló, pero npm install se completó" -ForegroundColor Yellow
}

# Paso 5: Completado
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✓ INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Abre una terminal PowerShell" -ForegroundColor White
Write-Host "  2. Ejecuta: " -ForegroundColor White -NoNewline
Write-Host "npm start" -ForegroundColor Green
Write-Host "  3. Abre tu navegador en: " -ForegroundColor White -NoNewline
Write-Host "http://localhost:4200" -ForegroundColor Green
Write-Host ""
Write-Host "Otros comandos útiles:" -ForegroundColor Cyan
Write-Host "  • npm run build    - Construir para producción" -ForegroundColor Gray
Write-Host "  • npm run watch    - Vigila cambios automáticamente" -ForegroundColor Gray
Write-Host "  • npm test         - Ejecutar pruebas" -ForegroundColor Gray
Write-Host ""

Read-Host "Presiona Enter para salir"
