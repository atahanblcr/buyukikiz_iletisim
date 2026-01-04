import Link from "next/link";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Üst Menü */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/store" className="text-2xl font-bold text-primary">
              Büyükikiz İletişim
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/store"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/store/products"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Ürünler
              </Link>
              <Link
                href="/store/categories"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Kategoriler
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* İçerik */}
      <main>{children}</main>

      {/* Alt Bilgi */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Büyükikiz İletişim. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

