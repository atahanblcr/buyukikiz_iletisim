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
import { Combobox } from "@/components/ui/combobox";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { createProduct, updateProduct, type CreateProductInput } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { StockStatus, Condition } from "@prisma/client";
import { Loader2, X } from "lucide-react";
import {
  getAllBrands,
  getModelsByBrand,
  PHONE_BRANDS,
} from "@/lib/phone-data";

interface ProductFormProps {
  productId?: string;
  initialData?: Partial<CreateProductInput> & { id?: string; imageUrls?: string[] };
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Standart renkler
const STANDARD_COLORS = [
  "Siyah",
  "Beyaz",
  "Mavi",
  "Gold",
  "Uzay Grisi",
  "Gümüş",
  "Kırmızı",
  "Mor",
  "Yeşil",
  "Pembe",
];

// Standart depolama seçenekleri
const STANDARD_STORAGE = ["64GB", "128GB", "256GB", "512GB", "1TB"];

export function ProductForm({
  productId,
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialData?.brand || "");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
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

  useEffect(() => {
    // Kategorileri yükle
    getCategories().then((result) => {
      if (result.success && result.data) {
        setCategories(result.data);
      }
    });
  }, []);

  // Marka değiştiğinde modelleri güncelle
  useEffect(() => {
    if (selectedBrand) {
      const models = getModelsByBrand(selectedBrand);
      setAvailableModels(models);
      // Eğer mevcut model seçili markaya ait değilse, temizle
      if (formData.model && !models.includes(formData.model)) {
        setFormData({ ...formData, model: "" });
      }
    } else {
      setAvailableModels([]);
    }
  }, [selectedBrand]);

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

  const toggleColor = (color: string) => {
    if (formData.colors.includes(color)) {
      setFormData({
        ...formData,
        colors: formData.colors.filter((c) => c !== color),
      });
    } else {
      setFormData({
        ...formData,
        colors: [...formData.colors, color],
      });
    }
  };

  const toggleStorage = (storage: string) => {
    if (formData.storageOptions.includes(storage)) {
      setFormData({
        ...formData,
        storageOptions: formData.storageOptions.filter((s) => s !== storage),
      });
    } else {
      setFormData({
        ...formData,
        storageOptions: [...formData.storageOptions, storage],
      });
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setFormData({ ...formData, brand, model: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Temel Bilgiler */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Temel Bilgiler</h3>
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
            <Combobox
              options={getAllBrands()}
              value={selectedBrand}
              onValueChange={handleBrandChange}
              placeholder="Marka seçin"
              searchPlaceholder="Marka ara..."
              emptyMessage="Marka bulunamadı"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Combobox
              options={availableModels}
              value={formData.model}
              onValueChange={(value) => setFormData({ ...formData, model: value })}
              placeholder={selectedBrand ? "Model seçin" : "Önce marka seçin"}
              searchPlaceholder="Model ara..."
              emptyMessage="Model bulunamadı"
              disabled={!selectedBrand || availableModels.length === 0}
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
                <SelectItem value="NEW">Sıfır</SelectItem>
                <SelectItem value="USED">2. El</SelectItem>
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
      </div>

      {/* Renkler */}
      <div className="space-y-3">
        <Label>Renkler *</Label>
        <div className="flex flex-wrap gap-2">
          {STANDARD_COLORS.map((color) => (
            <Button
              key={color}
              type="button"
              variant={formData.colors.includes(color) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleColor(color)}
              className="rounded-full"
            >
              {color}
              {formData.colors.includes(color) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Button>
          ))}
        </div>
        {formData.colors.length === 0 && (
          <p className="text-sm text-muted-foreground">
            En az bir renk seçmelisiniz
          </p>
        )}
      </div>

      {/* Depolama Seçenekleri */}
      <div className="space-y-3">
        <Label>Depolama Seçenekleri *</Label>
        <div className="flex flex-wrap gap-2">
          {STANDARD_STORAGE.map((storage) => (
            <Button
              key={storage}
              type="button"
              variant={formData.storageOptions.includes(storage) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleStorage(storage)}
              className="rounded-full"
            >
              {storage}
              {formData.storageOptions.includes(storage) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Button>
          ))}
        </div>
        {formData.storageOptions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            En az bir depolama seçeneği seçmelisiniz
          </p>
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
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
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
