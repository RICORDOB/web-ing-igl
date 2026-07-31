"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import lessons from "@/data/lessons";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useSound } from "@/lib/useSound";
import { useSpeech } from "@/lib/useSpeech";
import { Check, X, ArrowLeft, ArrowRight, Volume2, PartyPopper, ThumbsUp, Dumbbell, BookOpen } from "lucide-react";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { progress, isAuthenticated, completeLesson, addCorrectAnswer, addWordLearned } = useGame();

  const lessonId = params.lessonId as string;
  const lesson = lessons.find((l) => l.id === lessonId);

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const { play } = useSound();
  const speak = useSpeech();
  const [mounted, setMounted] = useState(false);

  const exercise = mounted && lesson ? lesson.exercises[currentExerciseIdx] : null;

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !exercise) return;
      setSelectedAnswer(answer);
      const correct = answer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
      setIsCorrect(correct);
      setShowResult(true);
      setTotalAnswered((prev) => prev + 1);
      if (correct) {
        setScore((prev) => prev + 1);
        addCorrectAnswer();
        play("correct");
      } else {
        play("wrong");
      }
    },
    [exercise, showResult, addCorrectAnswer, play]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!lesson) {
      router.push("/dashboard");
      return;
    }
    setMounted(true);
    if (lesson.exercises[0]?.type === "order-words") {
      const words = lesson.exercises[0].correctAnswer.split(" ");
      setOrderedWords(shuffleArray([...words]));
    }
  }, [isAuthenticated, lesson, router]);

  if (!mounted || !lesson) return null;

  if (!exercise) {
    router.push("/dashboard");
    return null;
  }

  const handleOrderSubmit = () => {
    const answer = orderedWords.join(" ");
    handleAnswer(answer);
  };

  const handleNext = () => {
    if (currentExerciseIdx < lesson.exercises.length - 1) {
      const nextIdx = currentExerciseIdx + 1;
      setCurrentExerciseIdx(nextIdx);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowResult(false);
      const nextExercise = lesson.exercises[nextIdx];
      if (nextExercise.type === "order-words") {
        const words = nextExercise.correctAnswer.split(" ");
        setOrderedWords(shuffleArray([...words]));
      }
    } else {
      setCompleted(true);
      const xpEarned = Math.round(lesson.xpReward * (score / lesson.exercises.length));
      completeLesson(lessonId, xpEarned);
      addWordLearned(lesson.vocabulary.length);
    }
  };

  const moveWord = (index: number, direction: "left" | "right") => {
    const newOrder = [...orderedWords];
    const swapIndex = direction === "left" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newOrder.length) return;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    setOrderedWords(newOrder);
  };

  if (completed) {
    const pct = Math.round((score / lesson.exercises.length) * 100);
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 animate-float">
              {pct >= 80 ? (
                <PartyPopper size={44} className="text-white" />
              ) : pct >= 50 ? (
                <ThumbsUp size={44} className="text-white" />
              ) : (
                <Dumbbell size={44} className="text-white" />
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-900">
            {pct >= 80 ? "¡Excelente!" : pct >= 50 ? "¡Buen trabajo!" : "¡Sigue intentando!"}
          </h2>
          <p className="text-purple-600">
            Completaste &ldquo;{lesson.titleEn}&rdquo;
          </p>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-amber-500">+{Math.round(lesson.xpReward * (score / lesson.exercises.length))} XP</p>
            <ProgressBar value={score} max={lesson.exercises.length} color="bg-green-500" />
            <p className="text-sm text-purple-500">
              {score}/{lesson.exercises.length} correctas
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push("/dashboard")}>
              Volver al mapa
            </Button>
            <Button variant="primary" onClick={() => router.push("/learn/" + lessonId)}>
              Repetir lección
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft size={18} /> Salir
        </Button>
        <p className="text-sm text-purple-500 font-medium">
          {currentExerciseIdx + 1} / {lesson.exercises.length}
        </p>
      </div>
      <ProgressBar value={currentExerciseIdx} max={lesson.exercises.length} color="bg-purple-600" />

      <div className="text-center space-y-1">
        <p className="text-sm text-purple-500 font-medium">{lesson.topic}</p>
        <h2 className="text-xl font-bold text-purple-900">{lesson.title}</h2>
        <p className="text-xs text-purple-400 italic">&ldquo;{lesson.verse}&rdquo; &mdash; {lesson.verseRef}</p>
      </div>

      <Card className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-purple-900">{exercise.question}</p>
          {exercise.type === "listening" && (
            <button
              onClick={() => speak(exercise.audioText || exercise.correctAnswer)}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800"
            >
              <Volume2 size={24} />
              <span className="text-sm font-medium">Escuchar</span>
            </button>
          )}
        </div>

        {exercise.type === "translate" && exercise.options && (
          <div className="grid grid-cols-2 gap-3">
            {exercise.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              let cls = "border-2 border-purple-200 hover:border-purple-400 bg-white";
              if (showResult && opt === exercise.correctAnswer) cls = "border-2 border-green-500 bg-green-50";
              else if (showResult && isSelected && !isCorrect) cls = "border-2 border-red-500 bg-red-50";
              else if (isSelected) cls = "border-2 border-purple-600 bg-purple-50";

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={showResult}
                  className={`rounded-xl p-4 text-center font-semibold text-purple-900 transition-all ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {exercise.type === "fill-blank" && (
          <div className="space-y-4">
            <p className="text-xl text-center font-medium text-purple-800 italic">
              &ldquo;{exercise.question.replace("___", "______")}&rdquo;
            </p>
            <input
              type="text"
              value={selectedAnswer || ""}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && selectedAnswer) handleAnswer(selectedAnswer); }}
              placeholder="Escribe tu respuesta..."
              className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-center text-lg font-medium outline-none focus:border-purple-500"
              disabled={showResult}
              autoFocus
            />
            <Button
              variant="primary"
              className="w-full"
              onClick={() => selectedAnswer && handleAnswer(selectedAnswer)}
              disabled={showResult || !selectedAnswer}
            >
              Verificar <Check size={18} />
            </Button>
          </div>
        )}

        {exercise.type === "order-words" && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {orderedWords.map((word, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <button
                    onClick={() => moveWord(idx, "left")}
                    disabled={idx === 0}
                    className="p-1 text-purple-400 hover:text-purple-600 disabled:opacity-30"
                  >
                    ◀
                  </button>
                  <span className="px-4 py-2 rounded-lg bg-purple-100 text-purple-900 font-semibold">
                    {word}
                  </span>
                  <button
                    onClick={() => moveWord(idx, "right")}
                    disabled={idx === orderedWords.length - 1}
                    className="p-1 text-purple-400 hover:text-purple-600 disabled:opacity-30"
                  >
                    ▶
                  </button>
                </div>
              ))}
            </div>
            <Button variant="primary" className="w-full" onClick={handleOrderSubmit} disabled={showResult}>
              Verificar <Check size={18} />
            </Button>
          </div>
        )}

        {exercise.type === "multiple-choice" && exercise.options && (
          <div className="space-y-3">
            {exercise.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              let cls = "border-2 border-purple-200 hover:border-purple-400 bg-white";
              if (showResult && opt === exercise.correctAnswer) cls = "border-2 border-green-500 bg-green-50";
              else if (showResult && isSelected && !isCorrect) cls = "border-2 border-red-500 bg-red-50";
              else if (isSelected) cls = "border-2 border-purple-600 bg-purple-50";

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={showResult}
                  className={`w-full rounded-xl p-4 text-left font-medium text-purple-900 transition-all ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {showResult && (
        <div className={`rounded-2xl p-4 text-center space-y-3 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"}`}>
          <div className="flex items-center justify-center gap-2">
            {isCorrect ? (
              <>
                <Check className="text-green-600" size={24} />
                <span className="font-bold text-green-700">¡Correcto!</span>
              </>
            ) : (
              <>
                <X className="text-red-500" size={24} />
                <span className="font-bold text-orange-700">
                  {exercise.type === "listening" ? "Escucha de nuevo" : "Respuesta:"}{" "}
                  <span className="text-purple-900">&ldquo;{exercise.correctAnswer}&rdquo;</span>
                </span>
              </>
            )}
          </div>
          <Button variant="primary" onClick={handleNext} className="w-full">
            {currentExerciseIdx < lesson.exercises.length - 1 ? (
              <>Siguiente <ArrowRight size={18} /></>
            ) : (
              <>Ver resultados</>
            )}
          </Button>
        </div>
      )}

      <Card className="bg-purple-50">
        <p className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-1.5">
          <BookOpen size={16} /> Vocabulario de la lección:
        </p>
        <div className="flex flex-wrap gap-2">
          {lesson.vocabulary.map((v, i) => (
            <button
              key={i}
              onClick={() => speak(v.en)}
              className="px-3 py-1 rounded-full bg-white text-xs font-medium text-purple-700 shadow-sm hover:bg-purple-100 transition-colors flex items-center gap-1"
            >
              {v.en} &mdash; {v.es}
              <Volume2 size={12} />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
