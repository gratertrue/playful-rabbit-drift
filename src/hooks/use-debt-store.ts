import { useState, useEffect } from 'react';

export interface Debt {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  dueDate: string;
  category: 'credit_card' | 'loan' | 'mortgage' | 'other';
}

export type PayoffStrategy = 'snowball' | 'avalanche';

export function useDebtStore() {
  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('debt_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [strategy, setStrategy] = useState<PayoffStrategy>(() => {
    return (localStorage.getItem('debt_strategy') as PayoffStrategy) || 'snowball';
  });

  useEffect(() => {
    localStorage.setItem('debt_data', JSON.stringify(debts));
    localStorage.setItem('debt_strategy', strategy);
  }, [debts, strategy]);

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt = { ...debt, id: Math.random().toString(36).substr(2, 9) };
    setDebts(prev => [...prev, newDebt]);
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const getSortedDebts = () => {
    if (strategy === 'snowball') {
      return [...debts].sort((a, b) => a.amount - b.amount);
    }
    return [...debts].sort((a, b) => b.interestRate - a.interestRate);
  };

  const totalDebt = debts.reduce((acc, d) => acc + d.amount, 0);
  const avgInterest = debts.length > 0 
    ? debts.reduce((acc, d) => acc + d.interestRate, 0) / debts.length 
    : 0;

  return { 
    debts, 
    addDebt, 
    deleteDebt, 
    updateDebt, 
    strategy, 
    setStrategy, 
    getSortedDebts,
    totalDebt,
    avgInterest
  };
}