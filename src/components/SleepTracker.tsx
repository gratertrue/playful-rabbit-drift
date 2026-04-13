import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Moon, Play, Square, RotateCcw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const SleepTracker = () => {
  const { wearableData, toggleSleep, resetSleep } = useNutritionStore();
  const [currentDuration, setCurrentDuration] = useState("0.0");

  // Update durasi secara real-time jika sedang tidur
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (wearableData.isSleeping && wearableData.sleepStartTime) {
      interval = setInterval(() => {
        const diffMs = Date.now() - wearableData.sleepStartTime!;
        const diffHours = (diffMs / (1000 * 60 * 60)).toFixed(1);
        setCurrentDuration(diffHours);
      }, 60000); // Update setiap menit
      
      // Set awal
      const diffMs = Date.now() - wearableData.sleepStartTime!;
      setCurrentDuration((diffMs / (1000 * 60 * 60)).toFixed(1));
    } else {
      setCurrentDuration("0.0");
    }

    return () => clearInterval(interval);
  }, [wearableData.isSleeping, wearableData.sleepStartTime]);

  return (
    <Card className={cn(
      "bg-slate-900/50 border-slate-800 backdrop-blur-xl transition-all duration-500 overflow-hidden relative",
      wearableData.isSleeping && "border-purple-500/50 bg-purple-500/10"
    )}>
      {wearableData.isSleeping && (
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 animate-pulse" />
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-xl transition-colors",
              wearableData.isSleeping ? "bg-purple-500/20" : "bg-slate-800"
            )}>
              <Moon className={cn("h-5 w-5", wearableData.isSleeping ? "text-purple-300 animate-pulse" : "text-slate-400")} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pelacak Tidur</p>
              <p className="text-sm font-bold text-white">
                {wearableData.isSleeping ? "Sedang Tidur..." : "Tidak Aktif"}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetSleep}
            className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
            title="Reset Data Tidur"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] uppercase font-medium">Total Durasi</span>
            </div>
            <p className="text-3xl font-black text-white">
              {wearableData.isSleeping ? currentDuration : wearableData.sleepHours}
              <span className="text-sm font-normal text-slate-500 ml-1">jam</span>
            </p>
          </div>

          <Button 
            onClick={toggleSleep}
            variant={wearableData.isSleeping ? "destructive" : "secondary"}
            className={cn(
              "gap-2 rounded-xl px-4 h-11 font-bold shadow-lg transition-all",
              !wearableData.isSleeping && "bg-purple-600 hover:bg-purple-700 text-white border-none"
            )}
          >
            {wearableData.isSleeping ? (
              <><Square className="h-4 w-4 fill-current" /> Bangun</>
            ) : (
              <><Play className="h-4 w-4 fill-current" /> Mulai Tidur</>
            )}
          </Button>
        </div>

        {wearableData.isSleeping && (
          <p className="text-[9px] text-purple-400 mt-3 text-center font-medium animate-pulse">
            Aplikasi dapat ditutup. Waktu tetap berjalan di latar belakang.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepTracker;