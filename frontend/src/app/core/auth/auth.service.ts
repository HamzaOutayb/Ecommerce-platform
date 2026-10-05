import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse, RegisterResponse, UserProfile, RegisterRequest } from '../models/user.model';

// Re-export models so existing imports from auth.service still compile
export type { UserProfile, LoginResponse, RegisterResponse };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userSubject = new BehaviorSubject<UserProfile | null>(null);
  readonly user$ = this.userSubject.asObservable();

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get userSnapshot(): UserProfile | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.token !== null;
  }

  get isSeller(): boolean {
    const user = this.userSubject.value;
    if (user !== null && user.role === 'SELLER') {
      return true;
    }
    return this.tokenRole === 'ROLE_SELLER';
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  register(req: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/auth/register', req);
  }

  loadProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/me').pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  updateProfile(name: string, avatar: string): Observable<UserProfile> {
    return this.http.put<UserProfile>('/me', { name, avatar }).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  private get tokenRole(): string {
    const token = this.token;
    if (token === null) { return ''; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.role || '';
    } catch {
      return '';
    }
  }
}
