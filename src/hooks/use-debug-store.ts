import { useState, useEffect } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
}

// State internal sederhana tanpa zustand
let logs: LogEntry[] = [];
let isDebugMode = localStorage.getItem('debug_mode') === 'true';
const listeners = new Set<() => void>();

const notify = () => listeners.forEach(l => l());

export const debugStore = {
  getLogs: () => logs,
  getIsDebugMode: () => isDebugMode,
  addLog: (type: 'error' | 'warn' | 'info', message: string, stack?: string) => {
    logs = [{
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      stack
    }, ...logs].slice(0, 50);
    notify();
  },
  clearLogs: () => {
    logs = [];
    notify();
  },
  toggleDebugMode: () => {
    isDebugMode = !isDebugMode;
    localStorage.setItem('debug_mode', String(isDebugMode));
    notify();
  }
};

// Hook untuk digunakan di komponen
export function useDebugStore() {
  const [state, setState] = useState({
    logs: debugStore.getLogs(),
    isDebugMode: debugStore.getIsDebugMode()
  });

  useEffect(() => {
    const listener = () => {
      setState({
        logs: debugStore.getLogs(),
        isDebugMode: debugStore.getIsDebugMode()
      });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    ...state,
    addLog: debugStore.addLog,
    clearLogs: debugStore.clearLogs,
    toggleDebugMode: debugStore.toggleDebugMode
  };
}

// Global Error Listener
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    debugStore.addLog('error', String(message), error?.stack);
  };

  window.onunhandledrejection = (event) => {
    debugStore.addLog('error', `Promise Rejected: ${event.reason}`);
  };
}