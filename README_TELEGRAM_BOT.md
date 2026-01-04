# Telegram Admin Bot - Hızlı Başlangıç

## 🚀 Kurulum Adımları

### 1. Telegram Bot Oluşturma

1. Telegram'da [@BotFather](https://t.me/botfather) ile konuşun
2. `/newbot` komutunu gönderin
3. Bot adını ve kullanıcı adını belirleyin
4. Bot token'ını kopyalayın

### 2. Ortam Değişkenlerini Ayarlayın

`.env` dosyanıza ekleyin:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"

# Supabase (zaten var olmalı)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Cloudinary (zaten var olmalı)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

# Bildirim API Güvenliği (opsiyonel ama önerilir)
TELEGRAM_NOTIFY_API_KEY="your-secret-key-here"
```

### 3. Veritabanını Güncelleyin

```bash
# Prisma şemasını veritabanına uygula
npm run db:push
```

### 4. Admin Telegram ID'sini Ekleyin

**Telegram ID'nizi öğrenmek için:**
1. [@userinfobot](https://t.me/userinfobot) ile konuşun
2. Size verilen ID'yi kopyalayın

**Supabase'de admin'e Telegram ID eklemek için:**

```sql
-- Supabase SQL Editor'da çalıştırın
UPDATE admins 
SET "telegramId" = 123456789  -- Kendi Telegram ID'nizi yazın
WHERE email = 'admin@example.com';
```

Veya Prisma Studio ile:
```bash
npm run db:studio
```

### 5. Bot'u Başlatın

```bash
# Geliştirme modu (otomatik yeniden başlatma)
npm run bot:dev

# Production modu
npm run bot
```

## 📱 Kullanım

### Bot'u Başlatma

Telegram'da botunuzu bulun ve `/start` gönderin.

### Komutlar

- `/add` - Yeni ürün ekle (adım adım sihirbaz)
- `/stats` - Bugün ve toplam eklediğiniz ürün sayısı
- `/list` - Son 20 ürünü listele
- `/delete` - Ürün sil (ID ile)
- `/help` - Yardım menüsü
- `/cancel` - Devam eden işlemi iptal et

### Ürün Ekleme Örneği

1. `/add` gönderin
2. `Apple iPhone 15 Pro` yazın (Marka Model)
3. `25000` yazın (Fiyat)
4. Ürün fotoğrafını gönderin
5. `/confirm` ile onaylayın

## 🔔 Bildirim Sistemi

Müşteri web sitesinde "WhatsApp ile Satın Al" butonuna tıkladığında, tüm adminlere otomatik bildirim gönderilir.

Bildirim mesajı:
```
🔔 Müşteri İlgisi!

Ürün: Apple iPhone 15 Pro
Ürün ID: 123e4567-e89b-12d3-a456-426614174000

Müşteri WhatsApp üzerinden satın almak istiyor.
```

## 🔒 Güvenlik

- ✅ Sadece `admins` tablosunda `telegramId`'si olan kullanıcılar erişebilir
- ✅ Yetkisiz kullanıcılar "Access Denied" mesajı alır
- ✅ Tüm işlemler `admin_logs` tablosuna kaydedilir
- ✅ Bildirim API'si için opsiyonel API key koruması

## 📊 Admin Logları

Tüm admin işlemleri `admin_logs` tablosuna kaydedilir:

- `ADD_PRODUCT` - Ürün eklendi
- `DELETE_PRODUCT` - Ürün silindi
- `UPDATE_PRODUCT` - Ürün güncellendi
- `UPDATE_PRICE` - Fiyat güncellendi
- `UPDATE_STOCK` - Stok güncellendi

## 🐛 Sorun Giderme

### Bot yanıt vermiyor
- ✅ Bot token'ının doğru olduğundan emin olun
- ✅ Admin'in `telegramId`'sinin doğru kaydedildiğini kontrol edin
- ✅ Bot'un çalıştığını kontrol edin (`npm run bot:dev`)

### "Access Denied" mesajı alıyorum
- ✅ Telegram ID'nizin `admins` tablosunda kayıtlı olduğunu kontrol edin
- ✅ `isActive` alanının `true` olduğundan emin olun

### Görsel yüklenemiyor
- ✅ Cloudinary yapılandırmasını kontrol edin
- ✅ Upload preset'in unsigned olduğundan emin olun
- ✅ Cloudinary API anahtarlarının doğru olduğunu kontrol edin

### Bildirimler gelmiyor
- ✅ `TELEGRAM_BOT_TOKEN`'ın doğru olduğundan emin olun
- ✅ Admin'lerin `telegramId`'sinin kayıtlı olduğunu kontrol edin
- ✅ API endpoint'in erişilebilir olduğunu kontrol edin
- ✅ Next.js uygulamasının çalıştığını kontrol edin

## 📝 Notlar

- Bot sadece adminler için tasarlanmıştır, müşteriler için değildir
- Ürün eklerken varsayılan kategori kullanılır (ilk kategori)
- Görseller otomatik olarak Cloudinary'ye yüklenir
- Tüm işlemler audit trail için loglanır

