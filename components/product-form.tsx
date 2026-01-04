"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { createProduct, updateProduct, type CreateProductInput } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { StockStatus, Condition } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface ProductFormProps {
  productId?: string;
  initialData?: Partial<CreateProductInput> & { id?: string; imageUrls?: string[] };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({
  productId,
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState<CreateProductInput & { imageUrls: string[] }>({
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    price: initialData?.price || 0,
    discountedPrice: initialData?.discountedPrice,
    stockStatus: initialData?.stockStatus || "IN_STOCK",
    condition: initialData?.condition || "NEW",
    colors: initialData?.colors || [],
    storageOptions: initialData?.storageOptions || [],
    imageUrls: initialData?.imageUrls || [],
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
  });

  const [colorInput, setColorInput] = useState("");
  const [storageInput, setStorageInput] = useState("");

  useEffect(() => {
    // Kategorileri yükle
    getCategories().then((result) => {
      if (result.success && result.data) {
        setCategories(result.data);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: CreateProductInput = {
        brand: formData.brand,
        model: formData.model,
        price: Number(formData.price),
        discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
        stockStatus: formData.stockStatus as StockStatus,
        condition: formData.condition as Condition,
        colors: formData.colors,
        storageOptions: formData.storageOptions,
        imageUrls: formData.imageUrls,
        description: formData.description || undefined,
        categoryId: formData.categoryId,
      };

      let result;
      if (productId) {
        result = await updateProduct({ id: productId, ...productData });
      } else {
        result = await createProduct(productData);
      }

      if (result.success) {
        onSuccess?.();
      } else {
        alert(result.error || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Form gönderme hatası:", error);
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, colorInput.trim()],
      });
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== color),
    });
  };

  const addStorage = () => {
    if (storageInput.trim() && !formData.storageOptions.includes(storageInput.trim())) {
      setFormData({
        ...formData,
        storageOptions: [...formData.storageOptions, storageInput.trim()],
      });
      setStorageInput("");
    }
  };

  const removeStorage = (storage: string) => {
    setFormData({
      ...formData,
      storageOptions: formData.storageOptions.filter((s) => s !== storage),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Temel Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Kategori *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            required
          >
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Marka *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Apple, Samsung, vb."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="iPhone 15 Pro, Galaxy S24, vb."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Durum *</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) =>
              setFormData({ ...formData, condition: value as Condition })
            }
            required
          >
            <SelectTrigger id="condition">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">Yeni</SelectItem>
              <SelectItem value="USED">Kullanılmış</SelectItem>
              <SelectItem value="OUTLET">Outlet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (₺) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountedPrice">İndirimli Fiyat (₺)</Label>
          <Input
            id="discountedPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.discountedPrice || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                discountedPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stockStatus">Stok Durumu *</Label>
          <Select
            value={formData.stockStatus}
            onValueChange={(value) =>
              setFormData({ ...formData, stockStatus: value as StockStatus })
            }
            required
          >
            <SelectTrigger id="stockStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IN_STOCK">Stokta Var</SelectItem>
              <SelectItem value="OUT_STOCK">Stokta Yok</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Renkler */}
      <div className="space-y-2">
        <Label>Renkler</Label>
        <div className="flex gap-2 flex-wrap">
          <Input
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="Renk ekle (örn: Siyah, Beyaz)"
            className="flex-1 min-w-[200px]"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addColor();
              }
            }}
          />
          <Button type="button" onClick={addColor} variant="outline">
            Ekle
          </Button>
        </div>
        {formData.colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.colors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Depolama Seçenekleri */}
      <div className="space-y-2">
        <Label>Depolama Seçenekleri</Label>
        <div className="flex gap-2 flex-wrap">
          <Input
            value={storageInput}
            onChange={(e) => setStorageInput(e.target.value)}
            placeholder="Depolama ekle (örn: 128GB, 256GB)"
            className="flex-1 min-w-[200px]"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addStorage();
              }
            }}
          />
          <Button type="button" onClick={addStorage} variant="outline">
            Ekle
          </Button>
        </div>
        {formData.storageOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.storageOptions.map((storage) => (
              <span
                key={storage}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
              >
                {storage}
                <button
                  type="button"
                  onClick={() => removeStorage(storage)}
                  className="hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Görseller */}
      <div className="space-y-2">
        <Label>Görseller *</Label>
        <CloudinaryUpload
          onUpload={(urls) => setFormData({ ...formData, imageUrls: urls })}
          existingUrls={formData.imageUrls}
          maxFiles={10}
        />
      </div>

      {/* Açıklama */}
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ürün açıklaması..."
          rows={4}
        />
      </div>

      {/* Butonlar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : productId ? (
            "Güncelle"
          ) : (
            "Oluştur"
          )}
        </Button>
      </div>
    </form>
  );
}

