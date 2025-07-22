"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Por favor, ingresa un correo válido.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "La contraseña debe tener al menos 12 caracteres, un número y un símbolo especial."
      );
      return;
    }

    setEmailError("");
    setPasswordError("");
    console.log("Email:", email, "Password:", password);
  };

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const validatePassword = (value: string) => {
    const hasLength = value.length >= 12;
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return hasLength && hasNumber && hasSpecialChar;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value) && value.length > 0) {
      setEmailError("Formato de correo no válido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!validatePassword(value) && value.length > 0) {
      setPasswordError(
        "Debe tener al menos 12 caracteres, un número y un símbolo especial."
      );
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-lg p-12 w-full max-w-lg">
        {/* Títulos */}
        <h2 className="text-center text-2xl font-semibold mb-2">
          ¡Bienvenido de nuevo!
        </h2>
        <h1 className="text-center text-3xl font-extrabold text-orange-500 mb-8">
          Iniciar sesión
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-base font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={handleEmailChange}
              className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-orange-400"
              }`}
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Contraseña con icono */}
          <div className="relative">
            <label className="block text-base font-medium mb-2">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                passwordError
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-orange-400"
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
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Link */}
          <div className="text-right">
            <Link
              href="#"
              className="text-blue-500 text-sm underline hover:text-blue-900"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded hover:bg-orange-600 transform hover:scale-105 transition duration-300 ease-in-out text-lg cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">o</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Link registro */}
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
