import { Injectable } from '@angular/core';

export interface SlotComGame {
  title: string;
  reels: 3 | 5;
  theme: string;
  paylines: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SlotComApiService {
  private readonly baseUrl = 'https://www.slot.com/en/free-online-slots';
  private readonly games: SlotComGame[] = [
    {
      title: 'The Golden Owl of Athena',
      reels: 5,
      theme: 'Grecia',
      paylines: 'Hasta 50 lineas',
      url: this.baseUrl,
    },
    {
      title: 'Rise of Egypt',
      reels: 5,
      theme: 'Egipto',
      paylines: 'Hasta 50 lineas',
      url: this.baseUrl,
    },
    {
      title: 'Fruit Zen',
      reels: 5,
      theme: 'Frutas',
      paylines: 'Hasta 50 lineas',
      url: this.baseUrl,
    },
    {
      title: 'Vikingos',
      reels: 3,
      theme: 'Vikingos',
      paylines: 'Clasica',
      url: this.baseUrl,
    },
    {
      title: 'Troya',
      reels: 3,
      theme: 'Mitologia',
      paylines: 'Clasica',
      url: this.baseUrl,
    },
    {
      title: 'On The Rocks',
      reels: 3,
      theme: 'Bar',
      paylines: 'Clasica',
      url: this.baseUrl,
    },
    {
      title: 'La perla del caribe deluxe',
      reels: 3,
      theme: 'Caribe',
      paylines: 'Clasica',
      url: this.baseUrl,
    },
    {
      title: 'La Granja',
      reels: 3,
      theme: 'Animales',
      paylines: 'Clasica',
      url: this.baseUrl,
    },
    {
      title: 'El Tesoro De Java',
      reels: 3,
      theme: 'Aventura',
      paylines: 'Clasica',
      url: this.baseUrl,
    },
    {
      title: 'Corsarios',
      reels: 3,
      theme: 'Piratas',
      paylines: 'Clasica',
      url: this.baseUrl,
    },
  ];

  getFeaturedSlots(): SlotComGame[] {
    return this.games;
  }

  getRandomSlot(): SlotComGame {
    const index = Math.floor(Math.random() * this.games.length);
    return this.games[index];
  }
}
