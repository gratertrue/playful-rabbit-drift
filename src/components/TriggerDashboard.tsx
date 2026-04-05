import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { AlertTriangle, TrendingUp, Info, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TriggerDashboard = () => {
  const { getSuspectedTriggers, symptoms } = useNutritionStore();
  const triggers = getSuspectedTriggers();

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      suspectedTriggers: triggers,
      recentSymptoms: symptoms.slice(-10)
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "GERD_Report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-400" />
          Trigger Analysis
        </h2>
        <Button onClick={exportReport} variant="outline" className="border-slate-700 text-slate-400 hover:text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Suspected Triggers
            </CardTitle>
            <p className="text-xs text-slate-500">Foods logged within 4 hours of symptoms</p>
          </CardHeader>
          <CardContent>
            {triggers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                Log more meals and symptoms to see correlations.
              </div>
            ) : (
              <div className="space-y-4">
                {triggers.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                    <div className="flex-1">
                      <p className="text-white font-medium">{t.name}</p>
                      <p className="text-xs text-slate-500">Correlated {t.count} times</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                        Avg Severity: {t.avgSeverity.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-400" />
              Common Triggers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
              <strong>Tip:</strong> High-fat foods relax the lower esophageal sphincter, allowing acid to escape.
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">• Fried & Fatty Foods</li>
              <li className="flex items-center gap-2">• Spicy Seasonings</li>
              <li className="flex items-center gap-2">• Citrus & Tomatoes</li>
              <li className="flex items-center gap-2">• Caffeine & Alcohol</li>
              <li className="flex items-center gap-2">• Peppermint</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriggerDashboard;