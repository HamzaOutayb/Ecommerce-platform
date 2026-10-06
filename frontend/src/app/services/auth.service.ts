import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'buy-auth-token';
  private readonly authenticatedState = signal(
    Boolean(localStorage.getItem(this.tokenKey))
  );

  readonly authenticated = this.authenticatedState.asReadonly();

  login(request: LoginRequest): Observable<LoginResponse>
  {
    return this.http.post<LoginResponse>(
      'http://localhost:8080/auth/login',
      request
    );
  }

  register(request: RegisterRequest): Observable<RegisterResponse>
  {
    return this.http.post<RegisterResponse>(
      'http://localhost:8080/auth/register',
      request
    );
  }

  saveToken(token: string): void
  {
    localStorage.setItem(this.tokenKey, token);
    this.authenticatedState.set(true);
  }

  isAuthenticated(): boolean
  {
    return this.authenticatedState();
  }
}
