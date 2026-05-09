'use client';
import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 350); }, 2600);
    return () => clearTimeout(t);
  }, [message, onDone]);
  return <div className={`${styles.toast} ${visible ? styles.show : ''}`}>{message}</div>;
}