import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-level2',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="view-container">
      <h1>Poziom 2: Jaka to melodia?</h1>
      <p class="level-description">
        Posłuchaj i zgadnij utwór.
      </p>

      <div class="placeholder-content">
        <p>🎵 Tu pojawi się quiz z melodiami</p>
      </div>

      <div class="nav-buttons">
        <button mat-button routerLink="/level-1">← Wstecz</button>
        <button mat-raised-button color="primary" routerLink="/level-3">
          Dalej →
        </button>
      </div>
    </div>
  `,
})
export default class Level2View {
  readonly gameStore = inject(GameStore);
}
