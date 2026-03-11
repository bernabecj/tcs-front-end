import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageNotificationService } from '../services/message-notification.service';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  private readonly notificationService = inject(MessageNotificationService);
  private readonly logging = inject(LoggingService);

  override handleError(error: unknown): void {
    this.logging.logError('Uncaught error', error);
    this.notificationService.setError('Algo salió mal. Intenta nuevamente.');
    super.handleError(error);
  }
}
