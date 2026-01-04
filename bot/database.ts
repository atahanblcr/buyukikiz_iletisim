// Supabase veritabanı bağlantısı

import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

export const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Admin kontrolü
export async function isAdmin(telegramId: bigint): Promise<{
  isAdmin: boolean;
  admin?: { id: string; name: string; email: string };
}> {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("id, name, email, telegramId")
      .eq("telegramId", telegramId.toString())
      .eq("isActive", true)
      .single();

    if (error || !data) {
      return { isAdmin: false };
    }

    return {
      isAdmin: true,
      admin: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    };
  } catch (error) {
    console.error("Admin kontrolü hatası:", error);
    return { isAdmin: false };
  }
}

// Admin log kaydı
export async function logAdminAction(
  adminId: string,
  adminName: string,
  actionType: "ADD_PRODUCT" | "DELETE_PRODUCT" | "UPDATE_PRODUCT" | "UPDATE_PRICE" | "UPDATE_STOCK",
  details?: string
) {
  try {
    const { error } = await supabase.from("admin_logs").insert({
      adminId,
      adminName,
      actionType,
      details,
    });

    if (error) {
      console.error("Admin log kayıt hatası:", error);
    }
  } catch (error) {
    console.error("Admin log kayıt hatası:", error);
  }
}

// Kategorileri getir
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Kategori getirme hatası:", error);
    return [];
  }
}

// İlk kategoriyi getir (varsayılan)
export async function getDefaultCategory() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error("Varsayılan kategori getirme hatası:", error);
    return null;
  }
}

// Admin istatistikleri
export async function getAdminStats(adminId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Bugün eklenen ürünler
    const { data: todayProducts, error: todayError } = await supabase
      .from("products")
      .select("id")
      .eq("createdByAdminId", adminId)
      .gte("createdAt", today.toISOString());

    if (todayError) throw todayError;

    // Toplam eklenen ürünler
    const { data: totalProducts, error: totalError } = await supabase
      .from("products")
      .select("id")
      .eq("createdByAdminId", adminId);

    if (totalError) throw totalError;

    return {
      today: todayProducts?.length || 0,
      total: totalProducts?.length || 0,
    };
  } catch (error) {
    console.error("İstatistik getirme hatası:", error);
    return { today: 0, total: 0 };
  }
}

// Ürün listesi (silme için)
export async function getProducts(limit = 20) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, brand, model, price")
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Ürün listesi getirme hatası:", error);
    return [];
  }
}

// Ürün sil
export async function deleteProductById(productId: string) {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Ürün silme hatası:", error);
    return { success: false, error: String(error) };
  }
}

