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
    <div className="relative min-h-screen flex items-center backdrop-blur-md justify-center">
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
      <div className="relative z-10 bg-white/80 backdrop-blur-md p-12 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-center text-2xl font-semibold mb-2">¿Eres nuevo?</h2>
        <h1 className="text-center text-3xl font-extrabold text-orange-500 mb-8">Regístrate</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mostrar error general del servidor */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {[
            { label: "Nombre completo", type: "text", field: "nombre", placeholder: "Juan Pérez" },
            { label: "Email", type: "email", field: "email", placeholder: "example@gmail.com" },
          ].map(({ label, type, field, placeholder }) => (
            <div key={field}>
              <label className="block text-base font-medium mb-2">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => handleChange(field as keyof typeof formData, e.target.value)}
                className={`w-full border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 ${
                  errors[field as keyof typeof errors]
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-400 focus:ring-orange-400"
                }`}
                required
              />
              {errors[field as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">{errors[field as keyof typeof errors]}</p>
              )}
            </div>
          ))}

          <div className="relative">
            <label className="block text-base font-medium mb-2">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              value={formData.password}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-3 rounded transition duration-300 ease-in-out text-lg ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 transform hover:scale-105 cursor-pointer'
            } text-white`}
          >
            {isSubmitting ? "Registrando..." : "Continuar"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">o</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <p className="text-center text-base text-gray-700">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-blue-500 underline hover:text-blue-900">
            Inicia sesión.
          </Link>
        </p>
      </div>
    </div>
  );
}
