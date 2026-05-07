import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BettingService } from '../../../services/betting.service';
import { GameLogicService } from '../../../services/game-logic.service';
import { PlaypagerApiService, type PlaypagerGame } from '../../../services/playpager-api.service';

@Component({
  selector: 'app-slots',
  imports: [FormsModule],
  templateUrl: './slots.html',
  styleUrl: './slots.css',
})
export class Slots {
  betAmount = 100;
  reels = ['7', '7', '7'];
  statusMessage = 'Haz girar los rodillos y prueba suerte.';
  playpagerGames: PlaypagerGame[] = [];
  selectedGame?: PlaypagerGame;

  constructor(
    private readonly bettingService: BettingService,
    private readonly gameLogic: GameLogicService,
    private readonly playpagerApi: PlaypagerApiService,
  ) {
    this.playpagerGames = this.playpagerApi.getCasinoGames();
    this.selectedGame = this.playpagerApi.getFeaturedSlot();
  }

  selectGame(game: PlaypagerGame): void {
    this.selectedGame = game;
    this.statusMessage = `Playpager seleccionado: ${game.title}.`;
  }

  spin(): void {
    const bet = this.bettingService.placeBet('Slots', this.betAmount, 'Apuesta en slots');
    if (!bet) {
      this.statusMessage = 'Saldo insuficiente para ese giro.';
      return;
    }

    this.reels = this.gameLogic.spinSlots(3);
    const uniqueCount = new Set(this.reels).size;

    let multiplier = 0;
    if (uniqueCount === 1) {
      multiplier = 5;
    } else if (uniqueCount === 2) {
      multiplier = 2;
    }

    const win = multiplier > 0;
    this.bettingService.settleBet(
      bet,
      multiplier,
      win ? 'Victoria en slots' : 'Derrota en slots',
    );

    this.statusMessage = win
      ? `Premio! ${this.selectedGame?.title ?? 'Slot'} paga combinacion x${multiplier}.`
      : `No hubo premio en ${this.selectedGame?.title ?? 'este giro'}.`;
  }
}


