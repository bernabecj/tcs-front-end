import { Component, inject, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageNotificationService } from '../../../core/services/message-notification.service';

@Component({
  selector: 'app-message-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-notification.component.html',
  styleUrls: ['./message-notification.component.scss'],
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
