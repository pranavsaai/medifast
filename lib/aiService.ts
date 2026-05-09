// lib/aiService.ts  (export aliases match old geminiService.ts names so no other files break)
import Groq from 'groq-sdk';
import { ParsedResponse } from './store';

const SYSTEM_PROMPT = `
You are an emergency first-aid assistant. Your job is to calmly guide someone through a medical emergency step by step.

RULES:
- Give ONE instruction at a time. Short. Clear. Easy under panic.
- After each instruction, ask a simple YES or NO question to check if it worked.
- If YES: move to the next step.
- If NO: try again, give an alternative, or escalate.
- Escalate to emergency services (call 112) if: breathing stops, unconsciousness, uncontrolled bleeding, seizure over 5 min, chest pain worsening.
- When done: confirm the situation is under control.

ALWAYS use this exact format:

Instruction:
<one clear action — max 2 sentences>

Check:
<one yes/no question>

When escalating use:
ESCALATE:
<one sentence reason>

When complete use:
COMPLETE:
<one reassuring sentence>

TONE: Calm. Confident. Simple words. No medical jargon. Like a trained friend guiding you.
`.trim();

let _client: Groq | null = null;
let _history: { role: 'user' | 'assistant'; content: string }[] = [];

export function initGemini(apiKey: string) {
  _client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
}

export function isInitialized() { return _client !== null; }
export function clearSession()  { _history = []; }

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

async function callWithRetry(fn: () => Promise<any>, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err: any) {
      if (err?.message?.includes('429') && i < retries - 1) {
        await wait((i + 1) * 12000);
      } else throw err;
    }
  }
}

async function chat(userMessage: string): Promise<ParsedResponse> {
  _history.push({ role: 'user', content: userMessage });
  const result = await callWithRetry(() =>
    _client!.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ..._history],
      temperature: 0.25,
      max_tokens: 250,
    })
  );
  const text = result.choices[0]?.message?.content ?? '';
  _history.push({ role: 'assistant', content: text });
  return parseResponse(text);
}

export async function startEmergencyChat(label: string, desc: string): Promise<ParsedResponse> {
  if (!_client) throw new Error('AI not initialized');
  _history = [];
  return chat(`Emergency: ${label}. Situation: "${desc || 'No extra details'}". Give the first step.`);
}

export async function sendAnswer(answer: 'Yes' | 'No'): Promise<ParsedResponse> {
  if (!_client) throw new Error('AI not initialized');
  return chat(answer);
}

function parseResponse(text: string): ParsedResponse {
  const raw = text.trim();
  const lower = raw.toLowerCase();

  const escalateMatch = raw.match(/^ESCALATE:\s*([\s\S]*?)$/im);
  if (escalateMatch || lower.includes('call 112') || lower.includes('ambulance') || lower.includes('emergency services')) {
    return { status: 'escalate', instruction: escalateMatch?.[1]?.trim() ?? 'Call 112 immediately.', check: '', raw };
  }

  const completeMatch = raw.match(/^COMPLETE:\s*([\s\S]*?)$/im);
  if (completeMatch || (!lower.includes('instruction:') && !lower.includes('check:'))) {
    return { status: 'complete', instruction: completeMatch?.[1]?.trim() ?? 'Steps complete. Monitor the person and seek medical advice.', check: '', raw };
  }

  const instruction = raw.match(/Instruction:\s*([\s\S]*?)(?=Check:|$)/i)?.[1]?.trim() ?? 'Follow the guidance carefully.';
  const check       = raw.match(/Check:\s*([\s\S]*?)$/i)?.[1]?.trim()                  ?? 'Did you complete this step?';
  return { status: 'instruction', instruction, check, raw };
}