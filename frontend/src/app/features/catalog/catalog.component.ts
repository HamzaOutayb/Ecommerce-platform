import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Product, ProductService } from '../../core/api/product.service';

@Component({ selector: 'app-catalog', standalone: true, imports: [CommonModule, CurrencyPipe], templateUrl: './catalog.component.html' })
export class CatalogComponent {
  private readonly productsApi = inject(ProductService);
  readonly auth = inject(AuthService);
  products: Product[] = [];
  media: Record<string, { imagePath: string }[]> = {};
  mediaErrors: Record<string, boolean> = {};
  error = '';

  constructor() {
    this.load();
    this.productsApi.productsChanged$.subscribe(() => this.load());
  }

  load() {
    this.productsApi.list().subscribe({
      next: products => { this.products = products; products.forEach(product => this.loadMedia(product.id)); },
      error: () => this.error = 'Products are unavailable.'
    });
  }

  private loadMedia(productId: string) {
    this.productsApi.media(productId).subscribe({
      next: media => { this.media[productId] = media; this.mediaErrors[productId] = false; },
      error: () => this.mediaErrors[productId] = true
    });
  }
}
