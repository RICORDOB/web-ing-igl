"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useGame } from "@/context/GameContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useSpeech } from "@/lib/useSpeech";
import { Mic, MicOff, Volume2, Send, Bot, User, RefreshCw, Target, PenLine, CheckCircle2, TriangleAlert } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const PHRASES = [
  { en: "God is love", es: "Dios es amor" },
  { en: "Jesus is my friend", es: "Jesús es mi amigo" },
  { en: "I love the Bible", es: "Amo la Biblia" },
  { en: "God created the world", es: "Dios creó el mundo" },
  { en: "I am a child of God", es: "Soy un hijo de Dios" },
  { en: "The Lord is good", es: "El Señor es bueno" },
  { en: "Pray without ceasing", es: "Oren sin cesar" },
  { en: "Walk by faith", es: "Caminen por fe" },
];

export default function AIPage() {
  const router = useRouter();
  const { progress, isAuthenticated, addWordLearned } = useGame();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `Hi ${progress.username || "there"}! I'm your English coach. Try saying a Bible verse in English!`,
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const speak = useSpeech();
  const [currentPhrase, setCurrentPhrase] = useState(PHRASES[0]);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognitionAPI();
      recog.lang = "en-US";
      recog.continuous = false;
      recog.interimResults = false;

      recog.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleSpeechResult(transcript);
      };

      recog.onerror = () => {
        setIsListening(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "I couldn't hear you clearly. Try again or check your microphone!" },
        ]);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }

    setMounted(true);
  }, [isAuthenticated, router, progress.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSpeechResult = useCallback(
    (transcript: string) => {
      setMessages((prev) => [...prev, { role: "user", text: transcript }]);
      setAttempts((prev) => prev + 1);

      const expected = currentPhrase.en.toLowerCase();
      const words = transcript.split(" ");
      const expectedWords = expected.split(" ");
      const matchedWords = words.filter((w) => expectedWords.includes(w));

      if (matchedWords.length / expectedWords.length >= 0.6) {
        const newPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
        setCurrentPhrase(newPhrase);
        setScore((prev) => prev + 10);
        addWordLearned(expectedWords.length);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `Great job! You said: "${transcript}". That's close to "${expected}"! Let's try another one.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `Good try! You said "${transcript}". Try saying: "${expected}". Keep going!`,
          },
        ]);
      }
    },
    [currentPhrase, addWordLearned]
  );

  const toggleListening = useCallback(() => {
    if (!recognition) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Your browser doesn't support speech recognition. Try Chrome on desktop!" },
      ]);
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
      setShowHint(true);
    }
  }, [recognition, isListening]);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-purple-900 flex items-center justify-center gap-2">
          <Bot className="text-purple-600" size={30} /> Aprende con IA
        </h1>
        <p className="text-purple-500">
          Practica tu pronunciación en inglés. ¡Habla y la IA te evaluará!
        </p>
      </div>

      {/* Score */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={24} className="text-purple-600" />
          <div>
            <p className="text-sm text-purple-500">Puntaje</p>
            <p className="text-xl font-bold text-purple-900">{score} XP</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PenLine size={24} className="text-purple-600" />
          <div>
            <p className="text-sm text-purple-500">Intentos</p>
            <p className="text-xl font-bold text-purple-900">{attempts}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setMessages([
              { role: "assistant", text: `Hi ${progress.username}! Let's practice more English!` },
            ]);
            setScore(0);
            setAttempts(0);
            setCurrentPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
          }}
        >
          <RefreshCw size={16} /> Reiniciar
        </Button>
      </Card>

      {/* Current Phrase */}
      <Card className="text-center space-y-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <p className="text-sm text-purple-500 font-medium">Di esta frase en INGLÉS:</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-2xl font-bold text-purple-900">{currentPhrase.es}</p>
          <button
            onClick={() => speak(currentPhrase.en)}
            className="p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200"
            title="Escuchar pronunciación"
          >
            <Volume2 size={24} />
          </button>
        </div>
        {showHint && (
          <p className="text-sm text-purple-400 italic">{currentPhrase.en}</p>
        )}
      </Card>

      {/* Chat */}
      <div className="space-y-4 max-h-96 overflow-y-auto p-4 rounded-2xl bg-white border border-purple-100">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                msg.role === "assistant" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "assistant"
                  ? "bg-gray-50 text-gray-800"
                  : "bg-purple-600 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? "bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse"
              : "bg-purple-700 text-white hover:bg-purple-600 shadow-lg"
          }`}
        >
          {isListening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
        <Button
          variant="secondary"
          onClick={() => speak(currentPhrase.en)}
        >
          <Volume2 size={18} /> Escuchar ejemplo
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs flex items-center justify-center gap-1.5">
          {recognition ? (
            <>
              <CheckCircle2 size={14} className="text-green-500" /> Speech Recognition disponible
            </>
          ) : (
            <>
              <TriangleAlert size={14} className="text-amber-500" /> Usa Chrome en desktop para mejor experiencia
            </>
          )}
        </p>
      </div>
    </div>
  );
}
