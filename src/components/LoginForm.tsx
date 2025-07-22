"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // Aquí iría la lógica para autenticar al usuario
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-sm">
        {/* Títulos */}
        <h2 className="text-center text-xl font-semibold mb-1">
          ¡Bienvenido de nuevo!
        </h2>
        <h1 className="text-center text-2xl font-extrabold text-orange-500 mb-6">
          Iniciar sesión
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div className="text-right">
            <Link href="#" className="text-blue-500 text-sm hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">o</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Link para registro */}
        <p className="text-center text-sm text-gray-700">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Regístrate.
          </Link>
        </p>
      </div>
    </div>
  );
}
