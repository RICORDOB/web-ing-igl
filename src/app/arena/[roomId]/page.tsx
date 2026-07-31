"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { rtdb } from "@/firebase/config";
import { ref, onValue, push, update, set, off, type Unsubscribe } from "firebase/database";
import lessons from "@/data/lessons";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useSpeech } from "@/lib/useSpeech";
import { Send, Mic, MicOff, Users, LogOut, Volume2, Crown, User, MessageCircle, Swords, Check, X } from "lucide-react";

interface Player {
  name: string;
  score: number;
}

interface ChatMsg {
  id?: string;
  user: string;
  text: string;
  timestamp: number;
}

export default function ArenaRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { progress, isAuthenticated, addArenaWin, addCorrectAnswer } = useGame();
  const roomId = params.roomId as string;

  const [mounted, setMounted] = useState(false);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [gameActive, setGameActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({ question: "", answer: "", options: [""] });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speak = useSpeech();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const allExercises = lessons.flatMap((l) => l.exercises);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setMounted(true);

    const roomRef = ref(rtdb, `rooms/${roomId}`);
    const playersRef = ref(rtdb, `rooms/${roomId}/players`);
    const chatRef = ref(rtdb, `rooms/${roomId}/chat`);
    const gameRef = ref(rtdb, `rooms/${roomId}/game`);

    const unsubRoom = onValue(roomRef, (snap) => {
      const data = snap.val();
      if (!data) {
        router.push("/arena");
        return;
      }
      if (data.host === progress.username) {
        setIsHost(true);
      }
    });

    const unsubPlayers = onValue(playersRef, (snap) => {
      const data = snap.val();
      if (data) setPlayers(data);
    });

    const unsubChat = onValue(chatRef, (snap) => {
      const data = snap.val();
      if (data) {
        const msgs: ChatMsg[] = Object.entries(data)
          .map(([id, msg]: [string, any]) => ({ id, ...msg }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setChatMessages(msgs);
      }
    });

    const unsubGame = onValue(gameRef, (snap) => {
      const data = snap.val();
      if (data) {
        setGameActive(data.active || false);
        if (data.currentQuestion != null) {
          setQuestionIndex(data.currentQuestion);
          const ex = allExercises[data.currentQuestion % allExercises.length];
          if (ex) {
            setCurrentQuestion({
              question: ex.question,
              answer: ex.correctAnswer,
              options: ex.options || [ex.correctAnswer],
            });
          }
        }
        setSelectedAnswer(null);
        setResult(null);
      }
    });

    return () => {
      off(roomRef);
      off(playersRef);
      off(chatRef);
      off(gameRef);
    };
  }, [isAuthenticated, router, roomId, progress.username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const chatRef = ref(rtdb, `rooms/${roomId}/chat`);
      push(chatRef, {
        user: progress.username,
        text: text.trim(),
        timestamp: Date.now(),
      });
      setChatInput("");
    },
    [roomId, progress.username]
  );

  const startGame = useCallback(async () => {
    const seed = Math.floor(Math.random() * 1000);
    await set(ref(rtdb, `rooms/${roomId}/game`), {
      active: true,
      currentQuestion: 0,
      seed,
    });
    // Reset scores
    const playersData = players || {};
    for (const name of Object.keys(playersData)) {
      await update(ref(rtdb), {
        [`rooms/${roomId}/players/${name}/score`]: 0,
      });
    }
  }, [roomId, players]);

  const answerQuestion = useCallback(
    async (answer: string) => {
      if (result !== null) return;
      setSelectedAnswer(answer);
      const correct =
        answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
      setResult(correct);

      if (correct) {
        const playerRef = ref(rtdb, `rooms/${roomId}/players/${progress.username}/score`);
        const currentScore = players[progress.username]?.score || 0;
        await update(ref(rtdb), {
          [`rooms/${roomId}/players/${progress.username}/score`]: currentScore + 10,
        });
        addCorrectAnswer();
      }

      setTimeout(async () => {
        const nextIdx = questionIndex + 1;
        if (nextIdx >= 10) {
          await set(ref(rtdb, `rooms/${roomId}/game`), {
            active: false,
            currentQuestion: nextIdx,
          });
          const myScore = players[progress.username]?.score || 0;
          if (myScore >= 50) {
            addArenaWin();
          }
          sendMessage(`${progress.username} terminó la batalla con ${myScore} puntos!`);
        } else {
          await update(ref(rtdb), {
            [`rooms/${roomId}/game/currentQuestion`]: nextIdx,
          });
        }
      }, 2000);
    },
    [result, currentQuestion, roomId, progress.username, players, questionIndex, addCorrectAnswer, addArenaWin, sendMessage]
  );

  const toggleListening = useCallback(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      setIsListening((prev) => !prev);
    }
  }, []);

  if (!mounted) return null;

  const playerList = Object.values(players);
  const playerCount = playerList.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Game Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/arena")}>
                <LogOut size={18} /> Salir
              </Button>
              <h1 className="text-xl font-bold text-purple-900">
                Sala: {roomId.slice(-6)}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              <span className="text-sm font-medium text-purple-600">{playerCount}/5</span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {playerList.map((p, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  p.name === progress.username
                    ? "bg-purple-100 border-2 border-purple-300"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <span className="text-lg flex items-center justify-center">
                  {p.name === progress.username ? <Crown size={20} className="text-amber-500" /> : <User size={20} className="text-purple-400" />}
                </span>
                <div>
                  <p className="text-sm font-bold text-purple-900">{p.name}</p>
                  <p className="text-xs text-amber-600 font-bold">{p.score || 0} pts</p>
                </div>
              </div>
            ))}
          </div>

          {!gameActive ? (
            <Card className="text-center py-12 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
                <Swords size={40} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-purple-900">
                {questionIndex > 0 ? "¡Batalla Completada!" : "Esperando jugadores..."}
              </h2>
              <p className="text-purple-500">
                {questionIndex > 0
                  ? "Usa el chat para hablar con tus amigos."
                  : "Cuando todos estén listos, inicia la batalla."}
              </p>
              {isHost && playerCount >= 1 && (
                <Button variant="gold" size="lg" onClick={startGame}>
                  ¡Iniciar Batalla!
                </Button>
              )}
              {!isHost && playerCount >= 1 && (
                <p className="text-sm text-purple-400">Esperando al anfitrión...</p>
              )}
              {playerCount < 1 && (
                <p className="text-sm text-purple-400">Comparte el código de sala con tus amigos</p>
              )}
            </Card>
          ) : (
            <Card className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-500">
                  Pregunta {questionIndex + 1}/10
                </span>
                <span className="font-bold text-amber-500">
                  {players[progress.username]?.score || 0} pts
                </span>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-purple-500 font-medium">Traduce o responde:</p>
                <p className="text-lg font-bold text-purple-900">{currentQuestion.question}</p>
                <button onClick={() => speak(currentQuestion.answer)} className="text-purple-500 hover:text-purple-700">
                  <Volume2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.slice(0, 4).map((opt, i) => {
                  let cls = "border-2 border-purple-200 hover:border-purple-400 bg-white";
                  if (result !== null && opt === currentQuestion.answer) {
                    cls = "border-2 border-green-500 bg-green-50";
                  } else if (result !== null && selectedAnswer === opt && !result) {
                    cls = "border-2 border-red-500 bg-red-50";
                  } else if (selectedAnswer === opt) {
                    cls = "border-2 border-purple-600 bg-purple-50";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => answerQuestion(opt)}
                      disabled={result !== null}
                      className={`rounded-xl p-4 text-sm font-semibold text-purple-900 transition-all ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {result !== null && (
                <div className={`text-center p-3 rounded-xl ${result ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"} font-bold`}>
                  {result ? <><Check size={18} className="inline" /> ¡Correcto! +10 pts</> : <><X size={18} className="inline" /> Respuesta: "{currentQuestion.answer}"</>}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Chat Sidebar */}
        <Card className="flex flex-col h-[500px]">
          <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
            <MessageCircle size={18} className="text-purple-500" /> Chat en vivo
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {chatMessages.map((msg, i) => (
              <div key={msg.id || i} className={`text-sm ${msg.user === progress.username ? "text-right" : ""}`}>
                <span className={`text-xs font-bold ${msg.user === progress.username ? "text-purple-600" : "text-blue-600"}`}>
                  {msg.user === progress.username ? "Tú" : msg.user}:
                </span>
                <p className="text-gray-700 break-words">{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(chatInput)}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-xl border-2 border-purple-200 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />
            <button
              onClick={() => sendMessage(chatInput)}
              disabled={!chatInput.trim()}
              className="p-2 rounded-xl bg-purple-700 text-white hover:bg-purple-600 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl ${isListening ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"} hover:opacity-80`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
