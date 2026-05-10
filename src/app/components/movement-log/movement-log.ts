import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-movement-log',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './movement-log.html',
  styleUrls: ['./movement-log.css'],
})
export class MovementLog {
  readonly entries = computed(() => this.historyService.movements().slice(0, 12));

  constructor(private readonly historyService: HistoryService) {}

  clear(): void {
    this.historyService.clear();
  }

  amountClass(amount: number): string {
    if (amount > 0) {
      return 'text-success';
    }
    if (amount < 0) {
      return 'text-danger';
    }
    return 'text-secondary';
  }
}
