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
        <span class="error-banner__text">{{ msg }}</span>
        <button type="button" class="error-banner__close" (click)="dismiss()" aria-label="Cerrar">
          &times;
        </button>
      </div>
    }
  `,
  styles: [
    `
      .error-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background-color: #fee;
        border: 1px solid #fcc;
        color: #c00;
        font-size: 0.875rem;
      }

      .error-banner__text {
        flex: 1;
      }

      .error-banner__close {
        background: none;
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: #c00;
        padding: 0 0.25rem;
      }

      .error-banner__close:hover {
        opacity: 0.8;
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
