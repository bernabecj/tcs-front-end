import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<p>Product list - Coming soon</p>`,
  styles: [],
})
export class ProductListComponent {}
