import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/users/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/users/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'lobby',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/casino/pages/lobby/lobby').then((m) => m.Lobby),
  },
  { path: '**', redirectTo: '' },
];
