'use client';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { emergencyData } from '@/lib/emergencyData';
import { sendAnswer } from '@/lib/aiService';
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
    pushStepHistory,
  } = useApp();
  const [toast, setToast] = useState<string | null>(null);
  const [answerAnim, setAnswerAnim] = useState<'yes' | 'no' | null>(null);

  if (!selected) return null;
  const data = emergencyData[selected];

  // CSS class variants — no inline styles
  const sevClass =
    data.severity === 'critical' ? styles.sevCritical :
    data.severity === 'high'     ? styles.sevHigh     :
                                   styles.sevModerate;

  // ── ESCALATE ────────────────────────────────────────────────
  if (aiResponse?.status === 'escalate') {
    return (
      <main className={styles.endPage}>
        <div className={`${styles.endCard} animate-up`}>
          <div className={styles.endRing}><span>🚨</span></div>
          <h2>Call 112 Now</h2>
          <p>{aiResponse.instruction}</p>
          <a href="tel:112" className={styles.callBig}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            Call 112 — Emergency
          </a>
          <button className={styles.ghostBtn} onClick={() => setScreen('home')}>Return Home</button>
        </div>
      </main>
    );
  }

  // ── COMPLETE ─────────────────────────────────────────────────
  if (aiResponse?.status === 'complete') {
    return (
      <main className={styles.endPage}>
        <div className={`${styles.endCard} animate-up`}>
          <div className={`${styles.endRing} ${styles.successRing}`}><span>✅</span></div>
          <h2>All Done</h2>
          <p>{aiResponse.instruction}</p>
          <button className={styles.reportBtn} onClick={() => setScreen('report')}>
            View Full Report
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button className={styles.ghostBtn} onClick={() => setScreen('home')}>Return Home</button>
        </div>
      </main>
    );
  }

  // ── MAIN GUIDANCE ────────────────────────────────────────────
  const handleAnswer = async (ans: 'yes' | 'no') => {
    if (aiLoading || !aiResponse) return;
    setAnswerAnim(ans);
    pushStepHistory(aiResponse.instruction);
    setAiLoading(true);
    try {
      // sendAnswer takes exactly 1 argument: 'Yes' | 'No'
      const next = await sendAnswer(ans === 'yes' ? 'Yes' : 'No');
      setAiResponse(next);
    } catch {
      setToast('Connection error. Try again.');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAnswerAnim(null), 300);
    }
  };

  return (
    <main className={styles.page}>
      {/* Context bar */}
      <div className={`${styles.contextBar} ${sevClass} animate-up`}>
        <span className={styles.contextEmoji}>{data.emoji}</span>
        <div className={styles.contextInfo}>
          <div className={styles.contextLabel}>Active Emergency</div>
          <div className={styles.contextTitle}>{data.label}</div>
        </div>
        <span className={`${styles.contextSev} ${sevClass}`}>
          {data.sevLabel}
        </span>
      </div>

      {/* Instruction card */}
      <div className={`${styles.instructionCard} animate-up d1`}>
        <div className={`${styles.cardTopBar} ${sevClass}Bar`} />
        <div className={styles.cardBody}>
          {aiLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.thinkingDots}>
                <span /><span /><span />
              </div>
              <p>Getting the next step…</p>
            </div>
          ) : (
            <>
              <div className={`${styles.stepBadge} ${sevClass}Badge`}>
                Step Instruction
              </div>
              <p className={styles.instruction}>{aiResponse?.instruction}</p>
            </>
          )}
        </div>
      </div>

      {/* Check question */}
      {!aiLoading && aiResponse?.check && (
        <div className={`${styles.checkCard} animate-up d2`}>
          <div className={styles.checkIcon}>?</div>
          <p className={styles.checkText}>{aiResponse.check}</p>
        </div>
      )}

      {/* YES / NO */}
      <div className={`${styles.actions} animate-up d3`}>
        <button
          className={`${styles.btnNo} ${answerAnim === 'no' ? styles.btnPressed : ''}`}
          onClick={() => handleAnswer('no')}
          disabled={aiLoading || !aiResponse}
        >
          <span className={styles.btnIcon}>✗</span>
          No, not working
        </button>
        <button
          className={`${styles.btnYes} ${answerAnim === 'yes' ? styles.btnPressed : ''}`}
          onClick={() => handleAnswer('yes')}
          disabled={aiLoading || !aiResponse}
        >
          <span className={styles.btnIcon}>✓</span>
          Yes, done!
        </button>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </main>
  );
}