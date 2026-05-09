'use client';
// components/ui/Toast.tsx

import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2800);
    return () => clearTimeout(t);
  }, [message, onDone]);

  return (
    <div className={`${styles.toast} ${visible ? styles.show : ''}`}>
      {message}
    </div>
  );
}