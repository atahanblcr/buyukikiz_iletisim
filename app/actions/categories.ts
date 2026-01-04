"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Tüm kategorileri getir
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Kategorileri getirme hatası:", error);
    return { success: false, error: "Kategoriler getirilemedi" };
  }
}

// Kategorileri ürün sayılarıyla birlikte getir
export async function getCategoriesWithCounts() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Kategorileri getirme hatası:", error);
    return { success: false, error: "Kategoriler getirilemedi" };
  }
}

// Kategori sil
export async function deleteCategory(id: string) {
  try {
    // Kategoriye bağlı ürün var mı kontrol et
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Kategori bulunamadı" };
    }

    if (category._count.products > 0) {
      return {
        success: false,
        error: `Bu kategoriye bağlı ${category._count.products} ürün bulunmaktadır. Önce ürünleri silin veya başka bir kategoriye taşıyın.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Kategori silme hatası:", error);
    return {
      success: false,
      error: error.message || "Kategori silinemedi",
    };
  }
}

