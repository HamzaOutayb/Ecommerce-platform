import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Product, ProductInput } from '../../core/models/product.model';
import { ProductService } from '../../core/api/product.service';

// ─── Controller ─────────────────────────────────────────────────────────────
// Manages the seller's own product listings.
// Delegates all HTTP to ProductService; owns only view-state.

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent {
  private readonly productService = inject(ProductService);
  private readonly authService    = inject(AuthService);

  // ── View state ────────────────────────────────────────────────────────────
  products: Product[] = [];
  draft: ProductInput = this.emptyDraft();
  editingId = '';
  error = '';
  successMessage = '';

  get isEditing(): boolean { return this.editingId.length > 0; }

  constructor() {
    this.loadProducts();
    this.productService.productsChanged$.subscribe(() => this.loadProducts());
    this.authService.user$.subscribe(user => {
      if (user) { this.loadProducts(); } else { this.products = []; }
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  loadProducts(): void {
    this.productService.list().subscribe({
      next: products => {
        const userId = this.authService.userSnapshot?.id;
        this.products = userId ? products.filter(p => p.userId === userId) : [];
        this.error = '';
      },
      error: err => this.error = err.error?.message || 'Could not load your products.'
    });
  }

  save(): void {
    if (!this.draftIsValid()) {
      this.error = 'Please fill in all fields with valid values.';
      return;
    }

    this.clearMessages();
    const request: Observable<Product> = this.isEditing
      ? this.productService.update(this.editingId, this.draft)
      : this.productService.create(this.draft);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditing ? 'Product updated.' : 'Product published.';
        this.reset();
        this.productService.refresh();
      },
      error: err => this.error = err.error?.message || 'Could not save product.'
    });
  }

  edit(product: Product): void {
    this.editingId = product.id;
    this.draft = { name: product.name, description: product.description, price: product.price, quantity: product.quantity };
    this.clearMessages();
  }

  remove(id: string): void {
    if (!confirm('Delete this product?')) { return; }
    this.productService.remove(id).subscribe({
      next: () => { this.successMessage = 'Product deleted.'; this.productService.refresh(); },
      error: err => this.error = err.error?.message || 'Could not delete product.'
    });
  }

  reset(): void {
    this.editingId = '';
    this.draft = this.emptyDraft();
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private emptyDraft(): ProductInput {
    return { name: '', description: '', price: 0, quantity: 0 };
  }

  private draftIsValid(): boolean {
    return this.draft.name.trim().length > 0
      && this.draft.description.trim().length > 0
      && this.draft.price >= 0
      && this.draft.quantity >= 0;
  }

  private clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }
}
