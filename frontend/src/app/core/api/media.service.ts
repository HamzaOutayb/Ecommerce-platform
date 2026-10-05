import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);

  uploadImages(files: File[]): Observable<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return this.http.post<string[]>('/media/images', formData);
  }
}
