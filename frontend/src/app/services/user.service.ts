import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../helpers/api-url';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  getCurrentUser(): Observable<UserProfile>
  {
    return this.http.get<UserProfile>(`${API_BASE_URL}/me`);
  }
}
