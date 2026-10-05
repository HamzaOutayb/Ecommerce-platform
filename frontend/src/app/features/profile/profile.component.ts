import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

// ─── Controller ─────────────────────────────────────────────────────────────
// Thin wrapper around AuthService for editing the current user's profile.

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);

  // ── View state ────────────────────────────────────────────────────────────
  name = '';
  email = '';
  avatar = '';
  successMessage = '';
  error = '';

  constructor() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.name  = user.name;
        this.email = user.email;
        this.avatar = user.avatar ?? '';
      }
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  save(): void {
    if (!this.name.trim()) { this.error = 'Display name is required.'; return; }
    this.error = '';
    this.authService.updateProfile(this.name, this.avatar).subscribe({
      next: () => this.successMessage = 'Profile updated.',
      error: err => this.error = err.error?.message || 'Could not update profile.'
    });
  }
}
