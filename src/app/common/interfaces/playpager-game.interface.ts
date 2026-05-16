export type PlaypagerGameCategory = 'Slots' | 'Cartas' | 'Mesa';

export interface PlaypagerGame {
  id: string;
  title: string;
  category: PlaypagerGameCategory;
  mode: string;
  image: string;
  description: string;
  details: string;
  features: string[];
  price: number;
  url: string;
  updatedAt?: string;
}
