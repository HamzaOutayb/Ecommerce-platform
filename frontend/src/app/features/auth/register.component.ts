import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <h2>Register</h2>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
      <form (ngSubmit)="submitRegistration()">
        <div>
          <label>Name</label>
          <input type="text" [(ngModel)]="name" name="name" required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required />
        </div>
        <div>
          <label>Role</label>
          <select [(ngModel)]="role" name="role">
            <option value="CLIENT">Client</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>
        <button type="submit" [disabled]="busy">Register</button>
      </form>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
    .error { color: red; margin-bottom: 1rem; }
    div { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input, select { width: 100%; padding: 0.5rem; box-sizing: border-box; }
    button { padding: 0.5rem 1rem; cursor: pointer; }
  `]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  role: 'CLIENT' | 'SELLER' = 'CLIENT';
  errorMessage = '';
  busy = false;

  submitRegistration(): void {
    this.busy = true;
    this.errorMessage = '';
    this.authService.register({
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role
    }).subscribe({
      next: (res: any) => {
        this.busy = false;
        // If registration returns JWT (like { token: '...' } ) we save and redirect
        // Check if token returned
        if (res.token) {
          this.authService.saveToken(res.token);
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
        this.busy = false;
        if (err instanceof HttpErrorResponse && typeof err.error?.message === 'string') {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
