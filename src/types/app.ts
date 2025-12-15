export type Phase = "menstrual" | "follicular" | "ovulation" | "luteal" | "detox";
export type CyclePhase = "menstrual" | "folicular" | "ovulacao" | "lutea" | "detox";

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

export interface HormonalResult {
  profile: string;
  recommendations: string[];
  score: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface MoodEntry {
  id: string;
  mood: string;
  energyLevel: number;
  notes?: string;
  date: string;
}

export interface SwellingEntry {
  id: string;
  level: number;
  areas: string[];
  date: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  cycle_duration: number | null;
  last_period_date: string | null;
  birth_date: string | null;
  height: number | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
}

export interface PhaseInfo {
  name: string;
  description: string;
  emoji: string;
  color: string;
  gradient: string;
  tips: string[];
  foods: string[];
  exercises: string[];
}

export const phaseData: Record<Phase, PhaseInfo> = {
  menstrual: {
    name: "Fase Menstrual",
    description: "Momento de descanso e introspecção. Seu corpo precisa de cuidados extras.",
    emoji: "🌙",
    color: "phase-menstrual",
    gradient: "gradient-menstrual",
    tips: [
      "Descanse mais e priorize o sono",
      "Evite exercícios intensos",
      "Hidrate-se bastante",
      "Pratique autocuidado",
    ],
    foods: ["Ferro: carnes vermelhas, feijão, espinafre", "Vitamina C para absorção de ferro", "Chocolate amargo com moderação", "Chás relaxantes"],
    exercises: ["Yoga suave", "Caminhadas leves", "Alongamentos", "Meditação"],
  },
  follicular: {
    name: "Fase Folicular",
    description: "Energia renovada! Ótimo momento para novos projetos e atividades.",
    emoji: "🌱",
    color: "phase-follicular",
    gradient: "gradient-follicular",
    tips: [
      "Aproveite a energia extra",
      "Comece novos projetos",
      "Socialize mais",
      "Experimente exercícios novos",
    ],
    foods: ["Proteínas magras", "Vegetais verdes", "Grãos integrais", "Sementes de abóbora"],
    exercises: ["HIIT", "Corrida", "Dança", "Treinos de força"],
  },
  ovulation: {
    name: "Fase Ovulatória",
    description: "Pico de energia e comunicação. Você está radiante!",
    emoji: "🌸",
    color: "phase-ovulation",
    gradient: "gradient-ovulation",
    tips: [
      "Aproveite eventos sociais",
      "Comunique-se mais",
      "Faça apresentações importantes",
      "Exercite-se intensamente",
    ],
    foods: ["Frutas frescas", "Vegetais crus", "Peixes", "Fibras"],
    exercises: ["Treinos intensos", "Esportes em grupo", "Natação", "Ciclismo"],
  },
  luteal: {
    name: "Fase Lútea",
    description: "Momento de completar tarefas e se preparar para o ciclo.",
    emoji: "🍂",
    color: "phase-luteal",
    gradient: "gradient-luteal",
    tips: [
      "Finalize projetos pendentes",
      "Organize sua rotina",
      "Evite sobrecarga",
      "Prepare-se para descanso",
    ],
    foods: ["Carboidratos complexos", "Magnésio: banana, abacate", "Vitamina B6", "Alimentos anti-inflamatórios"],
    exercises: ["Pilates", "Yoga", "Caminhadas", "Treinos moderados"],
  },
  detox: {
    name: "Fase Detox",
    description: "Momento de limpeza e renovação do corpo.",
    emoji: "🌿",
    color: "phase-detox",
    gradient: "gradient-detox",
    tips: [
      "Beba muita água",
      "Consuma alimentos naturais",
      "Evite processados",
      "Descanse adequadamente",
    ],
    foods: ["Sucos verdes", "Frutas detox", "Vegetais orgânicos", "Chás de ervas"],
    exercises: ["Yoga detox", "Caminhadas na natureza", "Respiração profunda", "Alongamentos"],
  },
};

export const defaultChecklist: ChecklistItem[] = [
  { id: "1", label: "Beber 8 copos de água", checked: false },
  { id: "2", label: "Tomar suplementos", checked: false },
  { id: "3", label: "Fazer exercício físico", checked: false },
  { id: "4", label: "Comer frutas e vegetais", checked: false },
  { id: "5", label: "Meditar ou relaxar", checked: false },
  { id: "6", label: "Dormir 8 horas", checked: false },
];

export const moodOptions = [
  { emoji: "😊", label: "Feliz", value: "happy" },
  { emoji: "😌", label: "Calma", value: "calm" },
  { emoji: "😐", label: "Neutra", value: "neutral" },
  { emoji: "😔", label: "Triste", value: "sad" },
  { emoji: "😤", label: "Irritada", value: "angry" },
  { emoji: "😰", label: "Ansiosa", value: "anxious" },
  { emoji: "😴", label: "Cansada", value: "tired" },
  { emoji: "🥰", label: "Amorosa", value: "loving" },
];

export const swellingAreas = [
  { id: "face", label: "Rosto" },
  { id: "hands", label: "Mãos" },
  { id: "belly", label: "Barriga" },
  { id: "legs", label: "Pernas" },
  { id: "feet", label: "Pés" },
  { id: "breasts", label: "Seios" },
];
