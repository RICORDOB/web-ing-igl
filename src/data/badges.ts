export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold";
  condition: string;
}

export const badges: Badge[] = [
  {
    id: "mustard-seed",
    name: "Semilla de Mostaza",
    description: "Completaste tu primera lección",
    icon: "🌱",
    tier: "bronze",
    condition: "Completar 1 lección",
  },
  {
    id: "living-water",
    name: "Manantial de Agua Viva",
    description: "10 lecciones completadas",
    icon: "💧",
    tier: "bronze",
    condition: "Completar 10 lecciones",
  },
  {
    id: "burning-bush",
    name: "Zarza Ardiente",
    description: "7 días de racha",
    icon: "🔥",
    tier: "silver",
    condition: "Mantener racha por 7 días",
  },
  {
    id: "goliath-slayer",
    name: "Matagigantes",
    description: "Ganaste 5 partidas en Arena",
    icon: "🗡️",
    tier: "silver",
    condition: "Ganar 5 partidas multiplayer",
  },
  {
    id: "pentecost",
    name: "Pentecostés",
    description: "50 palabras aprendidas",
    icon: "🕊️",
    tier: "silver",
    condition: "Aprender 50 palabras en inglés",
  },
  {
    id: "ark-builder",
    name: "Constructor del Arca",
    description: "30 lecciones completadas",
    icon: "🚢",
    tier: "silver",
    condition: "Completar 30 lecciones",
  },
  {
    id: "proverbs-sage",
    name: "Sabio de Proverbios",
    description: "100 versículos completados",
    icon: "📜",
    tier: "gold",
    condition: "Completar 100 versículos",
  },
  {
    id: "faithful-servant",
    name: "Siervo Fiel",
    description: "50 lecciones completadas",
    icon: "👑",
    tier: "gold",
    condition: "Completar 50 lecciones",
  },
  {
    id: "tongues-of-fire",
    name: "Lenguas de Fuego",
    description: "200 palabras aprendidas",
    icon: "🔤",
    tier: "gold",
    condition: "Aprender 200 palabras en inglés",
  },
  {
    id: "overcomer",
    name: "Vencedor",
    description: "Obtén todas las insignias",
    icon: "🏆",
    tier: "gold",
    condition: "Obtener todas las insignias",
  },
  {
    id: "word-warrior",
    name: "Guerrero de la Palabra",
    description: "100 respuestas correctas seguidas",
    icon: "⚔️",
    tier: "gold",
    condition: "Acertar 100 respuestas consecutivas",
  },
  {
    id: "crown-of-life",
    name: "Corona de Vida",
    description: "Nivel máximo alcanzado",
    icon: "👑",
    tier: "gold",
    condition: "Alcanzar el nivel máximo",
  },
];
