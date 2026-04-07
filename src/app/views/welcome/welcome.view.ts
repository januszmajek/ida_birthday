import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="view-container">
      <h1>Wszystkiego najlepszego, Idu!</h1>
      <p>
        Przygotowaliśmy dla Ciebie 3 mini-gry. Ukończ je wszystkie, aby
        odblokować niespodziankę!
      </p>
      <button mat-raised-button color="primary" routerLink="/level-1">
        Zaczynamy!
      </button>
    </div>
  `,
})
export default class WelcomeView {}
