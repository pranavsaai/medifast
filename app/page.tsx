'use client';
import { useApp } from '@/lib/store';
import { initGemini } from '@/lib/aiService';
import HomeScreen       from '@/components/screens/HomeScreen';
import DescribeScreen   from '@/components/screens/DescribeScreen';
import AnalyzingScreen  from '@/components/screens/AnalyzingScreen';
import AiGuidanceScreen from '@/components/screens/AiGuidanceScreen';
import ReportScreen     from '@/components/screens/ReportScreen';

// Initialise Groq SDK at module level — zero delay
const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY ?? '';
if (GROQ_KEY) initGemini(GROQ_KEY);

export default function Page() {
  const { screen, geminiReady } = useApp();

  if (!geminiReady) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)', flexDirection: 'column', gap: 12,
        color: 'var(--red)', fontFamily: 'Sora, sans-serif', fontSize: '0.9rem'
      }}>
        ⚠️ Missing NEXT_PUBLIC_GROQ_API_KEY in .env.local
      </div>
    );
  }

  return (
    <>
      {screen === 'home'                    && <HomeScreen />}
      {screen === 'describe'                && <DescribeScreen />}
      {screen === 'analyzing'               && <AnalyzingScreen />}
      {(screen as string) === 'ai-guidance' && <AiGuidanceScreen />}
      {screen === 'report'                  && <ReportScreen />}
    </>
  );
}