# CasiNO - Guía Rápida de Inicio

## 🎬 Comienza en 5 minutos

### 1️⃣ **Instala dependencias**
```bash
npm install
```

### 2️⃣ **Inicia servidor de desarrollo**
```bash
npm start
```

### 3️⃣ **Abre en navegador**
```
http://localhost:4200
```

### 4️⃣ **Accede con credenciales demo**
- **Usuario**: `demo`
- **Contraseña**: `demo1234`
- **Saldo inicial**: 5000 fichas

---

## 🎰 Los 5 Juegos

### **Ruleta** 🎡
- Apuesta en **rojo/negro** (x2) o **número exacto** (x36)
- Rueda visual con animación
- Historial de últimas tiradas

### **Blackjack** 🂡
- Juega contra la banca
- Hit, Stand, Double Down, Split
- Gana si tienes 21 sin pasarte

### **Poker Texas Hold'em** 🃏
- Juega contra 4 bots con IA
- 5 fases: Pre-flop, Flop, Turn, River, Showdown
- Desde escalera de color (x12) hasta carta alta

### **Slots** 🎰
- Máquina tragaperras 3 rodillos
- 3 símbolos iguales = Jackpot (hasta x10)
- 2 iguales = x1.5

### **Carreras de Enanos** 🧚
- Apuesta por un enano
- Carrera a 100 metros
- Multiplicadores de x2 a x5 según velocidad

---

## 💡 Consejos de Juego

1. **Empieza pequeño** - Prueba con 100 fichas
2. **Observa el historial** - Panel derecho muestra todas las transacciones
3. **Reinicia saldo** - Botón en la esquina superior si te acabas el dinero
4. **Alterna juegos** - Cada uno tiene diferente probabilidad
5. **Prueba las acciones** - En Blackjack usa Double Down y Split estratégicamente

---

## ⚙️ Comandos Útiles

```bash
# Desarrollo
npm start              # Inicia servidor

# Build
npm run build          # Build para producción

# Testing
npm test              # Ejecutar tests

# Linting
ng lint               # Verificar código

# Watch
npm run watch         # Compilación en modo watch
```

---

## 🎨 Personalización

### Cambiar tema
Edita `src/styles.css` y modifica las variables CSS:
```css
:root {
  --casino-gold: #f6c04a;      /* Color dorado */
  --casino-red: #da2f56;       /* Rojo */
  --casino-green: #16a673;     /* Verde */
  --casino-neon: #42d7ff;      /* Neon */
}
```

### Cambiar saldo inicial
En `src/app/services/wallet.service.ts`:
```typescript
private readonly initialBalance = 5000; // Cambia este valor
```

### Ajustar multiplicadores
Abre cada componente de juego y modifica los multiplicadores en la lógica.

---

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
npm start
```

### Error de puertos (puerto 4200 en uso)
```bash
# Usa otro puerto
ng serve --port 4300
```

### No se guardan cambios en localStorage
- Verifica que no estés en modo incógnito
- Limpia el cache del navegador (Ctrl+Shift+Del)

---

## 📚 Estructura de Archivos Clave

```
src/
├── app/
│   ├── components/games/          ← Los 5 juegos
│   ├── services/                  ← Lógica compartida
│   ├── layout/                    ← Login/Lobby
│   └── common/                    ← Guards e interfaces
└── styles.css                     ← Estilos globales
```

---

## 🔗 Enlaces Útiles

- [Angular Docs](https://angular.io/docs)
- [Bootstrap 5](https://getbootstrap.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📞 Soporte

Revisa `COMPLETE.md` para documentación completa y detalles técnicos.

---

**¡Listo para jugar!** 🎲✨
