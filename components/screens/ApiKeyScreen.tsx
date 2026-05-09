'use client';
// components/screens/ApiKeyScreen.tsx
// Shown before HomeScreen — user pastes their Gemini API key once per session.

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { initGemini } from '@/lib/aiService';
import styles from './ApiKeyScreen.module.css';

export default function ApiKeyScreen() {
  const { setApiKey, setGeminiReady, setScreen } = useApp();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const key = input.trim();
    if (!key || !key.startsWith('AIza')) {
      setError('Please enter a valid Gemini API key (starts with AIza...)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      initGemini(key);          // initialise the SDK singleton
      setApiKey(key);
      setGeminiReady(true);
      setScreen('home');
    } catch (e) {
      console.error(e);
      setError('Failed to initialise Gemini. Double-check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>🔑</div>
        <h2>Welcome to MediAssist AI</h2>
        <p>
          Enter your <strong>Gemini API Key</strong> to activate the AI first-aid agent.
          Your key is stored only in memory — never sent anywhere except Google.
        </p>

        <input
          type="password"
          className={styles.input}
          placeholder="AIzaSy..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.btn}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Initialising...' : '🚀 Start Agent'}
        </button>

        <p className={styles.hint}>
          Get a free key at{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
            aistudio.google.com
          </a>
        </p>
      </div>
    </main>
  );
}