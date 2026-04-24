import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { WalletService } from '../../../services/wallet';

@Component({
  selector: 'app-wallet-summary',
  imports: [],
  templateUrl: './wallet-summary.html',
  styleUrl: './wallet-summary.css',
})
export class WalletSummary {
  private readonly walletService = inject(WalletService);
  private readonly authService = inject(AuthService);

  readonly balance = this.walletService.balance;
  readonly currentUser = this.authService.currentUser;
}
