// Güvenlik middleware'i

import { Context } from "telegraf";
import { isAdmin } from "./database";

// Admin kontrolü middleware'i
export async function requireAdmin(ctx: Context, next: () => Promise<void>) {
  const telegramId = BigInt(ctx.from?.id || 0);
  const adminCheck = await isAdmin(telegramId);

  if (!adminCheck.isAdmin) {
    await ctx.reply("❌ Access Denied\n\nBu bot sadece yetkili adminler için kullanılabilir.");
    return;
  }

  // Admin bilgisini context'e ekle
  (ctx as any).admin = adminCheck.admin;
  return next();
}

