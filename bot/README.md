# Telegram Admin Bot

Bu bot, mağaza sahipleri ve çalışanları için ürün yönetimi yapmak üzere tasarlanmıştır. Müşteriler için değildir.

## Özellikler

- ✅ **Güvenli Erişim**: Sadece `admins` tablosunda `telegramId`'si olan kullanıcılar erişebilir
- ✅ **Ürün Ekleme Wizard**: Adım adım ürün ekleme akışı
- ✅ **İstatistikler**: Kişisel ürün ekleme istatistikleri
- ✅ **Ürün Silme**: ID ile ürün silme
- ✅ **Admin Logları**: Tüm işlemler `admin_logs` tablosuna kaydedilir
- ✅ **Bildirimler**: Next.js frontend'den WhatsApp buton tıklamaları için bildirim

## Kurulum

### 1. Ortam Değişkenleri

`.env` dosyanıza şu değişkenleri ekleyin:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

# Bildirim API Güvenliği (opsiyonel)
TELEGRAM_NOTIFY_API_KEY="your-secret-api-key"
```

### 2. Telegram Bot Oluşturma

1. [@BotFather](https://t.me/botfather) ile konuşun
2. `/newbot` komutu ile yeni bot oluşturun
3. Bot token'ını `.env` dosyasına ekleyin

### 3. Admin Ekleme

Supabase'de `admins` tablosuna admin eklerken `telegramId` alanını doldurun:

```sql
UPDATE admins 
SET telegramId = 123456789 
WHERE email = 'admin@example.com';
```

Telegram ID'nizi öğrenmek için [@userinfobot](https://t.me/userinfobot) ile konuşun.

### 4. Bot'u Başlatma

```bash
# Geliştirme modu (otomatik yeniden başlatma)
npm run bot:dev

# Production modu
npm run bot
```

## Komutlar

- `/start` - Bot'u başlat ve hoş geldin mesajı
- `/help` - Yardım menüsü
- `/add` - Yeni ürün ekleme sihirbazını başlat
- `/stats` - Kişisel istatistiklerinizi görüntüle
- `/list` - Son 20 ürünü listele
- `/delete` - Ürün silme menüsünü aç
- `/cancel` - Devam eden işlemi iptal et

## Ürün Ekleme Akışı

1. `/add` komutunu gönderin
2. Marka ve modeli girin (örn: `Apple iPhone 15 Pro`)
3. Fiyatı girin (örn: `25000`)
4. Ürün görselini gönderin
5. `/confirm` ile onaylayın veya `/cancel` ile iptal edin

## Bildirim Sistemi

Next.js frontend'den bildirim göndermek için:

```typescript
// API çağrısı
const response = await fetch('/api/telegram/notify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key', // Opsiyonel
  },
  body: JSON.stringify({
    productId: 'product-uuid',
    productName: 'Apple iPhone 15 Pro',
  }),
});
```

## Güvenlik

- Bot sadece `admins` tablosunda `telegramId`'si olan kullanıcılara yanıt verir
- Yetkisiz kullanıcılar "Access Denied" mesajı alır
- Tüm admin işlemleri `admin_logs` tablosuna kaydedilir
- Bildirim API'si için opsiyonel API key koruması

## Veritabanı Şeması

### Admin Logları

```prisma
model AdminLog {
  id        String      @id @default(uuid())
  adminId   String
  adminName String
  actionType AdminActionType
  details   String?
  createdAt DateTime    @default(now())
}
```

### Admin Tablosu Güncellemesi

```prisma
model Admin {
  telegramId BigInt?  @unique // Yeni alan
  // ... diğer alanlar
}
```

## Sorun Giderme

### Bot yanıt vermiyor
- Bot token'ının doğru olduğundan emin olun
- Admin'in `telegramId`'sinin doğru kaydedildiğini kontrol edin
- Bot'un aktif olduğunu kontrol edin

### Görsel yüklenemiyor
- Cloudinary yapılandırmasını kontrol edin
- Upload preset'in unsigned olduğundan emin olun

### Bildirimler gelmiyor
- `TELEGRAM_BOT_TOKEN`'ın doğru olduğundan emin olun
- Admin'lerin `telegramId`'sinin kayıtlı olduğunu kontrol edin
- API endpoint'in erişilebilir olduğunu kontrol edin

