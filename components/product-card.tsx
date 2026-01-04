"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductWithCategory } from "@/lib/types";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(price);
  };

  const handleWhatsAppClick = async () => {
    setLoading(true);
    try {
      // Analitik kaydı
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: "WHATSAPP_BUTTON",
          productId: product.id,
          source: "web",
        }),
      });

      // WhatsApp link oluştur
      const productName = `${product.brand} ${product.model}`;
      const price = product.discountedPrice || product.price;
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905551234567"; // .env'den al veya varsayılan
      const message = encodeURIComponent(
        `Merhaba, ${productName} ürünü hakkında bilgi almak istiyorum. Fiyat: ${formatPrice(price)}`
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Yeni sekmede WhatsApp'ı aç
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("WhatsApp buton hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square w-full">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <Image
            src={product.imageUrls[0]}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Görsel Yok</span>
          </div>
        )}
        {product.stockStatus === "OUT_STOCK" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Stokta Yok</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{product.brand}</h3>
          <p className="text-sm text-muted-foreground">{product.model}</p>
          <div className="flex items-center gap-2">
            {product.discountedPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.discountedPrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.colors.slice(0, 3).map((color, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-secondary rounded-full"
                >
                  {color}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleWhatsAppClick}
          disabled={loading || product.stockStatus === "OUT_STOCK"}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {loading ? "Yönlendiriliyor..." : "WhatsApp ile Al"}
        </Button>
      </CardFooter>
    </Card>
  );
}

