import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-level3',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="view-container">
      <h1>Poziom 3: Rebus</h1>
      <p class="level-description">
        Rozwiąż rebusy i odgadnij hasło.
      </p>

      <div class="placeholder-content">
        <p>🧩 Tu pojawią się rebusy</p>
      </div>

      <div class="nav-buttons">
        <button mat-button routerLink="/level-2">← Wstecz</button>
        <button mat-raised-button color="primary" routerLink="/final">
          Zakończ →
        </button>
      </div>
    </div>
  `,
})
export default class Level3View {
  readonly gameStore = inject(GameStore);
}
