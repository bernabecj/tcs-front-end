import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageNotificationComponent } from './message-notification.component';
import { MessageNotificationService } from '../../../core/services/message-notification.service';

describe('MessageNotificationComponent', () => {
  let component: MessageNotificationComponent;
  let fixture: ComponentFixture<MessageNotificationComponent>;
  let notificationService: MessageNotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageNotificationComponent],
      providers: [MessageNotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageNotificationComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(MessageNotificationService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show error message and error style when setError is set', () => {
    notificationService.setError('Algo salió mal.');
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('.alert-banner');
    const text = fixture.nativeElement.querySelector('.alert-banner__text');
    expect(banner?.classList.contains('alert-banner--error')).toBe(true);
    expect(text?.textContent?.trim()).toBe('Algo salió mal.');
  });
});
