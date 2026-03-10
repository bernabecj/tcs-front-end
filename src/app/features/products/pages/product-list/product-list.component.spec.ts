import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  ];

  beforeEach(async () => {
    productService = {
      getProducts: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: productService }],
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
      const cards = fixture.nativeElement.querySelectorAll('app-product-card');
      expect(cards.length).toBe(1);
      done();
    });
  });

  it('should display error message when API fails', (done) => {
    productService.getProducts.mockReturnValue(throwError(() => new Error('Network error')));
    const newFixture = TestBed.createComponent(ProductListComponent);
    newFixture.detectChanges();
    newFixture.whenStable().then(() => {
      newFixture.detectChanges();
      const errorText = newFixture.nativeElement.querySelector('.product-list__error');
      expect(errorText?.textContent?.trim()).toContain('No se pudieron cargar');
      done();
    });
  });

  it('should display empty message when no products', (done) => {
    productService.getProducts.mockReturnValue(of({ data: [] }));
    const newFixture = TestBed.createComponent(ProductListComponent);
    newFixture.detectChanges();
    newFixture.whenStable().then(() => {
      newFixture.detectChanges();
      const emptyText = newFixture.nativeElement.querySelector('.product-list__empty');
      expect(emptyText?.textContent?.trim()).toContain('No hay productos');
      done();
    });
  });
});
