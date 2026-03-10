import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ErrorNotificationService } from '../services/error-notification.service';

describe('httpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let errorService: ErrorNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        ErrorNotificationService,
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    errorService = TestBed.inject(ErrorNotificationService);
  });

  afterEach(() => {
    httpMock.verify();
    errorService.clear();
  });

  it('should set error message on 404', (done) => {
    http.get('/api/test').subscribe({
      error: () => {
        errorService.message$.subscribe((msg) => {
          expect(msg).toBe('Not found');
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
