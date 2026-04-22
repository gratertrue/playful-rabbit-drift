/**
 * USDA & Translation API Utility
 * Dioptimalkan untuk Web dan Mobile (Android/iOS).
 */

// Mengambil kunci dari variabel lingkungan
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY; 
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

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

/**
 * Fungsi translasi dengan penanganan error yang lebih kuat untuk mobile.
 */
export async function translateText(text: string, pair: 'id|en' | 'en|id'): Promise<string> {
  if (!text || /^\d+$/.test(text)) return text;
  
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors'
    });
    
    if (!response.ok) return text;
    
    const data = await response.json();
    return data.responseStatus === 200 ? data.responseData.translatedText : text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}

function isLikelyEnglish(text: string): boolean {
  const commonEnglish = /\b(chicken|rice|egg|bread|milk|water|beef|apple|fruit|meat|fish|potato)\b/i;
  return commonEnglish.test(text) || !/[^\x00-\x7F]/.test(text);
}

/**
 * Pencarian makanan dengan penanganan khusus untuk masalah koneksi di Android.
 */
export async function searchFoods(query: string, pageSize: number = 15): Promise<FoodItem[]> {
  if (!USDA_API_KEY) {
    console.error("VITE_USDA_API_KEY is missing in environment variables.");
    throw new Error("Kunci API tidak ditemukan. Silakan periksa konfigurasi aplikasi.");
  }

  try {
    let searchTerms = query;
    if (!isLikelyEnglish(query)) {
      searchTerms = await translateText(query, 'id|en');
    }

    const params = new URLSearchParams({
      api_key: USDA_API_KEY,
      query: searchTerms,
      pageSize: pageSize.toString(),
      dataType: "Foundation,SR Legacy,Branded"
    });

    const response = await fetch(`${BASE_URL}/foods/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors'
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Akses API ditolak. Kunci API mungkin tidak valid atau dinonaktifkan.");
      }
      throw new Error(`Gagal menghubungi server USDA (Status: ${response.status})`);
    }

    const data = await response.json();
    return data.foods || [];
  } catch (error: any) {
    console.error("USDA Search Error:", error);
    if (error.message === 'Failed to fetch') {
      throw new Error("Masalah koneksi internet. Pastikan perangkat Android Anda terhubung ke internet.");
    }
    throw error;
  }
}

export function getNutrientValue(nutrients: Nutrient[], name: string): number {
  if (!nutrients) return 0;
  const n = nutrients.find(n => n.nutrientName.toLowerCase().includes(name.toLowerCase()));
  return n ? n.value : 0;
}

export function calculateSmartScore(nutrients: Nutrient[]): number {
  if (!nutrients) return 0;
  const protein = getNutrientValue(nutrients, "Protein");
  const fiber = getNutrientValue(nutrients, "Fiber");
  const sugar = getNutrientValue(nutrients, "Sugars");
  let score = 50;
  score += (protein * 2) + (fiber * 3);
  score -= (sugar * 2);
  return Math.max(0, Math.min(100, Math.round(score)));
}