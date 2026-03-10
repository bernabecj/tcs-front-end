import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../../../core/models/product.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 'prod-1',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    logo: 'https://example.com/logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name', () => {
    const title = fixture.nativeElement.querySelector('.product-card__title');
    expect(title?.textContent?.trim()).toBe(mockProduct.name);
  });

  it('should display product description', () => {
    const desc = fixture.nativeElement.querySelector('.product-card__description');
    expect(desc?.textContent?.trim()).toBe(mockProduct.description);
  });

  it('should display product logo with correct src', () => {
    const img = fixture.nativeElement.querySelector('.product-card__img');
    expect(img?.getAttribute('src')).toBe(mockProduct.logo);
    expect(img?.getAttribute('alt')).toBe(mockProduct.name);
  });

  it('should hide image and show placeholder on img error', () => {
    const img = fixture.nativeElement.querySelector('.product-card__img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(img.style.display).toBe('none');
    expect(img.parentElement?.classList.contains('product-card__logo--error')).toBe(true);
  });
});
