import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorNotificationService } from '../services/error-notification.service';
import { LoggingService } from '../services/logging.service';

const GENERIC_MESSAGE = 'Algo salió mal. Intenta nuevamente.';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorNotificationService);
  const logging = inject(LoggingService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      logging.logError('API Error', {
        url: err.url,
        status: err.status,
        message: err.message,
        error: err.error,
      });
      errorService.setError(GENERIC_MESSAGE);
      return throwError(() => err);
    })
  );
};
