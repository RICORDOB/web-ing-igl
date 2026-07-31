export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  minLevel: number;
  route: string;
}

export const games: Game[] = [
  {
    id: "memory-bible",
    title: "Memorama Bíblico",
    description: "Encuentra los pares de palabras en inglés y español",
    icon: "🎴",
    image: "/games/memory-bible.svg",
    color: "#7C43BD",
    minLevel: 1,
    route: "/games/memory-bible",
  },
  {
    id: "race-of-faith",
    title: "Carrera de la Fe",
    description: "Escribe la palabra correcta antes de que se acabe el tiempo",
    icon: "🏃",
    image: "/games/race-of-faith.svg",
    color: "#1E88E5",
    minLevel: 2,
    route: "/games/race-of-faith",
  },
  {
    id: "armor-of-god",
    title: "Armadura de Dios",
    description: "Arrastra las piezas de la armadura a su lugar",
    icon: "🛡️",
    image: "/games/armor-of-god.svg",
    color: "#FF8F00",
    minLevel: 3,
    route: "/games/armor-of-god",
  },
  {
    id: "trivia",
    title: "Trivia Apocalíptica",
    description: "Responde preguntas bíblicas contrarreloj en inglés",
    icon: "⚡",
    image: "/games/trivia.svg",
    color: "#E53935",
    minLevel: 4,
    route: "/games/trivia",
  },
];
