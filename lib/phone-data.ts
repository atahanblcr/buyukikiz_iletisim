// Telefon marka ve model verileri

export interface PhoneBrand {
  name: string;
  models: string[];
}

export const PHONE_BRANDS: PhoneBrand[] = [
  {
    name: "Apple",
    models: [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15 Plus",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
      "iPhone 14 Plus",
      "iPhone 14",
      "iPhone 13 Pro Max",
      "iPhone 13 Pro",
      "iPhone 13",
      "iPhone 13 mini",
      "iPhone 12 Pro Max",
      "iPhone 12 Pro",
      "iPhone 12",
      "iPhone 12 mini",
      "iPhone 11 Pro Max",
      "iPhone 11 Pro",
      "iPhone 11",
      "iPhone SE (2022)",
      "iPhone SE (2020)",
    ],
  },
  {
    name: "Samsung",
    models: [
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Galaxy S24",
      "Galaxy S23 Ultra",
      "Galaxy S23+",
      "Galaxy S23",
      "Galaxy S22 Ultra",
      "Galaxy S22+",
      "Galaxy S22",
      "Galaxy S21 Ultra",
      "Galaxy S21+",
      "Galaxy S21",
      "Galaxy Note 20 Ultra",
      "Galaxy Note 20",
      "Galaxy A54",
      "Galaxy A34",
      "Galaxy A24",
      "Galaxy A14",
      "Galaxy Z Fold 5",
      "Galaxy Z Flip 5",
    ],
  },
  {
    name: "Xiaomi",
    models: [
      "Xiaomi 14 Pro",
      "Xiaomi 14",
      "Xiaomi 13 Pro",
      "Xiaomi 13",
      "Xiaomi 12 Pro",
      "Xiaomi 12",
      "Redmi Note 13 Pro",
      "Redmi Note 13",
      "Redmi Note 12 Pro",
      "Redmi Note 12",
      "Redmi 13C",
      "Redmi 12",
      "POCO X6 Pro",
      "POCO X6",
      "POCO F5",
      "POCO M5",
    ],
  },
  {
    name: "Huawei",
    models: [
      "P60 Pro",
      "P60",
      "P50 Pro",
      "P50",
      "Mate 60 Pro",
      "Mate 60",
      "Mate 50 Pro",
      "Mate 50",
      "Nova 12",
      "Nova 11",
    ],
  },
  {
    name: "Oppo",
    models: [
      "Find X6 Pro",
      "Find X6",
      "Find X5 Pro",
      "Find X5",
      "Reno 11 Pro",
      "Reno 11",
      "Reno 10 Pro",
      "Reno 10",
      "A98",
      "A78",
    ],
  },
  {
    name: "Vivo",
    models: [
      "X100 Pro",
      "X100",
      "X90 Pro",
      "X90",
      "V30 Pro",
      "V30",
      "V29",
      "Y100",
      "Y78",
    ],
  },
  {
    name: "OnePlus",
    models: [
      "OnePlus 12",
      "OnePlus 11",
      "OnePlus 10 Pro",
      "OnePlus 10T",
      "OnePlus 9 Pro",
      "OnePlus 9",
      "OnePlus Nord 3",
      "OnePlus Nord 2",
    ],
  },
  {
    name: "Google",
    models: [
      "Pixel 8 Pro",
      "Pixel 8",
      "Pixel 7 Pro",
      "Pixel 7",
      "Pixel 6 Pro",
      "Pixel 6",
      "Pixel 6a",
      "Pixel 5a",
    ],
  },
];

// Tüm markaları getir
export function getAllBrands(): string[] {
  return PHONE_BRANDS.map((brand) => brand.name);
}

// Markaya göre modelleri getir
export function getModelsByBrand(brandName: string): string[] {
  const brand = PHONE_BRANDS.find((b) => b.name === brandName);
  return brand ? brand.models : [];
}

// Model arama
export function searchModels(brandName: string, query: string): string[] {
  const models = getModelsByBrand(brandName);
  if (!query) return models;
  return models.filter((model) =>
    model.toLowerCase().includes(query.toLowerCase())
  );
}

