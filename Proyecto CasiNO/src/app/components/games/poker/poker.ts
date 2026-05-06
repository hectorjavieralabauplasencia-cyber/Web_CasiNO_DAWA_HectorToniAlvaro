import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { PlayingCard } from '../../../common/interfaces';
import { BettingService } from '../../../services/betting.service';
import { GameLogicService } from '../../../services/game-logic.service';

@Component({
  selector: 'app-poker',
  imports: [FormsModule],
  templateUrl: './poker.html',
  styleUrl: './poker.css',
})
export class Poker {
  betAmount = 100;
  hand: PlayingCard[] = [];
  handLabel = 'Sin mano';
  statusMessage = 'Pulsa Repartir mano para jugar poker mini.';

  constructor(
    private readonly bettingService: BettingService,
    private readonly gameLogic: GameLogicService,
  ) {}

  dealHand(): void {
    const bet = this.bettingService.placeBet('Poker', this.betAmount, 'Apuesta de mano poker');
    if (!bet) {
      this.statusMessage = 'Saldo insuficiente para jugar poker.';
      return;
    }

    const deck = this.gameLogic.shuffleDeck(this.gameLogic.createDeck());
    this.hand = deck.slice(0, 5);

    const evaluation = this.gameLogic.evaluatePokerHand(this.hand);
    this.handLabel = evaluation.label;
    this.bettingService.settleBet(
      bet,
      evaluation.multiplier,
      evaluation.multiplier > 0
        ? `Mano ganadora: ${evaluation.label}`
        : 'Mano sin premio',
    );

    this.statusMessage =
      evaluation.multiplier > 0
        ? `Buen juego: ${evaluation.label} (x${evaluation.multiplier})`
        : 'No hubo premio en esta mano.';
  }
}


