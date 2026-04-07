import { Routes } from '@angular/router';
import { levelGuard, finalGuard } from './guards/level.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/welcome/welcome.view'),
  },
  {
    path: 'level-1',
    loadComponent: () => import('./views/level1/level1.view'),
    canActivate: [levelGuard(1)],
  },
  {
    path: 'level-2',
    loadComponent: () => import('./views/level2/level2.view'),
    canActivate: [levelGuard(2)],
  },
  {
    path: 'level-3',
    loadComponent: () => import('./views/level3/level3.view'),
    canActivate: [levelGuard(3)],
  },
  {
    path: 'final',
    loadComponent: () => import('./views/final/final.view'),
    canActivate: [finalGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
