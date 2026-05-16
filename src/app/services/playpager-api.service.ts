import { Injectable } from '@angular/core';
import type { PlaypagerGame } from '../common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlaypagerApiService {
  private readonly games: PlaypagerGame[] = [
    {
      title: 'Blackbeard Pirate Slots',
      category: 'Slots',
      mode: 'HTML5 gratis, sin registro',
      url: 'https://playpager.com/free-slots-online/',
      updatedAt: '2026-04-26',
    },
    {
      title: 'Blackjack',
      category: 'Cartas',
      mode: 'Juego de navegador',
      url: 'https://playpager.com/blackjack/',
    },
    {
      title: 'Roulette',
      category: 'Mesa',
      mode: 'Juego de navegador',
      url: 'https://playpager.com/roulette/',
    },
    {
      title: 'Baccarat',
      category: 'Mesa',
      mode: 'Juego de navegador',
      url: 'https://playpager.com/baccarat/',
    },
    {
      title: 'Craps',
      category: 'Mesa',
      mode: 'Juego de navegador',
      url: 'https://playpager.com/craps/',
    },
    {
      title: '3-Card Poker',
      category: 'Cartas',
      mode: 'Juego de navegador',
      url: 'https://playpager.com/3-card-poker/',
    },
  ];

  getCasinoGames(): PlaypagerGame[] {
    return this.games;
  }

  getFeaturedSlot(): PlaypagerGame {
    return this.games[0];
  }
}
