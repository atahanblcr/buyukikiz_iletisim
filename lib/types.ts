// TypeScript tip tanımlamaları

import { Product, Category, Admin, Analytics, StockStatus, Condition, AnalyticsType } from "@prisma/client";

// Ürün tipi (ilişkilerle birlikte)
export type ProductWithCategory = Product & {
  category: Category;
};

// Kategori tipi (ilişkilerle birlikte)
export type CategoryWithProducts = Category & {
  products: Product[];
};

// Analitik tipi (ilişkilerle birlikte)
export type AnalyticsWithProduct = Analytics & {
  product: Product | null;
};

// Ürün oluşturma/güncelleme için tip
export type ProductInput = {
  brand: string;
  model: string;
  price: number;
  discountedPrice?: number;
  stockStatus: StockStatus;
  condition: Condition;
  colors: string[];
  storageOptions: string[];
  imageUrls: string[];
  description?: string;
  categoryId: string;
};

// Kategori oluşturma/güncelleme için tip
export type CategoryInput = {
  name: string;
  slug: string;
  description?: string;
};

// Admin oluşturma için tip
export type AdminInput = {
  email: string;
  password: string;
  name: string;
  role?: string;
};

// Analitik olay oluşturma için tip
export type AnalyticsInput = {
  productId?: string;
  eventType: AnalyticsType;
  source: "web" | "telegram";
  metadata?: Record<string, any>;
};

