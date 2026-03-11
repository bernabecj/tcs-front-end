import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="app-header">
      <svg class="app-header__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 10h20"/>
      </svg>
      <span class="app-header__title">BANCO</span>
    </header>
  `,
  styles: [
    `
      .app-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #fff;
        border-bottom: 1px solid #e9ecef;
      }

      .app-header__icon {
        color: #333;
      }

      .app-header__title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #333;
        letter-spacing: 0.05em;
      }
    `,
  ],
})
export class AppHeaderComponent {}
