'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type EmergencyType =
  | 'bleeding' | 'burns' | 'fracture' | 'heart-attack'
  | 'choking'  | 'fainting' | 'seizure' | 'snake-bite';

export type StepStatus = 'done' | 'progress' | 'pending';
export type AppScreen  = 'home' | 'describe' | 'analyzing' | 'ai-guidance' | 'report';

export interface ParsedResponse {
  status: 'instruction' | 'escalate' | 'complete' | 'error';
  instruction: string;
  check: string;
  raw: string;
}

interface AppState {
  screen: AppScreen;
  selected: EmergencyType | null;
  description: string;
  stepStatuses: Record<number, StepStatus>;
  patientStatus: 'yes' | 'no' | null;
  reportTime: string;
  geminiReady: boolean;
  aiResponse: ParsedResponse | null;
  aiLoading: boolean;
  aiError: string | null;
  stepHistory: string[];
}

interface AppContextValue extends AppState {
  setScreen: (s: AppScreen) => void;
  setSelected: (t: EmergencyType | null) => void;
  setDescription: (d: string) => void;
  setStepStatus: (i: number, s: StepStatus) => void;
  setPatientStatus: (s: 'yes' | 'no') => void;
  setGeminiReady: (v: boolean) => void;
  setAiResponse: (r: ParsedResponse | null) => void;
  setAiLoading: (v: boolean) => void;
  setAiError: (e: string | null) => void;
  pushStepHistory: (s: string) => void;
  resetAll: () => void;
}

// At the top of store.tsx, before defaultState:
const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY ?? '';

const defaultState: AppState = {
  screen: 'home',
  selected: null,
  description: '',
  stepStatuses: {},
  patientStatus: null,
  reportTime: '',
  geminiReady: !!GROQ_KEY,  
  aiResponse: null,
  aiLoading: false,
  aiError: null,
  stepHistory: [],
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const set = <K extends keyof AppState>(k: K, v: AppState[K]) => setState(s => ({ ...s, [k]: v }));

  return (
    <AppContext.Provider value={{
      ...state,
      setScreen:      v => set('screen', v),
      setSelected:    v => set('selected', v),
      setDescription: v => set('description', v),
      setStepStatus:  (i, status) => setState(s => ({ ...s, stepStatuses: { ...s.stepStatuses, [i]: status } })),
      setPatientStatus: ps => setState(s => ({
        ...s, patientStatus: ps,
        reportTime: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      })),
      setGeminiReady: v => set('geminiReady', v),
      setAiResponse:  v => set('aiResponse', v),
      setAiLoading:   v => set('aiLoading', v),
      setAiError:     v => set('aiError', v),
      pushStepHistory: s => setState(prev => ({ ...prev, stepHistory: [...prev.stepHistory, s] })),
      resetAll: () => setState(defaultState),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be within AppProvider');
  return ctx;
}