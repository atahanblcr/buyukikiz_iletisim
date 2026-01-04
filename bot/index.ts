// Telegram Bot - Büyükikiz İletişim Admin Bot

import { Telegraf, Context } from "telegraf";
import { config, validateConfig } from "./config";
import {
  isAdmin,
  logAdminAction,
  getAdminStats,
  getProducts,
  deleteProductById,
} from "./database";
import { handleWizardStep, resetWizardState, getWizardState } from "./wizard";

// Yapılandırma kontrolü
validateConfig();

const bot = new Telegraf(config.telegramBotToken);

// Genel middleware - tüm mesajlarda admin kontrolü
bot.use(async (ctx, next) => {
  const telegramId = BigInt(ctx.from?.id || 0);
  const adminCheck = await isAdmin(telegramId);

  if (!adminCheck.isAdmin) {
    if (ctx.message && "text" in ctx.message) {
      await ctx.reply("❌ Access Denied\n\nBu bot sadece yetkili adminler için kullanılabilir.");
    }
    return;
  }

  // Admin bilgisini context'e ekle
  (ctx as any).admin = adminCheck.admin;
  return next();
});

// Başlangıç komutu
bot.start(async (ctx) => {
  const admin = (ctx as any).admin;
  await ctx.reply(
    `👋 Hoş geldiniz, ${admin.name}!\n\n` +
      `Bu bot ürün yönetimi için kullanılır.\n\n` +
      `📋 Komutlar:\n` +
      `/add - Yeni ürün ekle\n` +
      `/stats - İstatistiklerinizi görüntüle\n` +
      `/delete - Ürün sil\n` +
      `/list - Ürün listesi\n` +
      `/help - Yardım`
  );
});

// Yardım komutu
bot.command("help", async (ctx) => {
  await ctx.reply(
    `📋 Kullanılabilir Komutlar:\n\n` +
      `/add - Yeni ürün ekleme sihirbazını başlat\n` +
      `/stats - Bugün ve toplam eklediğiniz ürün sayısını görüntüle\n` +
      `/delete - Ürün silme menüsünü aç\n` +
      `/list - Son 20 ürünü listele\n` +
      `/cancel - Devam eden işlemi iptal et`
  );
});

// Ürün ekleme komutu
bot.command("add", async (ctx) => {
  const admin = (ctx as any).admin;
  resetWizardState(ctx.from!.id);
  const state = getWizardState(ctx.from!.id);
  state.step = "brand";

  await ctx.reply(
    "📱 Ürün Ekleme Sihirbazı\n\n" +
      "Adım 1/4: Marka ve Model\n" +
      "Lütfen marka ve modeli şu formatta girin:\n" +
      "<code>Marka Model</code>\n\n" +
      "Örnek: <code>Apple iPhone 15 Pro</code>",
    { parse_mode: "HTML" }
  );
});

// İstatistikler komutu
bot.command("stats", async (ctx) => {
  const admin = (ctx as any).admin;
  const stats = await getAdminStats(admin.id);

  await ctx.reply(
    `📊 İstatistikleriniz\n\n` +
      `Bugün eklenen: ${stats.today} ürün\n` +
      `Toplam eklenen: ${stats.total} ürün`
  );
});

// Ürün listesi komutu
bot.command("list", async (ctx) => {
  const products = await getProducts(20);

  if (products.length === 0) {
    await ctx.reply("Henüz ürün bulunmamaktadır.");
    return;
  }

  let message = "📋 Son 20 Ürün:\n\n";
  products.forEach((product, index) => {
    message += `${index + 1}. ${product.brand} ${product.model}\n`;
    message += `   💰 ${product.price.toLocaleString("tr-TR")} ₺\n`;
    message += `   🆔 <code>${product.id}</code>\n\n`;
  });

  await ctx.reply(message, { parse_mode: "HTML" });
});

// Ürün silme komutu
bot.command("delete", async (ctx) => {
  await ctx.reply(
    "🗑️ Ürün Silme\n\n" +
      "Silmek istediğiniz ürünün ID'sini girin:\n" +
      "Örnek: <code>123e4567-e89b-12d3-a456-426614174000</code>\n\n" +
      "İptal etmek için <code>/cancel</code> yazın.",
    { parse_mode: "HTML" }
  );
});

// İptal komutu
bot.command("cancel", async (ctx) => {
  resetWizardState(ctx.from!.id);
  await ctx.reply("✅ İşlem iptal edildi.");
});

// Onay komutu (wizard için)
bot.command("confirm", async (ctx) => {
  const admin = (ctx as any).admin;
  const state = getWizardState(ctx.from!.id);

  if (state.step !== "confirm") {
    await ctx.reply("Onaylanacak bir işlem bulunmuyor.");
    return;
  }

  // Wizard'ın onay adımını işle
  const text = "/confirm";
  (ctx.message as any).text = text;
  await handleWizardStep(ctx, admin.id, admin.name);
});

// Mesaj işleme (wizard akışı için)
bot.on("message", async (ctx) => {
  const admin = (ctx as any).admin;
  const state = getWizardState(ctx.from!.id);

  // Wizard akışında mıyız?
  if (state.step !== "idle") {
    await handleWizardStep(ctx, admin.id, admin.name);
    return;
  }

  // Ürün silme akışı
  const text = (ctx.message as any)?.text;
  if (text && text.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    // UUID formatında bir ID girilmiş
    const productId = text.trim();

    // Ürünü sil
    const result = await deleteProductById(productId);
    if (result.success) {
      await logAdminAction(
        admin.id,
        admin.name,
        "DELETE_PRODUCT",
        `Deleted product ${productId}`
      );
      await ctx.reply(`✅ Ürün başarıyla silindi!\n\nID: <code>${productId}</code>`, {
        parse_mode: "HTML",
      });
    } else {
      await ctx.reply(`❌ Ürün silinemedi: ${result.error || "Bilinmeyen hata"}`);
    }
    return;
  }
});

// Hata yakalama
bot.catch((err, ctx) => {
  console.error("Bot hatası:", err);
  ctx.reply("❌ Bir hata oluştu. Lütfen tekrar deneyin.");
});

// Bot'u başlat
console.log("🤖 Telegram bot başlatılıyor...");
bot.launch().then(() => {
  console.log("✅ Telegram bot başarıyla başlatıldı!");
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// Bildirim gönderme fonksiyonu (Next.js'ten çağrılacak)
export async function sendNotificationToAdmins(message: string) {
  try {
    // Tüm aktif adminleri al
    const { data: admins, error } = await supabase
      .from("admins")
      .select("telegramId")
      .eq("isActive", true)
      .not("telegramId", "is", null);

    if (error || !admins) {
      console.error("Admin listesi alınamadı:", error);
      return { success: false, error: "Admin listesi alınamadı" };
    }

    // Her admin'e bildirim gönder
    const results = await Promise.allSettled(
      admins.map(async (admin) => {
        if (admin.telegramId) {
          await bot.telegram.sendMessage(Number(admin.telegramId), message);
        }
      })
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    const succeeded = results.length - failed;

    return {
      success: true,
      sent: succeeded,
      failed: failed,
    };
  } catch (error) {
    console.error("Bildirim gönderme hatası:", error);
    return { success: false, error: String(error) };
  }
}

