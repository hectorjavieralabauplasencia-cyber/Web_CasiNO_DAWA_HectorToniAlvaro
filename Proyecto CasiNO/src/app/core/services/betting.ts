import { Injectable } from '@angular/core';
import { BetSlip } from '../../shared/models/casino.models';
import { WalletService } from './wallet';

@Injectable({
  providedIn: 'root',
})
export class BettingService {
  private nextBetId = 1;

  constructor(private readonly walletService: WalletService) {}

  placeBet(game: string, amount: number, description: string): BetSlip | null {
    if (!this.walletService.canAfford(amount)) {
      return null;
    }

    const bet: BetSlip = {
      id: this.nextBetId++,
      game,
      amount,
      createdAt: new Date(),
      resolved: false,
    };

    this.walletService.applyDelta(game, description, -amount, 'bet');
    return bet;
  }

  settleBet(
    bet: BetSlip,
    payoutMultiplier: number,
    description: string,
  ): { payout: number; won: boolean } {
    if (bet.resolved) {
      return { payout: 0, won: false };
    }

    bet.resolved = true;
    const payout = Math.round(bet.amount * payoutMultiplier);

    if (payout > 0) {
      this.walletService.applyDelta(bet.game, description, payout, 'win');
      return { payout, won: true };
    }

    this.walletService.applyDelta(bet.game, description, 0, 'loss');
    return { payout: 0, won: false };
  }

  refundBet(bet: BetSlip, description: string): void {
    if (bet.resolved) {
      return;
    }

    bet.resolved = true;
    this.walletService.applyDelta(bet.game, description, bet.amount, 'refund');
  }
}
