import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styles: [
    `
      .product-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        display: flex;
        flex-direction: column;
      }

      .product-card__logo {
        background: #f5f5f5;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 120px;
      }

      .product-card__logo--error::after {
        content: 'Sin logo';
        font-size: 0.75rem;
        color: #999;
      }

      .product-card__img {
        max-width: 100%;
        max-height: 80px;
        object-fit: contain;
      }

      .product-card__body {
        padding: 1rem;
      }

      .product-card__title {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #333;
      }

      .product-card__description {
        margin: 0;
        font-size: 0.875rem;
        color: #666;
        line-height: 1.4;
      }
    `,
  ],
})
export class ProductCardComponent {
  product = input.required<Product>();

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    img.parentElement?.classList.add('product-card__logo--error');
  }
}
