import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map, debounceTime, distinctUntilChanged, switchMap, of, merge, first } from 'rxjs';
import { ProductService } from '../../../../core/services/product.service';
import { dateReleaseMinToday, dateRevisionOneYearAfter } from '../../validators/product-form.validators';

function idExistsValidator(productService: ProductService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const id = (control.value as string)?.trim();
    if (!id || id.length < 3) return of(null);
    return merge(of(id), control.valueChanges ?? of()).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value) => productService.verifyProductId(value)),
      map((exists) => (exists ? { idExists: true } : null)),
      first()
    );
  };
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  form: FormGroup;
  submitting = false;
  /** True after the user has clicked Agregar at least once; validation messages show only then. */
  submitAttempted = false;

  constructor() {
    this.form = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [idExistsValidator(inject(ProductService))],
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, dateReleaseMinToday()]],
      date_revision: ['', [Validators.required, dateRevisionOneYearAfter('date_release')]],
    });

    this.form.get('date_release')?.valueChanges.subscribe((release) => {
      const match = release && String(release).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const next = `${Number(match[1]) + 1}-${match[2]}-${match[3]}`;
        this.form.get('date_revision')?.setValue(next, { emitEvent: false });
      }
    });
  }

  hasError(controlName: string, errorCode: string): boolean {
    if (!this.submitAttempted) return false;
    const c = this.form.get(controlName);
    return c ? c.hasError(errorCode) : false;
  }

  /** Whether to show error state (red border) for a control; only after submit attempt. */
  showControlError(controlName: string): boolean {
    if (!this.submitAttempted) return false;
    const c = this.form.get(controlName);
    return c ? c.invalid : false;
  }

  getError(controlName: string, errorCode: string): string {
    const c = this.form.get(controlName);
    if (!c || !c.errors) return '';
    const err = c.errors[errorCode];
    if (errorCode === 'required') return 'Este campo es requerido!';
    if (errorCode === 'minlength') return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    if (errorCode === 'maxlength') return `Máximo ${c.errors['maxlength'].requiredLength} caracteres.`;
    if (errorCode === 'idExists') return 'ID ya existe.';
    if (errorCode === 'dateReleaseMinToday') return 'La fecha debe ser igual o mayor a hoy.';
    if (errorCode === 'dateRevisionOneYear') return 'Debe ser exactamente un año después de la fecha de liberación.';
    return '';
  }

  reiniciar(): void {
    this.submitAttempted = false;
    this.form.reset();
  }

  onSubmit(): void {
    this.submitAttempted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const value = this.form.value;
    this.productService.createProduct(value).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/products']);
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
