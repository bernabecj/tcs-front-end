import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 'prod-1',
    name: 'Test Product',
    description: 'Test description for product',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProducts should return products', () => {
    const mockResponse = { data: [mockProduct] };
    service.getProducts().subscribe((res) => {
      expect(res.data).toEqual([mockProduct]);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/bp/products') && r.method === 'GET' && !r.url.includes('verification'));
    expect(req.request.url).toContain('/bp/products');
    req.flush(mockResponse);
  });

  it('getProductById should return product when found', () => {
    const mockResponse = { data: [mockProduct] };
    service.getProductById('prod-1').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/bp/products') && r.method === 'GET');
    req.flush(mockResponse);
  });

  it('verifyProductId should return true when id exists', () => {
    service.verifyProductId('prod-1').subscribe((exists) => {
      expect(exists).toBe(true);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/verification/prod-1'));
    req.flush(true);
  });

  it('createProduct should POST product', () => {
    const mockResponse = { message: 'Product added', data: mockProduct };
    service.createProduct(mockProduct).subscribe((res) => {
      expect(res.data).toEqual(mockProduct);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/bp/products') && r.method === 'POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockResponse);
  });

  it('updateProduct should PUT product', () => {
    const updateData = { name: 'Updated Name', description: mockProduct.description, logo: mockProduct.logo, date_release: mockProduct.date_release, date_revision: mockProduct.date_revision };
    const mockResponse = { message: 'Updated', data: { ...mockProduct, ...updateData } };
    service.updateProduct('prod-1', updateData).subscribe((res) => {
      expect(res.data.name).toBe('Updated Name');
    });
    const req = httpMock.expectOne((r) => r.url.includes('/bp/products/prod-1') && r.method === 'PUT');
    req.flush(mockResponse);
  });

  it('deleteProduct should DELETE product', () => {
    service.deleteProduct('prod-1').subscribe((res) => {
      expect(res.message).toBeDefined();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/bp/products/prod-1') && r.method === 'DELETE');
    req.flush({ message: 'Product removed successfully' });
  });
});
