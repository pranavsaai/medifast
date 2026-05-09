'use client';
// lib/store.tsx — app-wide state including Gemini session state

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EmergencyType, StepStatus } from './emergencyData';
import { ParsedResponse } from './aiService';

export type AppScreen = 'home' | 'describe' | 'analyzing' | 'guidance' | 'report';

interface AppState {
  // ── Navigation ─────────────────────────────────────────────────────────────
  screen: AppScreen;

  // ── Emergency selection ────────────────────────────────────────────────────
  selected: EmergencyType | null;
  description: string;

  // ── Step tracking (static first-aid cards) ────────────────────────────────
  stepStatuses: Record<number, StepStatus>;
  patientStatus: 'yes' | 'no' | null;
  reportTime: string;

  // ── Gemini AI state ────────────────────────────────────────────────────────
  apiKey: string;
  geminiReady: boolean;                // true once initGemini() called
  aiResponse: ParsedResponse | null;   // latest parsed Gemini response
  aiLoading: boolean;
  aiError: string | null;
}

interface AppContextValue extends AppState {
  setScreen: (s: AppScreen) => void;
  setSelected: (t: EmergencyType | null) => void;
  setDescription: (d: string) => void;
  setStepStatus: (i: number, s: StepStatus) => void;
  setPatientStatus: (s: 'yes' | 'no') => void;

  // Gemini setters
  setApiKey: (k: string) => void;
  setGeminiReady: (v: boolean) => void;
  setAiResponse: (r: ParsedResponse | null) => void;
  setAiLoading: (v: boolean) => void;
  setAiError: (e: string | null) => void;

  resetAll: () => void;
}

const defaultState: AppState = {
  screen: 'home',
  selected: null,
  description: '',
  stepStatuses: {},
  patientStatus: null,
  reportTime: '',
  apiKey: '',
  geminiReady: false,
  aiResponse: null,
  aiLoading: false,
  aiError: null,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const set = <K extends keyof AppState>(key: K, val: AppState[K]) =>
    setState(s => ({ ...s, [key]: val }));

  const setStepStatus = (i: number, status: StepStatus) =>
    setState(s => ({ ...s, stepStatuses: { ...s.stepStatuses, [i]: status } }));

  const setPatientStatus = (patientStatus: 'yes' | 'no') =>
    setState(s => ({
      ...s,
      patientStatus,
      reportTime: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    }));

  return (
    <AppContext.Provider value={{
      ...state,
      setScreen:      (v) => set('screen', v),
      setSelected:    (v) => set('selected', v),
      setDescription: (v) => set('description', v),
      setStepStatus,
      setPatientStatus,
      setApiKey:      (v) => set('apiKey', v),
      setGeminiReady: (v) => set('geminiReady', v),
      setAiResponse:  (v) => set('aiResponse', v),
      setAiLoading:   (v) => set('aiLoading', v),
      setAiError:     (v) => set('aiError', v),
      resetAll:       () => setState(defaultState),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}