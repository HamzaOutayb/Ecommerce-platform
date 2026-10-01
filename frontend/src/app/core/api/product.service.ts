import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
}
export interface MediaItem { id: string; imagePath: string; productId: string; }

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  readonly productsChanged$ = new Subject<void>();

  list() { return this.http.get<Product[]>('/api/products'); }
  media(productId: string) { return this.http.get<MediaItem[]>(`/api/products/${productId}/media`); }
  create(product: Omit<Product, 'id' | 'userId'>) { return this.http.post<Product>('/api/products', product); }
  update(id: string, product: Omit<Product, 'id' | 'userId'>) { return this.http.put<Product>(`/api/products/${id}`, product); }
  remove(id: string) { return this.http.delete(`/api/products/${id}`); }
  uploadMedia(productId: string, file: File) {
    const body = new FormData();
    body.append('file', file);
    return this.http.post(`/api/products/${productId}/media`, body);
  }
  deleteMedia(id: string) { return this.http.delete(`/api/media/${id}`); }
  refresh() { this.productsChanged$.next(); }
}
