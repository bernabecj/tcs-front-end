import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  logError(message: string, error?: unknown): void {
    console.error(`[Error] ${message}`, error ?? '');
  }
}
