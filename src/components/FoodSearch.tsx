import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchFoods, FoodItem, getNutrientValue, calculateGerdRisk } from '@/lib/usda-api';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Search, Plus, Loader2, ChevronRight, Scale, X, Apple, Beef, Wheat, Coffee, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'fruit', label: 'Fruits', icon: Apple, query: 'fruit' },
  { id: 'protein', label: 'Proteins', icon: Beef, query: 'meat poultry fish' },
  { id: 'grains', label: 'Grains', icon: Wheat, query: 'grain bread pasta' },
  { id: 'beverages', label: 'Drinks', icon: Coffee, query: 'beverage juice' },
];

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState(100);
  
  const { addLog } = useNutritionStore();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await searchFoods(searchQuery, 40);
      setResults(data);
    } catch (err) {
      showError("Failed to fetch food data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (food: FoodItem, logAmount: number) => {
    addLog(food, logAmount);
    showSuccess(`Added ${food.description} to log!`);
    setSelectedFood(null);
    setAmount(100);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods to check triggers..."
              className="pl-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
          <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant="outline"
              size="sm"
              onClick={() => { setQuery(cat.label); handleSearch(cat.query); }}
              className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <cat.icon className="h-3.5 w-3.5 mr-2" />
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {results.map((food) => {
          const risk = calculateGerdRisk(food);
          
          return (
            <Card 
              key={food.fdcId} 
              className="bg-slate-900/50 border-slate-800 hover:border-red-500/50 transition-all group cursor-pointer"
              onClick={() => setSelectedFood(food)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-white font-medium truncate group-hover:text-red-400 transition-colors">
                    {food.description}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-bold",
                      risk.level === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      risk.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    )}>
                      {risk.level} Trigger Risk
                    </Badge>
                    <span className="text-[10px] text-slate-500">{risk.reason}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-red-400 transition-colors shrink-0" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedFood} onOpenChange={(open) => !open && setSelectedFood(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-2xl">
          {selectedFood && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-red-400">{selectedFood.description}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Trigger Analysis</p>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={cn(
                        "h-8 w-8",
                        calculateGerdRisk(selectedFood).level === 'High' ? 'text-red-400' : 'text-green-400'
                      )} />
                      <div>
                        <p className="text-lg font-bold">{calculateGerdRisk(selectedFood).level} Risk</p>
                        <p className="text-xs text-slate-400">{calculateGerdRisk(selectedFood).reason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Fat</p>
                      <p className="text-xl font-bold text-white">
                        {getNutrientValue(selectedFood.foodNutrients, "Total lipid (fat)")}g
                      </p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Fiber</p>
                      <p className="text-xl font-bold text-green-400">
                        {getNutrientValue(selectedFood.foodNutrients, "Fiber")}g
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="pt-4 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Scale className="h-3 w-3" />
                      Portion (grams)
                    </label>
                    <Input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="sm:justify-between gap-4">
                <Button variant="ghost" onClick={() => setSelectedFood(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                <Button onClick={() => handleAdd(selectedFood, amount)} className="bg-red-600 hover:bg-red-700 flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Meal
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodSearch;