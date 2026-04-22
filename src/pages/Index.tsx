"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import NutritionDashboard from '@/components/NutritionDashboard';
import FoodSearch from '@/components/FoodSearch';
import RecipeBuilder from '@/components/RecipeBuilder';
import MealPlanner from '@/components/MealPlanner';
import NutritionHistory from '@/components/NutritionHistory';
import WaterTracker from '@/components/WaterTracker';
import SleepTracker from '@/components/SleepTracker';
import Goals from '@/components/Goals';
import OnboardingGuide from '@/components/OnboardingGuide';
import DebugOverlay from '@/components/DebugOverlay';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { useDebugStore } from '@/hooks/use-debug-store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess } from '@/utils/toast';
import { Scale, User as UserIcon, Activity, Utensils, Calendar, Calculator, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, setProfile, achievements, calculateBMI, calculateRecommendedCalories } = useNutritionStore();
  const { isDebugMode, toggleDebugMode } = useDebugStore();

  const handleAutoCalorie = () => {
    const recommended = calculateRecommendedCalories();
    setProfile({ ...profile, calorieGoal: recommended });
    showSuccess(`Target kalori diperbarui menjadi ${recommended} kkal!`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SleepTracker />
              <WaterTracker />
              <Goals />
            </div>
            <NutritionDashboard />
          </div>
        );
      case 'search':
        return <FoodSearch />;
      case 'recipes':
        return <RecipeBuilder />;
      case 'planner':
        return <MealPlanner />;
      case 'history':
        return <NutritionHistory />;
      case 'profile':
        return (
          <div className="space-y-3 max-w-4xl mx-auto pb-10">
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-slate-900/50 border-slate-800 border-t-2 border-t-cyan-500 p-2 text-center">
                <Scale className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                <p className="text-[8px] text-slate-500 uppercase font-bold">BMI</p>
                <p className="text-lg font-black text-white">{calculateBMI()}</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 p-2 text-center">
                <Activity className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                <p className="text-[8px] text-slate-500 uppercase font-bold">Aktivitas</p>
                <p className="text-[10px] font-bold text-white truncate capitalize">{profile.activityLevel.replace('_', ' ')}</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 p-2 text-center">
                <UserIcon className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                <p className="text-[8px] text-slate-500 uppercase font-bold">Usia</p>
                <p className="text-lg font-bold text-white">{profile.age}</p>
              </Card>
            </div>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-500 uppercase font-bold">Nama Lengkap</Label>
                    <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="h-9 bg-slate-800 border-slate-700 text-sm" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-500 uppercase font-bold">Umur</Label>
                      <Input type="number" value={profile.age} onChange={e => setProfile({...profile, age: Number(e.target.value)})} className="h-9 bg-slate-800 border-slate-700 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-500 uppercase font-bold">Gender</Label>
                      <Select value={profile.gender} onValueChange={(val: any) => setProfile({...profile, gender: val})}>
                        <SelectTrigger className="h-9 bg-slate-800 border-slate-700 text-sm">
                          <SelectValue placeholder="Pilih" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                          <SelectItem value="male">Laki-laki</SelectItem>
                          <SelectItem value="female">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-500 uppercase font-bold">Target Kesehatan</Label>
                    <Select value={profile.goal} onValueChange={(val: any) => setProfile({...profile, goal: val})}>
                      <SelectTrigger className="h-9 bg-slate-800 border-slate-700 text-sm">
                        <SelectValue placeholder="Pilih Target" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="weight_loss">Menurunkan Berat Badan</SelectItem>
                        <SelectItem value="maintenance">Menjaga Berat Badan</SelectItem>
                        <SelectItem value="muscle_gain">Membangun Otot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-500 uppercase font-bold">Target Kalori Harian</Label>
                    <div className="flex gap-2">
                      <Input type="number" value={profile.calorieGoal} onChange={e => setProfile({...profile, calorieGoal: Number(e.target.value)})} className="h-9 bg-slate-800 border-slate-700 text-sm" />
                      <Button onClick={handleAutoCalorie} size="sm" variant="outline" className="h-9 px-3 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                        <Calculator className="h-4 w-4 mr-2" />
                        Hitung
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                    <div className="flex items-center gap-3">
                      <Bug className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Mode Debug (Mobile)</p>
                        <p className="text-[10px] text-slate-500">Aktifkan untuk melihat log error di HP.</p>
                      </div>
                    </div>
                    <Switch checked={isDebugMode} onCheckedChange={toggleDebugMode} />
                  </div>
                </div>

                <Button 
                  onClick={() => showSuccess("Profil berhasil diperbarui!")} 
                  className="w-full bg-cyan-600 hover:bg-cyan-700 h-11 text-sm font-bold rounded-xl mt-2"
                >
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-cyan-500/30">
      <OnboardingGuide onComplete={() => setActiveTab('profile')} />
      <DebugOverlay />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-2 md:p-4 overflow-y-auto pb-20 md:pb-4">
        <header className="flex justify-between items-center mb-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-base md:text-lg font-bold text-white">Halo, {profile.name}!</h2>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Ringkasan Nutrisi</p>
          </motion.div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
            {profile.name[0]}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;