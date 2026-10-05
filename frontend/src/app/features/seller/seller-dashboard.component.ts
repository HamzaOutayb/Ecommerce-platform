import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Product, ProductInput } from '../../core/models/product.model';
import { ProductService } from '../../core/api/product.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly authService    = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  draft: ProductInput = this.emptyDraft();
  editingId = '';
  error = '';
  successMessage = '';

  get isEditing(): boolean { return this.editingId.length > 0; }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editingId = id;
        this.loadProduct(id);
      } else {
        this.editingId = '';
        this.draft = this.emptyDraft();
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.get(id).subscribe({
      next: (product) => {
        this.draft = {
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity
        };
      },
      error: () => this.error = 'Could not load product for editing.'
    });
  }

  save(): void {
    if (!this.draftIsValid()) {
      this.error = 'Please fill in all fields with valid values.';
      return;
    }

    this.clearMessages();
    const request = this.isEditing
      ? this.productService.update(this.editingId, this.draft)
      : this.productService.create(this.draft);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditing ? 'Product updated.' : 'Product published.';
        setTimeout(() => this.router.navigate(['/profile']), 1500);
      },
      error: err => this.error = err.error?.message || 'Could not save product.'
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

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
