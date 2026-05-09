// lib/emergencyData.ts
import { EmergencyType } from './store';

export interface EmergencyData {
  key: EmergencyType;
  emoji: string;
  label: string;
  tagline: string;
  color: string;       // accent color for this card
  glow: string;        // glow rgba
  severity: 'critical' | 'high' | 'moderate';
  sevLabel: string;    // user-friendly severity label
  sevSub: string;
  chips: string[];
  steps: { title: string; detail: string }[];
  missing: { item: string; alts: string[] }[];
  tip: string;
  statusQuestion: string;
  doctorRec: string;
}

export const emergencyData: Record<EmergencyType, EmergencyData> = {
  bleeding: {
    key: 'bleeding', emoji: '🩸', label: 'Bleeding',
    tagline: 'Cuts, wounds, heavy blood loss',
    color: '#FF3B5C', glow: 'rgba(255,59,92,0.3)',
    severity: 'critical', sevLabel: 'Act immediately',
    sevSub: 'Apply pressure right now.',
    chips: ['Bike accident, bleeding badly', 'Deep cut on hand', 'Wound not stopping', 'Bleeding from leg'],
    steps: [
      { title: 'Press firmly on the wound', detail: 'Use a clean cloth or any fabric. Press hard and keep pressing without lifting.' },
      { title: 'Raise the injured part', detail: 'Lift the bleeding area above the heart level to help slow blood flow.' },
      { title: 'Keep the person calm', detail: 'Speak reassuringly. Panic makes things worse.' },
      { title: 'Do not remove the cloth', detail: 'If blood soaks through, add more material on top. Never remove the first layer.' },
    ],
    missing: [
      { item: 'Bandage', alts: ['Any clean cloth', 'T-shirt strips', 'Napkin'] },
      { item: 'Antiseptic', alts: ['Clean tap water', 'Soap and water'] },
    ],
    tip: 'Keep pressing for at least 10–15 minutes without peeking. Lifting the cloth breaks the clot forming underneath.',
    statusQuestion: 'Is the bleeding slowing down?',
    doctorRec: 'Patient received immediate pressure for external bleeding with elevation. Assess for internal bleeding, tetanus need, and possible sutures.',
  },
  burns: {
    key: 'burns', emoji: '🔥', label: 'Burns',
    tagline: 'Heat, chemical or electrical burns',
    color: '#FF8C42', glow: 'rgba(255,140,66,0.3)',
    severity: 'high', sevLabel: 'Cool it down now',
    sevSub: 'Do not use ice. Use cool running water.',
    chips: ['Touched hot stove', 'Hot water spilled on skin', 'Chemical burn', 'Cooking accident'],
    steps: [
      { title: 'Move away from the heat', detail: 'Get the person away from the source immediately.' },
      { title: 'Cool under running water', detail: 'Run cool (not cold) water over the burn for 20 minutes.' },
      { title: 'Remove tight items nearby', detail: 'Gently remove rings, watches or tight clothing near the burn — before swelling starts.' },
      { title: 'Cover loosely', detail: 'Use a clean cloth or cling wrap laid loosely over the area. Never wrap tightly.' },
    ],
    missing: [
      { item: 'Running water', alts: ['Bottled water', 'Any clean cool liquid'] },
      { item: 'Covering', alts: ['Clean plastic bag', 'Loose soft cloth'] },
    ],
    tip: 'Never use butter, toothpaste, or ice. They trap heat inside and increase infection risk.',
    statusQuestion: 'Is the burning sensation reducing?',
    doctorRec: 'Patient treated with immediate water cooling. Assess burn depth and body surface area. Consider tetanus and IV fluids for major burns.',
  },
  fracture: {
    key: 'fracture', emoji: '🦴', label: 'Fracture',
    tagline: 'Broken bone, sprain or dislocation',
    color: '#A78BFA', glow: 'rgba(167,139,250,0.3)',
    severity: 'moderate', sevLabel: 'Keep it still',
    sevSub: 'Do not move the injured area.',
    chips: ['Fell from bike, arm twisted', 'Cannot move wrist', 'Heard a crack', 'Ankle swollen badly'],
    steps: [
      { title: 'Do not move the bone', detail: 'Keep the injured area completely still. Never try to push or straighten it.' },
      { title: 'Support it with a splint', detail: 'Use a ruler, stick, or rolled magazine alongside the injury, padded with cloth.' },
      { title: 'Apply something cold', detail: 'Wrap ice or frozen item in cloth. Apply for 20 minutes to reduce swelling.' },
      { title: 'Raise if possible', detail: 'Gently lift the injured limb above heart level. Skip this if spine is involved.' },
    ],
    missing: [
      { item: 'Splint', alts: ['Ruler', 'Rolled magazine', 'Straight branch'] },
      { item: 'Ice pack', alts: ['Frozen peas in cloth', 'Cold wet towel'] },
    ],
    tip: 'If bone is visible through the skin, cover gently with a clean cloth and go to hospital immediately. Do not push it back.',
    statusQuestion: 'Is the pain manageable after keeping it still?',
    doctorRec: 'Suspected fracture treated with immobilization. X-ray required. Check for nerve or vascular damage.',
  },
  'heart-attack': {
    key: 'heart-attack', emoji: '❤️', label: 'Heart Attack',
    tagline: 'Chest pain, cardiac emergency',
    color: '#FF3B5C', glow: 'rgba(255,59,92,0.4)',
    severity: 'critical', sevLabel: 'Call 112 first',
    sevSub: 'Every second matters. Call now.',
    chips: ['Chest pain spreading to arm', 'Sudden dizziness and nausea', 'Heavy pressure on chest', 'Cannot breathe properly'],
    steps: [
      { title: 'Call 112 right now', detail: 'Do this before anything else. Do not wait.' },
      { title: 'Help them sit comfortably', detail: 'Let them sit up slightly leaning forward — this is easiest to breathe in.' },
      { title: 'Loosen tight clothing', detail: 'Open shirt buttons, loosen belt and tie immediately.' },
      { title: 'Give aspirin if available', detail: 'One regular aspirin (325mg) to chew — only if conscious and not allergic.' },
    ],
    missing: [
      { item: 'Aspirin', alts: ['Ask nearby people', 'Find a pharmacy immediately'] },
      { item: 'Defibrillator (AED)', alts: ['Check malls, airports, public buildings nearby'] },
    ],
    tip: 'If the person becomes unconscious and stops breathing, start CPR — push hard and fast in the center of the chest, 100 times per minute.',
    statusQuestion: 'Is the person conscious and breathing?',
    doctorRec: 'Cardiac emergency — positional support and aspirin given. ECG, troponin levels and cardiac imaging urgently required.',
  },
  choking: {
    key: 'choking', emoji: '😮‍💨', label: 'Choking',
    tagline: 'Something stuck in the throat',
    color: '#38BDF8', glow: 'rgba(56,189,248,0.3)',
    severity: 'critical', sevLabel: 'Act immediately',
    sevSub: 'Ask them to cough hard right now.',
    chips: ['Food stuck in throat', 'Cannot breathe or speak', 'Baby is choking', 'Person turning blue'],
    steps: [
      { title: 'Tell them to cough hard', detail: 'Ask the person to cough forcefully. If they can cough or speak, encourage it.' },
      { title: 'Give 5 back blows', detail: 'Lean them forward, give 5 firm slaps between the shoulder blades with your palm.' },
      { title: 'Give abdominal thrusts', detail: 'Stand behind them, make a fist above the belly button, pull sharply inward and upward 5 times.' },
      { title: 'Alternate and repeat', detail: 'Keep alternating 5 back blows and 5 abdominal thrusts until it clears or help arrives.' },
    ],
    missing: [],
    tip: 'For infants under 1 year: use 5 gentle back blows and 5 chest pushes — never abdominal thrusts.',
    statusQuestion: 'Has the blockage cleared? Can they breathe now?',
    doctorRec: 'Patient experienced choking episode. Assess airway for residual obstruction and throat injuries.',
  },
  fainting: {
    key: 'fainting', emoji: '💫', label: 'Fainting',
    tagline: 'Person collapsed or feeling faint',
    color: '#818CF8', glow: 'rgba(129,140,248,0.3)',
    severity: 'moderate', sevLabel: 'Lay them down',
    sevSub: 'Get them flat immediately.',
    chips: ['Person suddenly collapsed', 'Feeling dizzy and weak', 'About to pass out', 'Lost consciousness briefly'],
    steps: [
      { title: 'Lay them flat on their back', detail: 'Help them lie down safely on a flat surface.' },
      { title: 'Raise their legs', detail: 'Lift both legs about 30cm above heart level to send blood to the brain.' },
      { title: 'Loosen tight clothing', detail: 'Open buttons, remove ties, loosen anything tight around the neck and waist.' },
      { title: 'Check breathing', detail: 'Watch for chest movement. If not breathing, call 112 immediately.' },
    ],
    missing: [],
    tip: 'Do not give water or food until the person is fully conscious and sitting up safely.',
    statusQuestion: 'Has the person regained consciousness?',
    doctorRec: 'Syncopal episode — patient laid flat with legs elevated. Investigate cause: cardiac, neurological or vasovagal.',
  },
  seizure: {
    key: 'seizure', emoji: '⚡', label: 'Seizure',
    tagline: 'Convulsions or fits',
    color: '#FBBF24', glow: 'rgba(251,191,36,0.3)',
    severity: 'high', sevLabel: 'Keep them safe',
    sevSub: 'Do not hold them down.',
    chips: ['Person having a fit', 'Body shaking uncontrollably', 'Fell and convulsing', 'History of epilepsy'],
    steps: [
      { title: 'Clear the area', detail: 'Move furniture, sharp objects or anything dangerous away from the person.' },
      { title: 'Protect the head', detail: 'Place something soft (folded jacket, pillow) under their head.' },
      { title: 'Never restrain them', detail: 'Do not hold them down or put anything in their mouth.' },
      { title: 'Turn them on their side', detail: 'Once the shaking stops, gently roll them to the recovery position (on their side).' },
    ],
    missing: [],
    tip: 'Time the seizure. If it lasts more than 5 minutes or they do not regain consciousness, call 112 immediately.',
    statusQuestion: 'Has the shaking stopped and are they breathing normally?',
    doctorRec: 'Seizure patient — recovery position applied. Investigate for new onset epilepsy, electrolyte imbalance or head trauma.',
  },
  'snake-bite': {
    key: 'snake-bite', emoji: '🐍', label: 'Snake Bite',
    tagline: 'Bitten by a snake',
    color: '#34D399', glow: 'rgba(52,211,153,0.3)',
    severity: 'critical', sevLabel: 'Get to hospital fast',
    sevSub: 'Keep the person still. Go now.',
    chips: ['Snake bit my leg', 'Bite mark on arm', 'Not sure if snake was poisonous', 'Swelling after bite'],
    steps: [
      { title: 'Keep them completely still', detail: 'Movement speeds venom spread. Have them sit or lie still immediately.' },
      { title: 'Keep bite below heart level', detail: 'Let the bitten limb hang lower than the heart.' },
      { title: 'Remove tight items', detail: 'Take off rings, watches, tight clothing near the bite before swelling starts.' },
      { title: 'Get to hospital now', detail: 'Call 112 or drive to the nearest emergency room immediately. Do not wait.' },
    ],
    missing: [],
    tip: 'Never suck out the venom, cut the wound, or apply ice or a tourniquet. These make things worse.',
    statusQuestion: 'Are you on the way to a hospital?',
    doctorRec: 'Snake bite — limb immobilized and kept dependent. Identify snake species if possible. Administer antivenom per protocol.',
  },
};