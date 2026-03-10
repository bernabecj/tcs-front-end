import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorNotificationService {
  private readonly _message$ = new BehaviorSubject<string | null>(null);
  readonly message$ = this._message$.asObservable();

  setError(message: string): void {
    this._message$.next(message);
  }

  clear(): void {
    this._message$.next(null);
  }
}
