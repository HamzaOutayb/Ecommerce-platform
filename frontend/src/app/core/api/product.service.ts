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
  imagePaths?: string[];
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  readonly productsChanged$ = new Subject<void>();

  list() { return this.http.get<Product[]>('/products'); }
  get(id: string) { return this.http.get<Product>(`/products/${id}`); }
  create(product: ProductInput) { return this.http.post<Product>('/products', product); }
  update(id: string, product: ProductInput) { return this.http.put<Product>(`/products/${id}`, product); }
  remove(id: string) { return this.http.delete<void>(`/products/${id}`); }

  refresh() { this.productsChanged$.next(); }
}
