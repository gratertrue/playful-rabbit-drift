import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Sparkles, ArrowRight, Apple, Beef, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SUGGESTIONS = {
  weight_loss: [
    { name: 'Salmon Panggang', cals: 350, icon: Beef },
    { name: 'Salad Quinoa', cals: 280, icon: Wheat },
  ],
  muscle_gain: [
    { name: 'Steak & Ubi', cals: 650, icon: Beef },
    { name: 'Ayam & Nasi', cals: 550, icon: Beef },
  ],
  maintenance: [
    { name: 'Wrap Alpukat', cals: 420, icon: Beef },
    { name: 'Pasta Medit', cals: 480, icon: Wheat },
  ]
};

const SmartSuggestions = () => {
  const { profile } = useNutritionStore();
  const currentGoal = profile?.goal || 'maintenance';
  const suggestions = SUGGESTIONS[currentGoal as keyof typeof SUGGESTIONS] || SUGGESTIONS.maintenance;

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-white flex items-center gap-1.5 text-[9px] uppercase">
          <Sparkles className="h-3 w-3 text-yellow-400" />
          Saran Cerdas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-1">
        {suggestions.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-800/30 border border-slate-800/50 group">
            <div className="flex items-center gap-2 min-w-0">
              <item.icon className="h-3 w-3 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-medium text-white truncate">{item.name}</p>
                <p className="text-[7px] text-slate-500">{item.cals} kkal</p>
              </div>
            </div>
            <ArrowRight className="h-2.5 w-2.5 text-slate-600 group-hover:text-cyan-400" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;