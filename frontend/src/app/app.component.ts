import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly authenticated = this.authService.authenticated;

  logout(): void
  {
    this.authService.logout();
    this.router.navigateByUrl('/products');
  }
}
