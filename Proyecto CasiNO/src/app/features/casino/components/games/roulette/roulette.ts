import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BettingService } from '../../../../../core/services/betting';
import { GameLogicService } from '../../../../../core/services/game-logic';

interface RouletteRound {
  spin: number;
  color: string;
  outcome: string;
}

@Component({
  selector: 'app-roulette',
  imports: [FormsModule],
  templateUrl: './roulette.html',
  styleUrl: './roulette.css',
})
export class Roulette {
  betAmount = 100;
  betType: 'color' | 'number' = 'color';
  selectedColor: 'red' | 'black' = 'red';
  selectedNumber = 7;

  lastSpin: RouletteRound | null = null;
  rounds: RouletteRound[] = [];
  statusMessage = 'Realiza tu apuesta y gira la ruleta.';

  constructor(
    private readonly bettingService: BettingService,
    private readonly gameLogic: GameLogicService,
  ) {}

  spin(): void {
    const betDescription =
      this.betType === 'color'
        ? `Apuesta color ${this.selectedColor}`
        : `Apuesta numero ${this.selectedNumber}`;

    const bet = this.bettingService.placeBet('Ruleta', this.betAmount, betDescription);
    if (!bet) {
      this.statusMessage = 'Saldo insuficiente para esa apuesta.';
      return;
    }

    const spin = this.gameLogic.rouletteSpin();
    const color = this.gameLogic.rouletteColor(spin);

    const won =
      this.betType === 'color'
        ? color === this.selectedColor
        : spin === this.selectedNumber;

    const multiplier = won ? (this.betType === 'color' ? 2 : 36) : 0;
    const resultText = won
      ? `Ganaste en ruleta (${spin} ${color})`
      : `Perdiste en ruleta (${spin} ${color})`;

    this.bettingService.settleBet(bet, multiplier, resultText);

    const round: RouletteRound = {
      spin,
      color,
      outcome: won ? 'Victoria' : 'Derrota',
    };

    this.lastSpin = round;
    this.rounds = [round, ...this.rounds].slice(0, 8);
    this.statusMessage = resultText;
  }
}


