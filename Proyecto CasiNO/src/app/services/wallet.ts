import { Injectable, signal } from '@angular/core';
import { HistoryService } from './history';
import { MovementType } from '../models/casino.models';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly initialBalance = 5000;
  private readonly balanceSignal = signal(this.initialBalance);

  readonly balance = this.balanceSignal.asReadonly();

  constructor(private readonly historyService: HistoryService) {}

  canAfford(amount: number): boolean {
    return amount > 0 && this.balanceSignal() >= amount;
  }

  applyDelta(
    game: string,
    description: string,
    amount: number,
    type: MovementType,
  ): void {
    this.balanceSignal.update((current) => Math.max(0, current + amount));
    this.historyService.addMovement(game, description, amount, type);
  }

  resetBalance(): void {
    this.balanceSignal.set(this.initialBalance);
    this.historyService.addMovement(
      'Sistema',
      'Saldo reiniciado al valor inicial',
      0,
      'info',
    );
  }
}
