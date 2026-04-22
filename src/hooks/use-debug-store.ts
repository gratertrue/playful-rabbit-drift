import { create } from 'zustand';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
}

interface DebugStore {
  logs: LogEntry[];
  isDebugMode: boolean;
  addLog: (type: 'error' | 'warn' | 'info', message: string, stack?: string) => void;
  clearLogs: () => void;
  toggleDebugMode: () => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
  logs: [],
  isDebugMode: localStorage.getItem('debug_mode') === 'true',
  addLog: (type, message, stack) => set((state) => ({
    logs: [{
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      stack
    }, ...state.logs].slice(0, 50) // Simpan 50 log terakhir
  })),
  clearLogs: () => set({ logs: [] }),
  toggleDebugMode: () => set((state) => {
    const next = !state.isDebugMode;
    localStorage.setItem('debug_mode', String(next));
    return { isDebugMode: next };
  }),
}));

// Global Error Listener
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    useDebugStore.getState().addLog('error', String(message), error?.stack);
  };

  window.onunhandledrejection = (event) => {
    useDebugStore.getState().addLog('error', `Promise Rejected: ${event.reason}`);
  };
}