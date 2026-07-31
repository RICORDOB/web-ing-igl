# 📖 Cristo English

**Aprende inglés mientras exploras la Biblia**

Plataforma educativa gamificada para niños y adolescentes cristianos. Combina el aprendizaje del inglés con el estudio de las Escrituras a través de lecciones interactivas, mini-juegos, avatares, insignias y modo multijugador.

> *"Train up a child in the way he should go: and when he is old, he will not depart from it." — Proverbs 22:6*

---

## 🚀 Tecnologías

| Tecnología | Uso |
|-----------|-----|
| **Next.js 16** | Framework full-stack (App Router) |
| **React 19** | UI de componentes |
| **TypeScript** | Tipado estático |
| **Tailwind CSS 4** | Estilos utilitarios |
| **Firebase** | Auth + Realtime Database |
| **Web Speech API** | Reconocimiento de voz (IA) |
| **WebRTC** | Audio en multiplayer |
| **LocalStorage** | Persistencia offline |

---

## 📁 Estructura del Proyecto

```
src/
├── app/               # Rutas y páginas
│   ├── page.tsx       # Landing page
│   ├── login/         # Autenticación
│   ├── dashboard/     # Mapa de lecciones
│   ├── learn/         # Lecciones interactivas
│   ├── games/         # Mini-juegos
│   ├── avatar/        # Personalización
│   ├── badges/        # Insignias
│   ├── ai/            # Práctica con IA
│   ├── arena/         # Multiplayer
│   ├── parents/       # Panel para padres
│   ├── dev/           # Panel de desarrollador
│   └── profile/       # Perfil
├── components/        # Componentes UI
├── context/           # Estado global
├── data/              # Contenido educativo
├── lib/               # Utilidades
└── firebase/          # Config Firebase
```

---

## 🎮 Features

### Lecciones (15)
Cada lección incluye vocabulario, versículo bíblico y ejercicios interactivos:

| Nivel | Tema |
|-------|------|
| 🟢 1 | La Creación |
| 🟢 2 | El Arca de Noé / Nacimiento de Jesús |
| 🟡 3 | David y Goliat / El Buen Pastor |
| 🟡 4 | Fruto del Espíritu / Josué / 10 Mandamientos |
| 🟠 5 | Armadura de Dios / Daniel / Moisés |
| 🔴 6 | Parábolas / Resurrección |
| 🔴 7 | Apocalipsis |

### Tipos de ejercicios
- **Traducción**: elige la palabra correcta
- **Completar versículo**: escribe la palabra faltante
- **Ordenar palabras**: arma la oración correcta
- **Opción múltiple**: preguntas de la historia bíblica
- **Listening**: escucha y responde (Web Speech API)

### Mini-juegos
- 🎴 **Memorama Bíblico** — pares inglés/español
- 🏃 **Carrera de la Fe** — traducción contrarreloj
- 🛡️ **Armadura de Dios** — vocabulario de Efesios 6
- ⚡ **Trivia Apocalíptica** — preguntas bíblicas

### IA + Voz
- Reconocimiento de voz (Web Speech API)
- Práctica de pronunciación
- Evaluación de respuestas orales
- Chat con personajes bíblicos

### Multiplayer (Arena)
- Salas de hasta 5 jugadores
- Chat en vivo (Firebase RTDB)
- Batallas bíblicas en tiempo real
- Audio en vivo (WebRTC)

### Gamificación
- XP (Puntos de Fe) por lecciones y juegos
- Rachas diarias
- 10 niveles (Semilla → Serafín)
- 12 insignias (bronce, plata, oro)
- 8 avatares bíblicos desbloqueables

---

## 🛠️ Instalación

```bash
# 1. Clonar
git clone <repo-url>
cd "web ing-igl"

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con credenciales de Firebase

# 4. Iniciar desarrollo
npm run dev

# 5. Abrir navegador
open http://localhost:3000
```

---

## 🔥 Firebase Setup

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Registrar app web → copiar credenciales a `.env.local`
3. Activar **Authentication** → Email/Password + Google
4. Activar **Realtime Database** → modo prueba
5. El proyecto usará localStorage como fallback automático

---

## 🌐 Despliegue

```bash
# Construir producción
npm run build

# Desplegar en Vercel (recomendado)
npx vercel --prod
```

---

## 📄 Licencia

Uso educativo y ministerial. Libre para iglesias y escuelas cristianas.

---

*Hecho con 🙏 para la próxima generación de creyentes*
