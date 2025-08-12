"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getRandomIcon } from "@/utils/IconSelector";

const ROOT = (
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");
const API = `${ROOT}/api`;

type RegisterResponse = {
  token?: string;
  icon?: string;
  message?: string;
};

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    email: "",
    password: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const validate = {
    nombre: (v: string) => v.trim().length >= 3,
    email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    password: (v: string) =>
      v.length >= 12 && /\d/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v),
  };

  const getErrorMessage = (field: keyof typeof formData) =>
    field === "nombre"
      ? "Debe tener al menos 3 caracteres."
      : field === "email"
      ? "Formato de correo no válido."
      : "Debe tener 12 caracteres, un número y un símbolo.";

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    const isValid = validate[field](value);
    setErrors((p) => ({
      ...p,
      [field]: !isValid && value ? getErrorMessage(field) : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors((p) => ({ ...p, general: "" }));

    const { nombre, email, password } = formData;
    const fieldErrs = {
      nombre:
        nombre && !validate.nombre(nombre) ? getErrorMessage("nombre") : "",
      email: email && !validate.email(email) ? getErrorMessage("email") : "",
      password:
        password && !validate.password(password)
          ? getErrorMessage("password")
          : "",
    };
    setErrors((p) => ({ ...p, ...fieldErrs }));
    if (
      fieldErrs.nombre ||
      fieldErrs.email ||
      fieldErrs.password ||
      !nombre ||
      !email ||
      !password
    ) {
      setIsSubmitting(false);
      return;
    }

    const icon = getRandomIcon();

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nombre, email, password, icon }),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok) {
        setErrors((p) => ({
          ...p,
          general:
            data?.message ??
            "No se pudo crear la cuenta. Verifica los datos o inténtalo más tarde.",
        }));
        return;
      }

      if (!data?.token) {
        setErrors((p) => ({
          ...p,
          general: "Respuesta inválida del servidor.",
        }));
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userIcon", icon);
      login(data.token, icon);
      router.push("/");
    } catch (error) {
      setErrors((p) => ({
        ...p,
        general: "Error de conexión. Intenta de nuevo.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.jpg"
          alt="Fondo"
          fill
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-orange-900/60" />
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-md p-12 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-center text-2xl font-semibold mb-2">
          ¿Eres nuevo?
        </h2>
        <h1 className="text-center text-3xl font-extrabold text-orange-500 mb-8">
          Regístrate
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
              <div className="flex items-center">
                <span className="text-lg mr-2">⚠️</span>
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Nombre y Email */}
          {[
            {
              label: "Nombre completo",
              type: "text",
              field: "nombre",
              placeholder: "Juan Pérez",
            },
            {
              label: "Email",
              type: "email",
              field: "email",
              placeholder: "example@gmail.com",
            },
          ].map(({ label, type, field, placeholder }) => (
            <div key={field}>
              <label className="block text-base font-medium mb-2">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={formData[field as "nombre" | "email"]}
                onChange={(e) =>
                  handleChange(field as "nombre" | "email", e.target.value)
                }
                className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors[field as "nombre" | "email"]
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-400 focus:ring-orange-400"
                }`}
                required
              />
              {errors[field as "nombre" | "email"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field as "nombre" | "email"]}
                </p>
              )}
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <label className="block text-base font-medium mb-2">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              value={formData.password}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-4 rounded-xl transition-all duration-300 text-lg shadow-lg transform ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed scale-95"
                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:scale-105 hover:shadow-xl"
            } text-white`}
          >
            {isSubmitting ? "Creando cuenta..." : "Continuar 🚀"}
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
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-500 underline hover:text-blue-900"
          >
            Inicia sesión.
          </Link>
        </p>
      </div>
    </div>
  );
}
