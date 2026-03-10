import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  // routes for list, add, edit
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent) },
];
