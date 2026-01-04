// Ürünler API endpoint'i

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Tüm ürünleri getir
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");
    const stockStatus = searchParams.get("stockStatus");

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (stockStatus) {
      where.stockStatus = stockStatus;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Ürünler API hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

// POST: Yeni ürün oluştur (Admin için)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      brand,
      model,
      price,
      discountedPrice,
      stockStatus,
      condition,
      colors,
      storageOptions,
      imageUrls,
      description,
      categoryId,
    } = body;

    // Validasyon
    if (!brand || !model || !price || !categoryId) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        brand,
        model,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        stockStatus: stockStatus || "IN_STOCK",
        condition: condition || "NEW",
        colors: colors || [],
        storageOptions: storageOptions || [],
        imageUrls: imageUrls || [],
        description,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

