// Authentication yardımcı fonksiyonları

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  adminId: string;
  email: string;
  name: string;
}

// Session oluştur
export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// Session'ı doğrula
export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;

  if (!cookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Session'ı sil (logout)
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Admin giriş doğrulama
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; admin?: SessionPayload; error?: string }> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin || !admin.isActive) {
      return { success: false, error: "Geçersiz e-posta veya şifre" };
    }

    // Şifre kontrolü
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return { success: false, error: "Geçersiz e-posta veya şifre" };
    }

    return {
      success: true,
      admin: {
        adminId: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  } catch (error) {
    console.error("Giriş hatası:", error);
    return { success: false, error: "Bir hata oluştu" };
  }
}

