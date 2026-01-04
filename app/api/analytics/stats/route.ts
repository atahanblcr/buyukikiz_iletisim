// Analitik istatistikleri API endpoint'i

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Toplam tıklamalar
    const totalClicks = await prisma.analytics.count({
      where: {
        ...where,
        eventType: "PRODUCT_CLICK",
      },
    });

    // WhatsApp buton tıklamaları
    const whatsappClicks = await prisma.analytics.count({
      where: {
        ...where,
        eventType: "WHATSAPP_BUTTON",
      },
    });

    // Kaynak bazlı istatistikler
    const webClicks = await prisma.analytics.count({
      where: {
        ...where,
        source: "web",
      },
    });

    const telegramClicks = await prisma.analytics.count({
      where: {
        ...where,
        source: "telegram",
      },
    });

    // En çok tıklanan ürünler
    const topProducts = await prisma.analytics.groupBy({
      by: ["productId"],
      where: {
        ...where,
        eventType: "PRODUCT_CLICK",
        productId: {
          not: null,
        },
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: "desc",
        },
      },
      take: 10,
    });

    // Ürün detaylarını al
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        if (!item.productId) return null;
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            brand: true,
            model: true,
          },
        });
        return {
          product,
          clickCount: item._count.productId,
        };
      })
    );

    return NextResponse.json({
      totalClicks,
      whatsappClicks,
      webClicks,
      telegramClicks,
      topProducts: topProductsWithDetails.filter((item) => item !== null),
    });
  } catch (error) {
    console.error("Analitik istatistik hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

