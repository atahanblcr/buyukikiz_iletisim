export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Yönetim paneline hoş geldiniz. Buradan ürünleri, kategorileri ve
          analitik verileri yönetebilirsiniz.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Toplam Ürün</h3>
          <p className="text-3xl font-bold">-</p>
          <p className="text-sm text-muted-foreground mt-2">
            Veritabanından gelecek
          </p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Toplam Kategori</h3>
          <p className="text-3xl font-bold">-</p>
          <p className="text-sm text-muted-foreground mt-2">
            Veritabanından gelecek
          </p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Toplam Tıklama</h3>
          <p className="text-3xl font-bold">-</p>
          <p className="text-sm text-muted-foreground mt-2">
            Analitik verilerinden gelecek
          </p>
        </div>
      </div>
    </div>
  );
}

