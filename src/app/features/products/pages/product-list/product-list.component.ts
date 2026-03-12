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
  templateUrl: './product-list.component.html',
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

  /** Reload products (e.g. after error). */
  retry(): void {
    this.loadProducts();
  }

  /** Clear search term (used when empty search results). */
  clearSearch(): void {
    this.searchTerm.set('');
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
