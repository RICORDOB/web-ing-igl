"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import Button from "@/components/ui/Button";
import { auth } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

type LoginStep =
  | "welcome"
  | "register"
  | "login"
  | "name";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useGame();

  const handleEmailRegister = async () => {
    if (!email.trim() || password.length < 6) {
      setError("El email es requerido y la contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = username || result.user.email?.split("@")[0] || "User";
      login(displayName);
      router.push("/dashboard");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("Este email ya está registrado. Inicia sesión.");
      } else if (e.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Error al registrarse. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu email y contraseña");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const displayName = result.user.displayName || result.user.email?.split("@")[0] || "User";
      login(displayName);
      router.push("/dashboard");
    } catch (e: any) {
      if (e.code === "auth/user-not-found" || e.code === "auth/invalid-credential") {
        setError("Email o contraseña incorrectos.");
      } else if (e.code === "auth/invalid-email") {
        setError("Email inválido.");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const displayName = result.user.displayName || result.user.email?.split("@")[0] || "User";
      login(displayName);
      router.push("/dashboard");
    } catch (e: any) {
      if (e.code === "auth/popup-closed-by-user") {
        setError("");
      } else {
        setError("Error con Google. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameOnly = () => {
    if (username.trim().length < 2) return;
    login(username.trim());
    router.push("/dashboard");
  };

  const renderWelcome = () => (
    <div className="animate-slide-up text-center space-y-8">
      <div className="space-y-4">
        <div className="text-6xl animate-float">📖</div>
        <h1 className="text-4xl font-bold text-purple-900">Cristo English</h1>
        <p className="text-lg text-purple-600">
          Aprende inglés mientras exploras la Biblia
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <div className="text-3xl mb-1">🎮</div>
          <p className="text-xs font-medium text-purple-700">Juegos</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <div className="text-3xl mb-1">📚</div>
          <p className="text-xs font-medium text-purple-700">Lecciones</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <div className="text-3xl mb-1">🏆</div>
          <p className="text-xs font-medium text-purple-700">Logros</p>
        </div>
      </div>

      <div className="rounded-2xl bg-purple-900 p-4 text-white text-sm">
        <p className="font-semibold">Para niños y adolescentes cristianos</p>
        <p className="mt-1 text-purple-200">
          &ldquo;Train up a child in the way he should go&rdquo; — Proverbs 22:6
        </p>
      </div>

      <div className="space-y-3">
        <Button size="lg" onClick={() => setStep("register")} className="w-full">
          Crear cuenta con Email 📧
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Conectando..." : "Continuar con Google G"}
        </Button>
        <div className="flex items-center gap-3 text-sm text-purple-400">
          <div className="flex-1 h-px bg-purple-200" />
          <span>o</span>
          <div className="flex-1 h-px bg-purple-200" />
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setStep("login")}>
            Ya tengo cuenta
          </Button>
          <Button variant="ghost" onClick={() => setStep("name")}>
            Modo invitado
          </Button>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="animate-slide-up space-y-6">
      <div className="text-center space-y-2">
        <div className="text-5xl">✝️</div>
        <h2 className="text-2xl font-bold text-purple-900">Crear cuenta</h2>
        <p className="text-purple-500">Regístrate para guardar tu progreso</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Tu nombre de usuario"
        className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
        maxLength={20}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu correo electrónico"
        className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
        autoFocus
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña (mín. 6 caracteres)"
        onKeyDown={(e) => e.key === "Enter" && handleEmailRegister()}
        className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
      />

      <div className="space-y-3">
        <Button size="lg" onClick={handleEmailRegister} disabled={loading} className="w-full">
          {loading ? "Creando cuenta..." : "Crear cuenta 🎉"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setStep("welcome"); setError(""); }} className="w-full">
          ← Volver
        </Button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="animate-slide-up space-y-6">
      <div className="text-center space-y-2">
        <div className="text-5xl">👋</div>
        <h2 className="text-2xl font-bold text-purple-900">Iniciar sesión</h2>
        <p className="text-purple-500">Bienvenido de nuevo</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu correo electrónico"
        className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
        autoFocus
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Tu contraseña"
        onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
        className="w-full rounded-xl border-2 border-purple-200 px-4 py-3 text-sm outline-none focus:border-purple-500"
      />

      <div className="space-y-3">
        <Button size="lg" onClick={handleEmailLogin} disabled={loading} className="w-full">
          {loading ? "Entrando..." : "Entrar 🚀"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setStep("welcome"); setError(""); }} className="w-full">
          ← Volver
        </Button>
      </div>
    </div>
  );

  const renderNameInput = () => (
    <div className="animate-slide-up space-y-8">
      <div className="text-center space-y-2">
        <div className="text-5xl">😊</div>
        <h2 className="text-2xl font-bold text-purple-900">¿Cómo te llamas?</h2>
        <p className="text-purple-500">Modo invitado (sin guardar en la nube)</p>
      </div>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleNameOnly()}
        placeholder="Tu nombre..."
        className="w-full rounded-2xl border-2 border-purple-200 px-5 py-4 text-center text-lg font-medium text-purple-900 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
        autoFocus
        maxLength={20}
      />

      <div className="space-y-3">
        <Button size="lg" onClick={handleNameOnly} disabled={username.trim().length < 2} className="w-full">
          ¡Empezar! 🎉
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setStep("welcome"); setError(""); }} className="w-full">
          ← Volver
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {step === "welcome" && renderWelcome()}
        {step === "register" && renderRegister()}
        {step === "login" && renderLogin()}
        {step === "name" && renderNameInput()}
      </div>
    </div>
  );
}
