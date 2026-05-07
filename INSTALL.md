# 🎰 Instalación del Proyecto CasiNO

## ⚡ Instalación Rápida

### Opción 1: Script Automático (Recomendado)
Ejecuta este archivo en PowerShell (click derecho > Ejecutar con PowerShell):
```
install.ps1
```

### Opción 2: Comandos Manuales
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start

# 3. Construir para producción
npm run build
```

## 📋 Requisitos Previos
- **Node.js**: v18 o superior
- **npm**: v11.6.2 (o compatible)

## 🚀 Comandos Disponibles

```bash
npm start           # Inicia el servidor de desarrollo (puerto 4200)
npm run build       # Construye para producción
npm run watch       # Vigila cambios y reconstruye
npm test            # Ejecuta pruebas
npm run ng          # Ejecuta CLI de Angular directamente
```

## 📂 Estructura del Proyecto

```
Web_CasiNO_DAWA_HectorToniAlvaro/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── games/
│   │   │   ├── movement-log/
│   │   │   └── wallet-summary/
│   │   ├── layout/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── lobby/
│   │   ├── services/
│   │   └── common/
│   └── index.html
├── package.json
└── angular.json
```

## 🐛 Solución de Problemas

### Error: "Could not find module"
```bash
npm install
```

### Problemas con cache
```bash
npm cache clean --force
npm install
```

### Puerto 4200 en uso
```bash
ng serve --port 4300
```

## ✅ Verificación

Una vez instalado, deberías ver:
- ✅ `node_modules/` - Carpeta de dependencias
- ✅ Servidor corriendo en `http://localhost:4200`
- ✅ Sin errores en la consola

## 📞 Contacto

Si hay problemas, verifica:
1. Versión de Node.js: `node --version`
2. Versión de npm: `npm --version`
3. Intenta limpiar cache: `npm cache clean --force && npm install`

---
**Última actualización**: 07/05/2026
