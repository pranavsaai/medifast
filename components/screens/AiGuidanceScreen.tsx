'use client';
// components/screens/AiGuidanceScreen.tsx
// The live AI chat screen — replaces static GuidanceScreen for AI flow.
// Shows Gemini's Instruction + Check, user taps YES / NO, loops until
// COMPLETE or ESCALATE.

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { emergencyData } from '@/lib/emergencyData';
import { sendAnswer } from '@/lib/aiService';
import FlowStrip from '@/components/ui/FlowStrip';
import Toast from '@/components/ui/Toast';
import styles from './AiGuidanceScreen.module.css';

export default function AiGuidanceScreen() {
  const {
    selected,
    aiResponse,
    setAiResponse,
    setAiLoading,
    setScreen,
    aiLoading,
  } = useApp();

  const [toast, setToast] = useState<string | null>(null);
  const [stepHistory, setStepHistory] = useState<string[]>([]);

  if (!selected) return null;
  const data = emergencyData[selected];

  // ── Status: escalate ───────────────────────────────────────────────────────
  if (aiResponse?.status === 'escalate') {
    return (
      <section className={styles.endScreen}>
        <div className={`${styles.endCard} ${styles.danger}`}>
          <div className={styles.endIcon}>🚨</div>
          <h2>Call Emergency Services Now</h2>
          <p>{aiResponse.instruction}</p>
          <button
            className={`${styles.callBtn}`}
            onClick={() => window.open('tel:112')}
          >
            📞 Call 112
          </button>
          <button className={styles.homeBtn} onClick={() => setScreen('home')}>
            Return Home
          </button>
        </div>
      </section>
    );
  }

  // ── Status: complete ───────────────────────────────────────────────────────
  if (aiResponse?.status === 'complete') {
    return (
      <section className={styles.endScreen}>
        <div className={`${styles.endCard} ${styles.success}`}>
          <div className={styles.endIcon}>✅</div>
          <h2>Guidance Complete</h2>
          <p>{aiResponse.instruction}</p>

          {stepHistory.length > 0 && (
            <div className={styles.historyBox}>
              <h4>Steps followed:</h4>
              <ul>
                {stepHistory.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className={styles.reportBtn}
            onClick={() => setScreen('report')}
          >
            📄 View Report
          </button>
          <button className={styles.homeBtn} onClick={() => setScreen('home')}>
            Return Home
          </button>
        </div>
      </section>
    );
  }

  // ── Status: instruction (normal step) ─────────────────────────────────────
  const handleAnswer = async (answer: 'Yes' | 'No') => {
    if (aiLoading) return;

    // Save current instruction to history
    if (aiResponse?.instruction) {
      setStepHistory(prev => [...prev, aiResponse.instruction]);
    }

    setAiLoading(true);
    setToast(answer === 'Yes' ? '✅ Moving to next step...' : '🔄 Retrying step...');

    try {
      const next = await sendAnswer(answer);
      setAiResponse(next);
    } catch (err) {
      console.error(err);
      const msg = (err as any)?.message?.includes('429')
        ? '⏳ Rate limited — retrying automatically...'
        : '⚠️ Network error — please try again';
        setToast(msg);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section className={styles.guidance}>
      <div className={styles.flowStripContainer}>
        <FlowStrip current="guidance" />
      </div>

      {/* Severity banner */}
      <div className={`${styles.banner} ${data.severity === 'critical' ? styles.bannerCritical : styles.bannerHigh}`}>
        <span className={styles.bannerIcon}>{data.emoji}</span>
        <div className={styles.bannerText}>
          <strong>{data.sevTitle}</strong>
          <p>{data.sevSub}</p>
        </div>
        <button className={styles.callBtn} onClick={() => window.open('tel:112')}>
          📞 112
        </button>
      </div>

      {/* Step counter */}
      {stepHistory.length > 0 && (
        <div className={styles.stepCounter}>
          Step {stepHistory.length + 1} &nbsp;·&nbsp; {data.label}
        </div>
      )}

      {/* Main AI instruction card */}
      <div className={`${styles.instructionCard} ${aiLoading ? styles.loading : ''}`}>
        {aiLoading ? (
          <div className={styles.loadingInner}>
            <div className={styles.spinner} />
            <p>AI is thinking...</p>
          </div>
        ) : (
          <>
            <div className={styles.aiTag}>🧠 AI Guidance</div>
            <p className={styles.instruction}>
              {aiResponse?.instruction ?? 'Waiting for AI...'}
            </p>
          </>
        )}
      </div>

      {/* Check question */}
      {!aiLoading && aiResponse?.check && (
        <div className={styles.checkCard}>
          <p className={styles.checkLabel}>CHECK</p>
          <p className={styles.checkText}>{aiResponse.check}</p>
        </div>
      )}

      {/* YES / NO buttons */}
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnYes}`}
          onClick={() => handleAnswer('Yes')}
          disabled={aiLoading}
        >
          ✅ YES
        </button>
        <button
          className={`${styles.btn} ${styles.btnNo}`}
          onClick={() => handleAnswer('No')}
          disabled={aiLoading}
        >
          ❌ NO
        </button>
      </div>

      {/* Step history (collapsible feel) */}
      {stepHistory.length > 0 && (
        <div className={styles.history}>
          <p className={styles.historyLabel}>✓ Steps completed so far</p>
          <ul className={styles.historyList}>
            {stepHistory.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  );
}