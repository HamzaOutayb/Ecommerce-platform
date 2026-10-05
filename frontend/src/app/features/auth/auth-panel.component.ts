import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserProfile, LoginResponse, RegisterResponse } from '../../core/models/user.model';

// ─── Controller ─────────────────────────────────────────────────────────────
// Delegates all HTTP work to AuthService (service layer).
// Owns only view-state: form fields, loading flags, messages.

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.css']
})
export class AuthPanelComponent implements OnInit {
  private readonly authService = inject(AuthService);

  // ── View state ────────────────────────────────────────────────────────────
  mode: 'login' | 'register' = 'login';
  role: 'CLIENT' | 'SELLER' = 'CLIENT';
  email = '';
  password = '';
  name = '';
  avatar = '';
  signedIn = false;
  busy = false;
  profileBusy = false;
  errorMessage = '';
  profileError = '';
  successMessage = '';

  // ── Responses shown in view ───────────────────────────────────────────────
  loginResponse: LoginResponse | null = null;
  registerResponse: RegisterResponse | null = null;
  profileResponse: UserProfile | null = null;
  updateResponse: UserProfile | null = null;

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    if (this.authService.token !== null) {
      this.signedIn = true;
      this.fetchProfile(true);
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  showLogin(): void {
    this.mode = 'login';
    this.clearMessages();
  }

  showRegistration(): void {
    this.mode = 'register';
    this.clearMessages();
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  submitLogin(): void {
    this.setBusy(true);
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        this.loginResponse = response;
        this.signedIn = true;
        this.setBusy(false);
        this.fetchProfile(false);
      },
      error: err => { this.errorMessage = this.readError(err); this.setBusy(false); }
    });
  }

  submitRegistration(): void {
    this.setBusy(true);
    this.registerResponse = null;
    this.authService.register({ email: this.email, password: this.password, name: this.name, role: this.role }).subscribe({
      next: response => {
        this.registerResponse = response;
        this.successMessage = 'Registration succeeded. Sign in to access private endpoints.';
        this.setBusy(false);
      },
      error: err => { this.errorMessage = this.readError(err); this.setBusy(false); }
    });
  }

  reloadProfile(): void {
    this.fetchProfile(false);
  }

  saveProfile(): void {
    this.setBusy(true);
    this.authService.updateProfile(this.name, this.avatar).subscribe({
      next: response => {
        this.updateResponse = response;
        this.profileResponse = response;
        this.successMessage = 'Profile updated successfully.';
        this.setBusy(false);
      },
      error: err => { this.errorMessage = this.readError(err); this.setBusy(false); }
    });
  }

  logout(): void {
    this.authService.logout();
    this.signedIn = false;
    this.mode = 'login';
    this.password = '';
    this.loginResponse = null;
    this.profileResponse = null;
    this.updateResponse = null;
    this.clearMessages();
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private fetchProfile(clearInvalidSession: boolean): void {
    this.profileBusy = true;
    this.profileError = '';
    this.authService.loadProfile().subscribe({
      next: profile => {
        this.profileResponse = profile;
        this.name = profile.name;
        this.avatar = profile.avatar ?? '';
        this.profileBusy = false;
      },
      error: err => {
        this.profileError = this.readError(err);
        this.profileBusy = false;
        if (clearInvalidSession) { this.authService.logout(); this.signedIn = false; }
      }
    });
  }

  private setBusy(value: boolean): void {
    this.busy = value;
    if (value) { this.clearMessages(); }
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private readError(error: unknown): string {
    if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string') {
      return error.error.message;
    }
    return 'Request failed.';
  }
}
