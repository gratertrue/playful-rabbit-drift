import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, ChevronRight } from 'lucide-react';

const GrowthImpactInfo = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-0 h-auto flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase">Lihat Dampak Pertumbuhan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-cyan-400" />
            Dampak pada Pertumbuhan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Kekurangan Karbohidrat</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 text-cyan-500 shrink-0 mt-0.5" />
                <span>Tubuh akan menggunakan protein sebagai cadangan energi, sehingga protein untuk membangun sel baru berkurang.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 text-cyan-500 shrink-0 mt-0.5" />
                <span>Proses pembentukan jaringan tubuh (termasuk tinggi badan) melambat.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 text-cyan-500 shrink-0 mt-0.5" />
                <span>Aktivitas fisik dan kemampuan belajar menurun, menghambat potensi pertumbuhan optimal.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Kekurangan Protein</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 text-blue-500 shrink-0 mt-0.5" />
                <span>Pembentukan otot, tulang, dan organ terhambat.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 text-blue-500 shrink-0 mt-0.5" />
                <span>Produksi hormon pertumbuhan (growth hormone) terganggu.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight className="h-3 w-3 text-blue-500 shrink-0 mt-0.5" />
                <span>Regenerasi sel melambat, termasuk pertumbuhan rambut, kulit, dan kuku.</span>
              </li>
            </ul>
          </section>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 italic text-center">
              "Pertumbuhan optimal membutuhkan keseimbangan energi dan bahan baku sel yang cukup setiap hari."
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrowthImpactInfo;