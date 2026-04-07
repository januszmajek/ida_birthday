import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameStore } from '../store/game.store';

export function levelGuard(requiredLevel: number): CanActivateFn {
  return () => {
    const store = inject(GameStore);
    const router = inject(Router);

    // Level 1 is always accessible
    if (requiredLevel === 1) return true;

    // Check all previous levels are completed
    const levels = store.levels();
    for (let i = 1; i < requiredLevel; i++) {
      if (!levels[i]?.completed) {
        // Redirect to the first incomplete level
        const target = i === 1 ? '/level-1' : `/level-${i}`;
        return router.parseUrl(target);
      }
    }

    return true;
  };
}

export const finalGuard: CanActivateFn = () => {
  const store = inject(GameStore);
  const router = inject(Router);

  if (store.allLevelsCompleted()) return true;

  // Redirect to current level
  const currentLevel = store.currentLevel();
  return router.parseUrl(`/level-${currentLevel}`);
};
