'use client';

// components/screens/DescribeScreen.tsx

import { useApp } from '@/lib/store';

import {
  emergencyData,
  EmergencyType,
  EmergencyData,
} from '@/lib/emergencyData';

import FlowStrip from '@/components/ui/FlowStrip';

import styles from './DescribeScreen.module.css';

export default function DescribeScreen() {
  const {
    selected,
    description,
    setDescription,
    setScreen,
  } = useApp();

  if (!selected) return null;

  // FIXED TYPE ERROR
  const data: EmergencyData =
    emergencyData[selected as EmergencyType];

  const handleChip = (text: string) => {
    setDescription(text);
  };

  const handleAnalyze = () => {
    if (!description.trim()) return;

    setScreen('analyzing');
  };

  return (
    <section className={styles.describe}>
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FlowStrip current="describe" />
      </div>

      <button
        type="button"
        className={styles.backBtn}
        onClick={() => setScreen('home')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>

        Back to home
      </button>

      <div className={styles.head}>
        <h2>Describe what happened</h2>

        <p>
          Tell the AI about the situation in your own
          words
        </p>

        <div className={styles.selectedTag}>
          {data.emoji} {data.label}
        </div>
      </div>

      <div className={styles.box}>
        <label className={styles.boxLabel}>
          WHAT HAPPENED?
        </label>

        <textarea
          className={styles.textarea}
          placeholder={`Describe the emergency in detail... (e.g. "${data.chips[0]}")`}
          rows={5}
          value={description}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement>
          ) => setDescription(e.target.value)}
        />

        <label className={styles.boxLabel}>
          QUICK SELECT
        </label>

        <div className={styles.chips}>
          {data.chips.map((chip: string) => (
            <button
              key={chip}
              type="button"
              className={`${styles.chip} ${
                description === chip
                  ? styles.chipActive
                  : ''
              }`}
              onClick={() => handleChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.analyzeBtn}
          onClick={handleAnalyze}
          disabled={!description.trim()}
          style={{
            opacity: description.trim() ? 1 : 0.5,
            cursor: description.trim()
              ? 'pointer'
              : 'not-allowed',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />

            <path d="m21 21-4.35-4.35" />
          </svg>

          Analyze with AI
        </button>
      </div>
    </section>
  );
}