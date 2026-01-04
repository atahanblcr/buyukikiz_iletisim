import { getProducts } from "@/app/actions/products";
import { ProductCard } from "@/components/product-card";

export default async function StorePage() {
  const productsResult = await getProducts();
  const products = productsResult.success ? productsResult.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Hoş Geldiniz</h1>
        <p className="text-xl text-muted-foreground">
          En iyi mobil telefon ve aksesuar fırsatlarını keşfedin
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Henüz ürün bulunmamaktadır.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

