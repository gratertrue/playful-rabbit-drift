import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Moon, Play, Square, RotateCcw, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const SleepTracker = () => {
  const { wearableData, toggleSleep, resetSleep } = useNutritionStore();
  const [elapsed, setElapsed] = useState(0);

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h, m, s };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (wearableData.isSleeping && wearableData.sleepStartTime) {
      const update = () => {
        setElapsed(Date.now() - wearableData.sleepStartTime!);
      };
      
      interval = setInterval(update, 1000);
      update();
    } else {
      setElapsed(0);
    }

    return () => clearInterval(interval);
  }, [wearableData.isSleeping, wearableData.sleepStartTime]);

  const current = formatDuration(elapsed);
  const history = wearableData.sleepHistory || [];

  return (
    <Card className={cn(
      "bg-slate-900/50 border-slate-800 backdrop-blur-xl transition-all duration-500 overflow-hidden flex flex-col",
      wearableData.isSleeping && "border-purple-500/50 bg-purple-500/10"
    )}>
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs font-bold text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className={cn("h-3.5 w-3.5", wearableData.isSleeping ? "text-purple-400 animate-pulse" : "text-slate-400")} />
            Pelacak Tidur
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetSleep}
            className="h-6 w-6 text-slate-500 hover:text-red-400"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 pt-0 space-y-3 flex-1 flex flex-col">
        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800 text-center">
          <p className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">
            {wearableData.isSleeping ? "Waktu Berjalan" : "Sesi Terakhir"}
          </p>
          <div className="flex items-baseline justify-center gap-0.5">
            <span className="text-2xl font-black text-white">
              {wearableData.isSleeping ? current.h : Math.floor(wearableData.sleepHours)}
            </span>
            <span className="text-[10px] font-bold text-slate-500 mr-0.5">j</span>
            <span className="text-2xl font-black text-white">
              {wearableData.isSleeping ? current.m : Math.round((wearableData.sleepHours % 1) * 60)}
            </span>
            <span className="text-[10px] font-bold text-slate-500">m</span>
          </div>
        </div>

        <Button 
          onClick={toggleSleep}
          size="sm"
          className={cn(
            "w-full h-9 font-bold rounded-lg transition-all text-xs",
            wearableData.isSleeping 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-purple-600 hover:bg-purple-700 text-white"
          )}
        >
          {wearableData.isSleeping ? (
            <><Square className="h-3 w-3 mr-2 fill-current" /> Berhenti</>
          ) : (
            <><Play className="h-3 w-3 mr-2 fill-current" /> Mulai Tidur</>
          )}
        </Button>

        <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-1.5 text-slate-500 px-1">
            <History className="h-2.5 w-2.5" />
            <span className="text-[9px] uppercase font-bold">Riwayat</span>
          </div>
          <ScrollArea className="flex-1 h-[60px] pr-2">
            <div className="space-y-1">
              {history.length === 0 ? (
                <p className="text-[9px] text-slate-600 text-center py-2 italic">Kosong</p>
              ) : (
                history.map((session) => {
                  const date = new Date(session.endTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                  const h = Math.floor(session.durationHours);
                  const m = Math.round((session.durationHours % 1) * 60);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/30 border border-slate-800/50">
                      <span className="text-[9px] font-medium text-slate-400">{date}</span>
                      <span className="text-[9px] font-bold text-white">{h}j {m}m</span>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTracker;