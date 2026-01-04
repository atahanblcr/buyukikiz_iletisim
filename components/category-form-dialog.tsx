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
import { CategoryForm } from "@/components/category-form";
import { useRouter } from "next/navigation";

interface CategoryFormDialogProps {
  children: React.ReactNode;
}

export function CategoryFormDialog({ children }: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Kategori Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir kategori eklemek için formu doldurun
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

