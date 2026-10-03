import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Product, ProductService } from '../../core/api/product.service';
import { Observable } from 'rxjs';

@Component({ selector: 'app-seller-dashboard', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './seller-dashboard.component.html' })
export class SellerDashboardComponent {
  private readonly productsApi = inject(ProductService);
  products: Product[] = [];
  private readonly auth = inject(AuthService);
  product = { name: '', description: '', price: 0, quantity: 0 };
  editingId = '';
  error = '';
  message = '';

  constructor() {
    this.loadProducts();
    this.productsApi.productsChanged$.subscribe(() => this.loadProducts());
    this.auth.user$.subscribe(user => {
      if (user) this.loadProducts();
      else this.products = [];
    });
  }

  loadProducts() {
    this.productsApi.list().subscribe({
      next: products => {
        const userId = this.auth.userSnapshot?.id;
        this.products = userId ? products.filter(product => product.userId === userId) : [];
        this.error = '';
      },
      error: error => this.error = error.error?.message || 'Could not load your products.'
    });
  }

  save() {
    if (!this.product.name.trim() || !this.product.description.trim() || this.product.price < 0 || this.product.quantity < 0) {
      this.error = 'Complete the product fields with valid values.';
      return;
    }
    const editing = this.editingId.length > 0;
    let request: Observable<Product>;
    if (editing) {
      request = this.productsApi.update(this.editingId, this.product);
    } else {
      request = this.productsApi.create(this.product);
    }
    request.subscribe({
      next: () => {
        if (editing) {
          this.message = 'Product updated.';
        } else {
          this.message = 'Product published.';
        }
        this.reset();
        this.productsApi.refresh();
      },
      error: error => this.error = error.error?.message || 'Could not save product.'
    });
  }

  edit(product: Product) { this.editingId = product.id; this.product = { name: product.name, description: product.description, price: product.price, quantity: product.quantity }; }
  remove(id: string) { if (!confirm('Delete this product?')) return; this.productsApi.remove(id).subscribe({ next: () => { this.message = 'Product deleted.'; this.productsApi.refresh(); }, error: error => this.error = error.error?.message || 'Could not delete product.' }); }
  reset() { this.editingId = ''; this.product = { name: '', description: '', price: 0, quantity: 0 }; }
}
