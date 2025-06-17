"use client";

import Navbar from "../../components/Navbar";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando usuario...", formData);
    // Aquí puedes conectar con Firebase o tu backend
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 border border-gray-200 rounded-md shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Regístrate</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="firstName"
              placeholder="Nombres"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              name="lastName"
              placeholder="Apellidos"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-center border px-4 py-2 rounded hover:bg-gray-100">
              <span className="mr-2">G</span> Continue with Google
            </button>
            <button className="w-full flex items-center justify-center border px-4 py-2 rounded hover:bg-gray-100">
              <span className="mr-2">🪟</span> Continue with Microsoft Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
