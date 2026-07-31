"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useGame } from "@/context/GameContext";
import lessons from "@/data/lessons";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useSpeech } from "@/lib/useSpeech";
import GameIcon from "@/components/GameIcon";
import { games } from "@/data/games";
import { Volume2, RefreshCw, Home, PartyPopper, Dumbbell, Shield, Zap, Check, X } from "lucide-react";

type GameState = "playing" | "won" | "lost";

interface ArmorPiece {
  id: string;
  en: string;
  es: string;
  image: string;
}

const ARMOR_PIECES: ArmorPiece[] = [
  { id: "helmet", en: "helmet of salvation", es: "casco de salvación", image: "/armor/helmet.svg" },
  { id: "breastplate", en: "breastplate of righteousness", es: "coraza de justicia", image: "/armor/breastplate.svg" },
  { id: "shield", en: "shield of faith", es: "escudo de la fe", image: "/armor/shield.svg" },
  { id: "sword", en: "sword of the Spirit", es: "espada del Espíritu", image: "/armor/sword.svg" },
  { id: "belt", en: "belt of truth", es: "cinturón de verdad", image: "/armor/belt.svg" },
  { id: "shoes", en: "shoes of peace", es: "zapatos de paz", image: "/armor/boots.svg" },
];

const TRIVIA_QUESTIONS = [
  { q: "Who created the world?", a: "God", opts: ["God", "Moses", "David", "Noah"] },
  { q: "What did God create on the first day?", a: "Light", opts: ["Light", "Animals", "Trees", "Fish"] },
  { q: "How many days did God use to create the world?", a: "6", opts: ["6", "7", "5", "10"] },
  { q: "What did Noah build?", a: "An ark", opts: ["An ark", "A tower", "A temple", "A house"] },
  { q: "How many of each animal did Noah take on the ark?", a: "Two", opts: ["Two", "One", "Seven", "Ten"] },
  { q: "What sign did God give after the flood?", a: "A rainbow", opts: ["A rainbow", "A cloud", "A dove", "The sun"] },
  { q: "Who defeated Goliath?", a: "David", opts: ["David", "Samson", "Saul", "Joshua"] },
  { q: "What did David use to defeat Goliath?", a: "A sling and a stone", opts: ["A sling and a stone", "A sword", "A spear", "A bow"] },
  { q: "Who wrote the Psalms?", a: "David", opts: ["David", "Solomon", "Moses", "Abraham"] },
  { q: "The Lord is my ___ (Psalm 23)", a: "Shepherd", opts: ["Shepherd", "King", "Father", "Friend"] },
  { q: "How many fruits of the Spirit are there?", a: "9", opts: ["9", "7", "12", "5"] },
  { q: "What is the first fruit of the Spirit?", a: "Love", opts: ["Love", "Joy", "Peace", "Patience"] },
  { q: "What should we put on to fight spiritual battles?", a: "The armor of God", opts: ["The armor of God", "A sword", "Shield", "Crown"] },
  { q: "What protects your head in the armor of God?", a: "Helmet of salvation", opts: ["Helmet of salvation", "Shield of faith", "Sword of the Spirit", "Belt of truth"] },
  { q: "Who was thrown into a lion's den?", a: "Daniel", opts: ["Daniel", "David", "Samson", "Jonah"] },
  { q: "Who was swallowed by a big fish?", a: "Jonah", opts: ["Jonah", "Noah", "Peter", "Paul"] },
  { q: "Who built the ark?", a: "Noah", opts: ["Noah", "Moses", "Abraham", "Solomon"] },
  { q: "What did God send to Egypt?", a: "Plagues", opts: ["Plagues", "Rain", "Fire", "Angels"] },
  { q: "Who received the Ten Commandments?", a: "Moses", opts: ["Moses", "Abraham", "David", "Joshua"] },
  { q: "Where was Jesus born?", a: "Bethlehem", opts: ["Bethlehem", "Nazareth", "Jerusalem", "Egypt"] },
  { q: "What is the longest book in the Bible?", a: "Psalms", opts: ["Psalms", "Genesis", "Isaiah", "Jeremiah"] },
  { q: "What does 'John 3:16' say God gave?", a: "His only Son", opts: ["His only Son", "The law", "The ark", "The land"] },
  { q: "Who was the first king of Israel?", a: "Saul", opts: ["Saul", "David", "Solomon", "Samuel"] },
  { q: "Who was the wisest king?", a: "Solomon", opts: ["Solomon", "David", "Saul", "Samuel"] },
  { q: "What did Jesus say to the storm?", a: "Peace, be still", opts: ["Peace, be still", "Go away", "Stop now", "Be quiet"] },
];

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { progress, isAuthenticated, addCorrectAnswer, addWordLearned } = useGame();
  const gameId = params.gameId as string;

  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(10);
  const [currentEn, setCurrentEn] = useState("");
  const [currentEs, setCurrentEs] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showInstructions, setShowInstructions] = useState(true);

  const [memoramaCards, setMemoramaCards] = useState<{
    id: number; text: string; flipped: boolean; matched: boolean; pairId: number;
  }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [memoramaMoves, setMemoramaMoves] = useState(0);

  // Armor game state
  const [armorRound, setArmorRound] = useState(0);
  const [currentArmorPiece, setCurrentArmorPiece] = useState<ArmorPiece | null>(null);
  const [armorOptions, setArmorOptions] = useState<string[]>([]);
  const [armorScore, setArmorScore] = useState(0);

  // Trivia state
  const [triviaQuestions, setTriviaQuestions] = useState<typeof TRIVIA_QUESTIONS>([]);
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);

  const speak = useSpeech();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentEnRef = useRef(currentEn);
  const currentEsRef = useRef(currentEs);
  const roundRef = useRef(round);

  useEffect(() => {
    currentEnRef.current = currentEn;
    currentEsRef.current = currentEs;
    roundRef.current = round;
  }, [currentEn, currentEs, round]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  const allVocabulary = useMemo(() => lessons.flatMap((l) => l.vocabulary), []);

  // --- Memory Game ---
  const startMemoryGame = useCallback(() => {
    const selected = allVocabulary.sort(() => Math.random() - 0.5).slice(0, 6);
    const cards = [
      ...selected.map((w, i) => ({ id: i, text: w.en, flipped: false, matched: false, pairId: i })),
      ...selected.map((w, i) => ({ id: i + selected.length, text: w.es, flipped: false, matched: false, pairId: i })),
    ];
    setMemoramaCards(cards.sort(() => Math.random() - 0.5));
    setMatchedPairs(0);
    setMemoramaMoves(0);
    setScore(0);
    setGameState("playing");
  }, [allVocabulary]);

  const handleMemoramaFlip = (index: number) => {
    if (flippedCards.length >= 2) return;
    const card = memoramaCards[index];
    if (card.flipped || card.matched) return;
    const newCards = [...memoramaCards];
    newCards[index] = { ...newCards[index], flipped: true };
    setMemoramaCards(newCards);
    setFlippedCards((prev) => [...prev, index]);
    if (flippedCards.length === 1) {
      setMemoramaMoves((prev) => prev + 1);
      const first = memoramaCards[flippedCards[0]];
      if (first.pairId === card.pairId && first.id !== card.id) {
        setTimeout(() => {
          setMemoramaCards((prev) => prev.map((c) => (c.pairId === card.pairId ? { ...c, matched: true } : c)));
          setMatchedPairs((prev) => {
            const next = prev + 1;
            setFlippedCards([]);
            setScore((p) => p + 10);
            addCorrectAnswer();
            if (next === 6) { setGameState("won"); addWordLearned(6); }
            return next;
          });
        }, 500);
      } else {
        setTimeout(() => {
          setMemoramaCards((prev) => prev.map((c) => (c.id === first.id || c.id === card.id ? { ...c, flipped: false } : c)));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // --- Race Game ---
  const startRaceGame = useCallback(() => {
    const word = allVocabulary[Math.floor(Math.random() * allVocabulary.length)];
    setCurrentEn(word.en);
    setCurrentEs(word.es);
    const wrong = allVocabulary.filter((w) => w.es !== word.es).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.en);
    setOptions([word.en, ...wrong].sort(() => Math.random() - 0.5));
    setSelected(null); setResult(null); setTimeLeft(15); setRound(0); setScore(0);
    setGameState("playing");
  }, [allVocabulary]);

  const nextRaceRound = () => {
    const word = allVocabulary[Math.floor(Math.random() * allVocabulary.length)];
    setCurrentEn(word.en);
    setCurrentEs(word.es);
    const wrong = allVocabulary.filter((w) => w.es !== word.es).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.en);
    setOptions([word.en, ...wrong].sort(() => Math.random() - 0.5));
    setSelected(null); setResult(null); setTimeLeft(15);
  };

  // --- Armor of God Game ---
  const startArmorGame = useCallback(() => {
    setArmorRound(0);
    setArmorScore(0);
    setGameState("playing");
    nextArmorRound(0);
  }, []);

  const nextArmorRound = (idx: number) => {
    if (idx >= ARMOR_PIECES.length) { setGameState("won"); return; }
    const piece = ARMOR_PIECES[idx];
    setCurrentArmorPiece(piece);
    const wrong = ARMOR_PIECES.filter((p) => p.id !== piece.id).sort(() => Math.random() - 0.5).slice(0, 3).map((p) => p.en);
    setArmorOptions([piece.en, ...wrong].sort(() => Math.random() - 0.5));
    setSelected(null); setResult(null);
    setArmorRound(idx);
  };

  const handleArmorAnswer = (answer: string) => {
    if (result !== null || !currentArmorPiece) return;
    setSelected(answer);
    const correct = answer === currentArmorPiece.en;
    setResult(correct);
    if (correct) { setArmorScore((p) => p + 10); addCorrectAnswer(); addWordLearned(); }
    setTimeout(() => {
      const next = armorRound + 1;
      if (next >= ARMOR_PIECES.length) { setScore(armorScore + (correct ? 10 : 0)); setGameState("won"); }
      else nextArmorRound(next);
    }, 1200);
  };

  // --- Trivia Game ---
  const startTriviaGame = useCallback(() => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setTriviaQuestions(shuffled);
    setTriviaIdx(0);
    setTriviaScore(0);
    setScore(0);
    setSelected(null); setResult(null); setTimeLeft(15);
    setGameState("playing");
  }, []);

  const handleTriviaAnswer = (answer: string) => {
    if (result !== null) return;
    setSelected(answer);
    const q = triviaQuestions[triviaIdx];
    const correct = answer === q.a;
    setResult(correct);
    if (correct) {
      setTriviaScore((p) => p + 10);
      setScore((p) => p + 10);
      addCorrectAnswer();
    }
    setTimeout(() => {
      const next = triviaIdx + 1;
      if (next >= triviaQuestions.length) { setGameState("won"); }
      else { setTriviaIdx(next); setSelected(null); setResult(null); setTimeLeft(15); }
    }, 1500);
  };

  // --- Init game on mount ---
  useEffect(() => {
    if (!mounted) return;
    if (gameId === "memory-bible") startMemoryGame();
    else if (gameId === "armor-of-god") startArmorGame();
    else if (gameId === "trivia") startTriviaGame();
    else startRaceGame();
  }, [gameId, mounted, startMemoryGame, startArmorGame, startTriviaGame, startRaceGame]);

  // Timer for timed games
  useEffect(() => {
    if (gameState !== "playing" || gameId === "memory-bible" || gameId === "armor-of-god") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); setGameState("lost"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, round, triviaIdx, gameId]);

  // --- Race answer handler ---
  const handleRaceAnswer = (answer: string) => {
    if (result !== null) return;
    setSelected(answer);
    const correct = answer === currentEn;
    setResult(correct);
    if (correct) { setScore((prev) => prev + 10); addCorrectAnswer(); addWordLearned(); }
    setTimeout(() => {
      if (round + 1 >= totalRounds) { setGameState(correct ? "won" : "lost"); }
      else { setRound((prev) => prev + 1); nextRaceRound(); }
    }, 1000);
  };

  if (!mounted) return null;

  // --- Instructions screen ---
  if (showInstructions) {
    const info: Record<string, { title: string; desc: string }> = {
      "memory-bible": { title: "Memorama Bíblico", desc: "Encuentra los pares de palabras en inglés y español. ¡Usa tu memoria!" },
      "race-of-faith": { title: "Carrera de la Fe", desc: "Selecciona la traducción correcta antes de que se acabe el tiempo." },
      "armor-of-god": { title: "Armadura de Dios", desc: "Relaciona cada pieza de la armadura con su nombre en inglés." },
      "trivia": { title: "Trivia Apocalíptica", desc: "Responde preguntas bíblicas en inglés contrarreloj. ¿Cuánto sabes?" },
    };
    const currentGame = games.find((g) => g.id === gameId);
    const current = info[gameId] || { title: "Juego", desc: "Demuestra cuánto has aprendido." };
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <GameIcon gameId={gameId} image={currentGame?.image || "/games/memory-bible.svg"} color={currentGame?.color || "#7C43BD"} size={80} />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">{current.title}</h2>
          <p className="text-purple-600">{current.desc}</p>
          <Button variant="primary" size="lg" className="w-full" onClick={() => setShowInstructions(false)}>
            ¡Empezar!
          </Button>
        </Card>
      </div>
    );
  }

  // --- Win / Lose screens ---
  if (gameState === "won") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <PartyPopper size={44} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">¡Victoria!</h2>
          <p className="text-3xl font-bold text-amber-500">+{score || armorScore || triviaScore * 10} XP</p>
          {gameId === "memory-bible" && <p className="text-purple-500">Movimientos: {memoramaMoves}</p>}
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push("/games")}><Home size={18} /> Juegos</Button>
            <Button variant="primary" onClick={() => setShowInstructions(true)}><RefreshCw size={18} /> Otra vez</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === "lost") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/30">
            <Dumbbell size={44} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">¡Sigue intentando!</h2>
          <p className="text-purple-600 italic">&ldquo;The righteous falls seven times and rises again.&rdquo;</p>
          <p className="text-purple-500">— Proverbs 24:16</p>
          <p className="text-lg font-bold text-purple-900">Puntaje: {score} XP</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push("/games")}><Home size={18} /> Juegos</Button>
            <Button variant="primary" onClick={() => setShowInstructions(true)}><RefreshCw size={18} /> Reintentar</Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- Memory Bible ---
  if (gameId === "memory-bible") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/games")}><Home size={18} /> Salir</Button>
          <div className="text-center"><p className="text-sm text-purple-500">Pares: {matchedPairs}/6</p><p className="text-sm text-purple-500">Movimientos: {memoramaMoves}</p></div>
          <p className="font-bold text-amber-500">{score} XP</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {memoramaCards.map((card, index) => (
            <button key={card.id} onClick={() => handleMemoramaFlip(index)}
              className={`aspect-square rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                card.matched ? "bg-green-100 border-2 border-green-300 opacity-70" :
                card.flipped ? "bg-white border-2 border-purple-400 shadow-md" :
                "bg-purple-700 text-white hover:bg-purple-600 shadow-md"
              }`}
            >{card.flipped || card.matched ? card.text : "?"}</button>
          ))}
        </div>
      </div>
    );
  }

  // --- Race of Faith ---
  if (gameId === "race-of-faith") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/games")}><Home size={18} /> Salir</Button>
          <div className="text-center">
            <p className="text-sm text-purple-500">Ronda {round + 1}/{totalRounds}</p>
            <ProgressBar value={round} max={totalRounds} color="bg-purple-600" size="sm" showLabel={false} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${timeLeft <= 5 ? "text-red-500" : "text-amber-500"}`}>{timeLeft}s</span>
            <span className="font-bold text-amber-500">{score} XP</span>
          </div>
        </div>
        <Card className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <p className="text-2xl font-bold text-purple-900">{currentEs}</p>
            <button onClick={() => speak(currentEn)} className="p-2 text-purple-500 hover:text-purple-700"><Volume2 size={20} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => {
              let cls = "border-2 border-purple-200 hover:border-purple-400 bg-white";
              if (result !== null && opt === currentEn) cls = "border-2 border-green-500 bg-green-50";
              else if (result !== null && selected === opt) cls = "border-2 border-red-500 bg-red-50";
              else if (selected === opt) cls = "border-2 border-purple-600 bg-purple-50";
              return (
                <button key={opt} onClick={() => handleRaceAnswer(opt)} disabled={result !== null}
                  className={`rounded-xl p-4 font-semibold text-purple-900 transition-all ${cls}`}
                >{opt}</button>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  // --- Armor of God ---
  if (gameId === "armor-of-god") {
    if (!currentArmorPiece) return null;
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/games")}><Home size={18} /> Salir</Button>
          <div className="text-center">
            <p className="text-sm text-purple-500">Pieza {armorRound + 1}/{ARMOR_PIECES.length}</p>
            <ProgressBar value={armorRound} max={ARMOR_PIECES.length} color="bg-amber-500" size="sm" showLabel={false} />
          </div>
          <p className="font-bold text-amber-500">{armorScore} XP</p>
        </div>

        <Card className="text-center space-y-6 py-10">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30 animate-float">
            <img
              src={currentArmorPiece.image}
              alt={currentArmorPiece.es}
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <p className="text-lg text-purple-600 font-medium">¿Cómo se dice en inglés?</p>
            <p className="text-3xl font-bold text-purple-900 mt-1">{currentArmorPiece.es}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {armorOptions.map((opt) => {
              let cls = "border-2 border-purple-200 hover:border-purple-400 bg-white";
              if (result !== null && opt === currentArmorPiece!.en) cls = "border-2 border-green-500 bg-green-50";
              else if (result !== null && selected === opt) cls = "border-2 border-red-500 bg-red-50";
              else if (selected === opt) cls = "border-2 border-purple-600 bg-purple-50";
              return (
                <button key={opt} onClick={() => handleArmorAnswer(opt)} disabled={result !== null}
                  className={`rounded-xl p-4 text-sm font-semibold text-purple-900 transition-all ${cls}`}
                >{opt}</button>
              );
            })}
          </div>
          {result !== null && (
            <p className={`text-sm font-bold ${result ? "text-green-600" : "text-orange-600"}`}>
              {result ? <><Check size={16} /> ¡Correcto! +10 XP</> : <><X size={16} /> "{currentArmorPiece.en}"</>}
              <button onClick={() => speak(currentArmorPiece.en)} className="ml-2 text-purple-500 hover:text-purple-700 inline-flex"><Volume2 size={16} /></button>
            </p>
          )}
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <p className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5"><Shield size={16} /> Efesios 6:13-17</p>
          <p className="text-xs text-amber-700 italic">&ldquo;Put on the full armor of God, so that you can take your stand against the devil&rsquo;s schemes.&rdquo;</p>
        </Card>
      </div>
    );
  }

  // --- Trivia ---
  if (gameId === "trivia") {
    const q = triviaQuestions[triviaIdx];
    if (!q) return null;
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/games")}><Home size={18} /> Salir</Button>
          <div className="text-center">
            <p className="text-sm text-purple-500">Pregunta {triviaIdx + 1}/{triviaQuestions.length}</p>
            <ProgressBar value={triviaIdx} max={triviaQuestions.length} color="bg-red-500" size="sm" showLabel={false} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${timeLeft <= 5 ? "text-red-500" : "text-amber-500"}`}>{timeLeft}s</span>
            <span className="font-bold text-amber-500">{score} XP</span>
          </div>
        </div>

        <Card className="text-center space-y-6 py-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Zap size={32} className="text-white" />
          </div>
          <p className="text-xl font-bold text-purple-900">{q.q}</p>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {q.opts.map((opt) => {
              let cls = "border-2 border-purple-200 hover:border-purple-400 bg-white";
              if (result !== null && opt === q.a) cls = "border-2 border-green-500 bg-green-50";
              else if (result !== null && selected === opt) cls = "border-2 border-red-500 bg-red-50";
              else if (selected === opt) cls = "border-2 border-purple-600 bg-purple-50";
              return (
                <button key={opt} onClick={() => handleTriviaAnswer(opt)} disabled={result !== null}
                  className={`rounded-xl p-4 text-sm font-semibold text-purple-900 transition-all ${cls}`}
                >{opt}</button>
              );
            })}
          </div>
          {result !== null && (
            <p className={`text-sm font-bold ${result ? "text-green-600" : "text-orange-600"}`}>
              {result ? <><Check size={16} /> ¡Correcto! +10 XP</> : <><X size={16} /> "{q.a}"</>}
            </p>
          )}
        </Card>
      </div>
    );
  }

  return null;
}
