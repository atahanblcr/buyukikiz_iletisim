"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploadProps {
  onUpload: (urls: string[]) => void;
  existingUrls?: string[];
  maxFiles?: number;
}

export function CloudinaryUpload({
  onUpload,
  existingUrls = [],
  maxFiles = 10,
}: CloudinaryUploadProps) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Cloudinary script'ini yükle (eğer yüklenmemişse)
    if (document.querySelector('script[src="https://upload-widget.cloudinary.com/global/all.js"]')) {
      return; // Script zaten yüklenmiş
    }

    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    // Brute force z-index fix - Global observer to catch all Cloudinary elements
    const observer = new MutationObserver(() => {
      const cloudinaryElements = document.querySelectorAll(
        'iframe[src*="cloudinary"], .cloudinary-overlay, .cloudinary-popup, .widget-overlay, [data-cloudinary-widget], div[data-testid="cloudinary-widget"], [class*="cloudinary"], [id*="cloudinary"]'
      );
      cloudinaryElements.forEach((el) => {
        (el as HTMLElement).style.zIndex = '99999';
        (el as HTMLElement).style.position = 'fixed';
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      alert("Cloudinary yükleniyor, lütfen bekleyin...");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      alert("Cloudinary yapılandırması eksik. Lütfen NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ortam değişkenini ayarlayın.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset || "ml_default",
        multiple: true,
        maxFiles: maxFiles - uploadedUrls.length,
        resourceType: "image",
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        showAdvancedOptions: false,
        cropping: false,
        sources: ["local", "camera"],
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
          fonts: {
            default: null,
            "'Poppins', sans-serif": {
              url: "https://fonts.googleapis.com/css?family=Poppins",
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const newUrl = result.info.secure_url;
          const updatedUrls = [...uploadedUrls, newUrl];
          setUploadedUrls(updatedUrls);
          onUpload(updatedUrls);
        }
      }
    );

    widgetRef.current = widget;
    widget.open();
    
    // Brute force z-index fix - CSS handles most of it, but ensure it's applied
    setTimeout(() => {
      const cloudinaryElements = document.querySelectorAll(
        'iframe[src*="cloudinary"], .cloudinary-overlay, .cloudinary-popup, .widget-overlay, [data-cloudinary-widget], div[data-testid="cloudinary-widget"]'
      );
      cloudinaryElements.forEach((el) => {
        (el as HTMLElement).style.zIndex = '99999';
        (el as HTMLElement).style.position = 'fixed';
      });
    }, 100);
  };

  const removeImage = (urlToRemove: string) => {
    const updatedUrls = uploadedUrls.filter((url) => url !== urlToRemove);
    setUploadedUrls(updatedUrls);
    onUpload(updatedUrls);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={openWidget}
          disabled={uploadedUrls.length >= maxFiles}
          className="flex items-center gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          {uploadedUrls.length === 0
            ? "Görsel Yükle"
            : `${uploadedUrls.length}/${maxFiles} Görsel`}
        </Button>
        {uploadedUrls.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {uploadedUrls.length} görsel seçildi
          </span>
        )}
      </div>

      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border"
            >
              <Image
                src={url}
                alt={`Ürün görseli ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeImage(url)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

