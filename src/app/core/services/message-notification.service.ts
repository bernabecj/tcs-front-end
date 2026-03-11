import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export type NotificationType = 'error' | 'warning';

export interface Notification {
  message: string;
  type: NotificationType;
  autoDismissMs?: number;
}

@Injectable({ providedIn: 'root' })
export class MessageNotificationService {
  private readonly _notification$ = new BehaviorSubject<Notification | null>(null);

  /** Full notification (message + type + autoDismiss). Use this in the banner. */
  readonly notification$ = this._notification$.asObservable();

  /** Message only, for backward compatibility. */
  readonly message$: Observable<string | null> = this._notification$.pipe(
    map((n) => n?.message ?? null)
  );

  setError(message: string): void {
    this._notification$.next({ message, type: 'error' });
  }

  setWarning(message: string, autoDismissMs: number = 3000): void {
    this._notification$.next({ message, type: 'warning', autoDismissMs });
  }

  clear(): void {
    this._notification$.next(null);
  }
}
