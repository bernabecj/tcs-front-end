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

  it('should emit null initially', (done) => {
    service.notification$.subscribe((n) => {
      expect(n).toBeNull();
      done();
    });
  });

  it('should emit error notification when setError is called', (done) => {
    service.setError('Test error');
    service.notification$.subscribe((n) => {
      expect(n).toEqual({ message: 'Test error', type: 'error' });
      done();
    });
  });

  it('should emit warning with autoDismiss when setWarning is called', (done) => {
    service.setWarning('Fix fields', 3000);
    service.notification$.subscribe((n) => {
      expect(n).toEqual({ message: 'Fix fields', type: 'warning', autoDismissMs: 3000 });
      done();
    });
  });

  it('should clear when clear is called', (done) => {
    service.setError('Test error');
    service.clear();
    service.notification$.subscribe((n) => {
      expect(n).toBeNull();
      done();
    });
  });

  it('message$ should emit message string for backward compatibility', (done) => {
    service.setError('Test error');
    service.message$.subscribe((msg) => {
      expect(msg).toBe('Test error');
      done();
    });
  });
});
