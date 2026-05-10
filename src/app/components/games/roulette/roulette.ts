import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BettingService } from '../../../services/betting.service';
import { GameLogicService } from '../../../services/game-logic.service';

interface RouletteRound {
  spin: number;
  color: 'red' | 'black' | 'green';
  outcome: string;
  won: boolean;
}

@Component({
  selector: 'app-roulette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roulette.html',
  styleUrls: ['./roulette.css'],
})
export class Roulette {
  private readonly bettingService = inject(BettingService);
  private readonly gameLogic = inject(GameLogicService);

  readonly betAmount = signal(100);
  readonly betType = signal<'color' | 'number'>('color');
  readonly selectedColor = signal<'red' | 'black'>('red');
  readonly selectedNumber = signal(7);

  readonly isSpinning = signal(false);
  readonly wheelRotation = signal(0);
  readonly lastSpin = signal<RouletteRound | null>(null);
  readonly rounds = signal<RouletteRound[]>([]);
  readonly statusMessage = signal('Realiza tu apuesta y gira la ruleta.');

  private currentBet: any = null;

  // Números de ruleta (37 números: 0-36)
  readonly rouletteNumbers = Array.from({ length: 37 }, (_, i) => i);

  spin(): void {
    if (this.isSpinning()) return;

    const betDescription =
      this.betType() === 'color'
        ? `Apuesta color ${this.selectedColor()}`
        : `Apuesta número ${this.selectedNumber()}`;

    const bet = this.bettingService.placeBet('Ruleta', this.betAmount(), betDescription);
    if (!bet) {
      this.statusMessage.set('Saldo insuficiente para esa apuesta.');
      return;
    }

    this.currentBet = bet;
    this.isSpinning.set(true);
    this.statusMessage.set('La ruleta gira...');

    // Animación de giro (360 * 5 + offset hacia el resultado)
    const spinDuration = 3000;
    const resultNumber = this.gameLogic.rouletteSpin();
    const degreesPerNumber = 360 / 37;
    const targetDegrees = 360 * 5 + resultNumber * degreesPerNumber;

    // Simular spinning
    const spinStart = Date.now();
    const spinAnimation = setInterval(() => {
      const elapsed = Date.now() - spinStart;
      const progress = elapsed / spinDuration;

      if (progress < 1) {
        // Ease-out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        this.wheelRotation.set(targetDegrees * easeProgress);
      } else {
        clearInterval(spinAnimation);
        this.wheelRotation.set(targetDegrees);
        this.finishSpin(resultNumber);
      }
    }, 16);
  }

  private finishSpin(resultNumber: number): void {
    const color = this.gameLogic.rouletteColor(resultNumber);

    const won =
      this.betType() === 'color'
        ? color === this.selectedColor()
        : resultNumber === this.selectedNumber();

    const multiplier = won ? (this.betType() === 'color' ? 2 : 36) : 0;
    const resultText = won
      ? `¡Ganaste! ${resultNumber} ${color}`
      : `Perdiste. ${resultNumber} ${color}`;

    if (this.currentBet) {
      this.bettingService.settleBet(this.currentBet, multiplier, resultText);
    }

    const round: RouletteRound = {
      spin: resultNumber,
      color,
      outcome: won ? 'Victoria' : 'Derrota',
      won,
    };

    this.lastSpin.set(round);
    this.rounds.update((r: RouletteRound[]) => [round, ...r].slice(0, 10));
    this.statusMessage.set(resultText);
    this.isSpinning.set(false);
    this.currentBet = null;
  }

  getNumberColor(num: number): 'red' | 'black' | 'green' {
    return this.gameLogic.rouletteColor(num);
  }
}


