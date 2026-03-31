import { useState, useEffect } from 'react';
import { FoodItem, calculateSmartScore } from '@/lib/usda-api';
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
}

export interface LogEntry {
  id: string;
  food: FoodItem;
  amount: number; // in grams
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const INITIAL_PROFILE: UserProfile = {
  name: "Explorer",
  weight: 70,
  height: 175,
  age: 25,
  gender: 'male',
  activityLevel: 'moderate',
  calorieGoal: 2000,
  proteinGoal: 150,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_log', title: 'First Bite', description: 'Log your first food item', icon: '🍎', unlocked: false },
  { id: 'protein_king', title: 'Protein King', description: 'Hit your protein goal', icon: '💪', unlocked: false },
  { id: 'streak_3', title: 'Consistent', description: '3 day logging streak', icon: '🔥', unlocked: false },
];

export function useNutritionStore() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutrition_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('nutrition_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [points, setPoints] = useState(() => Number(localStorage.getItem('nutrition_points') || 0));
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('nutrition_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  useEffect(() => {
    localStorage.setItem('nutrition_profile', JSON.stringify(profile));
    localStorage.setItem('nutrition_logs', JSON.stringify(logs));
    localStorage.setItem('nutrition_points', points.toString());
    localStorage.setItem('nutrition_achievements', JSON.stringify(achievements));
  }, [profile, logs, points, achievements]);

  const addLog = (food: FoodItem, amount: number) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      food,
      amount,
      timestamp: Date.now(),
    };
    setLogs(prev => [...prev, newLog]);
    addPoints(10);
    checkAchievements('first_log');
  };

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
    if (amount >= 50) confetti();
  };

  const checkAchievements = (id: string) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        confetti();
        return { ...a, unlocked: true };
      }
      return a;
    }));
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  return { profile, setProfile, logs, addLog, deleteLog, points, achievements, addPoints };
}