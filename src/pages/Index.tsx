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
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';
import { Scale, User as UserIcon, Activity, Utensils, Calendar, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, setProfile, achievements, calculateBMI, calculateRecommendedCalories } = useNutritionStore();

  const handleAutoCalorie = () => {
    const recommended = calculateRecommendedCalories();
    setProfile({ ...profile, calorieGoal: recommended });
    showSuccess(`Target kalori diperbarui menjadi ${recommended} kkal!`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {/* Left Column: Main Stats & Analysis */}
            <div className="lg:col-span-8 space-y-2">
              <NutritionDashboard />
            </div>
            
            {/* Right Column: Trackers & Goals */}
            <div className="lg:col-span-4 space-y-2">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                <SleepTracker />
                <WaterTracker />
              </div>
              <Goals />
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <CardContent className="p-2 flex items-center justify-around">
                  <Button variant="ghost" onClick={() => setActiveTab('recipes')} className="flex flex-col gap-0.5 h-auto py-1 text-slate-400 hover:text-cyan-400">
                    <Utensils className="h-3.5 w-3.5" />
                    <span className="text-[8px] uppercase font-bold">Resep</span>
                  </Button>
                  <div className="w-px h-4 bg-slate-800" />
                  <Button variant="ghost" onClick={() => setActiveTab('planner')} className="flex flex-col gap-0.5 h-auto py-1 text-slate-400 hover:text-cyan-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[8px] uppercase font-bold">Rencana</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'search': return <FoodSearch />;
      case 'recipes': return <RecipeBuilder />;
      case 'planner': return <MealPlanner />;
      case 'hydration': return <div className="max-w-xl mx-auto"><WaterTracker /></div>;
      case 'history': return <NutritionHistory />;
      case 'profile':
        return (
          <div className="space-y-3 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-2">
              <Card className="bg-slate-900/50 border-slate-800 border-t-2 border-t-cyan-500 p-2 text-center">
                <Scale className="h-4 w-4 text-cyan-400 mx-auto mb-0.5" />
                <p className="text-[8px] text-slate-500 uppercase font-bold">BMI</p>
                <p className="text-lg font-black text-white">{calculateBMI()}</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 p-2 text-center">
                <Activity className="h-4 w-4 text-orange-400 mx-auto mb-0.5" />
                <p className="text-[8px] text-slate-500 uppercase font-bold">Aktivitas</p>
                <p className="text-[10px] font-bold text-white truncate capitalize">{profile.activityLevel.replace('_', ' ')}</p>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 p-2 text-center">
                <UserIcon className="h-4 w-4 text-purple-400 mx-auto mb-0.5" />
                <p className="text-[8px] text-slate-500 uppercase font-bold">Usia</p>
                <p className="text-lg font-bold text-white">{profile.age}</p>
              </Card>
            </div>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label className="text-[9px] text-slate-500 uppercase">Nama</Label>
                    <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="h-7 bg-slate-800 border-slate-700 text-xs" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[9px] text-slate-500 uppercase">Berat (kg)</Label>
                    <Input type="number" value={profile.weight} onChange={e => setProfile({...profile, weight: Number(e.target.value)})} className="h-7 bg-slate-800 border-slate-700 text-xs" />
                  </div>
                </div>
                <Button onClick={() => showSuccess("Profil disimpan!")} className="w-full bg-cyan-600 hover:bg-cyan-700 h-8 text-xs font-bold">Simpan</Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'achievements':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {achievements.map(a => (
              <Card key={a.id} className={cn(
                "bg-slate-900/50 border-slate-800 p-3 text-center transition-all",
                a.unlocked ? 'opacity-100 border-cyan-500/30' : 'opacity-30 grayscale'
              )}>
                <div className="text-xl mb-0.5">{a.icon}</div>
                <h3 className="text-[10px] font-bold text-white truncate">{a.title}</h3>
              </Card>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-cyan-500/30">
      <OnboardingGuide onComplete={() => setActiveTab('profile')} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-2 md:p-4 overflow-y-auto pb-16 md:pb-4">
        <header className="flex justify-between items-center mb-2 px-1">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-base md:text-lg font-bold text-white leading-tight">Halo, {profile.name}!</h2>
            <p className="text-[8px] text-slate-500 uppercase tracking-wider">Ringkasan Nutrisi</p>
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
            transition={{ duration: 0.1 }}
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