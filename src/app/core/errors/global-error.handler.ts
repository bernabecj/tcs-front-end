import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorNotificationService } from '../services/error-notification.service';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  private readonly errorService = inject(ErrorNotificationService);
  private readonly logging = inject(LoggingService);

  override handleError(error: unknown): void {
    this.logging.logError('Uncaught error', error);
    this.errorService.setError('Algo salió mal. Intenta nuevamente.');
    super.handleError(error);
  }
}
