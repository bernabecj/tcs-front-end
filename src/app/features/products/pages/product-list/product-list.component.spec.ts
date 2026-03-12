import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
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

  it('should display error when API fails and call getProducts again when Reintentar is clicked', async () => {
    productService.getProducts.mockReturnValue(throwError(() => new Error('Network error')));
    const newFixture = TestBed.createComponent(ProductListComponent);
    newFixture.detectChanges();
    await newFixture.whenStable();
    newFixture.detectChanges();
    const errorBlock = newFixture.nativeElement.querySelector('.product-list-state--error');
    expect(errorBlock?.textContent?.trim()).toContain('No se pudieron cargar los productos');
    const callsBeforeRetry = productService.getProducts.mock.calls.length;
    productService.getProducts.mockReturnValue(of({ data: [] }));
    const retryBtn = newFixture.nativeElement.querySelector('.product-list-state--error .btn-primary');
    retryBtn?.click();
    newFixture.detectChanges();
    expect(productService.getProducts.mock.calls.length).toBe(callsBeforeRetry + 1);
  });

  it('should display empty message when no products', (done) => {
    productService.getProducts.mockReturnValue(of({ data: [] }));
    const newFixture = TestBed.createComponent(ProductListComponent);
    newFixture.detectChanges();
    newFixture.whenStable().then(() => {
      newFixture.detectChanges();
      const emptyBlock = newFixture.nativeElement.querySelector('.product-list-state--empty');
      expect(emptyBlock?.textContent?.trim()).toContain('No hay productos');
      done();
    });
  });

  it('should open dropdown when clicking three-dots and navigate to edit on Editar (F5)', (done) => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const firstRowActions = fixture.nativeElement.querySelector('.product-table__actions');
      expect(firstRowActions).toBeTruthy();
      firstRowActions.click();
      fixture.detectChanges();
      expect(component.openMenuId()).toBe('prod-1');
      const editarLink = fixture.nativeElement.querySelector('.product-table__dropdown-item');
      expect(editarLink?.textContent?.trim()).toBe('Editar');
      editarLink.click();
      fixture.detectChanges();
      expect(component.openMenuId()).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/products', 'edit', 'prod-1']);
      done();
    });
  });
});
