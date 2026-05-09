'use client';
import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { initGemini } from '@/lib/aiService';
import HomeScreen       from '@/components/screens/HomeScreen';
import DescribeScreen   from '@/components/screens/DescribeScreen';
import AnalyzingScreen  from '@/components/screens/AnalyzingScreen';
import AiGuidanceScreen from '@/components/screens/AiGuidanceScreen';
import GuidanceScreen   from '@/components/screens/GuidanceScreen';
import ReportScreen     from '@/components/screens/ReportScreen';

export default function Page() {
  const { screen, geminiReady, setGeminiReady } = useApp();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (key && !geminiReady) {
      initGemini(key);
      setGeminiReady(true);
    }
  }, []);

  // Show a simple loading state until Gemini is ready
  if (!geminiReady) {
    return (
      <main className="page-loading">
        <div className="page-loading__spinner" />
        <p>Initialising AI agent...</p>
      </main>
    );
  }

  return (
    <>
      {screen === 'home'                      && <HomeScreen />}
      {screen === 'describe'                  && <DescribeScreen />}
      {screen === 'analyzing'                 && <AnalyzingScreen />}
      {(screen as string) === 'ai-guidance'   && <AiGuidanceScreen />}
      {screen === 'guidance'                  && <GuidanceScreen />}
      {screen === 'report'                    && <ReportScreen />}
    </>
  );
}