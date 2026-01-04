# Güvenlik Kurulum Kılavuzu

## 🔐 Admin Authentication Sistemi

Admin paneli artık güvenli bir şekilde korunmaktadır. Tüm `/admin` route'ları otomatik olarak korunur.

### Kurulum

1. **JWT Secret Oluşturun**

`.env` dosyanıza ekleyin:
```env
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
```

**Önemli:** Production'da en az 32 karakterlik güçlü bir secret kullanın!

2. **Admin Şifresi Hash'leme**

Yeni admin eklerken şifreyi hash'lemeyi unutmayın:

```typescript
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash("plain-password", 10);
```

Veya Prisma Studio'da manuel ekleme yapıyorsanız, şifreyi önce hash'leyin.

### Kullanım

1. **Giriş Yapma**
   - `/login` sayfasına gidin
   - E-posta ve şifrenizi girin
   - Başarılı girişte `/admin` sayfasına yönlendirilirsiniz

2. **Çıkış Yapma**
   - Admin panelinde sağ üstteki "Çıkış" butonuna tıklayın
   - Veya `/api/auth/logout` endpoint'ini çağırın

3. **Session Yönetimi**
   - Session'lar 7 gün geçerlidir
   - HttpOnly cookie kullanılır (XSS koruması)
   - Production'da secure flag aktif olur (HTTPS gerekli)

## 🛡️ Middleware Koruması

`middleware.ts` dosyası tüm `/admin` route'larını otomatik olarak korur:

- Giriş yapmamış kullanıcılar `/login` sayfasına yönlendirilir
- Giriş yapmış kullanıcılar `/login` sayfasına giderse `/admin`'e yönlendirilir

## 📱 WhatsApp Butonu

Product Card bileşeninde WhatsApp butonu eklendi:

1. **Ortam Değişkeni**
   ```env
   NEXT_PUBLIC_WHATSAPP_NUMBER="905551234567"
   ```
   (90 ülke kodu + telefon numarası, başında + olmadan)

2. **Fonksiyonellik**
   - Butona tıklandığında analitik kaydı yapılır
   - Telegram bot'a bildirim gönderilir
   - WhatsApp web/uygulaması açılır

## 🔧 Ortam Değişkenleri

Tüm gerekli ortam değişkenleri için `.env.example` dosyasına bakın.

**Önemli Ortam Değişkenleri:**
- `JWT_SECRET` - Session şifreleme için (ZORUNLU)
- `DATABASE_URL` - Supabase bağlantısı (ZORUNLU)
- `TELEGRAM_BOT_TOKEN` - Bot token'ı (ZORUNLU)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp numarası (OPSIYONEL)

## ✅ Test Etme

1. **Güvenlik Testi:**
   ```bash
   # Tarayıcıda /admin sayfasına git
   # Otomatik olarak /login'e yönlendirilmeli
   ```

2. **Giriş Testi:**
   ```bash
   # /login sayfasında geçerli admin bilgileriyle giriş yap
   # /admin sayfasına yönlendirilmeli
   ```

3. **WhatsApp Butonu Testi:**
   ```bash
   # /store veya /store/products sayfasında bir ürün kartına bak
   # "WhatsApp ile Al" butonuna tıkla
   # WhatsApp açılmalı ve Telegram bot'a bildirim gitmeli
   ```

## 🚨 Güvenlik Notları

1. **JWT Secret:** Asla Git'e commit etmeyin!
2. **Session Cookie:** HttpOnly ve Secure flag'ler aktif
3. **Password Hashing:** Bcrypt ile hash'lenmiş şifreler kullanın
4. **Middleware:** Tüm admin route'ları otomatik korunur
5. **API Keys:** Production'da güçlü API key'ler kullanın

## 📝 Admin Oluşturma

Yeni admin oluşturmak için:

```typescript
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const hashedPassword = await bcrypt.hash("your-password", 10);

await prisma.admin.create({
  data: {
    email: "admin@example.com",
    password: hashedPassword,
    name: "Admin Name",
    isActive: true,
  },
});
```

Veya Prisma Studio kullanarak manuel ekleyebilirsiniz (şifreyi önce hash'leyin).

