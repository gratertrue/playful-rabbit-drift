import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useDebtStore, Debt } from '@/hooks/use-debt-store';
import { Wallet, Plus, Trash2, TrendingDown, Percent, Calendar, ArrowDownWideNarrow, ArrowUpWideNarrow, PiggyBank } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DebtDashboard = () => {
  const { debts, addDebt, deleteDebt, strategy, setStrategy, getSortedDebts, totalDebt, avgInterest } = useDebtStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDebt, setNewDebt] = useState<Omit<Debt, 'id'>>({
    name: '',
    amount: 0,
    interestRate: 0,
    dueDate: '',
    category: 'credit_card'
  });

  const handleAdd = () => {
    if (!newDebt.name || newDebt.amount <= 0) return;
    addDebt(newDebt);
    setIsAddOpen(false);
    setNewDebt({ name: '', amount: 0, interestRate: 0, dueDate: '', category: 'credit_card' });
    showSuccess("Debt added to your portfolio");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800 border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 uppercase flex items-center gap-2">
              <Wallet className="h-3 w-3" /> Total Debt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">${totalDebt.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 uppercase flex items-center gap-2">
              <Percent className="h-3 w-3" /> Avg Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{avgInterest.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-slate-500 uppercase flex items-center gap-2">
              <PiggyBank className="h-3 w-3" /> Payoff Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button 
              variant={strategy === 'snowball' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setStrategy('snowball')}
              className="text-[10px] h-7"
            >
              Snowball
            </Button>
            <Button 
              variant={strategy === 'avalanche' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setStrategy('avalanche')}
              className="text-[10px] h-7"
            >
              Avalanche
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-400" />
          Your Debts (Sorted by {strategy})
        </h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" /> Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Debt Name</Label>
                <Input 
                  placeholder="e.g. Chase Sapphire" 
                  value={newDebt.name}
                  onChange={e => setNewDebt({...newDebt, name: e.target.value})}
                  className="bg-slate-900 border-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input 
                    type="number"
                    value={newDebt.amount}
                    onChange={e => setNewDebt({...newDebt, amount: Number(e.target.value)})}
                    className="bg-slate-900 border-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input 
                    type="number"
                    value={newDebt.interestRate}
                    onChange={e => setNewDebt({...newDebt, interestRate: Number(e.target.value)})}
                    className="bg-slate-900 border-slate-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newDebt.category} onValueChange={(v: any) => setNewDebt({...newDebt, category: v})}>
                  <SelectTrigger className="bg-slate-900 border-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="loan">Personal Loan</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} className="w-full bg-red-600 hover:bg-red-700">Save Debt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {getSortedDebts().map((debt, idx) => (
          <Card key={debt.id} className="bg-slate-900/50 border-slate-800 group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                  <h4 className="text-white font-medium">{debt.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">{debt.category.replace('_', ' ')}</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Wallet className="h-3 w-3" /> ${debt.amount.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Percent className="h-3 w-3" /> {debt.interestRate}%
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => deleteDebt(debt.id)}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {debts.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
            No debts logged. Start your payoff journey today.
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtDashboard;