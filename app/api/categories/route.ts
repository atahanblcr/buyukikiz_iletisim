// Kategoriler API endpoint'i

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Tüm kategorileri getir
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Kategoriler API hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

// POST: Yeni kategori oluştur (Admin için)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    // Validasyon
    if (!name || !slug) {
      return NextResponse.json(
        { error: "İsim ve slug gerekli" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kategori zaten mevcut" },
        { status: 409 }
      );
    }
    console.error("Kategori oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

