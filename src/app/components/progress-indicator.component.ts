import { Component, inject, computed } from '@angular/core';
import { GameStore } from '../store/game.store';

@Component({
  selector: 'app-progress',
  template: `
    <div class="progress-bar">
      @for (level of [1, 2, 3]; track level) {
        <div
          class="progress-dot"
          [class.completed]="isCompleted(level)"
          [class.active]="isActive(level)"
        ></div>
      }
      <span class="progress-label">{{ label() }}</span>
    </div>
  `,
})
export class ProgressIndicatorComponent {
  private readonly store = inject(GameStore);

  readonly label = computed(
    () => `Poziom ${this.store.currentLevel()} / 3`
  );

  isCompleted(level: number): boolean {
    return this.store.levels()[level]?.completed ?? false;
  }

  isActive(level: number): boolean {
    return this.store.currentLevel() === level;
  }
}
