/**
 * ############################################################
 * # LOGIC FILE: USDA API & RISK CALCULATIONS
 * # This file handles talking to the internet to get food data
 * # and calculating if a food is 'risky' for GERD.
 * ############################################################
 */

const API_KEY = "W1cTjbexnEV7o7cAqAmXlyytOGFCv2DnblANhXcR";
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// # Function to search for food using the USDA database
export const searchFoods = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}/foods/search?query=${encodeURIComponent(query)}&api_key=${API_KEY}&pageSize=15`);
    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

// # Function to find a specific nutrient (like Fat) in the data list
export function getNutrient(nutrients: any[], name: string) {
  const found = nutrients.find(n => n.nutrientName.toLowerCase().includes(name.toLowerCase()));
  return found ? found.value : 0;
}

// # Function to decide if a food is a GERD trigger
// # Logic: High Fat (>15g) or specific keywords = High Risk
export function checkGerdRisk(food: any) {
  const fat = getNutrient(food.foodNutrients, "Total lipid (fat)");
  const name = food.description.toLowerCase();
  
  // List of common triggers to look for in the name
  const triggers = ['spicy', 'chili', 'mint', 'chocolate', 'coffee', 'citrus', 'lemon', 'tomato', 'fried'];
  
  if (fat > 15 || triggers.some(t => name.includes(t))) {
    return { level: 'High', color: 'text-red-500', reason: 'High fat or trigger ingredients' };
  }
  if (fat > 7) {
    return { level: 'Medium', color: 'text-yellow-500', reason: 'Moderate fat content' };
  }
  return { level: 'Low', color: 'text-green-500', reason: 'Safe profile' };
}