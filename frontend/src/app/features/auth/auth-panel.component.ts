import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginResponse, RegisterResponse, UserProfile } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.css']
})
export class AuthPanelComponent implements OnInit {
  private readonly auth = inject(AuthService);

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
  message = '';
  loginResponse: LoginResponse | null = null;
  registerResponse: RegisterResponse | null = null;
  profileResponse: UserProfile | null = null;
  updateResponse: UserProfile | null = null;

  ngOnInit(): void {
    if (this.auth.token !== null) {
      this.signedIn = true;
      this.fetchProfile(true);
    }
  }

  showLogin(): void {
    this.mode = 'login';
    this.errorMessage = '';
    this.message = '';
  }

  showRegistration(): void {
    this.mode = 'register';
    this.errorMessage = '';
    this.message = '';
  }

  submitLogin(): void {
    this.busy = true;
    this.errorMessage = '';
    this.message = '';

    this.auth.login(this.email, this.password).subscribe({
      next: response => {
        this.loginResponse = response;
        this.signedIn = true;
        this.busy = false;
        this.fetchProfile(false);
      },
      error: error => {
        this.errorMessage = this.readError(error);
        this.busy = false;
      }
    });
  }

  submitRegistration(): void {
    this.busy = true;
    this.errorMessage = '';
    this.message = '';
    this.registerResponse = null;

    this.auth.register(this.email, this.password, this.name, this.role).subscribe({
      next: response => {
        this.registerResponse = response;
        this.message = 'Registration succeeded. Sign in with this account to test the private endpoints.';
        this.busy = false;
      },
      error: error => {
        this.errorMessage = this.readError(error);
        this.busy = false;
      }
    });
  }

  reloadProfile(): void {
    this.fetchProfile(false);
  }

  saveProfile(): void {
    this.busy = true;
    this.errorMessage = '';
    this.message = '';

    this.auth.updateProfile(this.name, this.avatar).subscribe({
      next: response => {
        this.updateResponse = response;
        this.profileResponse = response;
        this.message = 'PUT /me succeeded.';
        this.busy = false;
      },
      error: error => {
        this.errorMessage = this.readError(error);
        this.busy = false;
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.signedIn = false;
    this.mode = 'login';
    this.password = '';
    this.loginResponse = null;
    this.profileResponse = null;
    this.updateResponse = null;
    this.profileError = '';
    this.errorMessage = '';
    this.message = '';
  }

  private fetchProfile(clearInvalidSession: boolean): void {
    this.profileBusy = true;
    this.profileError = '';

    this.auth.loadProfile().subscribe({
      next: profile => {
        this.profileResponse = profile;
        this.name = profile.name;
        this.avatar = '';
        if (profile.avatar !== null) {
          this.avatar = profile.avatar;
        }
        this.profileBusy = false;
      },
      error: error => {
        this.profileError = this.readError(error);
        this.profileBusy = false;
        if (clearInvalidSession) {
          this.auth.logout();
          this.signedIn = false;
        }
      }
    });
  }

  private readError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error.message === 'string') {
        return error.error.message;
      }
    }
    return 'Request failed.';
  }
}
