'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  emergencyData,
  StepStatus,
  EmergencyType,
  EmergencyData,
} from '@/lib/emergencyData';

import FlowStrip from '@/components/ui/FlowStrip';
import Toast from '@/components/ui/Toast';
import styles from './GuidanceScreen.module.css';

export default function GuidanceScreen() {
  const {
    selected,
    stepStatuses,
    setStepStatus,
    setPatientStatus,
    setScreen,
  } = useApp();

  const [toast, setToast] = useState<string | null>(null);

  const [patientAns, setPatientAns] = useState<'yes' | 'no' | null>(null);

  // Type safety check
  if (!selected) return null;

  // FIXED ERROR
  const data: EmergencyData =
    emergencyData[selected as EmergencyType];

  const markStep = (i: number, s: StepStatus) => {
    setStepStatus(i, s);

    setToast(
      s === 'done'
        ? '✅ Step marked complete'
        : '⏳ Step marked in progress'
    );
  };

  const handleStatus = (ans: 'yes' | 'no') => {
    setPatientAns(ans);
    setPatientStatus(ans);

    if (ans === 'no') {
      setToast('⚠️ Worsening — Call 112 immediately!');

      setTimeout(() => {
        window.open('tel:112');
      }, 1500);
    } else {
      setToast('✅ Good — Keep monitoring the patient');

      setTimeout(() => {
        setScreen('report');
      }, 1400);
    }
  };

  const isCritical = data.severity === 'critical';

  return (
    <section className={styles.guidance}>
      <FlowStrip current="guidance" />

      <div
        className={`${styles.banner} ${
          isCritical
            ? styles.bannerCritical
            : styles.bannerHigh
        }`}
      >
        <span className={styles.bannerIcon}>
          {data.emoji}
        </span>

        <div className={styles.bannerText}>
          <strong>{data.sevTitle}</strong>
          <p>{data.sevSub}</p>
        </div>

        <button
          type="button"
          className={styles.callBtn}
          onClick={() => window.open('tel:112')}
        >
          📞 Call 112
        </button>
      </div>

      <div className={styles.columns}>
        {/* Steps */}
        <div className={styles.stepsCard}>
          <h3>First Aid for {data.label}</h3>

          <div className={styles.stepsList}>
            {data.steps.map(
              (
                step: {
                  title: string;
                  detail: string;
                },
                i: number
              ) => {
                const status = stepStatuses[i];

                return (
                  <div
                    key={i}
                    className={`${styles.stepItem} ${
                      status === 'done'
                        ? styles.stepDone
                        : ''
                    }`}
                  >
                    <div
                      className={`${styles.stepNum} ${
                        status === 'done'
                          ? styles.stepNumDone
                          : ''
                      }`}
                    >
                      {status === 'done'
                        ? '✓'
                        : i + 1}
                    </div>

                    <div className={styles.stepContent}>
                      <div className={styles.stepTitle}>
                        {step.title}
                      </div>

                      <div className={styles.stepDetail}>
                        {step.detail}
                      </div>

                      <div className={styles.stepActions}>
                        <button
                          type="button"
                          className={`${styles.stepBtn} ${
                            status === 'done'
                              ? styles.btnDone
                              : styles.btnComplete
                          }`}
                          onClick={() =>
                            markStep(i, 'done')
                          }
                        >
                          ✅ Done
                        </button>

                        <button
                          type="button"
                          className={`${styles.stepBtn} ${
                            status === 'progress'
                              ? styles.btnProgressActive
                              : styles.btnProgress
                          }`}
                          onClick={() =>
                            markStep(i, 'progress')
                          }
                        >
                          ⏳ In Progress
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className={styles.sidePanel}>
          <div className={styles.missingCard}>
            <h4>Missing Items?</h4>

            {data.missing.map(
              (
                m: {
                  item: string;
                  alts: string[];
                },
                i: number
              ) => (
                <div key={i}>
                  <div className={styles.missingItem}>
                    {m.item}
                  </div>

                  {m.alts.map(
                    (a: string, idx: number) => (
                      <div
                        key={idx}
                        className={styles.missingAlt}
                      >
                        {a}
                      </div>
                    )
                  )}
                </div>
              )
            )}

            <button
              type="button"
              className={styles.mapCard}
              onClick={() =>
                window.open(
                  'https://www.google.com/maps/search/pharmacy+near+me',
                  '_blank'
                )
              }
            >
              <span>🗺️</span>

              <div>
                <p>Find nearby stores</p>
                <p>Tap to open Maps</p>
              </div>
            </button>
          </div>

          <div className={styles.tipCard}>
            <h4>AI Medical Tip</h4>

            <p className={styles.tipText}>
              {data.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Status Check */}
      <div className={styles.statusCheck}>
        <h3>{data.statusQuestion}</h3>

        <div className={styles.statusBtns}>
          <button
            type="button"
            className={`${styles.statusBtn} ${
              styles.statusYes
            } ${
              patientAns === 'yes'
                ? styles.statusSelected
                : ''
            }`}
            onClick={() => handleStatus('yes')}
          >
            ✅ Yes, improving
          </button>

          <button
            type="button"
            className={`${styles.statusBtn} ${
              styles.statusNo
            } ${
              patientAns === 'no'
                ? styles.statusSelected
                : ''
            }`}
            onClick={() => handleStatus('no')}
          >
            ❌ No, worsening
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast}
          onDone={() => setToast(null)}
        />
      )}
    </section>
  );
}