export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  tier: "bronze" | "silver" | "gold";
  condition: string;
}

export const badges: Badge[] = [
  {
    id: "mustard-seed",
    name: "Semilla de Mostaza",
    description: "Completaste tu primera lección",
    image: "/badges/mustard-seed.svg",
    tier: "bronze",
    condition: "Completar 1 lección",
  },
  {
    id: "living-water",
    name: "Manantial de Agua Viva",
    description: "10 lecciones completadas",
    image: "/badges/living-water.svg",
    tier: "bronze",
    condition: "Completar 10 lecciones",
  },
  {
    id: "burning-bush",
    name: "Zarza Ardiente",
    description: "7 días de racha",
    image: "/badges/burning-bush.svg",
    tier: "silver",
    condition: "Mantener racha por 7 días",
  },
  {
    id: "goliath-slayer",
    name: "Matagigantes",
    description: "Ganaste 5 partidas en Arena",
    image: "/badges/goliath-slayer.svg",
    tier: "silver",
    condition: "Ganar 5 partidas multiplayer",
  },
  {
    id: "pentecost",
    name: "Pentecostés",
    description: "50 palabras aprendidas",
    image: "/badges/pentecost.svg",
    tier: "silver",
    condition: "Aprender 50 palabras en inglés",
  },
  {
    id: "ark-builder",
    name: "Constructor del Arca",
    description: "30 lecciones completadas",
    image: "/badges/ark-builder.svg",
    tier: "silver",
    condition: "Completar 30 lecciones",
  },
  {
    id: "proverbs-sage",
    name: "Sabio de Proverbios",
    description: "100 versículos completados",
    image: "/badges/proverbs-sage.svg",
    tier: "gold",
    condition: "Completar 100 versículos",
  },
  {
    id: "faithful-servant",
    name: "Siervo Fiel",
    description: "50 lecciones completadas",
    image: "/badges/faithful-servant.svg",
    tier: "gold",
    condition: "Completar 50 lecciones",
  },
  {
    id: "tongues-of-fire",
    name: "Lenguas de Fuego",
    description: "200 palabras aprendidas",
    image: "/badges/tongues-of-fire.svg",
    tier: "gold",
    condition: "Aprender 200 palabras en inglés",
  },
  {
    id: "overcomer",
    name: "Vencedor",
    description: "Obtén todas las insignias",
    image: "/badges/overcomer.svg",
    tier: "gold",
    condition: "Obtener todas las insignias",
  },
  {
    id: "word-warrior",
    name: "Guerrero de la Palabra",
    description: "100 respuestas correctas seguidas",
    image: "/badges/word-warrior.svg",
    tier: "gold",
    condition: "Acertar 100 respuestas consecutivas",
  },
  {
    id: "crown-of-life",
    name: "Corona de Vida",
    description: "Nivel máximo alcanzado",
    image: "/badges/crown-of-life.svg",
    tier: "gold",
    condition: "Alcanzar el nivel máximo",
  },
];
