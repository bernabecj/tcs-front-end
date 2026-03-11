import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { httpErrorInterceptor } from './http-error.interceptor';
import { MessageNotificationService } from '../services/message-notification.service';

describe('httpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let notificationService: MessageNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        MessageNotificationService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    notificationService = TestBed.inject(MessageNotificationService);
  });

  afterEach(() => {
    httpMock.verify();
    notificationService.clear();
  });

  it('should set generic message on 404', (done) => {
    http.get('/api/test').subscribe({
      error: () => {
        notificationService.message$.subscribe((msg) => {
          expect(msg).toBe('Algo salió mal. Intenta nuevamente.');
          done();
        });
      },
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
  });

  it('should pass through successful responses', () => {
    http.get('/api/test').subscribe((data) => {
      expect(data).toEqual({ ok: true });
    });
    const req = httpMock.expectOne('/api/test');
    req.flush({ ok: true });
  });
});
