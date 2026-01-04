// Analitik takip fonksiyonları

import { prisma } from "./prisma";
import { AnalyticsType } from "@prisma/client";

/**
 * Ürün tıklamasını kaydet
 */
export async function trackProductClick(
  productId: string,
  source: "web" | "telegram" = "web",
  metadata?: Record<string, any>
) {
  try {
    await prisma.analytics.create({
      data: {
        productId,
        eventType: "PRODUCT_CLICK",
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error("Analitik kayıt hatası:", error);
  }
}

/**
 * WhatsApp buton tıklamasını kaydet ve Telegram bildirimi gönder
 */
export async function trackWhatsAppButtonClick(
  productId: string | null,
  source: "web" | "telegram" = "web",
  metadata?: Record<string, any>
) {
  try {
    await prisma.analytics.create({
      data: {
        productId: productId || null,
        eventType: "WHATSAPP_BUTTON",
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Eğer ürün ID'si varsa, Telegram bildirimi gönder
    if (productId) {
      try {
        // Ürün bilgilerini al
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { brand: true, model: true },
        });

        if (product) {
          const productName = `${product.brand} ${product.model}`;
          
          // Telegram bildirim API'sini çağır
          const apiKey = process.env.TELEGRAM_NOTIFY_API_KEY || "";
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                         "http://localhost:3000";
          
          const response = await fetch(
            `${baseUrl}/api/telegram/notify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(apiKey && { "x-api-key": apiKey }),
              },
              body: JSON.stringify({
                productId,
                productName,
              }),
            }
          );

          if (!response.ok) {
            console.error("Telegram bildirimi gönderilemedi:", await response.text());
          }
        }
      } catch (notifyError) {
        // Bildirim hatası analitik kaydını etkilemesin
        console.error("Bildirim gönderme hatası:", notifyError);
      }
    }
  } catch (error) {
    console.error("Analitik kayıt hatası:", error);
  }
}

/**
 * Sayfa görüntülemeyi kaydet
 */
export async function trackPageView(
  source: "web" | "telegram" = "web",
  metadata?: Record<string, any>
) {
  try {
    await prisma.analytics.create({
      data: {
        eventType: "PAGE_VIEW",
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error("Analitik kayıt hatası:", error);
  }
}

/**
 * Arama olayını kaydet
 */
export async function trackSearch(
  searchQuery: string,
  source: "web" | "telegram" = "web",
  metadata?: Record<string, any>
) {
  try {
    await prisma.analytics.create({
      data: {
        eventType: "SEARCH",
        source,
        metadata: JSON.stringify({
          query: searchQuery,
          ...metadata,
        }),
      },
    });
  } catch (error) {
    console.error("Analitik kayıt hatası:", error);
  }
}

