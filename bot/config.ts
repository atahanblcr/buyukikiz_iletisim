// Telegram Bot Yapılandırması

export const config = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

// Yapılandırma kontrolü
export function validateConfig() {
  const required = [
    "telegramBotToken",
    "supabaseUrl",
    "supabaseKey",
  ] as const;

  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Eksik yapılandırma değişkenleri: ${missing.join(", ")}`
    );
  }
}

