export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Hoş Geldiniz</h1>
        <p className="text-xl text-muted-foreground">
          En iyi mobil telefon ve aksesuar fırsatlarını keşfedin
        </p>
      </div>

      {/* Öne Çıkan Ürünler bölümü buraya eklenecek */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 bg-card">
          <p className="text-muted-foreground">
            Ürünler yakında burada görüntülenecek
          </p>
        </div>
      </div>
    </div>
  );
}

