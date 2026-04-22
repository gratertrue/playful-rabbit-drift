import React, { useState } from 'react';
import { useDebugStore } from '@/hooks/use-debug-store';
import { Bug, X, Trash2, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

const DebugOverlay = () => {
  const { logs, isDebugMode, clearLogs, addLog } = useDebugStore();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isDebugMode) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-0 z-[9999] bg-red-600 text-white p-2 rounded-l-full shadow-lg animate-pulse flex items-center gap-2"
      >
        <Bug className="h-4 w-4" />
        <span className="text-[10px] font-bold pr-1">DEBUG</span>
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/95 flex flex-col animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-cyan-400" />
              <h2 className="font-bold text-white">System Logs (Mobile Debug)</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={clearLogs} className="text-slate-400">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center py-20 text-slate-600">
                  <Bug className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Belum ada log yang tercatat.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div 
                    key={log.id} 
                    className={cn(
                      "p-3 rounded-lg border text-[11px] font-mono break-all",
                      log.type === 'error' ? "bg-red-500/10 border-red-500/30 text-red-400" :
                      log.type === 'warn' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                      "bg-slate-800/50 border-slate-700 text-slate-300"
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="opacity-50">[{log.timestamp}]</span>
                      <button 
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                        className="shrink-0"
                      >
                        {expandedId === log.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                    <div className="mt-1 font-bold">{log.message}</div>
                    {expandedId === log.id && log.stack && (
                      <pre className="mt-2 p-2 bg-black/50 rounded text-[9px] overflow-x-auto whitespace-pre-wrap">
                        {log.stack}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500">
            Device: {navigator.userAgent}
          </div>
        </div>
      )}
    </>
  );
};

export default DebugOverlay;