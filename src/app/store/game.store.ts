import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

export interface LevelProgress {
  completed: boolean;
  score: number;
}

export interface GameState {
  currentLevel: number;
  levels: Record<number, LevelProgress>;
}

const initialState: GameState = {
  currentLevel: 1,
  levels: {
    1: { completed: false, score: 0 },
    2: { completed: false, score: 0 },
    3: { completed: false, score: 0 },
  },
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    totalScore: computed(() => {
      const levels = store.levels();
      return Object.values(levels).reduce((sum, l) => sum + l.score, 0);
    }),
    allLevelsCompleted: computed(() => {
      const levels = store.levels();
      return Object.values(levels).every((l) => l.completed);
    }),
    levelProgress: computed(() => {
      const levels = store.levels();
      return Object.values(levels).filter((l) => l.completed).length;
    }),
  })),
  withMethods((store) => ({
    completeLevel(level: number, score: number): void {
      const levels = { ...store.levels() };
      levels[level] = { completed: true, score };
      patchState(store, {
        levels,
        currentLevel: Math.min(level + 1, 3),
      });
    },
    resetGame(): void {
      patchState(store, initialState);
    },
  }))
);
