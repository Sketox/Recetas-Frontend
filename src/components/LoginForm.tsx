"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchFromBackend } from "@/services/index";
import { LoginResponse } from "types/auth";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const validate = {
    email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    password: (v: string) =>
      v.length >= 12 && /\d/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v),
  };

  const handleChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    setErrors((prev) => ({
      ...prev,
      [field]: value && !validate[field](value)
        ? "Campo inválido"
        : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!errors.email && !errors.password && email && password) {
    try {
      
    const data = await fetchFromBackend<LoginResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

      // ✅ Aquí data ya contiene { token, icon }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userIcon", data.icon);
      login(data.token, data.icon);
      router.push("/");
    } catch (err: any) {
      console.error("❌ Error:", err.message);
    }
  }
};


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo mejorado con overlay */}
      <div className="absolute inset-0 z-0">
        {/* Imagen de fondo */}
        <img
          src="/images/banner.jpg"
          alt="Fondo"
          className="w-full h-full object-cover"
        />

        {/* Overlay con gradiente y efectos */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-orange-900/60" />
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Contenido del formulario modernizado */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Header mejorado */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white">🔑</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">¡Bienvenido de nuevo!</h2>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            Iniciar sesión
          </h1>
          <p className="text-gray-600 text-sm">Accede a tu cuenta y sigue cocinando</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-700 flex items-center gap-2">
              <span>📧</span>
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                  errors.email 
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                    : "border-gray-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                }`}
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>❌</span>
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative space-y-2">
            <label className="block text-base font-semibold text-gray-700 flex items-center gap-2">
              <span>🔒</span>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 pr-12 text-base focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                  errors.password 
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" 
                    : "border-gray-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors duration-200 p-1"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>❌</span>
                {errors.password}
              </p>
            )}
          </div>

          <div className="text-right">
            <Link href="#" className="text-orange-500 text-sm underline hover:text-orange-600 font-medium transition-colors duration-200">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-300 text-lg cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            Iniciar Sesión
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
          <Link href="/register" className="text-orange-500 underline hover:text-orange-600 font-semibold transition-colors duration-200">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
