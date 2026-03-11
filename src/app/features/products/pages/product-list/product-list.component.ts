import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe],
  template: `
    <div class="product-list-page">
      <div class="product-list-card">
        <div class="product-list-toolbar">
          <input
            type="text"
            class="product-list-search"
            placeholder="Buscar por nombre o descripción..."
            [value]="searchTerm()"
            (input)="onSearchInput($event)"
          />
          <a routerLink="/products/add" class="btn-primary">Agregar</a>
        </div>

        @if (loading()) {
          <p class="product-list-message product-list-message--loading">Cargando productos...</p>
        } @else if (error()) {
          <p class="product-list-message product-list-message--error">{{ error() }}</p>
        } @else if (displayedProducts().length === 0) {
          <p class="product-list-message product-list-message--empty">
            {{ filteredProductCount() === 0 && products().length > 0 ? 'No hay productos que coincidan con la búsqueda.' : 'No hay productos para mostrar.' }}
          </p>
        } @else {
          <table class="product-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Nombre del producto</th>
                <th>
                  Descripción
                  <span class="product-table__info-icon" title="Descripción del producto" aria-label="Info">i</span>
                </th>
                <th>
                  Fecha de liberación
                  <span class="product-table__info-icon" title="Fecha de liberación del producto" aria-label="Info">i</span>
                </th>
                <th>
                  Fecha de reestructuración
                  <span class="product-table__info-icon" title="Fecha de reestructuración del producto" aria-label="Info">i</span>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (product of displayedProducts(); track product.id) {
                <tr>
                  <td>
                    <div class="product-table__logo">
                      @if (!logoError(product.id)) {
                        <img
                          [src]="product.logo"
                          [alt]="product.name"
                          (error)="setLogoError(product.id)"
                        />
                      } @else {
                        <span class="product-table__logo-fallback">
                          {{ getInitials(product.name) }}
                        </span>
                      }
                    </div>
                  </td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.description }}</td>
                  <td>{{ product.date_release | dateFormat }}</td>
                  <td>{{ product.date_revision | dateFormat }}</td>
                  <td class="product-table__actions-cell">
                    <div class="product-table__actions-wrap">
                      <button
                        type="button"
                        class="product-table__actions"
                        aria-label="Opciones"
                        (click)="toggleMenu(product.id)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="6" r="1.5"/>
                          <circle cx="12" cy="12" r="1.5"/>
                          <circle cx="12" cy="18" r="1.5"/>
                        </svg>
                      </button>
                      @if (openMenuId() === product.id) {
                        <div class="product-table__dropdown">
                          <a
                            class="product-table__dropdown-item"
                            (click)="goToEdit(product.id)"
                          >Editar</a>
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <div class="product-list-footer">
            <span class="product-list-footer__count">{{ displayedProducts().length }} Resultados</span>
            <select
              class="product-list-footer__select"
              [value]="pageSize()"
              (change)="onPageSizeChange($event)"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly pageSize = signal(5);
  readonly logoErrors = signal<Set<string>>(new Set());
  /** Id of the product row whose actions menu is open, or null. */
  readonly openMenuId = signal<string | null>(null);

  /** Products matching the current search term (before page size slice). */
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.products();
    return term
      ? all.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        )
      : all;
  });

  readonly filteredProductCount = computed(() => this.filteredProducts().length);

  /** Products to show in the table (filtered + sliced by page size). */
  readonly displayedProducts = computed(() =>
    this.filteredProducts().slice(0, this.pageSize())
  );

  constructor() {
    this.loadProducts();
  }

  logoError(id: string): boolean {
    return this.logoErrors().has(id);
  }

  setLogoError(id: string): void {
    this.logoErrors.update((set) => new Set(set).add(id));
  }

  getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || '—';
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
  }

  toggleMenu(productId: string): void {
    this.openMenuId.update((current) => (current === productId ? null : productId));
  }

  goToEdit(productId: string): void {
    this.openMenuId.set(null);
    this.router.navigate(['/products', 'edit', productId]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.openMenuId() && !target.closest('.product-table__actions-cell')) {
      this.openMenuId.set(null);
    }
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
        this.error.set('No se pudieron cargar los productos. Intenta nuevamente.');
        this.loading.set(false);
      },
    });
  }
}
