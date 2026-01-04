import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Üst Menü */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-2xl font-bold text-primary">
              Admin Paneli
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Ürünler
              </Link>
              <Link
                href="/admin/categories"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Kategoriler
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Analitik
              </Link>
              <Link
                href="/store"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Mağazaya Dön
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* İçerik */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

