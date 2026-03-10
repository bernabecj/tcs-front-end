import { Routes } from '@angular/router';

export const routes: Routes = [
  // Product routes will be added when implementing features
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', loadChildren: () => import('./features/products/products.routes').then(m => m.productsRoutes) },
  { path: '**', redirectTo: 'products' },
];
