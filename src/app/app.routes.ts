import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./layout/register/register').then((m) => m.Register),
  },
  {
    path: 'lobby',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/lobby/lobby').then((m) => m.Lobby),
  },
  {
    path: 'producto/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/producto/producto').then((m) => m.Producto),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
