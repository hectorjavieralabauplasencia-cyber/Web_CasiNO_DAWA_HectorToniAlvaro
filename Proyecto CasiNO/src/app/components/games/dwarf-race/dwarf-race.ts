import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BettingService } from '../../../services/betting';
import { GameLogicService } from '../../../services/game-logic';

interface DwarfOption {
  id: number;
  name: string;
  multiplier: number;
  speed: number;
}

@Component({
  selector: 'app-dwarf-race',
  imports: [FormsModule],
  templateUrl: './dwarf-race.html',
  styleUrl: './dwarf-race.css',
})
export class DwarfRace implements OnDestroy {
  readonly options: DwarfOption[] = [
    { id: 1, name: 'Bruno', multiplier: 2, speed: 1.08 },
    { id: 2, name: 'Tiko', multiplier: 2.5, speed: 1.02 },
    { id: 3, name: 'Nori', multiplier: 3, speed: 1 },
    { id: 4, name: 'Mork', multiplier: 3.5, speed: 0.95 },
    { id: 5, name: 'Zuri', multiplier: 4, speed: 0.9 },
    { id: 6, name: 'Pik', multiplier: 5, speed: 0.85 },
  ];

  selectedId = 1;
  betAmount = 100;
  racing = false;
  winnerName = '';
  statusMessage = 'Elige un enano y pulsa correr.';
  progress: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  private raceTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly bettingService: BettingService,
    private readonly gameLogic: GameLogicService,
  ) {}

  runRace(): void {
    if (this.racing) {
      return;
    }

    const selected = this.options.find((item) => item.id === this.selectedId);
    if (!selected) {
      return;
    }

    const bet = this.bettingService.placeBet(
      'Carreras de enanos',
      this.betAmount,
      `Apuesta por ${selected.name}`,
    );
    if (!bet) {
      this.statusMessage = 'No tienes saldo suficiente para esa apuesta.';
      return;
    }

    this.racing = true;
    this.winnerName = '';
    this.progress = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    this.raceTimer = setInterval(() => {
      for (const dwarf of this.options) {
        const step = this.gameLogic.randomInt(9) + 4;
        const next = Math.min(100, this.progress[dwarf.id] + step * dwarf.speed);
        this.progress[dwarf.id] = Number(next.toFixed(1));
      }

      const winner = this.options.find((dwarf) => this.progress[dwarf.id] >= 100);
      if (!winner) {
        return;
      }

      this.stopRaceTimer();
      this.racing = false;
      this.winnerName = winner.name;

      const won = winner.id === this.selectedId;
      const multiplier = won ? winner.multiplier : 0;
      this.bettingService.settleBet(
        bet,
        multiplier,
        won ? `Ganaste la carrera con ${winner.name}` : `Perdiste. Ganador: ${winner.name}`,
      );

      this.statusMessage = won
        ? `Victoria! ${winner.name} gano la carrera.`
        : `No hubo suerte. Gano ${winner.name}.`;
    }, 220);
  }

  ngOnDestroy(): void {
    this.stopRaceTimer();
  }

  private stopRaceTimer(): void {
    if (this.raceTimer) {
      clearInterval(this.raceTimer);
      this.raceTimer = null;
    }
  }
}
