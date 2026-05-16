export type PlaypagerGameCategory = 'Slots' | 'Cartas' | 'Mesa';

export interface PlaypagerGame {
  title: string;
  category: PlaypagerGameCategory;
  mode: string;
  url: string;
  updatedAt?: string;
}
