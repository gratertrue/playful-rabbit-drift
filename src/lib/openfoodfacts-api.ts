/**
 * Open Food Facts API Utility
 * Digunakan untuk mengambil data produk berdasarkan barcode.
 */

import { FoodItem, Nutrient } from './usda-api';

const BASE_URL = "https://world.openfoodfacts.org/api/v2";

export async function getProductByBarcode(barcode: string): Promise<FoodItem | null> {
  try {
    const response = await fetch(`${BASE_URL}/product/${barcode}.json?fields=product_name,nutriments,brands,image_url,nutriscore_grade,nova_group`);
    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const p = data.product;
    const n = p.nutriments;

    // Memetakan nutrisi Open Food Facts ke format Nutrient aplikasi kita
    const foodNutrients: Nutrient[] = [
      { nutrientId: 1008, nutrientName: "Energy", value: n['energy-kcal_100g'] || 0, unitName: "kcal" },
      { nutrientId: 1003, nutrientName: "Protein", value: n.proteins_100g || 0, unitName: "g" },
      { nutrientId: 1005, nutrientName: "Carbohydrate", value: n.carbohydrates_100g || 0, unitName: "g" },
      { nutrientId: 1004, nutrientName: "Total lipid (fat)", value: n.fat_100g || 0, unitName: "g" },
      { nutrientId: 2000, nutrientName: "Sugars", value: n.sugars_100g || 0, unitName: "g" },
      { nutrientId: 1093, nutrientName: "Sodium", value: n.sodium_100g * 1000 || 0, unitName: "mg" },
      { nutrientId: 1079, nutrientName: "Fiber", value: n.fiber_100g || 0, unitName: "g" },
    ];

    return {
      fdcId: parseInt(barcode), // Gunakan barcode sebagai ID unik
      description: `${p.product_name} (${p.brands || 'Tanpa Merk'})`,
      foodNutrients,
      brandOwner: p.brands,
      dataType: "Branded"
    };
  } catch (error) {
    console.error("Open Food Facts Error:", error);
    return null;
  }
}