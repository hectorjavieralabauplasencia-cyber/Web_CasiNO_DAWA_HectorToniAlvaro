import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap, type Observable } from 'rxjs';
import type { PlaypagerGame } from '../../common/interfaces';
import { PlaypagerApiService } from '../../services/playpager-api.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './producto.html',
  styleUrls: ['./producto.css'],
})
export class Producto {
  private readonly route = inject(ActivatedRoute);
  private readonly playpagerApi = inject(PlaypagerApiService);

  readonly agregado = signal(false);
  readonly producto$: Observable<PlaypagerGame | undefined> = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => this.playpagerApi.getCasinoGameById(id)),
  );

  agregarAlCarrito(): void {
    this.agregado.set(true);
  }
}
