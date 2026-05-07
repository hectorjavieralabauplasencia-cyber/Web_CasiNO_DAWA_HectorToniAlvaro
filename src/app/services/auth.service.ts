import { Injectable, signal } from '@angular/core';

interface RegisteredUser {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'casino-users-v1';
  private readonly sessionKey = 'casino-session-v1';
  private readonly currentUserSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    const sessionUser = localStorage.getItem(this.sessionKey);
    if (sessionUser) {
      this.currentUserSignal.set(sessionUser);
    }

    if (this.readUsers().length === 0) {
      this.register('demo', 'demo@casino.test', 'demo1234');
    }
  }

  get isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  login(username: string, password: string): boolean {
    const user = this.readUsers().find(
      (item) => item.username === username && item.password === password,
    );

    if (!user) {
      return false;
    }

    this.currentUserSignal.set(user.username);
    localStorage.setItem(this.sessionKey, user.username);
    return true;
  }

  register(username: string, email: string, password: string): boolean {
    const users = this.readUsers();
    const alreadyExists = users.some(
      (user) =>
        user.username.toLowerCase() === username.toLowerCase() ||
        user.email.toLowerCase() === email.toLowerCase(),
    );

    if (alreadyExists) {
      return false;
    }

    users.push({ username, email, password });
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.sessionKey);
  }

  private readUsers(): RegisteredUser[] {
    const rawUsers = localStorage.getItem(this.storageKey);
    if (!rawUsers) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawUsers) as RegisteredUser[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
