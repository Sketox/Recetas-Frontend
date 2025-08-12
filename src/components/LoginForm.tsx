"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ROOT = (
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");
const API = `${ROOT}/api`;

type LoginResponse = { token?: string; icon?: string; message?: string };

const validators = {
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  password: (v: string) =>
    v.length >= 12 && /\d/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v),
} as const;

type Field = keyof typeof validators;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const handleChange = (field: Field, value: string) => {
    field === "email" ? setEmail(value) : setPassword(value);
    setErrors((prev) => ({
      ...prev,
      [field]: value && !validators[field](value) ? "Campo inválido" : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = email && !validators.email(email) ? "Campo inválido" : "";
    const passErr =
      password && !validators.password(password) ? "Campo inválido" : "";
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr || !email || !password) return;

    try {
      setSubmitting(true);
      setServerMsg(null);

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data?.token) {
        setServerMsg(
          data?.message ?? "Credenciales inválidas o error de servidor."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      if (data.icon) localStorage.setItem("userIcon", data.icon);
      login(data.token, data.icon);
      router.push("/");
    } catch (err) {
      setServerMsg("Error de conexión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.jpg"
          alt="Fondo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-orange-900/60" />
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-2">
          ¡Bienvenido de nuevo!
        </h2>
        <h1 className="text-center text-3xl font-extrabold text-orange-500 mb-8">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-400 focus:ring-orange-400"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-base font-medium mb-2">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-400 focus:ring-orange-400"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-14 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <FiEyeOff size={25} /> : <FiEye size={25} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <Link
              href="#"
              className="text-blue-500 text-sm underline hover:text-blue-900"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {serverMsg && (
            <p className="text-center text-red-600 text-sm -mt-2">
              {serverMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-300 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{submitting ? "⏳" : "🚀"}</span>
            {submitting ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="flex items-center my-8">
          <hr className="flex-1 border-gray-300" />
          <div className="px-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white text-sm font-semibold py-1 rounded-full">
            o
          </div>
          <hr className="flex-1 border-gray-300" />
        </div>

        <p className="text-center text-base text-gray-700">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="text-blue-500 underline hover:text-blue-900"
          >
            Regístrate.
          </Link>
        </p>
      </div>
    </div>
  );
}
