export type MovementType = 'bet' | 'win' | 'loss' | 'refund' | 'info';

export interface MovementEntry {
  id: number;
  game: string;
  description: string;
  amount: number;
  type: MovementType;
  createdAt: Date;
}

export interface BetSlip {
  id: number;
  game: string;
  amount: number;
  createdAt: Date;
  resolved: boolean;
}

export interface PlayingCard {
  rank: string;
  suit: string;
  value: number;
}

