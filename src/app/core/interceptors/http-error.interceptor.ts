import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorNotificationService } from '../services/error-notification.service';

interface ApiErrorResponse {
  name?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

function getErrorMessage(err: HttpErrorResponse): string {
  if (err.error instanceof ErrorEvent) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  }

  const body = err.error as ApiErrorResponse | null;
  const status = err.status;

  if (body?.message) {
    return body.message;
  }

  if (body?.errors && typeof body.errors === 'object') {
    const messages = Object.values(body.errors).flat().filter(Boolean);
    if (messages.length > 0) {
      return messages.join('. ');
    }
  }

  switch (status) {
    case 400:
      return 'Solicitud inválida. Revisa los datos ingresados.';
    case 404:
      return 'Recurso no encontrado.';
    case 500:
      return 'Error del servidor. Intenta más tarde.';
    default:
      return `Error inesperado (${status}).`;
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorNotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = getErrorMessage(err);
      errorService.setError(message);
      return throwError(() => err);
    })
  );
};
