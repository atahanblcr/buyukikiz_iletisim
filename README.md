# Büyükikiz İletişim - Dijital Vitrin

Mobil telefon ve aksesuar mağazası için Next.js 15 tabanlı dijital vitrin uygulaması.

## 🚀 Özellikler

- **Halka Açık Mağaza (Public Storefront)**: Ürünleri görüntüleme, kategorilere göre filtreleme
- **Admin Paneli**: Ürün, kategori ve analitik verileri yönetimi
- **PostgreSQL Veritabanı**: Supabase uyumlu Prisma şeması
- **Cloudinary Entegrasyonu**: Görsel depolama için hazır
- **Analitik Takibi**: Ürün tıklamaları ve WhatsApp buton tıklamaları için analitik sistemi

## 📋 Gereksinimler

- Node.js 18+ 
- PostgreSQL veritabanı (Supabase önerilir)
- npm veya yarn

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Veritabanını Hazırlayın

```bash
# Prisma Client'ı oluştur
npm run db:generate

# Veritabanı şemasını uygula (Supabase için)
npm run db:push

# Veya migration oluştur (geliştirme için)
npm run db:migrate
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
├── app/
│   ├── admin/          # Admin paneli sayfaları
│   │   ├── analytics/  # Analitik sayfası
│   │   ├── categories/ # Kategori yönetimi
│   │   └── products/   # Ürün yönetimi
│   ├── store/          # Halka açık mağaza sayfaları
│   │   ├── products/   # Ürün listesi
│   │   └── categories/ # Kategori listesi
│   ├── layout.tsx      # Ana layout
│   └── page.tsx        # Ana sayfa
├── components/         # React bileşenleri
│   └── ui/            # Shadcn/UI bileşenleri
├── lib/               # Yardımcı fonksiyonlar
│   ├── prisma.ts      # Prisma Client
│   └── utils.ts       # Utility fonksiyonları
└── prisma/
    └── schema.prisma  # Veritabanı şeması
```

## 🗄️ Veritabanı Şeması

### Tablolar

1. **Categories**: Ürün kategorileri (Telefon, Aksesuar, Şarj Cihazı, vb.)
2. **Products**: Ürün bilgileri (Marka, Model, Fiyat, Stok, Durum, Renkler, Depolama, Görseller)
3. **Admins**: Admin kullanıcıları
4. **Analytics**: Tıklama ve etkileşim verileri

Detaylı şema için `prisma/schema.prisma` dosyasına bakın.

## 📝 Kullanım

### Mağaza (Public Storefront)

- `/store` - Ana mağaza sayfası
- `/store/products` - Tüm ürünler
- `/store/categories` - Kategoriler

### Admin Paneli

- `/admin` - Dashboard
- `/admin/products` - Ürün yönetimi
- `/admin/categories` - Kategori yönetimi
- `/admin/analytics` - Analitik veriler

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Linting
npm run lint

# Prisma Studio (Veritabanı GUI)
npm run db:studio
```

## 📦 Teknolojiler

- **Next.js 15** - React framework (App Router)
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI bileşenleri
- **Prisma** - ORM
- **PostgreSQL** - Veritabanı
- **Cloudinary** - Görsel depolama

## 🔐 Güvenlik Notları

- Admin paneli için authentication sistemi eklenmelidir
- Şifreler hash'lenmiş olarak saklanmalıdır (bcrypt önerilir)
- API route'ları için rate limiting eklenmelidir
- CORS ayarları production için yapılandırılmalıdır

## 📄 Lisans

Bu proje özel bir projedir.

## 🤝 Katkıda Bulunma

Proje geliştirme aşamasındadır. Öneriler ve katkılar için iletişime geçin.

