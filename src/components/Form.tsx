"use client";

import React from "react";

const RegisterForm = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 font-[BalsamiqSans-Regular]">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-md">
        <h2 className="text-center text-gray-600">¿Eres nuevo?</h2>
        <h1 className="text-center text-3xl font-bold text-orange-500 mb-6 ">Regístrate</h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Nombre Completo"
            className="w-full border px-4 py-2 rounded font-balsamiq"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Continuar
          </button>
        </form>

        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-500">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button className="w-full border py-2 rounded flex items-center justify-center gap-2 mb-2">
          <img src="/file.svg" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>
        <button className="w-full border py-2 rounded">Continuar con ...</button>

        <p className="text-sm text-center mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Inicia sesión.
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
