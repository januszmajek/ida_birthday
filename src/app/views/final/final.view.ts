import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-final',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="view-container final-view">
      <div class="confetti">🎉🎊🥳🎂🎈</div>

      <h1>Gratulacje, Idu!</h1>
      <p class="subtitle">Ukończyłaś wszystkie 3 mini-gry!</p>
      <p class="score">Twój wynik: {{ gameStore.totalScore() }} pkt</p>

      <div class="reward-box">
        <p class="reward-title">🎁 Twoja nagroda czeka!</p>
        <p class="reward-desc">Kliknij poniżej, aby pobrać voucher</p>

        <button
          mat-raised-button
          color="primary"
          class="download-btn"
          (click)="downloadVoucher()"
        >
          <mat-icon>download</mat-icon>
          Pobierz voucher
        </button>
      </div>

      <div class="nav-buttons">
        <button mat-button (click)="restart()">Zagraj ponownie</button>
      </div>
    </div>
  `,
  styles: `
    .final-view {
      animation: fadeIn 0.6s ease-out;
    }

    .confetti {
      font-size: 2rem;
      letter-spacing: 0.5rem;
      margin-bottom: 1rem;
      animation: bounce 1.5s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .subtitle {
      color: #e8a8d6;
      font-size: 1.1rem;
    }

    .score {
      font-size: 1.25rem;
      font-weight: 500;
      color: #c879b2;
      margin: 0.5rem 0 1.5rem;
    }

    .reward-box {
      background: rgba(#c879b2, 0.12);
      border: 2px solid rgba(#c879b2, 0.4);
      border-radius: 16px;
      padding: 1.5rem;
      margin: 1rem 0;
    }

    .reward-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .reward-desc {
      color: rgba(#f5f0f3, 0.7);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .download-btn {
      font-size: 1rem;
      min-height: 48px;
      width: 100%;

      mat-icon {
        margin-right: 0.5rem;
      }
    }
  `,
})
export default class FinalView {
  readonly gameStore = inject(GameStore);
  private readonly router = inject(Router);

  downloadVoucher(): void {
    const link = document.createElement('a');
    const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
    link.href = `${baseHref}voucher.pdf`;
    link.download = 'voucher-urodzinowy.pdf';
    link.click();
  }

  restart(): void {
    this.gameStore.resetGame();
    this.router.navigateByUrl('/');
  }
}
