import { Component, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/api/product.service';

// ─── Controller ─────────────────────────────────────────────────────────────
// Loads the product list on init and reloads whenever another feature
// publishes a change through ProductService.

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  private readonly productService = inject(ProductService);

  // ── View state ────────────────────────────────────────────────────────────
  products: Product[] = [];
  loading = true;
  error = '';

  constructor() {
    this.load();
    this.productService.productsChanged$.subscribe(() => this.load());
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  load(): void {
    this.loading = true;
    this.productService.list().subscribe({
      next: products => { this.products = products; this.loading = false; this.error = ''; },
      error: ()       => { this.error = 'Could not load products.'; this.loading = false; }
    });
  }
}
