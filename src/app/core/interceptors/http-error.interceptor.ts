import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageNotificationService } from '../services/message-notification.service';
import { LoggingService } from '../services/logging.service';

const GENERIC_MESSAGE = 'Algo salió mal. Intenta nuevamente.';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(MessageNotificationService);
  const logging = inject(LoggingService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      logging.logError('API Error', err);
      notificationService.setError(GENERIC_MESSAGE);
      return throwError(() => err);
    })
  );
};
