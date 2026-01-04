// Ürün ekleme wizard akışı

import { Context } from "telegraf";
import { supabase, getDefaultCategory, logAdminAction } from "./database";
import { uploadImageToCloudinary } from "./cloudinary";

interface ProductWizardState {
  brand?: string;
  model?: string;
  price?: number;
  imageUrl?: string;
  step: "brand" | "model" | "price" | "photo" | "confirm" | "idle";
}

const wizardStates = new Map<number, ProductWizardState>();

export function getWizardState(userId: number): ProductWizardState {
  if (!wizardStates.has(userId)) {
    wizardStates.set(userId, { step: "idle" });
  }
  return wizardStates.get(userId)!;
}

export function resetWizardState(userId: number) {
  wizardStates.delete(userId);
}

export async function handleWizardStep(
  ctx: Context,
  adminId: string,
  adminName: string
) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const state = getWizardState(userId);

  // Marka/Model adımı
  if (state.step === "brand" || state.step === "idle") {
    if (state.step === "idle") {
      state.step = "brand";
      await ctx.reply(
        "📱 Ürün Ekleme Sihirbazı\n\n" +
          "Adım 1/4: Marka ve Model\n" +
          "Lütfen marka ve modeli şu formatta girin:\n" +
          "<code>Marka Model</code>\n\n" +
          "Örnek: <code>Apple iPhone 15 Pro</code>",
        { parse_mode: "HTML" }
      );
      return;
    }

    const text = (ctx.message as any)?.text;
    if (!text) {
      await ctx.reply("Lütfen geçerli bir marka ve model girin.");
      return;
    }

    const parts = text.trim().split(/\s+/);
    if (parts.length < 2) {
      await ctx.reply("Lütfen hem marka hem de model girin.\nÖrnek: Apple iPhone 15 Pro");
      return;
    }

    state.brand = parts[0];
    state.model = parts.slice(1).join(" ");
    state.step = "price";

    await ctx.reply(
      `✅ Marka: ${state.brand}\n✅ Model: ${state.model}\n\n` +
        "Adım 2/4: Fiyat\n" +
        "Lütfen ürün fiyatını TL cinsinden girin:\n" +
        "Örnek: <code>25000</code>",
      { parse_mode: "HTML" }
    );
    return;
  }

  // Fiyat adımı
  if (state.step === "price") {
    const text = (ctx.message as any)?.text;
    if (!text) {
      await ctx.reply("Lütfen geçerli bir fiyat girin.");
      return;
    }

    const price = parseFloat(text.replace(/[^\d.,]/g, "").replace(",", "."));
    if (isNaN(price) || price <= 0) {
      await ctx.reply("Lütfen geçerli bir fiyat girin (örn: 25000)");
      return;
    }

    state.price = price;
    state.step = "photo";

    await ctx.reply(
      `✅ Fiyat: ${price.toLocaleString("tr-TR")} ₺\n\n` +
        "Adım 3/4: Görsel\n" +
        "Lütfen ürün görselini gönderin (fotoğraf olarak):"
    );
    return;
  }

  // Görsel adımı
  if (state.step === "photo") {
    const photo = (ctx.message as any)?.photo;
    const document = (ctx.message as any)?.document;
    
    let fileId: string | null = null;
    let filePath: string | null = null;

    // Fotoğraf kontrolü
    if (photo && photo.length > 0) {
      // En büyük boyuttaki görseli al
      const largestPhoto = photo[photo.length - 1];
      fileId = largestPhoto.file_id;
    } 
    // Doküman kontrolü (görsel dosyası olabilir)
    else if (document && document.mime_type?.startsWith("image/")) {
      fileId = document.file_id;
    } 
    else {
      await ctx.reply("Lütfen bir fotoğraf gönderin (fotoğraf veya görsel dosyası).");
      return;
    }

    if (!fileId) {
      await ctx.reply("❌ Görsel dosyası alınamadı. Lütfen tekrar deneyin.");
      return;
    }

    try {
      // Telegram'dan dosya bilgisini al
      const file = await ctx.telegram.getFile(fileId);
      filePath = file.file_path;

      if (!filePath) {
        throw new Error("Dosya yolu alınamadı");
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        throw new Error("TELEGRAM_BOT_TOKEN bulunamadı");
      }

      const imageUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

      await ctx.reply("⏳ Görsel Cloudinary'ye yükleniyor...");

      const cloudinaryUrl = await uploadImageToCloudinary(imageUrl);
      if (!cloudinaryUrl) {
        await ctx.reply("❌ Görsel yüklenemedi. Lütfen tekrar deneyin.");
        return;
      }

    state.imageUrl = cloudinaryUrl;
    state.step = "confirm";

    await ctx.replyWithPhoto(cloudinaryUrl, {
      caption:
        `✅ Görsel yüklendi!\n\n` +
        `📋 Özet:\n` +
        `Marka: ${state.brand}\n` +
        `Model: ${state.model}\n` +
        `Fiyat: ${state.price?.toLocaleString("tr-TR")} ₺\n\n` +
        `Adım 4/4: Onay\n` +
        `Ürünü kaydetmek için <code>/confirm</code> yazın.\n` +
        `İptal etmek için <code>/cancel</code> yazın.`,
      parse_mode: "HTML",
    });
    return;
  }

  // Onay adımı
  if (state.step === "confirm") {
    const text = (ctx.message as any)?.text;
    if (text?.toLowerCase() === "/confirm" || text?.toLowerCase() === "onayla") {
      // Varsayılan kategoriyi al
      const defaultCategoryId = await getDefaultCategory();
      if (!defaultCategoryId) {
        await ctx.reply(
          "❌ Hata: Veritabanında kategori bulunamadı. Lütfen önce bir kategori ekleyin."
        );
        resetWizardState(userId);
        return;
      }

      // Ürünü kaydet
      const { data, error } = await supabase.from("products").insert({
        brand: state.brand,
        model: state.model,
        price: state.price,
        stockStatus: "IN_STOCK",
        condition: "NEW",
        colors: [],
        storageOptions: [],
        imageUrls: state.imageUrl ? [state.imageUrl] : [],
        categoryId: defaultCategoryId,
        createdByAdminId: adminId,
      }).select().single();

      if (error || !data) {
        await ctx.reply(`❌ Ürün kaydedilemedi: ${error?.message || "Bilinmeyen hata"}`);
        resetWizardState(userId);
        return;
      }

      // Admin log kaydı
      await logAdminAction(
        adminId,
        adminName,
        "ADD_PRODUCT",
        `Added ${state.brand} ${state.model}`
      );

      await ctx.reply(
        `✅ Ürün başarıyla eklendi!\n\n` +
          `ID: <code>${data.id}</code>\n` +
          `Marka: ${state.brand}\n` +
          `Model: ${state.model}\n` +
          `Fiyat: ${state.price?.toLocaleString("tr-TR")} ₺`,
        { parse_mode: "HTML" }
      );

      resetWizardState(userId);
      return;
    }

    if (text?.toLowerCase() === "/cancel" || text?.toLowerCase() === "iptal") {
      resetWizardState(userId);
      await ctx.reply("❌ İşlem iptal edildi.");
      return;
    }

    await ctx.reply(
      "Ürünü kaydetmek için <code>/confirm</code> yazın.\n" +
        "İptal etmek için <code>/cancel</code> yazın.",
      { parse_mode: "HTML" }
    );
  }
}

