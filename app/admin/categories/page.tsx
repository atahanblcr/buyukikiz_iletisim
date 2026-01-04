import { getCategoriesWithCounts } from "@/app/actions/categories";
import { CategoryTable } from "@/components/category-table";
import { CategoryFormDialog } from "@/components/category-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categoriesResult = await getCategoriesWithCounts();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
          <p className="text-muted-foreground mt-1">
            Tüm kategorileri görüntüleyin, ekleyin ve yönetin
          </p>
        </div>
        <CategoryFormDialog>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kategori Ekle
          </Button>
        </CategoryFormDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kategoriler</CardTitle>
          <CardDescription>
            Toplam {categories.length} kategori bulunmaktadır
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryTable categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
