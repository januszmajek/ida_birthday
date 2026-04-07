import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GameStore } from '../../store/game.store';
import { ProgressIndicatorComponent } from '../../components/progress-indicator.component';

const REBUS_IMAGE = 'https://picsum.photos/seed/rebus/400/300';
const CORRECT_ANSWER = 'sunset';

@Component({
  selector: 'app-level3',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, ProgressIndicatorComponent],
  template: `
    <div class="view-container" style="animation: fadeIn 0.5s ease-out">
      <app-progress />
      <h1>Poziom 3: Rebus</h1>
      <p class="level-description">Rozwiąż rebus i wpisz odpowiedź.</p>

      <div class="quiz-card">
        <img
          [src]="rebusImage"
          alt="Rebus"
          class="rebus-image"
        />

        <mat-form-field appearance="outline" class="answer-field">
          <mat-label>Twoja odpowiedź</mat-label>
          <input
            matInput
            [(ngModel)]="userAnswer"
            (keyup.enter)="checkAnswer()"
            [disabled]="solved()"
            placeholder="Wpisz odpowiedź..."
          />
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          class="check-btn"
          [disabled]="solved() || !userAnswer().trim()"
          (click)="checkAnswer()"
        >
          Sprawdź odpowiedź
        </button>

        @if (feedback()) {
          <p class="feedback" [class.correct]="solved()">
            {{ feedback() }}
          </p>
        }
      </div>
    </div>
  `,
  styles: `
    .quiz-card {
      background: rgba(#c879b2, 0.08);
      border: 1px solid rgba(#c879b2, 0.3);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }

    .rebus-image {
      width: 100%;
      max-height: 240px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 1.25rem;
    }

    .answer-field {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .check-btn {
      width: 100%;
      font-size: 1rem;
      min-height: 48px;
    }

    .feedback {
      margin-top: 1rem;
      font-weight: 500;
      font-size: 1rem;

      &.correct {
        color: #4caf50;
      }

      &:not(.correct) {
        color: #f44336;
      }
    }
  `,
})
export default class Level3View {
  readonly gameStore = inject(GameStore);
  private readonly router = inject(Router);

  readonly rebusImage = REBUS_IMAGE;
  readonly userAnswer = signal('');
  readonly feedback = signal('');
  readonly solved = signal(false);

  checkAnswer(): void {
    if (this.solved()) return;

    const answer = this.userAnswer().trim().toLowerCase();
    if (!answer) return;

    if (answer === CORRECT_ANSWER) {
      this.solved.set(true);
      this.feedback.set('Brawo! Rebus rozwiązany!');
      this.gameStore.completeLevel(3, 1);
      setTimeout(() => this.router.navigateByUrl('/final'), 1500);
    } else {
      this.feedback.set('Źle — spróbuj ponownie!');
    }
  }
}
