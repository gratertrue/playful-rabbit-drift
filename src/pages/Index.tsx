import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NutritionDashboard from '@/components/NutritionDashboard';
import FoodSearch from '@/components/FoodSearch';
import { useNutritionStore } from '@/hooks/use-nutrition-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { showSuccess } from '@/utils/toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, setProfile, achievements } = useNutritionStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NutritionDashboard />;
      case 'search':
        return <FoodSearch />;
      case 'profile':
        return (
          <Card className="bg-slate-900/50 border-slate-800 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white">User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400">Name</Label>
                  <Input 
                    value={profile.name} 
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Calorie Goal</Label>
                  <Input 
                    type="number"
                    value={profile.calorieGoal} 
                    onChange={e => setProfile({...profile, calorieGoal: Number(e.target.value)})}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <Button onClick={() => showSuccess("Profile updated!")} className="w-full bg-cyan-600">Save Changes</Button>
            </CardContent>
          </Card>
        );
      case 'achievements':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map(a => (
              <Card key={a.id} className={`bg-slate-900/50 border-slate-800 ${a.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-4xl mb-2">{a.icon}</div>
                  <h3 className="text-white font-bold">{a.title}</h3>
                  <p className="text-xs text-slate-400">{a.description}</p>
                  {a.unlocked && <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Unlocked</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p>This feature is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-cyan-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome back, {profile.name}!</h2>
            <p className="text-slate-400">Track your nutrition and reach your goals.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Level 12</p>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1">
                <div className="w-3/4 h-full bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {profile.name[0]}
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default Index;