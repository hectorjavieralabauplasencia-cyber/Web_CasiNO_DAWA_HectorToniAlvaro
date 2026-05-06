import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { BetSlip, PlayingCard } from '../../../common/interfaces';
import { BettingService } from '../../../services/betting.service';
import { GameLogicService } from '../../../services/game-logic.service';

@Component({
  selector: 'app-blackjack',
  imports: [FormsModule],
  templateUrl: './blackjack.html',
  styleUrl: './blackjack.css',
})
export class Blackjack {
  betAmount = 100;
  deck: PlayingCard[] = [];
  playerCards: PlayingCard[] = [];
  dealerCards: PlayingCard[] = [];
  roundActive = false;
  statusMessage = 'Pulsa Repartir para iniciar una ronda.';

  private currentBet: BetSlip | null = null;

  constructor(
    private readonly bettingService: BettingService,
    private readonly gameLogic: GameLogicService,
  ) {}

  get playerScore(): number {
    return this.gameLogic.blackjackScore(this.playerCards);
  }

  get dealerScore(): number {
    return this.gameLogic.blackjackScore(this.dealerCards);
  }

  deal(): void {
    if (this.roundActive) {
      return;
    }

    const bet = this.bettingService.placeBet('Blackjack', this.betAmount, 'Apuesta de ronda');
    if (!bet) {
      this.statusMessage = 'Saldo insuficiente para repartir.';
      return;
    }

    this.currentBet = bet;
    this.roundActive = true;
    this.deck = this.gameLogic.shuffleDeck(this.gameLogic.createDeck());
    this.playerCards = [this.takeCard(), this.takeCard()];
    this.dealerCards = [this.takeCard(), this.takeCard()];
    this.statusMessage = 'Tu turno: pide carta o plantate.';

    if (this.playerScore === 21) {
      this.stand();
    }
  }

  hit(): void {
    if (!this.roundActive) {
      return;
    }

    this.playerCards.push(this.takeCard());
    if (this.playerScore > 21) {
      this.finishRound(0, 'Te pasaste de 21.');
    }
  }

  stand(): void {
    if (!this.roundActive) {
      return;
    }

    while (this.dealerScore < 17) {
      this.dealerCards.push(this.takeCard());
    }

    if (this.dealerScore > 21 || this.playerScore > this.dealerScore) {
      this.finishRound(2, 'Ganaste la ronda de blackjack.');
      return;
    }

    if (this.playerScore === this.dealerScore) {
      this.finishRound(1, 'Empate. Se devuelve tu apuesta.');
      return;
    }

    this.finishRound(0, 'La banca gana esta ronda.');
  }

  private finishRound(multiplier: number, message: string): void {
    if (!this.currentBet) {
      return;
    }

    this.bettingService.settleBet(this.currentBet, multiplier, message);
    this.currentBet = null;
    this.roundActive = false;
    this.statusMessage = message;
  }

  private takeCard(): PlayingCard {
    return this.deck.pop() ?? { rank: 'A', suit: '?', value: 11 };
  }
}


