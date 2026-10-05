// ─── Model: Product ─────────────────────────────────────────────────────────

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
