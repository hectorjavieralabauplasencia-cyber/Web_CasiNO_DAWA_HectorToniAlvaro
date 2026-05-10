import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BettingService } from '../../../services/betting.service';
import { GameLogicService } from '../../../services/game-logic.service';

interface SlotsRound {
  reels: string[];
  won: boolean;
  payout: number;
  multiplier: number;
  message: string;
}

@Component({
  selector: 'app-slots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slots.html',
  styleUrls: ['./slots.css'],
})
export class Slots {
  private readonly bettingService = inject(BettingService);
  private readonly gameLogic = inject(GameLogicService);

  readonly betAmount = signal(100);
  readonly reels = signal<string[]>(['7', '7', '7']);
  readonly isSpinning = signal(false);
  readonly statusMessage = signal('Haz girar los rodillos y prueba suerte.');
  readonly lastRound = signal<SlotsRound | null>(null);
  readonly spinHistory = signal<SlotsRound[]>([]);

  private readonly slotSymbols = ['7', 'BAR', 'GEM', 'STAR', 'CROWN', 'CHERRY'];
  private currentBet: any = null;

  spin(): void {
    if (this.isSpinning()) return;

    const amount = this.betAmount();
    const bet = this.bettingService.placeBet('Slots', amount, 'Apuesta en slots');
    if (!bet) {
      this.statusMessage.set('Saldo insuficiente para girar.');
      return;
    }

    this.currentBet = bet;
    this.isSpinning.set(true);
    this.statusMessage.set('Girando...');

    // Animación de spinning
    const spinDuration = 2000;
    const spinInterval = setInterval(() => {
      const newReels = Array.from({ length: 3 }, () =>
        this.slotSymbols[this.gameLogic.randomInt(this.slotSymbols.length)],
      );
      this.reels.set(newReels);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);

      // Resultado final
      const finalReels = Array.from({ length: 3 }, () =>
        this.slotSymbols[this.gameLogic.randomInt(this.slotSymbols.length)],
      );
      this.reels.set(finalReels);

      const result = this.evaluateSpins(finalReels, amount);
      this.processResult(result);

      this.isSpinning.set(false);
    }, spinDuration);
  }

  private evaluateSpins(reels: string[], betAmount: number): SlotsRound {
    const [reel1, reel2, reel3] = reels;

    let multiplier = 0;
    let message = '';

    // Tres iguales
    if (reel1 === reel2 && reel2 === reel3) {
      if (reel1 === '7') {
        multiplier = 10;
        message = '¡JACKPOT! ¡Tres 7s! ¡Ganaste mucho!';
      } else if (reel1 === 'CROWN') {
        multiplier = 5;
        message = '¡Tres coronas! ¡Excelente!';
      } else {
        multiplier = 3;
        message = `¡Tres ${reel1}s! ¡Ganaste!`;
      }
    }
    // Dos iguales
    else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      multiplier = 1.5;
      message = 'Dos símbolos iguales. Ganaste.';
    }
    // Escalera de símbolos
    else if (this.isSequence(reels)) {
      multiplier = 2;
      message = '¡Secuencia! Ganaste.';
    } else {
      multiplier = 0;
      message = 'Sin premio esta vez. ¡Intenta de nuevo!';
    }

    return {
      reels,
      won: multiplier > 0,
      payout: Math.round(betAmount * multiplier),
      multiplier,
      message,
    };
  }

  private isSequence(reels: string[]): boolean {
    const symbolOrder = this.slotSymbols;
    const indices = reels.map((symbol) => symbolOrder.indexOf(symbol));
    return (
      indices[0] < indices[1] &&
      indices[1] < indices[2]
    );
  }

  private processResult(result: SlotsRound): void {
    if (!this.currentBet) return;

    this.bettingService.settleBet(this.currentBet, result.multiplier, result.message);
    this.lastRound.set(result);
    this.spinHistory.update((history: SlotsRound[]) => [result, ...history].slice(0, 10));
    this.statusMessage.set(result.message);
    this.currentBet = null;
  }
}


