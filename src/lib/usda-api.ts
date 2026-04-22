/**
 * USDA & Translation API Utility
 */

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

export async function translateText(text: string, pair: 'id|en' | 'en|id'): Promise<string> {
  if (!text || /^\d+$/.test(text) || text.length < 2) return text;
  
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    return data.responseStatus === 200 ? data.responseData.translatedText : text;
  } catch (error) {
    console.warn("Translation failed, using original text");
    return text;
  }
}

function isLikelyEnglish(text: string): boolean {
  const commonEnglish = /\b(chicken|rice|egg|bread|milk|water|beef|apple|fruit|meat|fish|potato|juice|coffee|tea)\b/i;
  return commonEnglish.test(text) || !/[^\x00-\x7F]/.test(text);
}

export async function searchFoods(query: string, pageSize: number = 15): Promise<FoodItem[]> {
  // Ambil API KEY di dalam fungsi agar selalu mendapatkan nilai terbaru
  const apiKey = import.meta.env.VITE_USDA_API_KEY;

  if (!apiKey) {
    throw new Error("Kunci API (VITE_USDA_API_KEY) tidak ditemukan. Pastikan sudah diatur di .env");
  }

  try {
    let searchTerms = query.trim();
    
    if (!isLikelyEnglish(searchTerms)) {
      const translated = await translateText(searchTerms, 'id|en');
      if (translated) searchTerms = translated;
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      query: searchTerms,
      pageSize: pageSize.toString(),
      dataType: "Foundation,SR Legacy,Branded"
    });

    const response = await fetch(`${BASE_URL}/foods/search?${params.toString()}`);

    if (!response.ok) {
      if (response.status === 403) throw new Error("Kunci API USDA tidak valid atau limit tercapai.");
      if (response.status === 429) throw new Error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
      throw new Error(`Kesalahan Server API: ${response.status}`);
    }

    const data = await response.json();
    
    if ((!data.foods || data.foods.length === 0) && searchTerms !== query.trim()) {
      const retryParams = new URLSearchParams({
        api_key: apiKey,
        query: query.trim(),
        pageSize: pageSize.toString(),
        dataType: "Foundation,SR Legacy,Branded"
      });
      const retryRes = await fetch(`${BASE_URL}/foods/search?${retryParams.toString()}`);
      const retryData = await retryRes.json();
      return retryData.foods || [];
    }

    return data.foods || [];
  } catch (error: any) {
    console.error("Search Error Details:", error);
    // Jika error karena jaringan (fetch failed)
    if (error.message.includes('Failed to fetch')) {
      throw new Error("Koneksi internet bermasalah atau server API tidak terjangkau.");
    }
    throw error;
  }
}

export function getNutrientValue(nutrients: Nutrient[], name: string): number {
  const n = nutrients.find(n => n.nutrientName.toLowerCase().includes(name.toLowerCase()));
  return n ? n.value : 0;
}

export function calculateSmartScore(nutrients: Nutrient[]): number {
  const protein = getNutrientValue(nutrients, "Protein");
  const fiber = getNutrientValue(nutrients, "Fiber");
  const sugar = getNutrientValue(nutrients, "Sugars");
  let score = 50;
  score += (protein * 2) + (fiber * 3);
  score -= (sugar * 2);
  return Math.max(0, Math.min(100, Math.round(score)));
}