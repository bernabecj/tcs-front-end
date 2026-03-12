import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  logError(message: string, error?: unknown): void {
    if (environment.production) {
      // Production
      const safe = this.sanitize(error);
      console.error(`[Error] ${message}`, safe);
    } else {
      // Development: full details for debugging
      console.error(`[Error] ${message}`, error ?? '');
    }
  }

  private sanitize(error: unknown): string | object {
    if (error == null) return '';
    if (typeof error === 'object' && 'status' in error) {
      return { status: (error as { status?: number }).status, type: 'HttpErrorResponse' };
    }
    return error instanceof Error ? error.name : String(error);
  }
}
