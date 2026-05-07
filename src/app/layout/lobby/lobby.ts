import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Blackjack } from '../../components/games/blackjack/blackjack';
import { DwarfRace } from '../../components/games/dwarf-race/dwarf-race';
import { Poker } from '../../components/games/poker/poker';
import { Roulette } from '../../components/games/roulette/roulette';
import { Slots } from '../../components/games/slots/slots';
import { MovementLog } from '../../components/movement-log/movement-log';
import { WalletSummary } from '../../components/wallet-summary/wallet-summary';
import { AuthService } from '../../services/auth.service';
import { WalletService } from '../../services/wallet.service';

type GameId = 'roulette' | 'slots' | 'dwarf-race' | 'blackjack' | 'poker';

@Component({
  selector: 'app-lobby',
  imports: [
    WalletSummary,
    MovementLog,
    Roulette,
    Slots,
    DwarfRace,
    Blackjack,
    Poker,
  ],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby {
  private readonly authService = inject(AuthService);
  private readonly walletService = inject(WalletService);
  private readonly router = inject(Router);

  readonly activeGame = signal<GameId>('roulette');
  readonly balance = this.walletService.balance;
  readonly gameTitle = computed(() => {
    switch (this.activeGame()) {
      case 'roulette':
        return 'Ruleta';
      case 'slots':
        return 'Slots';
      case 'dwarf-race':
        return 'Carreras de enanos';
      case 'blackjack':
        return 'Blackjack';
      case 'poker':
        return 'Poker';
    }
  });

  selectGame(game: GameId): void {
    this.activeGame.set(game);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  resetWallet(): void {
    this.walletService.resetBalance();
  }
}
