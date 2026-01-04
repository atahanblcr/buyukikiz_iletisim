-- Örnek veri ekleme SQL scripti
-- Bu dosya örnek kategoriler ve ürünler eklemek için kullanılabilir

-- Örnek Kategoriler
INSERT INTO categories (id, name, slug, description, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Telefon', 'telefon', 'Akıllı telefonlar', NOW(), NOW()),
  (gen_random_uuid(), 'Aksesuar', 'aksesuar', 'Telefon aksesuarları', NOW(), NOW()),
  (gen_random_uuid(), 'Şarj Cihazı', 'sarj-cihazi', 'Şarj cihazları ve kablolar', NOW(), NOW()),
  (gen_random_uuid(), 'Kılıf', 'kilif', 'Telefon kılıfları', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Not: Gerçek ürün verileri admin paneli üzerinden eklenmelidir
-- Bu dosya sadece örnek kategoriler için kullanılabilir

