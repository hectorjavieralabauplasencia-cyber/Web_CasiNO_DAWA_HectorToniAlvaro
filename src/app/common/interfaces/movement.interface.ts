export type MovementType = 'bet' | 'win' | 'loss' | 'refund' | 'info';

export interface MovementEntry {
  id: number;
  game: string;
  description: string;
  amount: number;
  type: MovementType;
  createdAt: Date;
}
