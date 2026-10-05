import { Component, ViewEncapsulation, inject } from '@angular/core';
import { AuthPanelComponent } from './features/auth/auth-panel.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { SellerDashboardComponent } from './features/seller/seller-dashboard.component';
import { AuthService } from './core/auth/auth.service';

// ─── App shell (root controller) ────────────────────────────────────────────
// Responsible only for routing high-level view visibility based on auth state.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthPanelComponent, CatalogComponent, SellerDashboardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  readonly auth = inject(AuthService);
}
