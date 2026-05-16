export type PlaypagerGameCategory = 'Slots' | 'Cartas' | 'Mesa';

export interface PlaypagerGame {
  title: string;
  category: PlaypagerGameCategory;
  mode: string;
  image: string;
  description: string;
  price: number;
  url: string;
  updatedAt?: string;
}
