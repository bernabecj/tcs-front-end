import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorNotificationService } from '../../../core/services/error-notification.service';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (errorMessage(); as msg) {
      <div class="error-banner" role="alert">
        <span class="error-banner__icon" aria-hidden="true">!</span>
        <span class="error-banner__text">{{ msg }}</span>
        <button type="button" class="error-banner__close" (click)="dismiss()" aria-label="Cerrar">&times;</button>
      </div>
    }
  `,
  styles: [
    `
      .error-banner {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        max-width: 280px;
        background: #fff;
        border: 1px solid #e9ecef;
        border-left: 3px solid #dc3545;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-size: 0.8125rem;
        color: #333;
      }

      .error-banner__icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        font-size: 0.875rem;
        font-weight: 700;
        color: #fff;
        background: #dc3545;
        border-radius: 50%;
      }

      .error-banner__text {
        flex: 1;
        min-width: 0;
      }

      .error-banner__close {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        padding: 0;
        font-size: 1.25rem;
        line-height: 1;
        background: none;
        border: none;
        color: #6c757d;
        cursor: pointer;
      }

      .error-banner__close:hover {
        color: #333;
      }
    `,
  ],
})
export class ErrorBannerComponent {
  private readonly errorService = inject(ErrorNotificationService);
  readonly errorMessage = toSignal(this.errorService.message$, { initialValue: null });

  dismiss(): void {
    this.errorService.clear();
  }
}
