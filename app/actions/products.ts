"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, StockStatus, Condition } from "@prisma/client";

export interface CreateProductInput {
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
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

// Tüm ürünleri getir
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Ürünleri getirme hatası:", error);
    return { success: false, error: "Ürünler getirilemedi" };
  }
}

// Tek ürün getir
export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return { success: true, data: product };
  } catch (error) {
    console.error("Ürün getirme hatası:", error);
    return { success: false, error: "Ürün getirilemedi" };
  }
}

// Yeni ürün oluştur
export async function createProduct(input: CreateProductInput) {
  try {
    // Validasyon
    if (!input.brand || !input.model || !input.price || !input.categoryId) {
      return {
        success: false,
        error: "Marka, model, fiyat ve kategori alanları zorunludur",
      };
    }

    if (input.imageUrls.length === 0) {
      return {
        success: false,
        error: "En az bir görsel eklenmelidir",
      };
    }

    const product = await prisma.product.create({
      data: {
        brand: input.brand,
        model: input.model,
        price: input.price,
        discountedPrice: input.discountedPrice || null,
        stockStatus: input.stockStatus || "IN_STOCK",
        condition: input.condition || "NEW",
        colors: input.colors || [],
        storageOptions: input.storageOptions || [],
        imageUrls: input.imageUrls,
        description: input.description || null,
        categoryId: input.categoryId,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/admin/products");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Ürün oluşturma hatası:", error);
    return {
      success: false,
      error: error.message || "Ürün oluşturulamadı",
    };
  }
}

// Ürün güncelle
export async function updateProduct(input: UpdateProductInput) {
  try {
    const { id, ...updateData } = input;

    if (!id) {
      return { success: false, error: "Ürün ID gerekli" };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    revalidatePath("/admin/products");
    return { success: true, data: product };
  } catch (error: any) {
    console.error("Ürün güncelleme hatası:", error);
    return {
      success: false,
      error: error.message || "Ürün güncellenemedi",
    };
  }
}

// Ürün sil
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Ürün silme hatası:", error);
    return {
      success: false,
      error: error.message || "Ürün silinemedi",
    };
  }
}

