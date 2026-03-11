import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jest.Mocked<Pick<ProductService, 'getProducts'>>;

  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      logo: 'logo1.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    },
    {
      id: 'prod-2',
      name: 'Tarjeta Gold',
      description: 'Tarjeta premium',
      logo: 'logo2.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01',
    },
  ];

  beforeEach(async () => {
    productService = {
      getProducts: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [provideRouter([]), { provide: ProductService, useValue: productService }],
    }).compileComponents();

    productService.getProducts.mockReturnValue(of({ data: mockProducts }));
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ProductService.getProducts on init', () => {
    expect(productService.getProducts).toHaveBeenCalledTimes(1);
  });

  it('should display products after loading', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.products()).toEqual(mockProducts);
      expect(component.loading()).toBe(false);
      const rows = fixture.nativeElement.querySelectorAll('.product-table tbody tr');
      expect(rows.length).toBe(2);
      done();
    });
  });

  it('should display error message when API fails', async () => {
    productService.getProducts.mockReturnValue(throwError(() => new Error('Network error')));
    const newFixture = TestBed.createComponent(ProductListComponent);
    newFixture.detectChanges();
    await newFixture.whenStable();
    newFixture.detectChanges();
    const errorText = newFixture.nativeElement.querySelector('.product-list-message--error');
    expect(errorText?.textContent?.trim()).toContain('No se pudieron cargar los productos');
  });

  it('should display empty message when no products', (done) => {
    productService.getProducts.mockReturnValue(of({ data: [] }));
    const newFixture = TestBed.createComponent(ProductListComponent);
    newFixture.detectChanges();
    newFixture.whenStable().then(() => {
      newFixture.detectChanges();
      const emptyText = newFixture.nativeElement.querySelector('.product-list-message--empty');
      expect(emptyText?.textContent?.trim()).toContain('No hay productos para mostrar');
      done();
    });
  });

  it('should filter by name when searching (F2)', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.searchTerm.set('Tarjeta');
      fixture.detectChanges();
      expect(component.filteredProductCount()).toBe(1);
      expect(component.filteredProducts()[0].name).toBe('Tarjeta Gold');
      const rows = fixture.nativeElement.querySelectorAll('.product-table tbody tr');
      expect(rows.length).toBe(1);
      done();
    });
  });

  it('should filter by description when searching (F2)', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.searchTerm.set('premium');
      fixture.detectChanges();
      expect(component.filteredProductCount()).toBe(1);
      expect(component.filteredProducts()[0].description).toContain('premium');
      done();
    });
  });

  it('should show search-no-match message when search has no results (F2)', (done) => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.searchTerm.set('xyz-nonexistent');
      fixture.detectChanges();
      expect(component.filteredProductCount()).toBe(0);
      const emptyText = fixture.nativeElement.querySelector('.product-list-message--empty');
      expect(emptyText?.textContent?.trim()).toContain('No hay productos que coincidan con la búsqueda');
      done();
    });
  });
});
