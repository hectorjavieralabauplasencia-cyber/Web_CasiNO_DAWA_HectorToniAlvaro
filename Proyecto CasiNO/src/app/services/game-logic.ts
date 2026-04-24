import { Injectable } from '@angular/core';
import { PlayingCard } from '../models/casino.models';

@Injectable({
  providedIn: 'root',
})
export class GameLogicService {
  private readonly slotSymbols = ['7', 'BAR', 'GEM', 'STAR', 'CROWN', 'CHERRY'];
  private readonly redNumbers = new Set([
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ]);

  randomInt(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
  }

  rouletteSpin(): number {
    return this.randomInt(37);
  }

  rouletteColor(number: number): 'red' | 'black' | 'green' {
    if (number === 0) {
      return 'green';
    }

    return this.redNumbers.has(number) ? 'red' : 'black';
  }

  spinSlots(reels = 3): string[] {
    return Array.from({ length: reels }, () => {
      return this.slotSymbols[this.randomInt(this.slotSymbols.length)];
    });
  }

  createDeck(): PlayingCard[] {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks: Array<[string, number]> = [
      ['A', 11],
      ['2', 2],
      ['3', 3],
      ['4', 4],
      ['5', 5],
      ['6', 6],
      ['7', 7],
      ['8', 8],
      ['9', 9],
      ['10', 10],
      ['J', 10],
      ['Q', 10],
      ['K', 10],
    ];

    const deck: PlayingCard[] = [];
    for (const suit of suits) {
      for (const [rank, value] of ranks) {
        deck.push({ suit, rank, value });
      }
    }

    return deck;
  }

  shuffleDeck(cards: PlayingCard[]): PlayingCard[] {
    const copy = [...cards];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  blackjackScore(cards: PlayingCard[]): number {
    let total = cards.reduce((acc, card) => acc + card.value, 0);
    let aces = cards.filter((card) => card.rank === 'A').length;

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  }

  evaluatePokerHand(cards: PlayingCard[]): { label: string; multiplier: number } {
    const values = cards
      .map((card) => this.rankToValue(card.rank))
      .sort((a, b) => a - b);
    const suits = cards.map((card) => card.suit);

    const counts = new Map<number, number>();
    for (const value of values) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const sortedCounts = [...counts.values()].sort((a, b) => b - a);

    const flush = suits.every((suit) => suit === suits[0]);
    const straight = this.isStraight(values);

    if (straight && flush) return { label: 'Escalera de color', multiplier: 12 };
    if (sortedCounts[0] === 4) return { label: 'Poker', multiplier: 10 };
    if (sortedCounts[0] === 3 && sortedCounts[1] === 2) {
      return { label: 'Full House', multiplier: 7 };
    }
    if (flush) return { label: 'Color', multiplier: 5 };
    if (straight) return { label: 'Escalera', multiplier: 4 };
    if (sortedCounts[0] === 3) return { label: 'Trío', multiplier: 3 };
    if (sortedCounts[0] === 2 && sortedCounts[1] === 2) {
      return { label: 'Doble pareja', multiplier: 2.5 };
    }
    if (sortedCounts[0] === 2) return { label: 'Pareja', multiplier: 1.5 };

    return { label: 'Carta alta', multiplier: 0 };
  }

  private rankToValue(rank: string): number {
    switch (rank) {
      case 'A':
        return 14;
      case 'K':
        return 13;
      case 'Q':
        return 12;
      case 'J':
        return 11;
      default:
        return Number(rank);
    }
  }

  private isStraight(values: number[]): boolean {
    let normalStraight = true;
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== values[i - 1] + 1) {
        normalStraight = false;
        break;
      }
    }
    if (normalStraight) {
      return true;
    }

    const aceLow = values.map((value) => (value === 14 ? 1 : value)).sort((a, b) => a - b);
    for (let i = 1; i < aceLow.length; i++) {
      if (aceLow[i] !== aceLow[i - 1] + 1) {
        return false;
      }
    }

    return true;
  }
}
