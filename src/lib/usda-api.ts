/**
 * USDA & Translation API Utility
 * Fokus pada pencarian Bahasa Inggris untuk akurasi maksimal.
 */

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || "DEMO_KEY"; 
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

/**
 * Menerjemahkan teks (digunakan setelah item dipilih)
 */
export async function translateText(text: string, pair: 'en|id' | 'id|en'): Promise<string> {
  if (!text || /^\d+$/.test(text)) return text;
  
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    return data.responseStatus === 200 ? data.responseData.translatedText : text;
  } catch (error) {
    return text;
  }
}

/**
 * Mencari makanan langsung ke USDA (Fokus Bahasa Inggris)
 */
export async function searchFoods(query: string, pageSize: number = 15): Promise<FoodItem[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const params = new URLSearchParams({
    api_key: USDA_API_KEY,
    query: trimmedQuery,
    pageSize: pageSize.toString(),
    dataType: "Foundation,SR Legacy,Branded"
  });

  try {
    const response = await fetch(`${BASE_URL}/foods/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors' // Memastikan CORS aktif untuk mobile
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Terlalu banyak permintaan (Rate Limit)");
      throw new Error("Gagal menghubungi server USDA");
    }

    const data = await response.json();
    return data.foods || [];
  } catch (error: any) {
    console.error("USDA Search Error:", error);
    throw error;
  }
}

export function getNutrientValue(nutrients: Nutrient[], name: string): number {
  if (!nutrients) return 0;
  const n = nutrients.find(n => n.nutrientName.toLowerCase().includes(name.toLowerCase()));
  return n ? n.value : 0;
}

export function calculateSmartScore(nutrients: Nutrient[]): number {
  const protein = getNutrientValue(nutrients, "Protein");
  const sugar = getNutrientValue(nutrients, "Sugars");
  let score = 50 + (protein * 2) - (sugar * 2);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export interface Nutrient {
  nutrientId: number;
  nutrientName: string;
  value: number;
  unitName: string;
}

export interface FoodItem {
  fdcId: number;
  description: string;
  foodNutrients: Nutrient[];
  brandOwner?: string;
  dataType?: string;
}