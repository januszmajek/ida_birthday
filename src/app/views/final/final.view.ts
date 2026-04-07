import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-final',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="view-container">
      <h1>Gratulacje! 🎉</h1>
      <p>Ukończyłaś wszystkie poziomy!</p>
      <p>Twój wynik: {{ gameStore.totalScore() }} pkt</p>

      <div class="placeholder-content">
        <p>🎁 Tu pojawi się voucher do pobrania (PDF)</p>
      </div>

      <div class="nav-buttons">
        <button mat-button routerLink="/">Zagraj ponownie</button>
      </div>
    </div>
  `,
})
export default class FinalView {
  readonly gameStore = inject(GameStore);
}
