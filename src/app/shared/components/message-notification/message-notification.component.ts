import { Component, inject, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageNotificationService } from '../../../core/services/message-notification.service';

@Component({
  selector: 'app-message-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-notification.component.html',
  styles: [
    `
      .alert-banner {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        max-width: 340px;
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-size: 0.9375rem;
        color: #333;
      }

      .alert-banner--error {
        border-left: 3px solid #dc3545;
      }

      .alert-banner--error .alert-banner__icon {
        background: #dc3545;
      }

      .alert-banner--warning {
        border-left: 3px solid #f0ad4e;
      }

      .alert-banner--warning .alert-banner__icon {
        background: #f0ad4e;
      }

      .alert-banner--success {
        border-left: 3px solid #28a745;
      }

      .alert-banner--success .alert-banner__icon {
        background: #28a745;
      }

      .alert-banner__icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        font-size: 1rem;
        font-weight: 700;
        color: #fff;
        border-radius: 50%;
      }

      .alert-banner__text {
        flex: 1;
        min-width: 0;
      }

      .alert-banner__close {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        padding: 0;
        font-size: 1.375rem;
        line-height: 1;
        background: none;
        border: none;
        color: #6c757d;
        cursor: pointer;
      }

      .alert-banner__close:hover {
        color: #333;
      }
    `,
  ],
})
export class MessageNotificationComponent implements OnDestroy {
  private readonly notificationService = inject(MessageNotificationService);
  readonly notification = toSignal(this.notificationService.notification$, { initialValue: null as any });

  private autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const n = this.notification();
      this.clearAutoDismissTimer();
      if (n?.autoDismissMs) {
        this.autoDismissTimer = setTimeout(() => {
          this.notificationService.clear();
          this.autoDismissTimer = null;
        }, n.autoDismissMs);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAutoDismissTimer();
  }

  dismiss(): void {
    this.notificationService.clear();
  }

  private clearAutoDismissTimer(): void {
    if (this.autoDismissTimer != null) {
      clearTimeout(this.autoDismissTimer);
      this.autoDismissTimer = null;
    }
  }
}
