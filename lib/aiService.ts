// lib/geminiService.ts  (keeping same filename so no other files break)

import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './systemPrompt';

// ── Types (unchanged — rest of app uses these) ────────────────────────────────
export type GeminiStatus = 'instruction' | 'escalate' | 'complete' | 'error';

export interface ParsedResponse {
  status: GeminiStatus;
  instruction: string;
  check: string;
  raw: string;
}

// ── Conversation history (Groq is stateless, we manage history ourselves) ─────
let _client: Groq | null = null;
let _history: { role: 'user' | 'assistant'; content: string }[] = [];

// ── Init ──────────────────────────────────────────────────────────────────────
export function initGemini(apiKey: string): void {
  _client = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,   // needed for client-side Next.js
  });
}

export function isInitialized(): boolean {
  return _client !== null;
}

// ── Start fresh emergency chat ─────────────────────────────────────────────────
export async function startEmergencyChat(
  emergencyLabel: string,
  userDescription: string
): Promise<ParsedResponse> {
  if (!_client) throw new Error('Groq not initialized. Call initGemini(apiKey) first.');

  // Reset history for new emergency
  _history = [];

  const firstMessage =
    `Emergency type: ${emergencyLabel}.\n` +
    `User description: "${userDescription || 'No further details provided.'}".\n` +
    `Please provide the very first first-aid step.`;

  return await chat(firstMessage);
}

// ── Send YES / NO answer ───────────────────────────────────────────────────────
export async function sendAnswer(answer: 'Yes' | 'No'): Promise<ParsedResponse> {
  if (!_client) throw new Error('Groq not initialized.');
  return await chat(answer);
}

// ── Clear session ──────────────────────────────────────────────────────────────
export function clearSession(): void {
  _history = [];
}

// ── Core chat function ─────────────────────────────────────────────────────────
async function chat(userMessage: string): Promise<ParsedResponse> {
  // Add user message to history
  _history.push({ role: 'user', content: userMessage });

  const response = await _client!.chat.completions.create({
    model: 'llama-3.3-70b-versatile',   // free, fast, smart
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ..._history,
    ],
    temperature: 0.3,     // low temp = consistent, predictable responses
    max_tokens: 300,      // first-aid steps are short
  });

  const text = response.choices[0]?.message?.content ?? '';

  // Save assistant reply to history
  _history.push({ role: 'assistant', content: text });

  return parseResponse(text);
}

// ── Response parser (unchanged logic) ─────────────────────────────────────────
function parseResponse(text: string): ParsedResponse {
  const raw = text.trim();
  const lower = raw.toLowerCase();

  // Escalation
  const escalateMatch = raw.match(/^ESCALATE:\s*([\s\S]*?)$/im);
  if (
    escalateMatch ||
    lower.includes('call emergency services') ||
    lower.includes('call 112') ||
    lower.includes('ambulance') ||
    lower.includes('emergency medical services')
  ) {
    return {
      status: 'escalate',
      instruction: escalateMatch
        ? escalateMatch[1].trim()
        : 'Please call 112 (emergency services) immediately.',
      check: '',
      raw,
    };
  }

  // Completion
  const completeMatch = raw.match(/^COMPLETE:\s*([\s\S]*?)$/im);
  if (
    completeMatch ||
    lower.includes('situation controlled') ||
    lower.includes('monitor the person') ||
    (!lower.includes('instruction:') && !lower.includes('check:'))
  ) {
    return {
      status: 'complete',
      instruction: completeMatch
        ? completeMatch[1].trim()
        : 'Immediate steps complete. Monitor the person and seek medical advice if needed.',
      check: '',
      raw,
    };
  }

  // Normal instruction + check
  const instructionMatch = raw.match(/Instruction:\s*([\s\S]*?)(?=Check:|$)/i);
  const checkMatch       = raw.match(/Check:\s*([\s\S]*?)$/i);

  return {
    status: 'instruction',
    instruction: instructionMatch ? instructionMatch[1].trim() : 'Follow the guidance carefully.',
    check:       checkMatch       ? checkMatch[1].trim()       : 'Did you complete this step?',
    raw,
  };
}