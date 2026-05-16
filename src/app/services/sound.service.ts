import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private soundsEnabled = true;

  constructor() {
    const saved = localStorage.getItem('casino-sounds-enabled');
    if (saved !== null) {
      this.soundsEnabled = saved === 'true';
    }
  }

  toggleSounds(): void {
    this.soundsEnabled = !this.soundsEnabled;
    localStorage.setItem('casino-sounds-enabled', String(this.soundsEnabled));
  }

  areEnabled(): boolean {
    return this.soundsEnabled;
  }

  // Método para reproducir sonidos usando Web Audio API
  private playTone(frequency: number, duration: number, type: 'sine' | 'square' = 'sine'): void {
    if (!this.soundsEnabled) return;

    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    } catch {
      // AudioContext no disponible, silenciosamente fallar
    }
  }

  playBet(): void {
    this.playTone(800, 0.1);
  }

  playWin(): void {
    this.playTone(1000, 0.1, 'square');
    setTimeout(() => this.playTone(1200, 0.1, 'square'), 100);
    setTimeout(() => this.playTone(1400, 0.2, 'square'), 200);
  }

  playLose(): void {
    this.playTone(400, 0.2);
    setTimeout(() => this.playTone(300, 0.2), 150);
  }

  playClick(): void {
    this.playTone(600, 0.05);
  }

  playSpinStart(): void {
    this.playTone(500, 0.15);
  }

  playSpinEnd(): void {
    this.playTone(1000, 0.2);
  }

  playChips(): void {
    this.playTone(700, 0.08);
  }

  playJackpot(): void {
    // Secuencia de jackpot
    this.playTone(800, 0.1);
    setTimeout(() => this.playTone(1000, 0.1), 100);
    setTimeout(() => this.playTone(1200, 0.1), 200);
    setTimeout(() => this.playTone(1400, 0.3), 300);
  }
}
