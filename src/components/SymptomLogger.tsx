import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const SYMPTOM_TYPES = [
  { id: 'heartburn', label: 'Heartburn', icon: '🔥' },
  { id: 'regurgitation', label: 'Regurgitation', icon: '⬆️' },
  { id: 'chest_pain', label: 'Chest Pain', icon: '💔' },
  { id: 'bloating', label: 'Bloating', icon: '🎈' },
  { id: 'nausea', label: 'Nausea', icon: '🤢' },
];

const SymptomLogger = () => {
  const { addSymptom } = useNutritionStore();
  const [type, setType] = useState<any>('heartburn');
  const [severity, setSeverity] = useState([5]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    addSymptom(type, severity[0], notes);
    showSuccess("Symptom logged. We'll correlate this with your recent meals.");
    setNotes('');
    setSeverity([5]);
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-400" />
          Log Symptoms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {SYMPTOM_TYPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setType(s.id)}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                type === s.id 
                  ? 'bg-red-500/20 border-red-500 text-white' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="text-[10px] font-bold uppercase">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-slate-400">Severity: {severity[0]}/10</Label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              severity[0] > 7 ? 'bg-red-500/20 text-red-400' : 
              severity[0] > 3 ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-green-500/20 text-green-400'
            }`}>
              {severity[0] > 7 ? 'Severe' : severity[0] > 3 ? 'Moderate' : 'Mild'}
            </span>
          </div>
          <Slider 
            value={severity} 
            onValueChange={setSeverity} 
            max={10} 
            step={1} 
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-400">Notes (Optional)</Label>
          <Textarea 
            placeholder="e.g. Happened right after lying down..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
          />
        </div>

        <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700">
          Save Symptom Log
        </Button>
      </CardContent>
    </Card>
  );
};

export default SymptomLogger;