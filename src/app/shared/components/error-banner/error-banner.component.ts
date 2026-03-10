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
        <div class="error-banner__icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="error-banner__text">{{ msg }}</p>
        <button type="button" class="error-banner__close" (click)="dismiss()" aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    }
  `,
  styles: [
    `
      .error-banner {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        background: linear-gradient(135deg, #fff5f5 0%, #fee 100%);
        border-left: 4px solid #dc2626;
        border-radius: 0 8px 8px 0;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.12);
        color: #991b1b;
        font-size: 0.9375rem;
        line-height: 1.4;
      }

      .error-banner__icon {
        flex-shrink: 0;
        color: #dc2626;
      }

      .error-banner__text {
        flex: 1;
        margin: 0;
      }

      .error-banner__close {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        background: rgba(220, 38, 38, 0.1);
        border: none;
        border-radius: 6px;
        color: #b91c1c;
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
      }

      .error-banner__close:hover {
        background: rgba(220, 38, 38, 0.2);
        color: #991b1b;
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
