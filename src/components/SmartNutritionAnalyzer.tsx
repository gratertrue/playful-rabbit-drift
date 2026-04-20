import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Brain, AlertCircle, CheckCircle2, Info, ChevronRight, BookOpen, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const SmartNutritionAnalyzer = () => {
  const { getAKGGoals, getAverageNutrients, logs } = useNutritionStore();
  const akg = getAKGGoals();
  const avg = getAverageNutrients(3);

  if (!avg || logs.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 text-center text-slate-500">
          <p className="text-[9px]">Catat makanan untuk melihat tren nutrisi.</p>
        </CardContent>
      </Card>
    );
  }

  const micros = [
    { name: 'Vit C', current: avg.vitaminC, target: akg.vitaminC, unit: 'mg' },
    { name: 'Besi', current: avg.iron, target: akg.iron, unit: 'mg' },
    { name: 'Kalsium', current: avg.calcium, target: akg.calcium, unit: 'mg' },
    { name: 'Vit A', current: avg.vitaminA, target: akg.vitaminA, unit: 'mcg' },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-white flex items-center gap-1.5 text-[9px] uppercase">
          <Brain className="h-3 w-3 text-purple-400" />
          Tren Nutrisi (3H)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-1.5">
        {micros.map((m) => {
          const percentage = Math.min((m.current / m.target) * 100, 100);
          return (
            <div key={m.name} className="space-y-0.5">
              <div className="flex justify-between items-center text-[8px]">
                <span className="font-bold text-slate-300">{m.name}</span>
                <span className="text-slate-500">{Math.round(m.current)}/{m.target}</span>
              </div>
              <Progress value={percentage} className="h-0.5 bg-slate-800" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SmartNutritionAnalyzer;