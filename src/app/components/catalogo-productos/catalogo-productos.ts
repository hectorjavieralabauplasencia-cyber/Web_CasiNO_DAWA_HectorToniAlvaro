import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Observable } from 'rxjs';
import type { PlaypagerGame } from '../../common/interfaces';
import { PlaypagerApiService } from '../../services/playpager-api.service';

@Component({
  selector: 'app-catalogo-productos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo-productos.html',
  styleUrls: ['./catalogo-productos.css'],
})
export class CatalogoProductos {
  private readonly playpagerApi = inject(PlaypagerApiService);

  readonly productos$: Observable<PlaypagerGame[]> = this.playpagerApi.getCasinoGames();
}
