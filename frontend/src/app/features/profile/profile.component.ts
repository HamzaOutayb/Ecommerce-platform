import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ProductService } from '../../core/api/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);

  name = '';
  email = '';
  avatar = '';
  role = '';
  successMessage = '';
  error = '';
  loading = true;
  userId = '';
  sellerProducts: Product[] = [];

  ngOnInit(): void {
    this.authService.loadProfile().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.name = user.name;
        this.email = user.email;
        this.avatar = user.avatar ?? '';
        this.role = user.role;
        this.loading = false;
        if (this.role === 'SELLER') {
          this.loadSellerProducts();
        }
      },
      error: (err) => {
        this.error = 'Could not load profile.';
        this.loading = false;
      }
    });
  }

  loadSellerProducts(): void {
    this.productService.list().subscribe({
      next: products => {
        this.sellerProducts = products.filter(p => p.sellerId === this.userId);
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Delete this product?')) {
      this.productService.remove(id).subscribe({
        next: () => this.loadSellerProducts(),
        error: (err) => alert('Could not delete product.')
      });
    }
  }

  save(): void {
    if (!this.name.trim()) { this.error = 'Display name is required.'; return; }
    this.error = '';
    this.authService.updateProfile(this.name, this.avatar).subscribe({
      next: () => this.successMessage = 'Profile updated.',
      error: err => this.error = err.error?.message || 'Could not update profile.'
    });
  }
}
