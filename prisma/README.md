# Prisma Veritabanı Şeması

Bu klasör Prisma ORM şema dosyasını içerir.

## Veritabanı Tabloları

### Categories (Kategoriler)
- `id`: UUID (Primary Key)
- `name`: Kategori adı (Unique)
- `slug`: URL slug (Unique)
- `description`: Kategori açıklaması
- `createdAt`: Oluşturulma tarihi
- `updatedAt`: Güncellenme tarihi

### Products (Ürünler)
- `id`: UUID (Primary Key)
- `brand`: Marka (Apple, Samsung, vb.)
- `model`: Model adı
- `price`: Fiyat
- `discountedPrice`: İndirimli fiyat (opsiyonel)
- `stockStatus`: Stok durumu (IN_STOCK, OUT_STOCK)
- `condition`: Durum (NEW, USED, OUTLET)
- `colors`: Renkler dizisi (String[])
- `storageOptions`: Depolama seçenekleri dizisi (String[])
- `imageUrls`: Cloudinary görsel URL'leri dizisi (String[])
- `description`: Ürün açıklaması
- `categoryId`: Kategori ID (Foreign Key)
- `createdAt`: Oluşturulma tarihi
- `updatedAt`: Güncellenme tarihi

### Admins (Adminler)
- `id`: UUID (Primary Key)
- `email`: E-posta adresi (Unique)
- `password`: Hash'lenmiş şifre
- `name`: Admin adı
- `role`: Rol (admin, super_admin, vb.)
- `isActive`: Aktif mi?
- `createdAt`: Oluşturulma tarihi
- `updatedAt`: Güncellenme tarihi

### Analytics (Analitik)
- `id`: UUID (Primary Key)
- `productId`: Ürün ID (opsiyonel)
- `eventType`: Olay tipi (PRODUCT_CLICK, WHATSAPP_BUTTON, PAGE_VIEW, SEARCH)
- `source`: Kaynak ('web' veya 'telegram')
- `metadata`: Ek bilgiler (JSON formatında)
- `createdAt`: Oluşturulma tarihi

## Komutlar

```bash
# Prisma Client oluştur
npm run db:generate

# Veritabanı şemasını uygula (Supabase için)
npm run db:push

# Migration oluştur
npm run db:migrate

# Prisma Studio'yu aç (GUI)
npm run db:studio
```

## Supabase ile Kullanım

1. Supabase projenizde PostgreSQL veritabanınızı oluşturun
2. Connection string'i `.env` dosyasına ekleyin:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```
3. `npm run db:push` komutu ile şemayı uygulayın

