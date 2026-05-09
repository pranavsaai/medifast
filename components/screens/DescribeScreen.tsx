'use client'
import { useApp } from '@/lib/store'
import { emergencyData } from '@/lib/emergencyData'  
import styles from './DescribeScreen.module.css'
import { useState, useRef, useEffect, useCallback } from 'react'

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function DescribeScreen() {
  const { selected, description, setDescription, setScreen } = useApp()
  const [isListening, setIsListening] = useState<boolean>(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  if (!selected) return null

  const data = emergencyData[selected as keyof typeof emergencyData]

  const startListening = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Voice input not supported. Please type your description.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {  
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setDescription(description + ' ' + finalTranscript.trim())
      }
    }

    recognition.onerror = (event: any) => { 
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow and try again.')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [setDescription])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const handleChipClick = (chip: string) => {
    setDescription(chip)
  }

  const handleGetHelp = () => {
    setScreen('analyzing')
  }

  return (
    <main className={styles.page}>
      {/* Badge */}
      <div className={`${styles.badge} animate-up ${styles[data.color || 'moderate']}`}>
        <span className={styles.badgeEmoji}>{data.emoji}</span>
        <span>{data.label}</span>
      </div>

      {/* Heading */}
      <h2 className={`${styles.title} animate-up d1`}>
        Tell us what<br />happened
      </h2>
      <p className={`${styles.sub} animate-up d2`}>
        The more you describe, the better we can guide you.
      </p>

      {/* Input card */}
      <div className={`${styles.inputWrap} animate-up d3`}>
        <div className={styles.inputHeader}>
          <div className={styles.inputHeaderIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--mint-deep)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className={styles.inputHeaderLabel}>Describe the situation</span>
        </div>

        <textarea 
          className={styles.textarea} 
          placeholder={`e.g. ${data.chips[0]}`}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoFocus
        />

        <div className={styles.inputFooter}>
          <span className={styles.charCount}>
            {description.length} characters
          </span>
          
          {/* VOICE BUTTON */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={!navigator.mediaDevices?.getUserMedia}
            className={`
              ${styles.voiceBtn}
              ${isListening ? styles.voiceBtnListening : ''}
            `}
            aria-label={isListening ? "Stop voice recording" : "Start voice input"}
          >
            <span className={styles.micIcon}>🎤</span>
            <span className={styles.voiceBtnText}>
              {isListening ? 'Listening...' : 'Voice Input'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick chips */}
      <div className={`${styles.chipsLabel} animate-up d4`}>
        Quick select
        <div className={styles.chipsDivider} />
      </div>
      <div className={`${styles.chips} animate-up d4`}>
        {data.chips.map((chip: string, index: number) => (
          <button
            key={`${chip}-${index}`}
            className={`${styles.chip} ${description.includes(chip) ? styles.chipActive : ''}`}
            onClick={() => handleChipClick(chip)}  // ✅ Typed
          >
            {chip}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className={`${styles.cta} animate-up d5`}>
        <button 
          className={`${styles.ctaBtn} ${!description.trim() ? styles.ctaBtnDisabled : ''}`}
          onClick={handleGetHelp}  // ✅ Typed
          disabled={!description.trim()}
        >
          Get Help Now
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <p className={styles.ctaNote}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Our AI will walk you through every step safely
        </p>
      </div>
    </main>
  )
}