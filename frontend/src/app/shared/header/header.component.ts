import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="header">
      <a class="logo" routerLink="/">BUY 01</a>
      <nav>
        <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active">Products</a>
        
        <ng-container *ngIf="!authService.isAuthenticated">
          <a routerLink="/auth/login" routerLinkActive="active">Login</a>
          <a routerLink="/auth/register" routerLinkActive="active">Register</a>
        </ng-container>

        <ng-container *ngIf="authService.isAuthenticated">
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </ng-container>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
