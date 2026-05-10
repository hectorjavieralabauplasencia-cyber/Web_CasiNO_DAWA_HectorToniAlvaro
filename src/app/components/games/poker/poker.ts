import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { PlayingCard, BetSlip } from '../../../common/interfaces';
import { BettingService } from '../../../services/betting.service';
import { GameLogicService } from '../../../services/game-logic.service';

interface PokerPlayer {
  id: string;
  name: string;
  hand: PlayingCard[];
  balance: number;
  isFolded: boolean;
  currentBet: number;
  bestHand: { label: string; rank: number };
}

interface GameRound {
  deck: PlayingCard[];
  communityCards: PlayingCard[];
  players: PokerPlayer[];
  currentPlayerIndex: number;
  pot: number;
  roundPhase: 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown' | 'finished';
}

@Component({
  selector: 'app-poker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poker.html',
  styleUrls: ['./poker.css'],
})
export class Poker {
  private readonly bettingService = inject(BettingService);
  private readonly gameLogic = inject(GameLogicService);

  readonly betAmount = signal(100);
  readonly gameRound = signal<GameRound | null>(null);
  readonly playerHand = signal<PlayingCard[]>([]);
  readonly statusMessage = signal('Presiona Jugar para comenzar una ronda de Texas Hold\'em.');
  readonly roundHistory = signal<string[]>([]);
  readonly lastWinner = signal<string>('');

  private currentBet: BetSlip | null = null;

  playRound(): void {
    const amount = this.betAmount();
    const bet = this.bettingService.placeBet('Poker Texas Hold\'em', amount, 'Apuesta de mesa');
    if (!bet) {
      this.statusMessage.set('Saldo insuficiente para jugar.');
      return;
    }

    this.currentBet = bet;
    this.initializeRound();
  }

  private initializeRound(): void {
    const deck = this.gameLogic.shuffleDeck(this.gameLogic.createDeck());
    const humanPlayer: PokerPlayer = {
      id: 'human',
      name: 'Tu',
      hand: [deck.pop()!, deck.pop()!],
      balance: this.betAmount(),
      isFolded: false,
      currentBet: this.betAmount(),
      bestHand: { label: '', rank: 0 },
    };

    const bots: PokerPlayer[] = [
      {
        id: 'bot-1',
        name: 'Bot Prudente',
        hand: [deck.pop()!, deck.pop()!],
        balance: 500,
        isFolded: false,
        currentBet: this.betAmount(),
        bestHand: { label: '', rank: 0 },
      },
      {
        id: 'bot-2',
        name: 'Bot Agresivo',
        hand: [deck.pop()!, deck.pop()!],
        balance: 500,
        isFolded: false,
        currentBet: this.betAmount(),
        bestHand: { label: '', rank: 0 },
      },
      {
        id: 'bot-3',
        name: 'Bot Prudente II',
        hand: [deck.pop()!, deck.pop()!],
        balance: 500,
        isFolded: false,
        currentBet: this.betAmount(),
        bestHand: { label: '', rank: 0 },
      },
      {
        id: 'bot-4',
        name: 'Bot Equilibrado',
        hand: [deck.pop()!, deck.pop()!],
        balance: 500,
        isFolded: false,
        currentBet: this.betAmount(),
        bestHand: { label: '', rank: 0 },
      },
    ];

    const round: GameRound = {
      deck,
      communityCards: [],
      players: [humanPlayer, ...bots],
      currentPlayerIndex: 0,
      pot: this.betAmount() * 5,
      roundPhase: 'pre-flop',
    };

    this.gameRound.set(round);
    this.playerHand.set(humanPlayer.hand);
    this.statusMessage.set('Pre-flop: Los bots están evaluando sus cartas...');
    this.progressRound();
  }

  private progressRound(): void {
    const round = this.gameRound();
    if (!round) return;

    setTimeout(() => {
      if (round.roundPhase === 'pre-flop') {
        this.botActions(round, 'pre-flop');
        round.roundPhase = 'flop';
        // Flop: 3 cartas comunitarias
        round.communityCards = [round.deck.pop()!, round.deck.pop()!, round.deck.pop()!];
        this.statusMessage.set('Flop: 3 cartas abiertas. Los bots actúan...');
        this.botActions(round, 'flop');
      } else if (round.roundPhase === 'flop') {
        round.roundPhase = 'turn';
        // Turn: 1 carta más
        round.communityCards.push(round.deck.pop()!);
        this.statusMessage.set('Turn: Carta adicional. Los bots actúan...');
        this.botActions(round, 'turn');
      } else if (round.roundPhase === 'turn') {
        round.roundPhase = 'river';
        // River: última carta
        round.communityCards.push(round.deck.pop()!);
        this.statusMessage.set('River: Última carta. Showdown en progreso...');
        this.botActions(round, 'river');
      } else if (round.roundPhase === 'river') {
        round.roundPhase = 'showdown';
        this.showdown(round);
      }

      this.gameRound.set({ ...round });

      if (round.roundPhase !== 'showdown' && round.roundPhase !== 'finished') {
        this.progressRound();
      }
    }, 1500);
  }

  private botActions(round: GameRound, phase: string): void {
    for (const player of round.players) {
      if (player.id === 'human' || player.isFolded) continue;

      // IA simple: evaluar mano, folded con probabilidad
      const handRank = this.evaluateBotHand(player, round.communityCards);
      const shouldFold = Math.random() > (handRank / 10);

      if (shouldFold && phase !== 'river') {
        player.isFolded = true;
      } else {
        // Apostar más si la mano es fuerte
        const bet = Math.round(this.betAmount() * (0.5 + handRank / 5));
        player.currentBet += bet;
        round.pot += bet;
      }
    }
  }

  private evaluateBotHand(
    player: PokerPlayer,
    communityCards: PlayingCard[],
  ): number {
    const allCards = [...player.hand, ...communityCards];
    if (allCards.length < 5) return Math.random() * 5;

    const evaluation = this.gameLogic.evaluatePokerHand(allCards.slice(0, 5));
    return evaluation.multiplier;
  }

  private showdown(round: GameRound): void {
    const activePlayers = round.players.filter((p) => !p.isFolded);

    for (const player of activePlayers) {
      const allCards = [...player.hand, ...round.communityCards];
      // Encontrar la mejor combinación de 5 cartas
      const bestFive = this.findBestFiveCards(allCards);
      player.bestHand = this.gameLogic.evaluatePokerHand(bestFive);
    }

    // Determinar ganador
    const winner = activePlayers.reduce((best, player) =>
      player.bestHand.rank > best.bestHand.rank ? player : best,
    );

    const payout = winner.id === 'human' ? round.pot : 0;
    const multiplier = payout > 0 ? payout / this.betAmount() : 0;

    if (this.currentBet) {
      this.bettingService.settleBet(
        this.currentBet,
        multiplier,
        `${winner.name} ganó con ${winner.bestHand.label}`,
      );
    }

    this.lastWinner.set(winner.name);
    this.statusMessage.set(`¡${winner.name} ganó el pot de ${round.pot} fichas con ${winner.bestHand.label}!`);
    this.addHistory(`${winner.name} ganó - ${winner.bestHand.label}`);

    round.roundPhase = 'finished';
    this.gameRound.set({ ...round });
  }

  private findBestFiveCards(cards: PlayingCard[]): PlayingCard[] {
    // Combinaciones de 5 cartas - simplificado: tomar las 5 primeras
    // En un poker real, buscaría la mejor combinación
    return cards.slice(0, 5);
  }

  private addHistory(message: string): void {
    const history = this.roundHistory();
    this.roundHistory.set([message, ...history].slice(0, 10));
  }
}


