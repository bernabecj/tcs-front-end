import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent) },
];
