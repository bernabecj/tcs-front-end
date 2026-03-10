import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="product-list">
      <section class="product-list__header">
        <h1 class="product-list__title">Productos financieros</h1>
      </section>

      @if (loading()) {
        <p class="product-list__loading">Cargando productos...</p>
      } @else if (error()) {
        <p class="product-list__error">{{ error() }}</p>
      } @else if (products().length === 0) {
        <p class="product-list__empty">No hay productos para mostrar.</p>
      } @else {
        <div class="product-list__grid">
          @for (product of products(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .product-list {
        padding: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .product-list__header {
        margin-bottom: 1.5rem;
      }

      .product-list__title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
      }

      .product-list__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .product-list__loading,
      .product-list__empty,
      .product-list__error {
        margin: 0;
        padding: 1rem;
        font-size: 0.9375rem;
      }

      .product-list__loading {
        color: #666;
      }

      .product-list__empty {
        color: #666;
      }

      .product-list__error {
        color: #c00;
      }
    `,
  ],
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos. Verifica que el backend esté en ejecución.');
        this.loading.set(false);
      },
    });
  }
}
