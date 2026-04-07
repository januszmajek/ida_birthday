import { Component, inject, signal, computed, ElementRef, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GameStore } from '../../store/game.store';
import { ProgressIndicatorComponent } from '../../components/progress-indicator.component';

interface Song {
  videoId: string;
  title: string;
  options: string[];
  correctIndex: number;
}

const SONG_POOL: Song[] = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    options: [
      'Take On Me',
      'Never Gonna Give You Up',
      'Careless Whisper',
      'Livin\' on a Prayer',
    ],
    correctIndex: 1,
  },
  {
    videoId: '9bZkp7q19f0',
    title: 'PSY - Gangnam Style',
    options: ['Despacito', 'Macarena', 'Gangnam Style', 'Waka Waka'],
    correctIndex: 2,
  },
  {
    videoId: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito',
    options: ['Despacito', 'Bailando', 'Vivir Mi Vida', 'La Bicicleta'],
    correctIndex: 0,
  },
  {
    videoId: 'JGwWNGJdvx8',
    title: 'Ed Sheeran - Shape of You',
    options: [
      'Thinking Out Loud',
      'Perfect',
      'Photograph',
      'Shape of You',
    ],
    correctIndex: 3,
  },
  {
    videoId: 'RgKAFK5djSk',
    title: 'Wiz Khalifa - See You Again',
    options: ['See You Again', 'Counting Stars', 'Happy', 'Uptown Funk'],
    correctIndex: 0,
  },
  {
    videoId: 'OPf0YbXqDm0',
    title: 'Mark Ronson - Uptown Funk',
    options: ['Blinding Lights', 'Uptown Funk', 'Treasure', '24K Magic'],
    correctIndex: 1,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

@Component({
  selector: 'app-level2',
  imports: [MatButtonModule, MatIconModule, ProgressIndicatorComponent],
  template: `
    <div class="view-container" style="animation: fadeIn 0.5s ease-out">
      <app-progress />
      <h1>Poziom 2: Jaka to melodia?</h1>
      <p class="level-description">Posłuchaj i zgadnij utwór.</p>

      <div class="quiz-progress">
        Piosenka {{ songIndex() + 1 }} / {{ playlist().length }} | Poprawne:
        {{ correctCount() }} / {{ requiredCorrect }}
      </div>

      <div class="quiz-card">
        <div class="player-wrapper">
          @if (!playing()) {
            <button
              mat-raised-button
              color="primary"
              class="play-btn"
              (click)="play()"
            >
              <mat-icon>play_arrow</mat-icon>
              Odtwórz
            </button>
          } @else {
            <iframe
              #ytPlayer
              [src]="currentEmbedUrl()"
              width="0"
              height="0"
              allow="autoplay"
              style="position: absolute; opacity: 0; pointer-events: none;"
            ></iframe>
            <div class="now-playing">Teraz gra...</div>
          }
        </div>

        <div class="answers-grid">
          @for (option of currentSong().options; track $index) {
            <button
              mat-raised-button
              class="answer-btn"
              [class.correct]="
                answered() !== null &&
                $index === currentSong().correctIndex
              "
              [class.incorrect]="
                answered() !== null &&
                answered() === $index &&
                $index !== currentSong().correctIndex
              "
              [disabled]="answered() !== null"
              (click)="selectAnswer($index)"
            >
              {{ labels[$index] }}. {{ option }}
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

    .player-wrapper {
      position: relative;
      margin-bottom: 1.25rem;
      min-height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .play-btn {
      font-size: 1rem;

      mat-icon {
        margin-right: 0.25rem;
      }
    }

    .now-playing {
      color: #e8a8d6;
      font-size: 1.1rem;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
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
export default class Level2View {
  readonly gameStore = inject(GameStore);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  readonly ytPlayer = viewChild<ElementRef>('ytPlayer');

  readonly labels = ['A', 'B', 'C', 'D'];
  readonly requiredCorrect = 3;

  readonly playlist = signal<Song[]>(shuffle(SONG_POOL));
  readonly songIndex = signal(0);
  readonly correctCount = signal(0);
  readonly answered = signal<number | null>(null);
  readonly feedback = signal('');
  readonly feedbackCorrect = signal(false);
  readonly playing = signal(false);

  readonly currentSong = computed(() => this.playlist()[this.songIndex()]);

  readonly currentEmbedUrl = computed<SafeResourceUrl>(() => {
    const song = this.currentSong();
    const url = `https://www.youtube.com/embed/${song.videoId}?autoplay=1&start=30&end=60&controls=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  play(): void {
    this.playing.set(true);
  }

  selectAnswer(index: number): void {
    if (this.answered() !== null) return;

    this.answered.set(index);
    this.playing.set(false);
    const correct = index === this.currentSong().correctIndex;

    if (correct) {
      this.correctCount.update((c) => c + 1);
      this.feedback.set('Dobrze!');
      this.feedbackCorrect.set(true);
    } else {
      this.feedback.set(
        `Źle! To był: ${this.currentSong().title}`
      );
      this.feedbackCorrect.set(false);
    }

    setTimeout(() => this.advance(), 1500);
  }

  private advance(): void {
    if (this.correctCount() >= this.requiredCorrect) {
      this.gameStore.completeLevel(2, this.correctCount());
      this.router.navigateByUrl('/level-3');
      return;
    }

    const nextIndex = this.songIndex() + 1;

    if (nextIndex >= this.playlist().length) {
      // Exhausted pool without enough correct — reset
      this.playlist.set(shuffle(SONG_POOL));
      this.songIndex.set(0);
      this.correctCount.set(0);
      this.answered.set(null);
      this.playing.set(false);
      this.feedback.set('Za mało poprawnych — zaczynamy od nowa!');
      this.feedbackCorrect.set(false);
      return;
    }

    this.songIndex.set(nextIndex);
    this.answered.set(null);
    this.playing.set(false);
    this.feedback.set('');
  }
}
