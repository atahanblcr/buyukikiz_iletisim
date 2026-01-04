export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
          Yeni Kategori Ekle
        </button>
      </div>
      <p className="text-muted-foreground">
        Kategori listesi ve yönetim arayüzü buraya eklenecek
      </p>
    </div>
  );
}

