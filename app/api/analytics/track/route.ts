// Analitik takip API endpoint'i

import { NextRequest, NextResponse } from "next/server";
import {
  trackProductClick,
  trackWhatsAppButtonClick,
  trackPageView,
  trackSearch,
} from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, productId, source, metadata } = body;

    // Kaynak doğrulama
    const validSource = source === "telegram" ? "telegram" : "web";

    switch (eventType) {
      case "PRODUCT_CLICK":
        if (!productId) {
          return NextResponse.json(
            { error: "productId gerekli" },
            { status: 400 }
          );
        }
        await trackProductClick(productId, validSource, metadata);
        break;

      case "WHATSAPP_BUTTON":
        await trackWhatsAppButtonClick(
          productId || null,
          validSource,
          metadata
        );
        break;

      case "PAGE_VIEW":
        await trackPageView(validSource, metadata);
        break;

      case "SEARCH":
        if (!metadata?.query) {
          return NextResponse.json(
            { error: "Arama sorgusu gerekli" },
            { status: 400 }
          );
        }
        await trackSearch(metadata.query, validSource, metadata);
        break;

      default:
        return NextResponse.json(
          { error: "Geçersiz event tipi" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analitik API hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

