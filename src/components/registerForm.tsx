"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getRandomIcon } from "@/utils/IconSelector";
import { fetchFromBackend } from "@/services/index";


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
    general: "", // Para errores del servidor
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

  const getErrorMessage = (field: keyof typeof formData) => {
    switch (field) {
      case "nombre":
        return "Debe tener al menos 3 caracteres.";
      case "email":
        return "Formato de correo no válido.";
      case "password":
        return "Debe tener 12 caracteres, un número y un símbolo.";
      default:
        return "Campo inválido.";
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const isValid = validate[field](value);
    setErrors((prev) => ({
      ...prev,
      [field]: !isValid && value.length > 0 ? getErrorMessage(field) : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, general: "" })); // Limpiar errores previos
    
    const icon = getRandomIcon();
    const { nombre, email, password } = formData;

    const isValid = Object.entries(validate).every(
      ([field, fn]) => fn(formData[field as keyof typeof formData])
    );

    if (!isValid) {
      console.log("❌ Errores en el formulario");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("📤 Enviando datos de registro...");
      const data = await fetchFromBackend<{ token: string }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ name: nombre, email, password, icon }),
        }
      );

      console.log("✅ Registro exitoso");
      
      // Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userIcon", icon);

      // Contexto o auth state
      login(data.token, icon);

      // Redirigir al home
      router.push("/");
    } catch (error: any) {
      console.error("❌ Error en registro:", error.message);
      
      // Mostrar error específico al usuario
      if (error.message.includes("usuario ya existe") || error.message.includes("already exists")) {
        setErrors(prev => ({ ...prev, general: "Ya existe una cuenta con este email" }));
      } else if (error.message.includes("datos inválidos") || error.message.includes("invalid")) {
        setErrors(prev => ({ ...prev, general: "Los datos proporcionados no son válidos" }));
      } else {
        setErrors(prev => ({ ...prev, general: "Error al crear la cuenta. Inténtalo de nuevo." }));
      }
    } finally {
      setIsSubmitting(false);
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
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Contenido del formulario modernizado */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Header mejorado */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white">👋</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">¿Eres nuevo?</h2>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            Regístrate
          </h1>
          <p className="text-gray-600 text-sm">Únete a nuestra comunidad culinaria</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mostrar error general del servidor */}
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
              <div className="flex items-center">
                <span className="text-lg mr-2">⚠️</span>
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          {[
            { label: "Nombre completo", type: "text", field: "nombre", placeholder: "Juan Pérez", icon: "👤" },
            { label: "Email", type: "email", field: "email", placeholder: "example@gmail.com", icon: "📧" },
          ].map(({ label, type, field, placeholder, icon }) => (
            <div key={field} className="space-y-2">
              <label className="block text-base font-semibold text-gray-700 flex items-center gap-2">
                <span>{icon}</span>
                {label}
              </label>
              <div className="relative">
                <input
                  type={type}
                  placeholder={placeholder}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => handleChange(field as keyof typeof formData, e.target.value)}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                    errors[field as keyof typeof errors]
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  }`}
                  required
                />
              </div>
              {errors[field as keyof typeof errors] && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <span>❌</span>
                  {errors[field as keyof typeof errors]}
                </p>
              )}
            </div>
          ))}

          <div className="relative space-y-2">
            <label className="block text-base font-semibold text-gray-700 flex items-center gap-2">
              <span>🔒</span>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={formData.password}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-4 rounded-xl transition-all duration-300 text-lg shadow-lg transform ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed scale-95' 
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:scale-105 hover:shadow-xl cursor-pointer'
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando cuenta...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>🚀</span>
                Continuar
              </div>
            )}
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
          <Link href="/login" className="text-orange-500 underline hover:text-orange-600 font-semibold transition-colors duration-200">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
