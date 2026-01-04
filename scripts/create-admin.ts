// İlk Admin Kullanıcısı Oluşturma Script'i
// Kullanım: npm run create-admin veya tsx scripts/create-admin.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "admin@buyukikiz.com";
    const password = "admin123";
    const name = "Admin";

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Admin kullanıcısını oluştur
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "admin",
        isActive: true,
      },
    });

    console.log("✅ Admin kullanıcısı başarıyla oluşturuldu!");
    console.log("\n📋 Bilgiler:");
    console.log(`   E-posta: ${admin.email}`);
    console.log(`   Ad: ${admin.name}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   Rol: ${admin.role}`);
    console.log("\n🔐 Giriş Bilgileri:");
    console.log(`   E-posta: ${email}`);
    console.log(`   Şifre: ${password}`);
    console.log("\n⚠️  Önemli: İlk girişten sonra şifrenizi değiştirmeniz önerilir!");
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("❌ Hata: Bu e-posta adresi zaten kullanılıyor!");
      console.log("   Mevcut admin kullanıcısını kullanabilir veya farklı bir e-posta deneyebilirsiniz.");
    } else {
      console.error("❌ Hata:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
createAdmin();

