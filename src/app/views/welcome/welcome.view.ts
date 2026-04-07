import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule],
  template: `
    <div class="view-container" style="animation: fadeIn 0.5s ease-out">
      <h1>Wszystkiego najlepszego, Kochanie!</h1>
      <p>
        Przygotowaliśmy dla Ciebie 3 mini-gry. Ukończ je wszystkie, aby
        odblokować niespodziankę!
      </p>
      <button mat-raised-button color="primary" (click)="start()">
        Zaczynamy!
      </button>
    </div>
  `,
})
export default class WelcomeView {
  private readonly router = inject(Router);
  private readonly store = inject(GameStore);

  start(): void {
    // Resume from where the player left off
    if (this.store.allLevelsCompleted()) {
      this.router.navigateByUrl('/final');
    } else {
      this.router.navigateByUrl(`/level-${this.store.currentLevel()}`);
    }
  }
}
