import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, type Observable } from 'rxjs';
import type { PlaypagerGame } from '../common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlaypagerApiService {
  private readonly gamesUrl = 'casino-games.json';

  constructor(private readonly http: HttpClient) {}

  getCasinoGames(): Observable<PlaypagerGame[]> {
    return this.http.get<PlaypagerGame[]>(this.gamesUrl);
  }

  getFeaturedSlot(): Observable<PlaypagerGame | undefined> {
    return this.getCasinoGames().pipe(
      map((games) => games.find((game) => game.category === 'Slots') ?? games[0]),
    );
  }

  getCasinoGameById(id: string): Observable<PlaypagerGame | undefined> {
    return this.getCasinoGames().pipe(
      map((games) => games.find((game) => game.id === id)),
    );
  }
}
