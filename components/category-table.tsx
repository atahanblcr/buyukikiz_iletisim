"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/app/actions/categories";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  _count?: {
    products: number;
  };
}

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Kategori silinemedi");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Bir hata oluştu");
    } finally {
      setDeletingId(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Henüz kategori eklenmemiş. İlk kategoriyi eklemek için yukarıdaki
        butonu kullanın.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategori Adı</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Açıklama</TableHead>
            <TableHead>Ürün Sayısı</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {category.slug}
                </code>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {category.description || "-"}
              </TableCell>
              <TableCell>{category._count?.products || 0}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={deletingId === category.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

