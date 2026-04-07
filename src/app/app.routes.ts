import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/welcome/welcome.view'),
  },
  {
    path: 'level-1',
    loadComponent: () => import('./views/level1/level1.view'),
  },
  {
    path: 'level-2',
    loadComponent: () => import('./views/level2/level2.view'),
  },
  {
    path: 'level-3',
    loadComponent: () => import('./views/level3/level3.view'),
  },
  {
    path: 'final',
    loadComponent: () => import('./views/final/final.view'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
