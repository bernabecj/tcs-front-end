import { TestBed } from '@angular/core/testing';
import { MessageNotificationService } from './message-notification.service';

describe('MessageNotificationService', () => {
  let service: MessageNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit error notification with autoDismiss when setError is called', (done) => {
    service.setError('Test error');
    service.notification$.subscribe((n) => {
      expect(n).toEqual({ message: 'Test error', type: 'error', autoDismissMs: 3000 });
      done();
    });
  });
});
