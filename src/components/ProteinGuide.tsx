import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ChevronRight, BookOpen } from 'lucide-react';

const ProteinGuide = () => {
  const data = [
    { group: "Pria Dewasa", range: "62 – 72 gram", source: "IndonesiaBaik.id" },
    { group: "Wanita Dewasa", range: "56 – 69 gram", source: "IndonesiaBaik.id" },
    { group: "Lansia (65+)", range: "58 – 64 gram", source: "NaturalFarm" },
    { group: "Ibu Hamil/Menyusui", range: "70 – 90 gram", source: "Alodokter" },
    { group: "Anak-anak", range: "20 – 40 gram", source: "Dinkes Kalbar" },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <BookOpen className="h-4 w-4 text-blue-400" />
          Referensi Protein Harian
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="space-y-1">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white">{item.group}</span>
                <span className="text-[9px] text-slate-500">{item.source}</span>
              </div>
              <span className="text-[11px] font-black text-blue-400">{item.range}</span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Info className="h-3 w-3 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase">Rumus Cepat (Halodoc)</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Berat Badan (kg) × <span className="text-white font-bold">0,8g</span> (Sedenter) s/d <span className="text-white font-bold">2,0g</span> (Atlet/Otot).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProteinGuide;