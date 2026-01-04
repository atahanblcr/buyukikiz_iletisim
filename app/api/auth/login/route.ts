// Admin giriş API endpoint'i

import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-posta ve şifre gerekli" },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(email, password);

    if (!result.success || !result.admin) {
      return NextResponse.json(
        { success: false, error: result.error || "Giriş başarısız" },
        { status: 401 }
      );
    }

    // Session oluştur
    await createSession(result.admin);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Giriş API hatası:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

