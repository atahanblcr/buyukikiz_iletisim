// Telegram bildirim API endpoint'i
// Next.js frontend'den çağrılacak

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || "";

export async function POST(request: NextRequest) {
  try {
    // API key kontrolü (güvenlik için)
    const apiKey = request.headers.get("x-api-key");
    const expectedApiKey = process.env.TELEGRAM_NOTIFY_API_KEY;

    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, productName } = body;

    if (!productId || !productName) {
      return NextResponse.json(
        { error: "productId ve productName gerekli" },
        { status: 400 }
      );
    }

    // Tüm aktif adminleri al
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: admins, error } = await supabase
      .from("admins")
      .select("telegramId")
      .eq("isActive", true)
      .not("telegramId", "is", null);

    if (error || !admins) {
      console.error("Admin listesi alınamadı:", error);
      return NextResponse.json(
        { error: "Admin listesi alınamadı" },
        { status: 500 }
      );
    }

    // Bildirim mesajı
    const message = `🔔 Müşteri İlgisi!\n\n` +
      `Ürün: ${productName}\n` +
      `Ürün ID: ${productId}\n\n` +
      `Müşteri WhatsApp üzerinden satın almak istiyor.`;

    // Her admin'e bildirim gönder
    const results = await Promise.allSettled(
      admins.map(async (admin) => {
        if (admin.telegramId) {
          const response = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chat_id: Number(admin.telegramId),
                text: message,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Telegram API hatası: ${response.statusText}`);
          }

          return await response.json();
        }
      })
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      sent: succeeded,
      failed: failed,
      total: admins.length,
    });
  } catch (error) {
    console.error("Bildirim gönderme hatası:", error);
    return NextResponse.json(
      { error: "Bildirim gönderilemedi", details: String(error) },
      { status: 500 }
    );
  }
}

