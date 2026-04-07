/**
 * ############################################################
 * # MAIN FILE: HTML (JSX) & JAVASCRIPT
 * # This is the heart of the app. It manages what the user sees
 * # and how they interact with the data.
 * ############################################################
 */

import React, { useState, useEffect } from 'react';
import { searchFoods, checkGerdRisk, getNutrient } from '@/lib/usda-api';
import { showSuccess, showError } from '@/utils/toast';
import { Search, Activity, AlertTriangle, User, ShieldAlert, Flame, ChevronRight } from 'lucide-react';

const Index = () => {
  // # STATE: This is where the app 'remembers' things
  const [tab, setTab] = useState('home'); // Current screen
  const [searchQuery, setSearchQuery] = useState(''); // What user is typing
  const [results, setResults] = useState<any[]>([]); // Food search results
  const [logs, setLogs] = useState<any[]>(() => JSON.parse(localStorage.getItem('gerd_logs') || '[]'));
  const [symptoms, setSymptoms] = useState<any[]>(() => JSON.parse(localStorage.getItem('gerd_symptoms') || '[]'));
  const [accepted, setAccepted] = useState(() => localStorage.getItem('gerd_accepted') === 'true');

  // # SAVE DATA: Automatically save to phone memory when things change
  useEffect(() => {
    localStorage.setItem('gerd_logs', JSON.stringify(logs));
    localStorage.setItem('gerd_symptoms', JSON.stringify(symptoms));
    localStorage.setItem('gerd_accepted', accepted.toString());
  }, [logs, symptoms, accepted]);

  // # LOGIC: Handle searching for food
  const handleSearch = async () => {
    if (!searchQuery) return;
    const data = await searchFoods(searchQuery);
    setResults(data);
  };

  // # LOGIC: Add a food to the daily log
  const logFood = (food: any) => {
    setLogs([...logs, { name: food.description, time: Date.now() }]);
    showSuccess("Food logged!");
    setResults([]);
    setSearchQuery('');
  };

  // # LOGIC: Add a symptom (like Heartburn)
  const logSymptom = (type: string) => {
    setSymptoms([...symptoms, { type, time: Date.now(), severity: 5 }]);
    showSuccess(`${type} logged. Checking for triggers...`);
    setTab('triggers');
  };

  // # LOGIC: Find which foods were eaten before symptoms
  const getTriggers = () => {
    const found: any = {};
    symptoms.forEach(s => {
      // Look at foods eaten 4 hours before the symptom
      const window = s.time - (4 * 60 * 60 * 1000);
      logs.filter(l => l.time >= window && l.time <= s.time).forEach(l => {
        found[l.name] = (found[l.name] || 0) + 1;
      });
    });
    return Object.entries(found).sort((a: any, b: any) => b[1] - a[1]);
  };

  // # HTML: Medical Disclaimer (Shows first)
  if (!accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card text-center max-w-md">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Medical Disclaimer</h2>
          <p className="text-slate-400 mb-6">This app is for tracking only. It does not provide medical advice. Consult a doctor for health issues.</p>
          <button onClick={() => setAccepted(true)} className="btn-red">I Accept</button>
        </div>
      </div>
    );
  }

  // # HTML: Main App Layout
  return (
    <div className="max-w-lg mx-auto p-4 pb-24">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-black text-white">GERD<span className="text-red-500">INTEL</span></h1>
          <p className="text-xs text-slate-500">Trigger Tracker</p>
        </div>
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold">U</div>
      </header>

      {/* # SCREEN: Home Dashboard */}
      {tab === 'home' && (
        <div className="animate-in fade-in duration-500">
          <div className="glass-card flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-2xl"><Activity className="text-red-500" /></div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
              <p className="text-white">Feeling Good Today</p>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-4">Recent Logs</h3>
          {logs.slice(-3).reverse().map((l, i) => (
            <div key={i} className="glass-card !p-4 !mb-2 text-sm">{l.name}</div>
          ))}
        </div>
      )}

      {/* # SCREEN: Food Search */}
      {tab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              className="input-dark" 
              placeholder="Search food..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="bg-red-600 p-3 rounded-xl"><Search /></button>
          </div>
          {results.map((f, i) => {
            const risk = checkGerdRisk(f);
            return (
              <div key={i} className="glass-card !p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{f.description}</p>
                  <p className={`text-[10px] font-bold ${risk.color}`}>{risk.level} Risk: {risk.reason}</p>
                </div>
                <button onClick={() => logFood(f)} className="text-red-500"><ChevronRight /></button>
              </div>
            );
          })}
        </div>
      )}

      {/* # SCREEN: Symptom Logger */}
      {tab === 'symptoms' && (
        <div className="grid grid-cols-2 gap-4">
          {['Heartburn', 'Bloating', 'Nausea', 'Chest Pain'].map(s => (
            <button key={s} onClick={() => logSymptom(s)} className="glass-card hover:border-red-500 transition-all">
              <Flame className="mx-auto mb-2 text-red-500" />
              <p className="text-center font-bold">{s}</p>
            </button>
          ))}
        </div>
      )}

      {/* # SCREEN: Trigger Analysis */}
      {tab === 'triggers' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Suspected Triggers</h3>
          {getTriggers().length === 0 ? (
            <p className="text-slate-500 text-center py-10">Log more data to see patterns.</p>
          ) : (
            getTriggers().map(([name, count]: any) => (
              <div key={name} className="glass-card !p-4 flex justify-between">
                <span className="text-sm">{name}</span>
                <span className="text-red-500 font-bold">{count}x</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* # NAVIGATION: Bottom Bar */}
      <nav className="bottom-nav">
        <button onClick={() => setTab('home')} className={tab === 'home' ? 'text-red-500' : 'text-slate-500'}><Activity /></button>
        <button onClick={() => setTab('search')} className={tab === 'search' ? 'text-red-500' : 'text-slate-500'}><Search /></button>
        <button onClick={() => setTab('symptoms')} className={tab === 'symptoms' ? 'text-red-500' : 'text-slate-500'}><Flame /></button>
        <button onClick={() => setTab('triggers')} className={tab === 'triggers' ? 'text-red-500' : 'text-slate-500'}><AlertTriangle /></button>
      </nav>
    </div>
  );
};

export default Index;