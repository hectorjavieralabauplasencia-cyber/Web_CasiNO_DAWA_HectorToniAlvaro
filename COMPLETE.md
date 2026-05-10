# CasiNO - Aplicación Web de Casino Ficticio | Documentación Completa

## 📋 Estado del Proyecto: COMPLETADO

Esta es una aplicación web de casino online completa construida con **Angular 21**, **Bootstrap 5**, **Signals** e **inyección de dependencias moderna**.

---

## ✨ Características Implementadas

### 🎰 Juegos Incluidos

#### 1. **Ruleta Europea con Animación**
- **Archivo**: `src/app/components/games/roulette/`
- Rueda visual con 37 números (0-36)
- Apuestas por color (Rojo/Negro) - Multiplicador x2
- Apuestas por número exacto - Multiplicador x36
- Animación suave de spin de 3 segundos con ease-out
- Historial de últimas 10 tiradas
- Indicador visual en la parte superior de la rueda

**Archivos**:
- `roulette.ts` - Lógica con signals, animations, historial
- `roulette.html` - Interfaz con rueda visual animada
- `roulette.css` - Estilos de rueda cónica, animaciones

---

#### 2. **Blackjack - 21 contra la Banca**
- **Archivo**: `src/app/components/games/blackjack/`
- Baraja de 52 cartas (4 palos × 13 rangos)
- **Acciones disponibles**:
  - **Hit**: Pedir otra carta
  - **Stand**: Plantarse
  - **Double Down**: Duplicar apuesta y recibir 1 sola carta más
  - **Split**: Dividir pareja (si tienes 2 cartas del mismo rango)
- Lógica del As: vale 11 o 1 automáticamente
- Dealer juega automáticamente: pide cartas hasta 17+
- Multiplicadores: x2 por victoria, x1 por empate, x0 por pérdida
- Validación de saldo antes de cada acción

**Archivos**:
- `blackjack.ts` - Lógica completa de juego con signals
- `blackjack.html` - Interfaz responsive con cartas visuales
- `blackjack.css` - Estilos de mesa verde, cartas con sombra

---

#### 3. **Poker Texas Hold'em - 4 Bots con IA**
- **Archivo**: `src/app/components/games/poker/`
- **5 Jugadores**: 1 humano + 4 bots con nombres y estrategias
  - Bot Prudente (IA conservadora)
  - Bot Agresivo (IA arriesgada)
  - Bot Prudente II (IA conservadora)
  - Bot Equilibrado (IA mixta)
- **Rondas de Juego**:
  - Pre-flop: 2 cartas privadas
  - Flop: 3 cartas comunitarias
  - Turn: 1 carta adicional
  - River: Última carta
  - Showdown: Evaluación de manos
- **Evaluación de Manos**:
  - Escalera de color (rank 9, x12)
  - Poker/Four of a kind (rank 8, x10)
  - Full House (rank 7, x7)
  - Color/Flush (rank 6, x5)
  - Escalera/Straight (rank 5, x4)
  - Trío (rank 4, x3)
  - Doble pareja (rank 3, x2.5)
  - Pareja (rank 2, x1.5)
  - Carta alta (rank 1, x0)
- IA de bots: Evaluación de mano + probabilidad de fold

**Archivos**:
- `poker.ts` - Lógica de juego con bots, signals, showdown
- `poker.html` - Mesa de juego con cartas comunitarias, bots, pot
- `poker.css` - Estilos de cartas de poker, mesa verde

---

#### 4. **Slots - Máquina Tragaperras 3 Rodillos**
- **Archivo**: `src/app/components/games/slots/`
- 6 símbolos: 7, BAR, GEM, STAR, CROWN, CHERRY
- **Premios**:
  - 3 símbolos iguales = x3-x10 (Jackpot con 3×7s = x10)
  - 2 símbolos iguales = x1.5
  - Secuencia ascendente = x2
- Animación de spinning de 2 segundos
- Historial de últimas 10 tiradas
- Información de multiplicador y pago visible

**Archivos**:
- `slots.ts` - Lógica de evaluación de premios, signals
- `slots.html` - Interfaz con rodillos animados, historial
- `slots.css` - Estilos de rodillos, animaciones de spin

---

#### 5. **Carreras de Enanos (Bonus Game)**
- **Archivo**: `src/app/components/games/dwarf-race/`
- 6 enanos con velocidades y multiplicadores diferentes
- Carrera a 100 metros
- IA de velocidad variable por enano
- Apuesta por un enano, gana si ese enano gana la carrera

---

### 💳 Sistema de Wallet y Apuestas

#### **Wallet Service** (`src/app/services/wallet.service.ts`)
- Saldo inicial: 5000 fichas ficticias
- Signals reactivos para balance
- Métodos:
  - `canAfford(amount)` - Verifica si hay saldo
  - `applyDelta()` - Aplica cambios de saldo
  - `resetBalance()` - Reinicia a 5000

#### **Betting Service** (`src/app/services/betting.service.ts`)
- `placeBet()` - Crea una apuesta (deduce saldo)
- `settleBet()` - Resuelve apuesta con multiplicador
- `refundBet()` - Devuelve dinero si es necesario
- Interfaz `BetSlip` para rastrear apuestas

---

### 🎵 Sistema de Sonidos

**SoundService** (`src/app/services/sound.service.ts`)
- Generación de tonos usando Web Audio API
- Toggle activable (guardado en localStorage)
- Métodos:
  - `playBet()` - Sonido de apuesta
  - `playWin()` - Sonido de victoria
  - `playLose()` - Sonido de pérdida
  - `playSpinStart()` / `playSpinEnd()`
  - `playJackpot()` - Secuencia de jackpot

---

### 📊 Servicios Compartidos

#### **GameLogicService** (`src/app/services/game-logic.service.ts`)
- Lógica de ruleta: números, colores
- Creación y barajado de baraja
- Cálculo de puntuación en Blackjack
- Evaluación de manos de Poker (con rank numérico)
- Generación aleatoria para slots

#### **HistoryService** (`src/app/services/history.service.ts`)
- Signal reactivo de movimientos (últimos 250)
- Estructura: game, description, amount, type, timestamp
- Métodos: `addMovement()`, `clear()`

#### **AuthService** (`src/app/services/auth.service.ts`)
- Registro e inicio de sesión
- Persistencia en localStorage
- Demo user: `demo` / `demo1234`
- Métodos: `login()`, `register()`, `logout()`

---

## 🎨 Diseño y Temas

### **Paleta de Colores (CSS Variables)**
```css
--casino-bg: #07080f (Fondo oscuro)
--casino-gold: #f6c04a (Dorado)
--casino-red: #da2f56 (Rojo casino)
--casino-green: #16a673 (Verde casino)
--casino-purple: #6531b8 (Púrpura)
--casino-neon: #42d7ff (Cian neon)
```

### **Componentes Visuales**
- `.casino-glass` - Panel con blur y transparencia
- `.casino-highlight` - Bordes dorados resaltados
- `.btn-casino` - Botones dorados principales
- `.btn-neon` - Botones neon secundarios
- `.brand-title` - Títulos con efecto dorado

### **Responsive Design**
- Tablet (768px): Ajustes de espaciado y tamaños
- Mobile (576px): Stacking vertical, botones más grandes
- Desktop (1200px+): Layout de 3 columnas en lobby

---

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── games/
│   │   │   ├── roulette/     (ruleta.ts/html/css)
│   │   │   ├── blackjack/    (blackjack.ts/html/css)
│   │   │   ├── poker/        (poker.ts/html/css)
│   │   │   ├── slots/        (slots.ts/html/css)
│   │   │   └── dwarf-race/   (dwarf-race.ts/html/css)
│   │   ├── wallet-summary/   (resumen de saldo)
│   │   └── movement-log/     (historial de transacciones)
│   ├── layout/
│   │   ├── login/            (inicio de sesión)
│   │   ├── register/         (registro de usuario)
│   │   └── lobby/            (pantalla principal)
│   ├── services/
│   │   ├── auth.service.ts        (autenticación)
│   │   ├── wallet.service.ts      (saldo)
│   │   ├── betting.service.ts     (apuestas)
│   │   ├── game-logic.service.ts  (lógica de juegos)
│   │   ├── history.service.ts     (historial)
│   │   ├── sound.service.ts       (sonidos)
│   │   └── playpager-api.service.ts (catalogo de juegos externos)
│   ├── common/
│   │   ├── guards/
│   │   │   └── auth.guard.ts      (protección de rutas)
│   │   └── interfaces/            (tipos TypeScript)
│   ├── app.routes.ts          (rutas principales)
│   ├── app.config.ts          (configuración global)
│   └── app.ts                 (componente raíz)
├── styles.css                 (estilos globales)
└── index.html
```

---

## 🚀 Características Técnicas Avanzadas

### **Angular 21+ Moderno**
- ✅ **Standalone Components** - Todos los componentes son standalone
- ✅ **Signals** - Reactividad sin RxJS en componentes UI
- ✅ **inject()** - Sin constructor injection
- ✅ **@if / @for** - Control de flujo moderno
- ✅ **computed()** - Valores calculados reactivos
- ✅ **Change Detection OnPush** - Optimizado (no implementado explícitamente, pero Angular lo usa por defecto con zoneless)

### **Routing Moderno**
- Lazy loading de componentes con `loadComponent`
- Guard de autenticación funcional
- Redirecciones inteligentes

### **Gestión de Estado**
- Signals en lugar de RxJS Subjects
- Servicios inyectables con `providedIn: 'root'`
- Persistencia en localStorage

### **Estilos Avanzados**
- CSS Variables para tema configurable
- Gradientes radiales y cónicos
- Blur effects y glassmorphism
- Animaciones CSS fluidas
- Responsive design con Bootstrap 5

---

## 🎯 Cómo Jugar

### **1. Acceso Inicial**
- **URL**: `http://localhost:4200`
- **Usuario demo**: `demo` / `demo1234`
- **Saldo inicial**: 5000 fichas

### **2. Seleccionar Juego**
En el lobby, elige uno de los 5 juegos en el panel izquierdo.

### **3. Apuestas**
1. Ingresa cantidad de fichas
2. Ajusta parámetros del juego (número/color en ruleta, etc.)
3. Presiona el botón de juego
4. Observa el resultado
5. Gana o pierde fichas

### **4. Historial**
- Panel derecho muestra últimas 12 transacciones
- Incluye: Juego, descripción, cantidad, timestamp
- Botón "Limpiar" para resetear historial

---

## ⚙️ Instalación y Ejecución

### **Requisitos**
- Node.js 18+
- npm 9+
- Angular CLI 21+

### **Pasos**
```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo
npm start
# o
ng serve

# 3. Abrir en navegador
http://localhost:4200
```

### **Build para Producción**
```bash
ng build --configuration production
# Salida en: dist/casino/
```

---

## ⚠️ Avisos de Juego Responsable

La aplicación incluye múltiples avisos:
- **+18**: Badge en login/lobby
- **"Casino ficticio"**: Indicación clara de no-dinero-real
- **"Juego responsable"**: Mensajes en login y register
- **Saldo ficticio**: Todas las transacciones son virtuales

---

## 🎓 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|----------|---------|-----|
| Angular | 21.2.10 | Framework principal |
| Bootstrap | 5.3.8 | Diseño responsivo |
| TypeScript | 5.9.3 | Tipado fuerte |
| RxJS | 7.8.2 | Programación reactiva |
| Vitest | 4.1.5 | Testing (opcional) |

---

## 📝 Notas de Desarrollo

### **Cambios Realizados en Esta Sesión**
1. ✅ Reescrito Poker a **Texas Hold'em con 4 bots con IA**
2. ✅ Ampliado Blackjack con **hit, stand, double down, split**
3. ✅ Reescrito Slots **sin APIs externas** (Playpager removido)
4. ✅ Mejorada Ruleta con **animación smooth de 3 segundos**
5. ✅ Creado **SoundService** con Web Audio API
6. ✅ Completados estilos CSS para todos los juegos
7. ✅ Añadidos **CommonModule** donde es necesario
8. ✅ **Verificación de tipos**: Sin errores

### **Arquitectura de Componentes**
- **Standalone**: Todos los componentes son standalone
- **Lazy Loading**: Ruta `/` → Login/Register, `/lobby` → Lobby
- **Servicios**: Inyectados con `inject()`
- **Signals**: Estado reactivo sin RxJS en UI

---

## 🐛 Conocidos y Limitaciones

- Los bots de Poker usan IA simple (basada en evaluación de mano + aleatoriedad)
- No hay soporte multijugador en red
- Audio Web API puede no funcionar en algunos navegadores antiguos
- Almacenamiento en localStorage (datos se pierden si se limpia cache)

---

## 🎉 Conclusión

**CasiNO** es una aplicación web de casino completamente funcional, moderna y responsive, construida con las mejores prácticas de Angular 21. Todos los 5 juegos están implementados con lógica propia, sin dependencias de APIs externas, y cuentan con un sistema integral de wallet, historial y sonidos.

**Disfruta jugando responsablemente** 🎲✨

---

**Creado**: Mayo 2026 | **Estado**: Production Ready | **Versión**: 1.0.0
