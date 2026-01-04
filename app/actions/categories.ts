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

