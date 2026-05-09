'use client';
// components/ui/FlowStrip.tsx

import styles from './FlowStrip.module.css';
import { AppScreen } from '@/lib/store';

const steps: { id: AppScreen | 'guidance'; label: string; icon: string }[] = [
  { id: 'home',      label: 'Choose',   icon: '📋' },
  { id: 'describe',  label: 'Describe', icon: '💬' },
  { id: 'analyzing', label: 'Analysis', icon: '🧠' },
  { id: 'guidance',  label: 'Guidance', icon: '🩺' },
  { id: 'report',    label: 'Report',   icon: '📄' },
];

export default function FlowStrip({ current }: { current: AppScreen }) {
  return (
    <div className={styles.strip}>
      {steps.map((step, i) => (
        <div key={step.id} className={styles.nodeWrap}>
          <div className={`${styles.node} ${current === step.id ? styles.active : ''}`}>
            <span className={styles.icon}>{step.icon}</span>
            <span className={styles.label}>{step.label}</span>
          </div>
          {i < steps.length - 1 && <span className={styles.sep}>›</span>}
        </div>
      ))}
    </div>
  );
}