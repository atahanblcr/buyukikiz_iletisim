"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/product-form";
import { CreateProductInput } from "@/app/actions/products";
import { useRouter } from "next/navigation";

interface ProductFormDialogProps {
  children: React.ReactNode;
  productId?: string;
  initialData?: Partial<CreateProductInput> & { id?: string; imageUrls?: string[] };
}

export function ProductFormDialog({
  children,
  productId,
  initialData,
}: ProductFormDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {productId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </DialogTitle>
          <DialogDescription>
            {productId
              ? "Ürün bilgilerini güncelleyin"
              : "Yeni bir ürün eklemek için formu doldurun"}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          productId={productId}
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

