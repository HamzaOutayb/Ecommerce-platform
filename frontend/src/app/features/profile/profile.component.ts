import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({ selector: 'app-profile', standalone: true, imports: [FormsModule], templateUrl: './profile.component.html' })
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  name = '';
  email = '';
  avatar = '';
  message = '';
  error = '';

  constructor() {
    this.auth.user$.subscribe(user => { if (user) { this.name = user.name; this.email = user.email; this.avatar = user.avatar || ''; } });
  }

  save() {
    if (!this.name.trim()) { this.error = 'Display name is required.'; return; }
    this.auth.updateProfile(this.name, this.avatar).subscribe({ next: () => this.message = 'Profile updated.', error: error => this.error = error.error?.message || 'Could not update profile.' });
  }

}
