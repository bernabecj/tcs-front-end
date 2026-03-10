import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorBannerComponent } from './error-banner.component';
import { ErrorNotificationService } from '../../../core/services/error-notification.service';

describe('ErrorBannerComponent', () => {
  let component: ErrorBannerComponent;
  let fixture: ComponentFixture<ErrorBannerComponent>;
  let errorService: ErrorNotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBannerComponent],
      providers: [ErrorNotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorBannerComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorNotificationService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show banner when no error', () => {
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('.error-banner');
    expect(banner).toBeNull();
  });

  it('should show error message when set', () => {
    errorService.setError('Something went wrong');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.error-banner__text');
    expect(text?.textContent?.trim()).toBe('Something went wrong');
  });

  it('should clear error when dismiss is clicked', () => {
    errorService.setError('Error');
    fixture.detectChanges();
    const closeBtn = fixture.nativeElement.querySelector('.error-banner__close');
    closeBtn?.click();
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('.error-banner');
    expect(banner).toBeNull();
  });
});
