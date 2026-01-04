import { getProducts } from "@/app/actions/products";
import { ProductCard } from "@/components/product-card";

export default async function ProductsPage() {
  const productsResult = await getProducts();
  const products = productsResult.success ? productsResult.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tüm Ürünler</h1>
      {products.length === 0 ? (
        <p className="text-muted-foreground mb-8">
          Henüz ürün bulunmamaktadır.
        </p>
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

