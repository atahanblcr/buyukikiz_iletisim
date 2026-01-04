import { getProducts, deleteProduct } from "@/app/actions/products";
import { ProductTable } from "@/components/product-table";
import { ProductFormDialog } from "@/components/product-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const productsResult = await getProducts();
  const products = productsResult.success ? productsResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
          <p className="text-muted-foreground mt-1">
            Tüm ürünleri görüntüleyin, düzenleyin ve yönetin
          </p>
        </div>
        <ProductFormDialog>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Ürün Ekle
          </Button>
        </ProductFormDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürünler</CardTitle>
          <CardDescription>
            Toplam {products.length} ürün bulunmaktadır
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} />
        </CardContent>
      </Card>
    </div>
  );
}
