import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-wallet-summary',
  standalone: true,
  imports: [],
  templateUrl: './wallet-summary.html',
  styleUrls: ['./wallet-summary.css'],
})
export class WalletSummary {
  private readonly walletService = inject(WalletService);
  private readonly authService = inject(AuthService);

  readonly balance = this.walletService.balance;
  readonly currentUser = this.authService.currentUser;
}
