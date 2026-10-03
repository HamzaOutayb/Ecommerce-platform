import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product, ProductService } from '../../core/api/product.service';

@Component({ selector: 'app-catalog', standalone: true, imports: [CommonModule, CurrencyPipe], templateUrl: './catalog.component.html' })
export class CatalogComponent {
  private readonly productsApi = inject(ProductService);
  products: Product[] = [];
  error = '';

  constructor() {
    this.load();
    this.productsApi.productsChanged$.subscribe(() => this.load());
  }

  load() {
    this.productsApi.list().subscribe({
      next: products => { this.products = products; this.error = ''; },
      error: () => this.error = 'Products are unavailable.'
    });
  }

}
