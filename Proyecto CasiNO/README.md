# CasiNO - Migracion Angular 21 + Estructura Escalable

Esta guia deja el proyecto listo con:
- Angular 21 (standalone)
- Routing lazy-loaded
- Configuracion moderna en `app.config.ts` (incluyendo zoneless)
- Bootstrap 5.3 configurado en `angular.json`

## 1) Estructura ANTES (tipica Angular 17 base)

```text
casi-no/
+-- angular.json
+-- package.json
+-- src/
¦   +-- main.ts
¦   +-- index.html
¦   +-- styles.css
¦   +-- app/
¦       +-- app.component.ts
¦       +-- app.component.html
¦       +-- app.component.scss
¦       +-- app.config.ts
¦       +-- app.routes.ts
+-- public/
```

## 2) Comandos de migracion a Angular 21

Ejecuta en orden:

```bash
npm install
npx ng update @angular/core@21 @angular/cli@21
npx ng update @angular/build
```

Si quieres SSR nativo:

```bash
npx ng add @angular/ssr
```

Si quieres Bootstrap:

```bash
npm install bootstrap@^5.3.0
```

Opcional (solo si vais a usar componentes Angular de Bootstrap):

```bash
npm install @ng-bootstrap/ng-bootstrap
```

## 3) Refactor de estructura recomendada (escalable)

> Nota: tu `angular.json` ya usa `"newProjectRoot": "projects"`.

### Opcion A (mantener app actual en `src/` y solo organizar por dominio)

```text
src/
+-- app/
    +-- core/
    ¦   +-- services/
    ¦   +-- guards/
    ¦   +-- interceptors/
    +-- shared/
    ¦   +-- components/
    ¦   +-- directives/
    ¦   +-- pipes/
    +-- features/
    ¦   +-- casino/
    ¦   ¦   +-- components/
    ¦   ¦   +-- casino.routes.ts
    ¦   +-- users/
    +-- pages/
    ¦   +-- home/
    ¦   +-- login/
    ¦   +-- register/
    +-- app.ts
    +-- app.config.ts
    +-- app.routes.ts
```

### Opcion B (workspace multi-proyecto en `projects/casi-no`)

```text
projects/
+-- casi-no/
    +-- src/
    ¦   +-- app/
    ¦       +-- core/
    ¦       +-- shared/
    ¦       +-- features/
    ¦       +-- pages/
    ¦       +-- app.component.ts
    ¦       +-- app.routes.ts
    +-- project.json (si usas estructura Nx/standalone workspace)
    +-- ...
```

Para crear una app nueva ya ubicada en `projects/`:

```bash
npx ng generate application casi-no --standalone --routing --style=scss
```

## 4) Snippet de `package.json` (dependencies)

```json
{
  "dependencies": {
    "@angular/common": "^21.2.0",
    "@angular/compiler": "^21.2.0",
    "@angular/core": "^21.2.0",
    "@angular/forms": "^21.2.0",
    "@angular/platform-browser": "^21.2.0",
    "@angular/router": "^21.2.0",
    "bootstrap": "^5.3.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0"
  }
}
```

## 5) Snippet exacto de `angular.json` (Bootstrap)

En `projects.<tuApp>.architect.build.options`:

```json
{
  "styles": [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/styles.css"
  ],
  "scripts": [
    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
  ]
}
```

## 6) `main.ts` y `app.config.ts` modernos

### `src/main.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

### `src/app/app.config.ts`

```ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
```

## 7) Rutas lazy-loaded (`app.routes.ts`)

```ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'lobby',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/lobby/lobby').then((m) => m.Lobby),
  },
  { path: '**', redirectTo: '' },
];
```

## 8) Validacion

```bash
npx ng serve
npx ng build --configuration production
```

## 9) Ejecucion rapida para profesora

```bash
npm install
npx ng serve
```

Abrir: `http://localhost:4200`

---

## Estado actual aplicado en este repo

- Bootstrap cargado desde `angular.json` (`styles` + `scripts`).
- `app.routes.ts` migrado a lazy loading con `loadComponent`.
- `app.config.ts` actualizado con providers modernos (router + zoneless).

## Script de recuperacion npm (Windows)

Si vuelve a salir EPERM/EACCES con npm, ejecuta:

```powershell
.\scripts\fix-npm.ps1
```
