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

// Slug oluşturma yardımcı fonksiyonu
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Özel karakterleri kaldır
    .replace(/[\s_-]+/g, "-") // Boşlukları ve alt çizgileri tire ile değiştir
    .replace(/^-+|-+$/g, ""); // Başta ve sonda tire varsa kaldır
}

// POST: Yeni kategori oluştur (Admin için)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    // Validasyon
    if (!name) {
      return NextResponse.json(
        { error: "Kategori adı gerekli" },
        { status: 400 }
      );
    }

    // Slug otomatik oluştur (eğer verilmemişse)
    const categorySlug = slug || generateSlug(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        description: description || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kategori adı veya slug zaten mevcut" },
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

