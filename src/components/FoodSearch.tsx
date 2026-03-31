import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchFoods, FoodItem, getNutrientValue, calculateSmartScore } from '@/lib/usda-api';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Search, Plus, Loader2, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from '@/utils/toast';

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { addLog } = useNutritionStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchFoods(query);
      setResults(data);
    } catch (err) {
      showError("Failed to fetch food data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (food: FoodItem) => {
    addLog(food, 100); // Default 100g
    showSuccess(`Added ${food.description} to log!`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 300,000+ foods (e.g. 'Blueberry', 'Salmon')..."
            className="pl-10 bg-slate-900/50 border-slate-800 text-white"
          />
        </div>
        <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {results.map((food) => {
          const score = calculateSmartScore(food.foodNutrients);
          const calories = getNutrientValue(food.foodNutrients, "Energy");
          const protein = getNutrientValue(food.foodNutrients, "Protein");
          
          return (
            <Card key={food.fdcId} className="bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">{food.description}</h3>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="text-slate-400 border-slate-700">
                      {Math.round(calories)} kcal / 100g
                    </Badge>
                    <Badge variant="outline" className="text-slate-400 border-slate-700">
                      {Math.round(protein)}g Protein
                    </Badge>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded ${
                      score > 70 ? 'bg-green-500/20 text-green-400' : 
                      score > 40 ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Smart Score: {score}
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleAdd(food)}
                  size="icon" 
                  variant="ghost" 
                  className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
        
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12 text-slate-500">
            No results found. Try a different search term.
          </div>
        )}
      </div>
      
      <div className="text-center text-[10px] text-slate-600 mt-8">
        Powered by <a href="https://fdc.nal.usda.gov/" target="_blank" className="underline">USDA FoodData Central</a>
      </div>
    </div>
  );
};

export default FoodSearch;