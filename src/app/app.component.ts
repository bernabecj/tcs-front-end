import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorBannerComponent } from './shared/components/error-banner/error-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'financial-products';
}
