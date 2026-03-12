import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export type NotificationType = 'error' | 'warning' | 'success';

export interface Notification {
  message: string;
  type: NotificationType;
  autoDismissMs?: number;
}

@Injectable({ providedIn: 'root' })
export class MessageNotificationService {
  private readonly _notification$ = new BehaviorSubject<Notification | null>(null);

  /** Full notification */
  readonly notification$ = this._notification$.asObservable();

  readonly message$: Observable<string | null> = this._notification$.pipe(
    map((n) => n?.message ?? null)
  );

  private readonly defaultAutoDismissMs = 3000;

  setError(message: string): void {
    this._notification$.next({ message, type: 'error', autoDismissMs: this.defaultAutoDismissMs });
  }

  setWarning(message: string, autoDismissMs: number = this.defaultAutoDismissMs): void {
    this._notification$.next({ message, type: 'warning', autoDismissMs });
  }

  setSuccess(message: string, autoDismissMs: number = this.defaultAutoDismissMs): void {
    this._notification$.next({ message, type: 'success', autoDismissMs });
  }

  clear(): void {
    this._notification$.next(null);
  }
}
