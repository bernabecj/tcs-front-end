import { TestBed } from '@angular/core/testing';
import { ErrorNotificationService } from './error-notification.service';

describe('ErrorNotificationService', () => {
  let service: ErrorNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit null initially', (done) => {
    service.message$.subscribe((msg) => {
      expect(msg).toBeNull();
      done();
    });
  });

  it('should emit error when setError is called', (done) => {
    service.setError('Test error');
    service.message$.subscribe((msg) => {
      expect(msg).toBe('Test error');
      done();
    });
  });

  it('should clear error when clear is called', (done) => {
    service.setError('Test error');
    service.clear();
    service.message$.subscribe((msg) => {
      expect(msg).toBeNull();
      done();
    });
  });
});
