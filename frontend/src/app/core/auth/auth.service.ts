import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'SELLER';
  avatar: string | null;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: 'CLIENT' | 'SELLER';
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'SELLER';
}

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

  register(email: string, password: string, name: string, role: 'CLIENT' | 'SELLER'): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/auth/register', { email, password, name, role });
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
    if (token === null) {
      return '';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.role || '';
    } catch {
      return '';
    }
  }
}
