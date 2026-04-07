import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { GameStore } from '../../store/game.store';
import { ProgressIndicatorComponent } from '../../components/progress-indicator.component';

interface Question {
  image: string;
  text: string;
  answers: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  {
    image: 'https://picsum.photos/seed/paris/400/300',
    text: 'Gdzie zrobiono to zdjęcie?',
    answers: ['Londyn', 'Paryż', 'Berlin', 'Rzym'],
    correctIndex: 1,
  },
  {
    image: 'https://picsum.photos/seed/beach/400/300',
    text: 'Co przedstawia to zdjęcie?',
    answers: ['Góry', 'Las', 'Plaża', 'Pustynia'],
    correctIndex: 2,
  },
  {
    image: 'https://picsum.photos/seed/city/400/300',
    text: 'Jaki to krajobraz?',
    answers: ['Wieś', 'Miasto', 'Morze', 'Jezioro'],
    correctIndex: 1,
  },
];

@Component({
  selector: 'app-level1',
  imports: [MatButtonModule, ProgressIndicatorComponent],
  template: `
    <div class="view-container" style="animation: fadeIn 0.5s ease-out">
      <app-progress />
      <h1>Poziom 1: Skąd to zdjęcie?</h1>
      <p class="level-description">Rozpoznaj miejsca na zdjęciach.</p>

      <div class="quiz-progress">
        Pytanie {{ currentIndex() + 1 }} / {{ questions.length }} | Poprawne:
        {{ correctCount() }} / {{ requiredCorrect }}
      </div>

      <div class="quiz-card">
        <img
          [src]="currentQuestion().image"
          [alt]="'Zdjęcie ' + (currentIndex() + 1)"
          class="quiz-image"
        />
        <p class="quiz-question">{{ currentQuestion().text }}</p>

        <div class="answers-grid">
          @for (answer of currentQuestion().answers; track $index) {
            <button
              mat-raised-button
              class="answer-btn"
              [class.correct]="
                answered() !== null && $index === currentQuestion().correctIndex
              "
              [class.incorrect]="
                answered() !== null &&
                answered() === $index &&
                $index !== currentQuestion().correctIndex
              "
              [disabled]="answered() !== null"
              (click)="selectAnswer($index)"
            >
              {{ labels[$index] }}. {{ answer }}
            </button>
          }
        </div>

        @if (feedback()) {
          <p class="feedback" [class.correct]="feedbackCorrect()">
            {{ feedback() }}
          </p>
        }
      </div>
    </div>
  `,
  styles: `
    .quiz-progress {
      color: rgba(#f5f0f3, 0.6);
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .quiz-card {
      background: rgba(#c879b2, 0.08);
      border: 1px solid rgba(#c879b2, 0.3);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }

    .quiz-image {
      width: 100%;
      max-height: 220px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .quiz-question {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: #e8a8d6;
    }

    .answers-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }

    .answer-btn {
      text-align: left;
      font-size: 0.85rem;
      white-space: normal;
      line-height: 1.3;
      min-height: 48px;

      &.correct {
        background-color: #4caf50 !important;
        color: white !important;
      }

      &.incorrect {
        background-color: #f44336 !important;
        color: white !important;
      }
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
export default class Level1View {
  readonly gameStore = inject(GameStore);
  private readonly router = inject(Router);

  readonly labels = ['A', 'B', 'C', 'D'];
  readonly questions = QUESTIONS;
  readonly requiredCorrect = 3;

  readonly currentIndex = signal(0);
  readonly correctCount = signal(0);
  readonly answered = signal<number | null>(null);
  readonly feedback = signal('');
  readonly feedbackCorrect = signal(false);

  readonly currentQuestion = computed(() => this.questions[this.currentIndex()]);

  selectAnswer(index: number): void {
    if (this.answered() !== null) return;

    this.answered.set(index);
    const correct = index === this.currentQuestion().correctIndex;

    if (correct) {
      this.correctCount.update((c) => c + 1);
      this.feedback.set('Dobrze!');
      this.feedbackCorrect.set(true);
    } else {
      this.feedback.set(
        `Źle! Poprawna: ${this.labels[this.currentQuestion().correctIndex]}`
      );
      this.feedbackCorrect.set(false);
    }

    setTimeout(() => this.advance(), 1200);
  }

  private advance(): void {
    const nextIndex = this.currentIndex() + 1;

    if (this.correctCount() >= this.requiredCorrect) {
      this.gameStore.completeLevel(1, this.correctCount());
      this.router.navigateByUrl('/level-2');
      return;
    }

    if (nextIndex >= this.questions.length) {
      // Not enough correct — restart
      this.currentIndex.set(0);
      this.correctCount.set(0);
      this.answered.set(null);
      this.feedback.set('Za mało poprawnych — spróbuj jeszcze raz!');
      this.feedbackCorrect.set(false);
      return;
    }

    this.currentIndex.set(nextIndex);
    this.answered.set(null);
    this.feedback.set('');
  }
}
