import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { MediaItem, Product, ProductService } from '../../core/api/product.service';
import { Observable } from 'rxjs';

@Component({ selector: 'app-seller-dashboard', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './seller-dashboard.component.html' })
export class SellerDashboardComponent {
  private readonly productsApi = inject(ProductService);
  products: Product[] = [];
  media: Record<string, MediaItem[]> = {};
  private readonly auth = inject(AuthService);
  product = { name: '', description: '', price: 0, quantity: 0 };
  editingId = '';
  selectedProductId = '';
  selectedFile: File | null = null;
  error = '';
  message = '';

  constructor() {
    this.loadProducts();
    this.productsApi.productsChanged$.subscribe(() => this.loadProducts());
  }

  loadProducts() { this.productsApi.list().subscribe({ next: products => { this.products = products.filter(product => product.userId === this.auth.userSnapshot?.email); products.forEach(product => this.loadMedia(product.id)); }, error: error => this.error = error.error?.message || 'Could not load your products.' }); }
  loadMedia(productId: string) { this.productsApi.media(productId).subscribe({ next: items => this.media[productId] = items }); }

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

  chooseFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
    this.error = '';
    if (!this.selectedFile) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(this.selectedFile.type)) {
      this.error = 'Images must be JPEG, PNG, or WebP files.';
      this.selectedFile = null;
    } else if (this.selectedFile.size > 2 * 1024 * 1024) {
      this.error = 'Images must be 2 MB or smaller.';
      this.selectedFile = null;
    }
  }

  upload() {
    if (!this.selectedProductId || !this.selectedFile) { this.error = 'Select a product and an image first.'; return; }
    this.productsApi.uploadMedia(this.selectedProductId, this.selectedFile).subscribe({ next: () => { this.message = 'Image uploaded.'; this.selectedFile = null; }, error: error => this.error = error.error?.message || 'Image upload failed.' });
  }
  deleteMedia(id: string, productId: string) { this.productsApi.deleteMedia(id).subscribe({ next: () => { this.message = 'Image deleted.'; this.loadMedia(productId); }, error: error => this.error = error.error?.message || 'Image deletion failed.' }); }
}
