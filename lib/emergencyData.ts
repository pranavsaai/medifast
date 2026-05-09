// lib/emergencyData.ts

export type EmergencyType = 'bleeding' | 'burns' | 'fracture' | 'heart-attack';
export type Severity = 'critical' | 'high' | 'moderate';
export type StepStatus = 'done' | 'progress' | 'pending';

export interface MissingItem {
  item: string;
  alts: string[];
}

export interface Step {
  title: string;
  detail: string;
}

export interface EmergencyData {
  key: EmergencyType;
  label: string;
  emoji: string;
  tagline: string;
  severity: Severity;
  sevTitle: string;
  sevSub: string;
  chips: string[];
  steps: Step[];
  missing: MissingItem[];
  tip: string;
  statusQuestion: string;
  doctorRec: string;
}

export const emergencyData: Record<EmergencyType, EmergencyData> = {
  bleeding: {
    key: 'bleeding',
    label: 'Bleeding',
    emoji: '🩸',
    tagline: 'Wounds, cuts, severe blood loss',
    severity: 'critical',
    sevTitle: '🚨 Critical — Severe Bleeding',
    sevSub: 'Immediate action required. Apply pressure now.',
    chips: [
      'Bike accident, heavy bleeding',
      "Cut on arm, won't stop",
      'Nose bleed lasting 10 min',
      'Deep wound on leg',
    ],
    steps: [
      { title: 'Apply firm pressure', detail: 'Use a clean cloth or bandage and press directly on the wound continuously for at least 10 minutes.' },
      { title: 'Elevate the injured area', detail: 'Raise the bleeding part above the level of the heart to slow blood flow.' },
      { title: 'Keep patient calm', detail: 'Reassure the person. Anxiety increases heart rate and blood loss.' },
      { title: 'Do NOT remove the cloth', detail: "If it soaks through, add more material on top — removing it disrupts clotting." },
    ],
    missing: [
      { item: 'Bandage', alts: ['Clean cloth', 'Torn shirt strips', 'Sanitary napkin'] },
      { item: 'Antiseptic', alts: ['Clean water', 'Soap and water'] },
    ],
    tip: 'Applying continuous pressure for at least **10–15 minutes** is the most effective intervention for external bleeding. Do not peek to check — breaking the seal restarts the clotting process.',
    statusQuestion: 'Is the bleeding reducing after applying pressure?',
    doctorRec: 'Patient received immediate first aid for external bleeding. Wound was compressed for 10+ minutes with elevation. Please assess for internal bleeding signs, tetanus prophylaxis requirement, and need for sutures. Blood type and hemoglobin levels may need checking.',
  },
  burns: {
    key: 'burns',
    label: 'Burns',
    emoji: '🔥',
    tagline: 'Thermal, chemical, electrical',
    severity: 'high',
    sevTitle: '⚠️ High Severity — Burn Injury',
    sevSub: 'Cool the burn immediately. Do not use ice.',
    chips: [
      'Fire touched my hand',
      'Chemical spilled on skin',
      'Hot liquid burn',
      'Sunburn with blisters',
    ],
    steps: [
      { title: 'Cool with running water', detail: 'Run cool (not cold) water over the burn for 10–20 minutes immediately.' },
      { title: 'Remove jewelry/clothing', detail: 'Remove watches, rings, belts near the burn area before swelling begins.' },
      { title: 'Cover with cling film', detail: 'Loosely cover with cling film or a clean non-fluffy material.' },
      { title: 'Never use butter or ice', detail: 'Ice causes further damage. Butter seals in heat and increases infection risk.' },
    ],
    missing: [
      { item: 'Running water', alts: ['Bottled water', 'Any clean cool liquid'] },
      { item: 'Cling film', alts: ['Clean plastic bag', 'Non-fluffy cloth'] },
    ],
    tip: 'Burns are classified by depth. If blisters form or skin turns white/charred, this indicates 2nd or 3rd degree — **immediate hospital care is essential**.',
    statusQuestion: 'Is the burning sensation reducing after cooling?',
    doctorRec: 'Patient was treated for burn injury with immediate cooling under running water. Please assess burn depth and percentage of body surface area affected. Tetanus prophylaxis and IV fluids may be required for serious burns.',
  },
  fracture: {
    key: 'fracture',
    label: 'Fracture',
    emoji: '🦴',
    tagline: 'Broken bones, sprains, dislocations',
    severity: 'moderate',
    sevTitle: '⚡ Moderate — Possible Fracture',
    sevSub: 'Immobilize the area. Do not move the patient unnecessarily.',
    chips: [
      'Fell from bike, arm twisted',
      'Cannot move wrist',
      'Swelling after fall',
      'Heard a crack sound',
    ],
    steps: [
      { title: 'Immobilize the injured area', detail: 'Keep the broken bone still. Do not try to straighten or push bones back.' },
      { title: 'Apply a splint', detail: 'Use a rigid item (ruler, stick, rolled newspaper) as a splint, padded with cloth.' },
      { title: 'Apply ice pack', detail: 'Wrap ice in cloth and apply for 20 minutes to reduce swelling.' },
      { title: 'Elevate if possible', detail: 'Raise the injured limb to reduce swelling. Avoid if spine injury is suspected.' },
    ],
    missing: [
      { item: 'Splint material', alts: ['Ruler', 'Rolled magazine', 'Straight stick'] },
      { item: 'Ice pack', alts: ['Frozen vegetables in cloth', 'Cold water compress'] },
    ],
    tip: 'Open fractures (bone visible through skin) are medical emergencies. Cover gently with a clean cloth and go to hospital immediately. Do **not** attempt to push bone back.',
    statusQuestion: 'Is the pain manageable after immobilization?',
    doctorRec: 'Patient sustained a suspected fracture and was given immediate first aid including immobilization. Please conduct X-ray imaging to confirm fracture type and location. Assess for vascular or nerve damage in the affected limb.',
  },
  'heart-attack': {
    key: 'heart-attack',
    label: 'Heart Attack',
    emoji: '❤️',
    tagline: 'Chest pain, cardiac emergency',
    severity: 'critical',
    sevTitle: '🚨 CRITICAL — Possible Heart Attack',
    sevSub: 'Call emergency services immediately. Every second counts.',
    chips: [
      'Chest pain radiating to arm',
      'Sudden dizziness, nausea',
      'Heavy pressure on chest',
      'Shortness of breath',
    ],
    steps: [
      { title: 'Call 112 immediately', detail: 'Do this first. Heart attacks require emergency medical care within minutes.' },
      { title: 'Make patient sit/lie comfortably', detail: 'Have them sit in a comfortable position — usually sitting up, leaning forward.' },
      { title: 'Loosen tight clothing', detail: 'Loosen belts, ties, and shirt buttons to ease breathing.' },
      { title: 'Aspirin if not allergic', detail: 'Give one regular aspirin (325mg) to chew if not allergic and conscious.' },
    ],
    missing: [
      { item: 'Aspirin', alts: ['Contact pharmacy immediately', 'Ask bystanders'] },
      { item: 'Defibrillator (AED)', alts: ['Check public buildings nearby', 'Airport / Mall AED'] },
    ],
    tip: 'If patient becomes unconscious and stops breathing normally, begin CPR immediately. Push hard and fast in the center of the chest — **100–120 compressions per minute**.',
    statusQuestion: 'Is the patient conscious and breathing normally?',
    doctorRec: 'Patient presented with signs of cardiac emergency. First aid administered including positional support and aspirin. Immediate ECG, troponin levels, and cardiac imaging required. Patient should be assessed for STEMI/NSTEMI and treated accordingly.',
  },
};

export const severityConfig: Record<Severity, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#D42B2B', bg: '#FFE8E8' },
  high:     { label: 'High',     color: '#B06000', bg: '#FFF0D9' },
  moderate: { label: 'Moderate', color: '#2D6B3A', bg: '#E8F4EA' },
};