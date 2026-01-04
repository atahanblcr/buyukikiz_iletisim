// Cloudinary görsel yükleme

import { config } from "./config";

export async function uploadImageToCloudinary(
  imageUrl: string
): Promise<string | null> {
  try {
    if (!config.cloudinaryCloudName) {
      throw new Error("Cloudinary cloud name yapılandırılmamış");
    }

    // Telegram'dan gelen görsel URL'sini Cloudinary'ye yükle
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Telegram'dan görsel alınamadı: ${response.statusText}`);
    }

    const blob = await response.blob();

    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 
                        "ml_default";

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", config.cloudinaryCloudName);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Cloudinary yükleme hatası: ${uploadResponse.status} - ${errorText}`);
    }

    const data = await uploadResponse.json();
    return data.secure_url || null;
  } catch (error) {
    console.error("Cloudinary yükleme hatası:", error);
    return null;
  }
}

