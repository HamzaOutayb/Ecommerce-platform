import { Routes } from '@angular/router';
import { CatalogComponent } from './features/catalog/catalog.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SellerDashboardComponent } from './features/seller/seller-dashboard.component';
import { sellerGuard } from './core/auth/seller.guard';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { 
    path: 'seller/products/new', 
    component: SellerDashboardComponent,
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/products/:id/edit',
    component: SellerDashboardComponent,
    canActivate: [sellerGuard]
  }
];
