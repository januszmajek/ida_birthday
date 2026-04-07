import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-level1',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="view-container">
      <h1>Poziom 1: Skąd to zdjęcie?</h1>
      <p class="level-description">
        Rozpoznaj miejsca na zdjęciach.
      </p>

      <div class="placeholder-content">
        <p>🖼️ Tu pojawi się quiz ze zdjęciami</p>
      </div>

      <div class="nav-buttons">
        <button mat-button routerLink="/">Powrót</button>
        <button mat-raised-button color="primary" routerLink="/level-2">
          Dalej →
        </button>
      </div>
    </div>
  `,
})
export default class Level1View {
  readonly gameStore = inject(GameStore);
}
