import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../../core/services/product.service';

const mockProduct = {
  id: 'prod-edit',
  name: 'Product to Edit',
  description: 'Description of product to edit',
  logo: 'https://logo.url',
  date_release: '2030-06-01',
  date_revision: '2031-06-01',
};

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jest.Mocked<Pick<ProductService, 'verifyProductId' | 'createProduct' | 'getProductById' | 'updateProduct'>>;
  let router: Router;

  beforeEach(async () => {
    productService = {
      verifyProductId: jest.fn().mockReturnValue(of(false)),
      createProduct: jest.fn().mockReturnValue(of({ data: {} as any })),
      getProductById: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of({ data: mockProduct })),
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (k: string) => (k === 'id' ? null : null) } } } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with all required controls', () => {
    expect(component.form.get('id')).toBeDefined();
    expect(component.form.get('name')).toBeDefined();
    expect(component.form.get('description')).toBeDefined();
    expect(component.form.get('logo')).toBeDefined();
    expect(component.form.get('date_release')).toBeDefined();
    expect(component.form.get('date_revision')).toBeDefined();
  });

  it('reiniciar should reset the form and submitAttempted', () => {
    component.submitAttempted = true;
    component.form.patchValue({ id: 'abc', name: 'Test' });
    component.reiniciar();
    expect(component.form.get('id')?.value).toBe(null);
    expect(component.form.get('name')?.value).toBe(null);
    expect(component.submitAttempted).toBe(false);
  });

  it('onSubmit should set submitAttempted and not call API when form is invalid', () => {
    component.form.patchValue({ id: 'ab' }); // too short
    component.onSubmit();
    expect(component.submitAttempted).toBe(true);
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('onSubmit should call createProduct and navigate when form is valid', fakeAsync(() => {
    const today = new Date().toISOString().slice(0, 10);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const revision = nextYear.toISOString().slice(0, 10);

    component.form.patchValue({
      id: 'prod-1',
      name: 'Product Name',
      description: 'Product description here',
      logo: 'https://logo.url',
      date_release: today,
      date_revision: revision,
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    tick(500); // allow async ID validator to complete
    fixture.detectChanges();

    component.onSubmit();
    expect(productService.createProduct).toHaveBeenCalledWith(component.form.value);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  }));

  it('hasError returns true only after submitAttempted when control has error', () => {
    component.form.get('id')?.setValue('');
    component.form.get('id')?.updateValueAndValidity();
    expect(component.hasError('id', 'required')).toBe(false);
    component.submitAttempted = true;
    fixture.detectChanges();
    expect(component.hasError('id', 'required')).toBe(true);
  });

  it('getError returns message for required', () => {
    expect(component.getError('id', 'required')).toBe('Este campo es requerido!');
  });

  it('in edit mode should load product, patch form, disable id and call updateProduct on submit', fakeAsync(() => {
    TestBed.resetTestingModule();
    const editService = {
      verifyProductId: jest.fn().mockReturnValue(of(false)),
      createProduct: jest.fn(),
      getProductById: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of({ data: mockProduct })),
    };
    TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: editService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (k: string) => (k === 'id' ? 'prod-edit' : null) } } } },
      ],
    }).compileComponents();

    const editRouter = TestBed.inject(Router);
    jest.spyOn(editRouter, 'navigate').mockResolvedValue(true);
    const editFixture = TestBed.createComponent(ProductFormComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();
    tick(500); // allow getProductById and any async validators to complete
    editFixture.detectChanges();

    expect(editService.getProductById).toHaveBeenCalledWith('prod-edit');
    expect(editComponent.form.get('id')?.value).toBe('prod-edit');
    expect(editComponent.form.get('name')?.value).toBe(mockProduct.name);
    expect(editComponent.form.get('id')?.disabled).toBe(true);
    editComponent.form.get('name')?.setValue('Updated Name');
    editComponent.onSubmit();
    expect(editService.updateProduct).toHaveBeenCalledWith('prod-edit', expect.objectContaining({ name: 'Updated Name' }));
    expect(editService.createProduct).not.toHaveBeenCalled();
  }));
});
