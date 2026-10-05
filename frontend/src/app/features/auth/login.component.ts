import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <h2>Login</h2>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
      <form (ngSubmit)="submitLogin()">
        <div>
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required />
        </div>
        <button type="submit" [disabled]="busy">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
    .error { color: red; margin-bottom: 1rem; }
    div { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input { width: 100%; padding: 0.5rem; box-sizing: border-box; }
    button { padding: 0.5rem 1rem; cursor: pointer; }
  `]
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  busy = false;

  submitLogin(): void {
    this.busy = true;
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        // Token is saved in service tap
        this.busy = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.busy = false;
        if (err instanceof HttpErrorResponse && typeof err.error?.message === 'string') {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}
