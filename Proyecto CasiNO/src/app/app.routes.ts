import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Lobby } from './pages/lobby/lobby';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'registro', component: Register },
  { path: 'lobby', component: Lobby, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
