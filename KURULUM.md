# Hızlı Kurulum Kılavuzu

Bu kılavuz, Büyükikiz İletişim Dijital Vitrin projesini hızlıca kurmak için adım adım talimatlar içerir.

## 📦 Adım 1: Bağımlılıkları Yükleyin

```bash
npm install
```

## 🔐 Adım 2: Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# Veritabanı Bağlantısı (Supabase)
DATABASE_URL="postgresql://postgres:[ŞİFRENİZ]@[HOST]:5432/postgres"

# Cloudinary (Görsel Depolama)
CLOUDINARY_CLOUD_NAME="bulut-adınız"
CLOUDINARY_API_KEY="api-anahtarınız"
CLOUDINARY_API_SECRET="api-gizli-anahtarınız"
```

### Supabase Bağlantı String'i Nasıl Alınır?

1. Supabase projenize giriş yapın
2. Settings > Database bölümüne gidin
3. "Connection string" bölümünden "URI" formatını kopyalayın
4. `[YOUR-PASSWORD]` kısmını gerçek şifrenizle değiştirin

## 🗄️ Adım 3: Veritabanını Hazırlayın

```bash
# Prisma Client'ı oluştur
npm run db:generate

# Veritabanı şemasını uygula (Supabase için önerilen)
npm run db:push
```

**Not:** `db:push` komutu şemayı doğrudan veritabanına uygular. Geliştirme için migration kullanmak isterseniz:

```bash
npm run db:migrate
```

## 🚀 Adım 4: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## ✅ Kontrol Listesi

- [ ] Node.js 18+ yüklü mü?
- [ ] PostgreSQL veritabanı hazır mı? (Supabase önerilir)
- [ ] `.env` dosyası oluşturuldu mu?
- [ ] `DATABASE_URL` doğru mu?
- [ ] Bağımlılıklar yüklendi mi? (`npm install`)
- [ ] Prisma Client oluşturuldu mu? (`npm run db:generate`)
- [ ] Veritabanı şeması uygulandı mı? (`npm run db:push`)

## 🎯 Sonraki Adımlar

1. **İlk Admin Kullanıcısını Oluşturun**
   - Prisma Studio'yu açın: `npm run db:studio`
   - `admins` tablosuna manuel olarak bir admin ekleyin
   - Şifreyi hash'lemeyi unutmayın (bcrypt kullanın)

2. **Kategorileri Ekleyin**
   - Admin panelinden (`/admin/categories`) veya
   - Prisma Studio'dan kategoriler ekleyin

3. **Ürünleri Ekleyin**
   - Admin panelinden (`/admin/products`) ürün ekleyin
   - Cloudinary'ye görselleri yükleyin
   - Görsel URL'lerini ürünlere ekleyin

4. **Analitik Sistemini Test Edin**
   - Mağazada bir ürüne tıklayın
   - Admin panelinden (`/admin/analytics`) istatistikleri kontrol edin

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Hatası

- `DATABASE_URL` formatını kontrol edin
- Supabase'de veritabanının aktif olduğundan emin olun
- Firewall ayarlarını kontrol edin

### Prisma Client Hatası

```bash
# Prisma Client'ı yeniden oluşturun
npm run db:generate
```

### Port Zaten Kullanılıyor

```bash
# Farklı bir port kullanın
PORT=3001 npm run dev
```

## 📚 Daha Fazla Bilgi

Detaylı dokümantasyon için `README.md` dosyasına bakın.

