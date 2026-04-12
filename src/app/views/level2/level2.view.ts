import { Component, inject, signal, computed, ElementRef, viewChild, effect, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameStore } from '../../store/game.store';
import { ProgressIndicatorComponent } from '../../components/progress-indicator.component';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface Song {
  videoId: string;
  title: string;
  options: string[];
  correctIndex: number;
}

const SONG_POOL: Song[] = [
  {
    videoId: 'xy3AcmW0lrQ',
    title: 'Djo - End of Beginning',
    options: ['End of Beginning', 'Chateau', 'Gloom', 'Change'],
    correctIndex: 0,
  },
  {
    videoId: 'vBy7FaapGRo',
    title: 'Daniel Caesar - Best Part',
    options: ['Get You', 'Best Part', 'We Find Love', 'Japanese Denim'],
    correctIndex: 1,
  },
  {
    videoId: 'mQezde_qeXw',
    title: 'sombr - Homewrecker',
    options: ['Homewrecker', '12 to 12', 'i wish i knew how to quit you', 'Somebody Else'],
    correctIndex: 0,
  },
  {
    videoId: 'XeLaiL9tk68',
    title: 'BANNERS - Someone To You',
    options: ['Holy Ground', 'Start a Riot', 'Someone To You', 'Got It in You'],
    correctIndex: 2,
  },
  {
    videoId: 'p47fEXGabaY',
    title: 'Ricky Martin - Livin\' la Vida Loca',
    options: ['La Bamba', 'Livin\' la Vida Loca', 'La Isla Bonita', 'Bailando'],
    correctIndex: 1,
  },
  {
    videoId: '7sxVHYZ_PnA',
    title: 'Harry Styles - Aperture',
    options: ['Aperture', 'Watermelon Sugar', 'Ready, Steady, Go!', 'Adore You'],
    correctIndex: 0,
  },
  {
    videoId: 'ghTVa3-5PTg',
    title: 'Balu Brigada - So Cold',
    options: ['Fever Dream', 'Beautiful Things', 'So Cold', 'Only Human'],
    correctIndex: 2,
  },
  {
    videoId: 'bq4pOKnc5Yg',
    title: 'Lola Young - Post Sex Clarity',
    options: ['Post Sex Clarity', 'Don\'t Say That', 'Midnight Sun', 'Good Luck, Babe!'],
    correctIndex: 0,
  },
  {
    videoId: 'cZgUiR31m-Y',
    title: 'sombr - 12 to 12',
    options: ['Homewrecker', 'End of Beginning', '12 to 12', 'So Cold'],
    correctIndex: 2,
  },
  {
    videoId: '1RKqOmSkGgM',
    title: 'Chappell Roan - Good Luck, Babe!',
    options: ['Good Luck, Babe!', 'Post Sex Clarity', 'Beautiful Things', 'Aperture'],
    correctIndex: 0,
  },
  {
    videoId: 'jSsK-8Yik4o',
    title: 'Harry Styles - Ready, Steady, Go!',
    options: ['Aperture', 'Adore You', 'Ready, Steady, Go!', 'Watermelon Sugar'],
    correctIndex: 2,
  },
  {
    videoId: 'rqZGns_5354',
    title: 'Harrison - All the Things She Said',
    options: ['Umbrella', 'All the Things She Said', 'Someone To You', 'Best Part'],
    correctIndex: 1,
  },
  {
    videoId: 'c2i4h7Q-8sA',
    title: 'Disco Polo - Jestes szalona',
    options: ['Miłość w Zakopanem', 'Ona By Chciała', 'Jestes szalona', 'Zawsze Z Tobą Chciałbym'],
    correctIndex: 2,
  },
  {
    videoId: 'Wp57PXBB7Xg',
    title: 'Ich Troje - Zawsze Z Tobą Chciałbym',
    options: ['Zawsze Z Tobą Chciałbym', 'Zawsze tam gdzie Ty', 'Jestes szalona', 'Weź nie pytaj'],
    correctIndex: 0,
  },
  {
    videoId: 'XQNJI4QqfFk',
    title: 'Lady Pank - Zawsze tam gdzie Ty',
    options: ['Miłość w Zakopanem', 'To co masz Ty!', 'Zawsze tam gdzie Ty', 'Weź nie pytaj'],
    correctIndex: 2,
  },
  {
    videoId: 'n2hJA78YuWw',
    title: 'Sławomir - Miłość w Zakopanem',
    options: ['Jestes szalona', 'Miłość w Zakopanem', 'Ona By Chciała', 'La Bamba'],
    correctIndex: 1,
  },
  {
    videoId: 'nLAWPrCUQQ0',
    title: 'Los Lobos - La Bamba',
    options: ['La Isla Bonita', 'Livin\' la Vida Loca', 'La Bamba', 'Şımarık'],
    correctIndex: 2,
  },
  {
    videoId: '0AbvnTgGH8s',
    title: 'Suzi Quatro & Chris Norman - Stumblin\' In',
    options: ['Stayin\' Alive', 'Stumblin\' In', 'Take A Chance On Me', 'September'],
    correctIndex: 1,
  },
  {
    videoId: 'uSD4vsh1zDA',
    title: 'Black Eyed Peas - I Gotta Feeling',
    options: ['I Gotta Feeling', 'Right Round', 'Low', 'Single Ladies'],
    correctIndex: 0,
  },
  {
    videoId: 'U2waT9TxPU0',
    title: 'Flo Rida - Low',
    options: ['Right Round', 'Low', 'SexyBack', 'I Gotta Feeling'],
    correctIndex: 1,
  },
  {
    videoId: '4m1EFMoRFvY',
    title: 'Beyoncé - Single Ladies',
    options: ['Umbrella', 'This Is What You Came For', 'Single Ladies', 'Dangerous'],
    correctIndex: 2,
  },
  {
    videoId: 'CvBfHwUxHIk',
    title: 'Rihanna - Umbrella',
    options: ['Umbrella', 'Single Ladies', 'This Is What You Came For', 'Promises'],
    correctIndex: 0,
  },
  {
    videoId: 'LCcIx6bCcr8',
    title: 'Ronnie Ferrari - Ona By Chciała',
    options: ['Jestes szalona', 'Miłość w Zakopanem', 'Ona By Chciała', 'Zawsze tam gdzie Ty'],
    correctIndex: 2,
  },
  {
    videoId: '9bZkp7q19f0',
    title: 'PSY - Gangnam Style',
    options: ['Skibidi', 'Gangnam Style', 'Rasputin', 'Şımarık'],
    correctIndex: 1,
  },
  {
    videoId: 'cZwYpAh3bXQ',
    title: 'Majestic & Boney M. - Rasputin',
    options: ['Rasputin', 'Gangnam Style', 'Skibidi', 'September'],
    correctIndex: 0,
  },
  {
    videoId: 'mDFBTdToRmw',
    title: 'Little Big - Skibidi',
    options: ['Gangnam Style', 'Rasputin', 'Losing Control', 'Skibidi'],
    correctIndex: 3,
  },
  {
    videoId: 'cpp69ghR1IM',
    title: 'Tarkan - Şımarık',
    options: ['La Bamba', 'Şımarık', 'Rasputin', 'Gangnam Style'],
    correctIndex: 1,
  },
  {
    videoId: '3gOHvDP_vCs',
    title: 'Justin Timberlake - SexyBack',
    options: ['Low', 'SexyBack', 'Right Round', 'I Gotta Feeling'],
    correctIndex: 1,
  },
  {
    videoId: 'iAc6Qr_sAXw',
    title: 'Paweł Domagała - Weź nie pytaj',
    options: ['To co masz Ty!', 'Zawsze tam gdzie Ty', 'Weź nie pytaj', 'Miłość w Zakopanem'],
    correctIndex: 2,
  },
  {
    videoId: 'CXBFU97X61I',
    title: 'Miley Cyrus - End of World',
    options: ['Dream On', 'End of World', 'Beautiful Things', 'Only Human'],
    correctIndex: 1,
  },
  {
    videoId: 'fNFzfwLM72c',
    title: 'Bee Gees - Stayin\' Alive',
    options: ['September', 'Take A Chance On Me', 'Stayin\' Alive', 'Stumblin\' In'],
    correctIndex: 2,
  },
  {
    videoId: 'Oa_RSwwpPaA',
    title: 'Benson Boone - Beautiful Things',
    options: ['Beautiful Things', 'Only Human', 'End of Beginning', 'So Cold'],
    correctIndex: 0,
  },
  {
    videoId: 'dLxpNiF0YKs',
    title: 'R.E.M. - Man On The Moon',
    options: ['Dream On', 'Stayin\' Alive', 'Man On The Moon', 'September'],
    correctIndex: 2,
  },
  {
    videoId: 'uvY8fdgezLQ',
    title: 'Zara Larsson - Midnight Sun',
    options: ['Good Luck, Babe!', 'Midnight Sun', 'Post Sex Clarity', 'All I Know'],
    correctIndex: 1,
  },
  {
    videoId: 'zfL1I7WpEdk',
    title: 'Dawid Podsiadło - To co masz Ty!',
    options: ['Weź nie pytaj', 'Zawsze tam gdzie Ty', 'dopóki się nie znudzisz', 'To co masz Ty!'],
    correctIndex: 3,
  },
  {
    videoId: 'Ro7yHf_pU14',
    title: 'Kardinal Offishall & Akon - Dangerous',
    options: ['Dangerous', 'SexyBack', 'Low', 'Umbrella'],
    correctIndex: 0,
  },
  {
    videoId: 'xpA5pxLjgW4',
    title: 'Loud Luxury & Emily Roberts - LOVE YOU FOR LIFE.',
    options: ['Promises', 'LOVE YOU FOR LIFE.', 'All I Know', 'This Is What You Came For'],
    correctIndex: 1,
  },
  {
    videoId: 'hkUSnrHQJHg',
    title: 'Alex Warren - FEVER DREAM',
    options: ['FEVER DREAM', 'So Cold', 'End of Beginning', 'Beautiful Things'],
    correctIndex: 0,
  },
  {
    videoId: 'kBNt8hYvn8A',
    title: 'Jonas Brothers - Only Human',
    options: ['Beautiful Things', 'Man On The Moon', 'Only Human', 'Dream On'],
    correctIndex: 2,
  },
  {
    videoId: '3IhKpk14R3A',
    title: 'Ruel - Don\'t Say That',
    options: ['Don\'t Say That', 'Best Part', 'Someone To You', '12 to 12'],
    correctIndex: 0,
  },
  {
    videoId: 'rK5TyISxZ_M',
    title: 'RAYE - WHERE IS MY HUSBAND!',
    options: ['Single Ladies', 'WHERE IS MY HUSBAND!', 'Good Luck, Babe!', 'Umbrella'],
    correctIndex: 1,
  },
  {
    videoId: 'dFUF-5ALIpA',
    title: 'The Nycer & Deeci - Losing Control',
    options: ['Skibidi', 'Rasputin', 'Losing Control', 'Right Round'],
    correctIndex: 2,
  },
  {
    videoId: 'zpzdgmqIHOQ',
    title: 'Madonna - La Isla Bonita',
    options: ['La Bamba', 'La Isla Bonita', 'Livin\' la Vida Loca', 'Şımarık'],
    correctIndex: 1,
  },
  {
    videoId: 'iJDtukGW79Y',
    title: 'Aerosmith - Dream On',
    options: ['Man On The Moon', 'Stayin\' Alive', 'September', 'Dream On'],
    correctIndex: 3,
  },
  {
    videoId: 'jn6ZnlgfnO4',
    title: 'MIŁ, Zalia, Koder - dopóki się nie znudzisz',
    options: ['dopóki się nie znudzisz', 'Weź nie pytaj', 'To co masz Ty!', 'Zawsze Z Tobą Chciałbym'],
    correctIndex: 0,
  },
  {
    videoId: 'SN5dhslfqLs',
    title: 'Rudimental & Khalid - All I Know',
    options: ['Promises', 'LOVE YOU FOR LIFE.', 'All I Know', 'This Is What You Came For'],
    correctIndex: 2,
  },
  {
    videoId: 'vUoOZPfuy8o',
    title: 'MIKOLAS - FERRARI',
    options: ['FEVER DREAM', 'FERRARI', 'LOVE YOU FOR LIFE.', 'Dangerous'],
    correctIndex: 1,
  },
  {
    videoId: 'kkLk2XWMBf8',
    title: 'Calvin Harris & Sam Smith - Promises',
    options: ['This Is What You Came For', 'All I Know', 'Promises', 'LOVE YOU FOR LIFE.'],
    correctIndex: 2,
  },
  {
    videoId: '989-7xsRLR4',
    title: 'Vitas - 7th Element',
    options: ['Rasputin', '7th Element', 'Şımarık', 'Gangnam Style'],
    correctIndex: 1,
  },
  {
    videoId: '-crgQGdpZR0',
    title: 'ABBA - Take A Chance On Me',
    options: ['Stayin\' Alive', 'September', 'Stumblin\' In', 'Take A Chance On Me'],
    correctIndex: 3,
  },
  {
    videoId: 'CcCw1ggftuQ',
    title: 'Flo Rida & Kesha - Right Round',
    options: ['Right Round', 'Low', 'I Gotta Feeling', 'SexyBack'],
    correctIndex: 0,
  },
  {
    videoId: 'kOkQ4T5WO9E',
    title: 'Calvin Harris & Rihanna - This Is What You Came For',
    options: ['Umbrella', 'Promises', 'This Is What You Came For', 'All I Know'],
    correctIndex: 2,
  },
  {
    videoId: 'Gs069dndIYk',
    title: 'Earth, Wind & Fire - September',
    options: ['September', 'Stayin\' Alive', 'Man On The Moon', 'Take A Chance On Me'],
    correctIndex: 0,
  },
  {
    videoId: '9OcazSP6Hco',
    title: 'sombr - i wish i knew how to quit you',
    options: ['Homewrecker', '12 to 12', 'i wish i knew how to quit you', 'End of Beginning'],
    correctIndex: 2,
  },
  {
    videoId: 'rEwMR6wHg1U',
    title: 'Matt Dusk & Kuba Badach - Learnin\' the Blues / Już wiem',
    options: ['Stumblin\' In', 'Dream On', 'Learnin\' the Blues / Już wiem', 'Stayin\' Alive'],
    correctIndex: 2,
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
            <div class="now-playing">Teraz gra...</div>
          }
          <div #ytPlayerContainer style="position: absolute; width: 0; height: 0; overflow: hidden;"></div>
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
      grid-template-rows: 1fr 1fr;
      gap: 0.5rem;
      height: 152px;
    }

    .answer-btn {
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: 0.78rem;
      white-space: normal !important;
      line-height: 1.25;
      overflow: hidden;

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
  private readonly destroyRef = inject(DestroyRef);

  readonly ytPlayerContainer = viewChild<ElementRef>('ytPlayerContainer');

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.ytPlayer) {
        try { this.ytPlayer.destroy(); } catch {}
      }
    });
  }

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

  private ytPlayer: any = null;
  private ytApiReady = false;
  private pendingPlay = false;

  private readonly loadApiEffect = effect(() => {
    // trigger on container being available
    this.ytPlayerContainer();
    this.loadYTApi();
  }, { allowSignalWrites: false });

  private loadYTApi(): void {
    if (window.YT?.Player) {
      this.ytApiReady = true;
      return;
    }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      this.ytApiReady = true;
      if (this.pendingPlay) {
        this.pendingPlay = false;
        this.startPlayback();
      }
    };
  }

  play(): void {
    this.playing.set(true);
    if (this.ytApiReady) {
      this.startPlayback();
    } else {
      this.pendingPlay = true;
    }
  }

  private startPlayback(): void {
    const container = this.ytPlayerContainer()?.nativeElement;
    if (!container) return;

    const song = this.currentSong();

    // Destroy previous player if exists
    if (this.ytPlayer) {
      try { this.ytPlayer.destroy(); } catch {}
      this.ytPlayer = null;
    }

    // Create a fresh div for the player (YT API replaces it)
    const playerDiv = document.createElement('div');
    container.innerHTML = '';
    container.appendChild(playerDiv);

    this.ytPlayer = new window.YT.Player(playerDiv, {
      width: 1,
      height: 1,
      videoId: song.videoId,
      playerVars: {
        autoplay: 1,
        start: 30,
        end: 60,
        controls: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo();
        },
      },
    });
  }

  private stopPlayback(): void {
    if (this.ytPlayer) {
      try { this.ytPlayer.stopVideo(); } catch {}
    }
  }

  selectAnswer(index: number): void {
    if (this.answered() !== null) return;

    this.answered.set(index);
    this.playing.set(false);
    this.stopPlayback();
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
