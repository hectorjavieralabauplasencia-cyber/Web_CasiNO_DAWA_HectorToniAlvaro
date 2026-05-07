@echo off
REM Script de instalacion automatica para CasiNO
REM Haz click derecho y "Run as administrator"

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   CASINO - Instalacion Automatica
echo ========================================
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo [ERROR] package.json no encontrado!
    echo.
    echo Por favor, ejecuta este script desde la raiz del proyecto.
    echo.
    pause
    exit /b 1
)

REM Paso 1: Limpiar cache anterior
echo [1/5] Limpiando cache anterior...
call npm cache clean --force >nul 2>&1

REM Paso 2: Instalar dependencias
echo [2/5] Instalando dependencias (esto puede tardar 1-2 minutos)...
call npm install
if errorlevel 1 (
    echo [ERROR] Fallo al instalar dependencias
    pause
    exit /b 1
)

REM Paso 3: Verificar auditoria
echo [3/5] Verificando seguridad (npm audit fix)...
call npm audit fix --silent >nul 2>&1

REM Paso 4: Verificar build
echo [4/5] Verificando que el build funciona...
call npm run build >nul 2>&1
if errorlevel 1 (
    echo [WARNING] El build fallo, pero npm install se completo
) else (
    echo [OK] Build verificado correctamente
)

REM Paso 5: Listo
echo.
echo ========================================
echo   ✓ INSTALACION COMPLETADA
echo ========================================
echo.
echo Comando para iniciar:
echo   npm start
echo.
echo Luego abre: http://localhost:4200
echo.
pause
