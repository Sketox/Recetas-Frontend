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
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Fondo borroso */}
      <div className="absolute inset-0 z-0">
        {/* Imagen de fondo */}
        <img
          src="/images/banner.jpg"
          alt="Fondo"
          className="w-full h-full object-cover blur-sm"
        />

        {/* Degradado negro desde abajo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent" />
      </div>

      {/* Contenido del formulario */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-2">¡Bienvenido de nuevo!</h2>
        <h1 className="text-center text-3xl font-extrabold text-orange-500 mb-8">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-400 focus:ring-orange-400"
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label className="block text-base font-medium mb-2">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-400 focus:ring-orange-400"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-14 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={25} /> : <FiEye size={25} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="text-right">
            <Link href="#" className="text-blue-500 text-sm underline hover:text-blue-900">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded hover:bg-orange-600 transform hover:scale-105 transition duration-300 ease-in-out text-lg cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">o</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <p className="text-center text-base text-gray-700">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-blue-500 underline hover:text-blue-900">
            Regístrate.
          </Link>
        </p>
      </div>
    </div>
  );
}
