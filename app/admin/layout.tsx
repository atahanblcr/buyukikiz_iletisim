import Link from "next/link";
import { verifySession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Üst Menü */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-2xl font-bold text-primary">
              Admin Paneli
            </Link>
            <nav className="flex items-center gap-6">
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
              {session && (
                <div className="flex items-center gap-4 pl-4 border-l">
                  <span className="text-sm text-muted-foreground">
                    {session.name}
                  </span>
                  <LogoutButton />
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* İçerik */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

