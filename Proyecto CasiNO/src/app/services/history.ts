import { Injectable, signal } from '@angular/core';
import { MovementEntry, MovementType } from '../models/casino.models';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly movementsSignal = signal<MovementEntry[]>([]);
  private nextId = 1;

  readonly movements = this.movementsSignal.asReadonly();

  addMovement(
    game: string,
    description: string,
    amount: number,
    type: MovementType,
  ): void {
    const movement: MovementEntry = {
      id: this.nextId++,
      game,
      description,
      amount,
      type,
      createdAt: new Date(),
    };

    this.movementsSignal.update((current) => [movement, ...current].slice(0, 250));
  }

  clear(): void {
    this.movementsSignal.set([]);
  }
}
