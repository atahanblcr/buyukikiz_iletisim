"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "@/components/product-form-dialog";
import { deleteProduct } from "@/app/actions/products";
import { ProductWithCategory } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  products: ProductWithCategory[];
}

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Ürün silinemedi");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Bir hata oluştu");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Henüz ürün eklenmemiş. İlk ürünü eklemek için yukarıdaki butonu kullanın.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Görsel</TableHead>
            <TableHead>Marka</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Fiyat</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.model}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    Görsel Yok
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.brand}</TableCell>
              <TableCell>{product.model}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {product.discountedPrice ? (
                    <>
                      <span className="line-through text-muted-foreground text-sm">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-primary font-semibold">
                        {formatPrice(product.discountedPrice)}
                      </span>
                    </>
                  ) : (
                    <span>{formatPrice(product.price)}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.stockStatus === "IN_STOCK"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stockStatus === "IN_STOCK" ? "Stokta Var" : "Stokta Yok"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <ProductFormDialog productId={product.id} initialData={product}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </ProductFormDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

