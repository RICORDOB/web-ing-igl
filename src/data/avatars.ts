export interface Avatar {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  color: string;
  gradient: string;
  icon: string;
  unlockCondition: string;
  unlockLevel: number;
  dicebearSeed: string;
}

export const avatars: Avatar[] = [
  {
    id: "lion-of-judah",
    name: "León de Judá",
    nameEn: "Lion of Judah",
    description: "Valiente y fuerte como un león",
    color: "#FF8F00",
    gradient: "from-amber-500 to-orange-600",
    icon: "🦁",
    unlockCondition: "Completar la primera lección",
    unlockLevel: 0,
    dicebearSeed: "lion-judah",
  },
  {
    id: "david",
    name: "David",
    nameEn: "David",
    description: "El pastor que venció gigantes",
    color: "#1E88E5",
    gradient: "from-blue-500 to-blue-700",
    icon: "⚔️",
    unlockCondition: "Completar 5 lecciones",
    unlockLevel: 1,
    dicebearSeed: "david-shepherd",
  },
  {
    id: "esther",
    name: "Ester",
    nameEn: "Esther",
    description: "Princesa valiente y sabia",
    color: "#E91E63",
    gradient: "from-pink-500 to-rose-600",
    icon: "👑",
    unlockCondition: "Completar 10 lecciones",
    unlockLevel: 2,
    dicebearSeed: "queen-esther",
  },
  {
    id: "samson",
    name: "Sansón",
    nameEn: "Samson",
    description: "Fuerza sobrenatural",
    color: "#795548",
    gradient: "from-amber-700 to-brown-800",
    icon: "💪",
    unlockCondition: "Obtener 3 insignias",
    unlockLevel: 3,
    dicebearSeed: "samson-strong",
  },
  {
    id: "noah",
    name: "Noé",
    nameEn: "Noah",
    description: "Constructor del arca",
    color: "#4CAF50",
    gradient: "from-green-500 to-emerald-700",
    icon: "🌊",
    unlockCondition: "Completar 20 lecciones",
    unlockLevel: 4,
    dicebearSeed: "noah-ark",
  },
  {
    id: "jonah",
    name: "Jonás",
    nameEn: "Jonah",
    description: "Aventurero del mar",
    color: "#00BCD4",
    gradient: "from-cyan-400 to-cyan-700",
    icon: "🐋",
    unlockCondition: "Mantener racha de 7 días",
    unlockLevel: 5,
    dicebearSeed: "jonah-whale",
  },
  {
    id: "dove",
    name: "Paloma",
    nameEn: "Dove",
    description: "Pura y llena de paz",
    color: "#9E9E9E",
    gradient: "from-gray-200 to-gray-400",
    icon: "🕊️",
    unlockCondition: "Completar 30 lecciones",
    unlockLevel: 6,
    dicebearSeed: "dove-peace",
  },
  {
    id: "elijah",
    name: "Elías",
    nameEn: "Elijah",
    description: "Profeta de fuego",
    color: "#FF5722",
    gradient: "from-red-500 to-orange-600",
    icon: "⚡",
    unlockCondition: "Obtener todas las insignias",
    unlockLevel: 7,
    dicebearSeed: "elijah-fire",
  },
];
