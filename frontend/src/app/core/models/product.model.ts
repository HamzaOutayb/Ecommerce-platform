// ─── Model: Product ─────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sellerId: string;
  imageUrls?: string[];
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrls?: string[];
}
