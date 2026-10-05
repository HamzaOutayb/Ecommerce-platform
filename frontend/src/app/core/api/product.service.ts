import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Product, ProductInput } from '../models/product.model';

// Re-export so existing imports still compile
export type { Product, ProductInput };

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  readonly productsChanged$ = new Subject<void>();

  list()                                   { return this.http.get<Product[]>('/products'); }
  get(id: string)                          { return this.http.get<Product>(`/products/${id}`); }
  create(product: ProductInput)            { return this.http.post<Product>('/products', product); }
  update(id: string, p: ProductInput)      { return this.http.put<Product>(`/products/${id}`, p); }
  remove(id: string)                       { return this.http.delete<void>(`/products/${id}`); }

  refresh(): void { this.productsChanged$.next(); }
}
