// Cloudinary görsel yükleme

import { config } from "./config";

export async function uploadImageToCloudinary(
  imageUrl: string
): Promise<string | null> {
  try {
    // Telegram'dan gelen görsel URL'sini Cloudinary'ye yükle
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default");
    formData.append("cloud_name", config.cloudinaryCloudName);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Cloudinary yükleme hatası");
    }

    const data = await uploadResponse.json();
    return data.secure_url || null;
  } catch (error) {
    console.error("Cloudinary yükleme hatası:", error);
    return null;
  }
}

