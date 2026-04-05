import { useState, useEffect } from 'react';
import { FoodItem, getNutrientValue } from '@/lib/usda-api';
import confetti from 'canvas-confetti';

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  calorieGoal: number;
  proteinGoal: number;
  waterGoal: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  hasAcceptedDisclaimer: boolean;
}

export interface LogEntry {
  id: string;
  food: FoodItem;
  amount: number;
  timestamp: number;
}

export interface SymptomEntry {
  id: string;
  type: 'heartburn' | 'regurgitation' | 'chest_pain' | 'bloating' | 'nausea';
  severity: number; // 0-10
  timestamp: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: { food: FoodItem; amount: number }[];
}

const INITIAL_PROFILE: UserProfile = {
  name: "User",
  weight: 70,
  height: 175,
  age: 25,
  gender: 'male',
  activityLevel: 'moderate',
  calorieGoal: 2000,
  proteinGoal: 150,
  waterGoal: 2500,
  goal: 'maintenance',
  hasAcceptedDisclaimer: false,
};

export function useNutritionStore() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gerd_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('gerd_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(() => {
    const saved = localStorage.getItem('gerd_symptoms');
    return saved ? JSON.parse(saved) : [];
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('gerd_recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [waterIntake, setWaterIntake] = useState(() => Number(localStorage.getItem('gerd_water') || 0));

  useEffect(() => {
    localStorage.setItem('gerd_profile', JSON.stringify(profile));
    localStorage.setItem('gerd_logs', JSON.stringify(logs));
    localStorage.setItem('gerd_symptoms', JSON.stringify(symptoms));
    localStorage.setItem('gerd_recipes', JSON.stringify(recipes));
    localStorage.setItem('gerd_water', waterIntake.toString());
  }, [profile, logs, symptoms, recipes, waterIntake]);

  const addLog = (food: FoodItem, amount: number) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      food,
      amount,
      timestamp: Date.now(),
    };
    setLogs(prev => [...prev, newLog]);
  };

  const addSymptom = (type: SymptomEntry['type'], severity: number, notes?: string) => {
    const newSymptom: SymptomEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      severity,
      timestamp: Date.now(),
      notes,
    };
    setSymptoms(prev => [...prev, newSymptom]);
    if (severity > 7) confetti({ colors: ['#ef4444'] }); // Alert style confetti
  };

  const addWater = (amount: number) => setWaterIntake(prev => prev + amount);

  const getSuspectedTriggers = () => {
    const triggers: Record<string, { count: number; avgSeverity: number }> = {};
    
    symptoms.forEach(symptom => {
      // Look for food logged in the 4 hours before the symptom
      const windowStart = symptom.timestamp - (4 * 60 * 60 * 1000);
      const relevantLogs = logs.filter(l => l.timestamp >= windowStart && l.timestamp <= symptom.timestamp);
      
      relevantLogs.forEach(log => {
        const name = log.food.description;
        if (!triggers[name]) triggers[name] = { count: 0, avgSeverity: 0 };
        triggers[name].count += 1;
        triggers[name].avgSeverity = (triggers[name].avgSeverity + symptom.severity) / 2;
      });
    });

    return Object.entries(triggers)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return { 
    profile, setProfile, 
    logs, addLog, 
    symptoms, addSymptom,
    recipes, setRecipes,
    waterIntake, addWater, setWaterIntake,
    getSuspectedTriggers
  };
}