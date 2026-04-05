import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import NutritionDashboard from '@/components/NutritionDashboard';
import FoodSearch from '@/components/FoodSearch';
import SymptomLogger from '@/components/SymptomLogger';
import TriggerDashboard from '@/components/TriggerDashboard';
import NutritionHistory from '@/components/NutritionHistory';
import WaterTracker from '@/components/WaterTracker';
import SmartCoach from '@/components/SmartCoach';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess } from '@/utils/toast';
import { Scale, User as UserIcon, Activity, AlertTriangle, Moon, Footprints, Play, Square, Calculator, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, setProfile, calculateBMI, wearableData, toggleSleep, calculateRecommendedCalories } = useNutritionStore();

  if (!profile.hasAcceptedDisclaimer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F172A]">
        <Card className="max-w-md bg-slate-900 border-slate-800">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-white text-2xl">Medical Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-slate-400 leading-relaxed text-center">
              This app is for informational purposes only and does not replace professional medical advice. 
              Always consult your physician before making dietary changes or if you experience severe symptoms.
            </p>
            <Button 
              onClick={() => setProfile({ ...profile, hasAcceptedDisclaimer: true })}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              I Understand & Accept
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <Activity className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Quick Log</p>
                    <Button variant="link" onClick={() => setActiveTab('symptoms')} className="p-0 h-auto text-red-400 text-sm">Add Symptom</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Trigger Check</p>
                    <Button variant="link" onClick={() => setActiveTab('triggers')} className="p-0 h-auto text-amber-400 text-sm">View Analysis</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <Footprints className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Steps</p>
                    <p className="text-xl font-bold text-white">{wearableData.steps.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NutritionDashboard />
              </div>
              <div className="space-y-6">
                <WaterTracker />
                <SmartCoach />
              </div>
            </div>
          </div>
        );
      case 'search': return <FoodSearch />;
      case 'symptoms': return <SymptomLogger />;
      case 'triggers': return <TriggerDashboard />;
      case 'hydration': return <div className="max-w-2xl mx-auto"><WaterTracker /></div>;
      case 'history': return <NutritionHistory />;
      case 'profile':
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-slate-800 border-t-4 border-t-red-500">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Scale className="h-8 w-8 text-red-400 mb-2" />
                  <p className="text-xs text-slate-500 uppercase font-bold">BMI Calculator</p>
                  <p className="text-4xl font-black text-white my-2">{calculateBMI()}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Activity className="h-8 w-8 text-orange-400 mb-2" />
                  <p className="text-xs text-slate-500 uppercase">Activity Level</p>
                  <p className="text-xl font-bold text-white capitalize">{profile.activityLevel.replace('_', ' ')}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <UserIcon className="h-8 w-8 text-purple-400 mb-2" />
                  <p className="text-xs text-slate-500 uppercase">Age / Gender</p>
                  <p className="text-xl font-bold text-white">{profile.age} / {profile.gender}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader><CardTitle className="text-white">Biometric Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Name</Label>
                    <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Weight (kg)</Label>
                    <Input type="number" value={profile.weight} onChange={e => setProfile({...profile, weight: Number(e.target.value)})} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Height (cm)</Label>
                    <Input type="number" value={profile.height} onChange={e => setProfile({...profile, height: Number(e.target.value)})} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Age</Label>
                    <Input type="number" value={profile.age} onChange={e => setProfile({...profile, age: Number(e.target.value)})} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                </div>
                <Button onClick={() => showSuccess("Profile updated!")} className="w-full bg-red-600 hover:bg-red-700">Save Changes</Button>
              </CardContent>
            </Card>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-red-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <header className="flex justify-between items-center mb-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white">GERD Tracker</h2>
            <p className="text-sm text-slate-400">Identify triggers and manage symptoms.</p>
          </motion.div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold">
              {profile.name[0]}
            </div>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;