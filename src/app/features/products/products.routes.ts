import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'add', loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent) },
];
