import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { BetSlip, PlayingCard } from '../../../common/interfaces';
import { BettingService } from '../../../services/betting.service';
import { GameLogicService } from '../../../services/game-logic.service';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blackjack.html',
  styleUrls: ['./blackjack.css'],
})
export class Blackjack {
  private readonly bettingService = inject(BettingService);
  private readonly gameLogic = inject(GameLogicService);

  readonly betAmount = signal(100);
  readonly deck = signal<PlayingCard[]>([]);
  readonly playerCards = signal<PlayingCard[]>([]);
  readonly dealerCards = signal<PlayingCard[]>([]);
  readonly dealerCardHidden = signal(true);
  readonly roundActive = signal(false);
  readonly canHit = signal(false);
  readonly canStand = signal(false);
  readonly canDoubleDown = signal(false);
  readonly canSplit = signal(false);
  readonly statusMessage = signal('Pulsa Repartir para iniciar una ronda.');
  readonly roundResult = signal<{ won: boolean; message: string } | null>(null);

  private currentBet: BetSlip | null = null;

  get playerScore(): number {
    return this.gameLogic.blackjackScore(this.playerCards());
  }

  get dealerScore(): number {
    return this.gameLogic.blackjackScore(this.dealerCards());
  }

  get dealerVisibleScore(): number {
    if (this.dealerCardHidden()) {
      return this.gameLogic.blackjackScore([this.dealerCards()[0]]);
    }
    return this.dealerScore;
  }

  deal(): void {
    if (this.roundActive()) {
      return;
    }

    const bet = this.bettingService.placeBet(
      'Blackjack',
      this.betAmount(),
      'Apuesta de ronda',
    );
    if (!bet) {
      this.statusMessage.set('Saldo insuficiente para repartir.');
      return;
    }

    this.currentBet = bet;
    this.roundActive.set(true);
    this.roundResult.set(null);
    this.dealerCardHidden.set(true);

    const newDeck = this.gameLogic.shuffleDeck(this.gameLogic.createDeck());
    this.deck.set(newDeck);

    const playerCards = [this.takeCard(), this.takeCard()];
    this.playerCards.set(playerCards);

    const dealerCards = [this.takeCard(), this.takeCard()];
    this.dealerCards.set(dealerCards);

    this.updateActionButtons();

    if (this.playerScore === 21) {
      this.stand();
    } else {
      this.statusMessage.set('Tu turno: pide carta o plantate.');
    }
  }

  hit(): void {
    if (!this.canHit()) return;

    const newCards = [...this.playerCards(), this.takeCard()];
    this.playerCards.set(newCards);

    if (this.playerScore > 21) {
      this.finishRound(0, '¡Busto! Te pasaste de 21. Perdiste esta ronda.');
    } else {
      this.updateActionButtons();
      this.statusMessage.set(`Puntuación: ${this.playerScore}. Pide otra o plantate.`);
    }
  }

  stand(): void {
    if (!this.canStand() && this.roundActive()) return;

    this.dealerCardHidden.set(false);
    this.statusMessage.set('La banca juega...');

    setTimeout(() => {
      const dealerCards = [...this.dealerCards()];
      while (this.gameLogic.blackjackScore(dealerCards) < 17) {
        dealerCards.push(this.takeCard());
      }
      this.dealerCards.set(dealerCards);

      const playerScore = this.playerScore;
      const newDealerScore = this.gameLogic.blackjackScore(dealerCards);

      let multiplier = 0;
      let message = '';

      if (newDealerScore > 21) {
        multiplier = 2;
        message = '¡La banca se pasó! ¡Ganaste!';
      } else if (playerScore > newDealerScore) {
        multiplier = 2;
        message = '¡Ganaste esta ronda!';
      } else if (playerScore === newDealerScore) {
        multiplier = 1;
        message = 'Empate. Se devuelve tu apuesta.';
      } else {
        multiplier = 0;
        message = 'La banca gana esta ronda.';
      }

      this.finishRound(multiplier, message);
    }, 1000);
  }

  doubleDown(): void {
    if (!this.canDoubleDown()) return;

    const newBet = this.bettingService.placeBet(
      'Blackjack',
      this.betAmount(),
      'Double down',
    );
    if (!newBet) {
      this.statusMessage.set('Saldo insuficiente para double down.');
      return;
    }

    const newCards = [...this.playerCards(), this.takeCard()];
    this.playerCards.set(newCards);
    this.canDoubleDown.set(false);
    this.canHit.set(false);

    if (this.playerScore > 21) {
      this.finishRound(0, '¡Busto! Te pasaste de 21 con double down. Perdiste.');
    } else {
      this.statusMessage.set('Double down completado. La banca juega...');
      this.stand();
    }
  }

  split(): void {
    if (!this.canSplit()) return;

    const playerCards = this.playerCards();
    if (playerCards.length !== 2 || playerCards[0].rank !== playerCards[1].rank) {
      return;
    }

    const newBet = this.bettingService.placeBet('Blackjack', this.betAmount(), 'Split');
    if (!newBet) {
      this.statusMessage.set('Saldo insuficiente para split.');
      return;
    }

    this.statusMessage.set('Split realizado. Juegas ambas manos.');
    this.canSplit.set(false);
    this.updateActionButtons();
  }

  private updateActionButtons(): void {
    const canAct = this.roundActive();
    this.canHit.set(canAct && this.playerScore < 21);
    this.canStand.set(canAct && this.playerScore <= 21);
    this.canDoubleDown.set(
      canAct &&
        this.playerCards().length === 2 &&
        this.playerScore >= 9 &&
        this.playerScore <= 11,
    );
    this.canSplit.set(
      canAct &&
        this.playerCards().length === 2 &&
        this.playerCards()[0].rank === this.playerCards()[1].rank,
    );
  }

  private finishRound(multiplier: number, message: string): void {
    if (!this.currentBet) return;

    this.bettingService.settleBet(this.currentBet, multiplier, message);
    this.currentBet = null;
    this.roundActive.set(false);
    this.canHit.set(false);
    this.canStand.set(false);
    this.canDoubleDown.set(false);
    this.canSplit.set(false);
    this.roundResult.set({
      won: multiplier > 0,
      message,
    });
    this.statusMessage.set(message);
  }

  private takeCard(): PlayingCard {
    const currentDeck = this.deck();
    if (currentDeck.length === 0) {
      return { rank: 'A', suit: '?', value: 11 };
    }
    const card = currentDeck.pop()!;
    this.deck.set(currentDeck);
    return card;
  }
}


