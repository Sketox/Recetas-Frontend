"use client";

// Este archivo contiene clases utilitarias para efectos de hover y otras interacciones
// que se pueden reutilizar en toda la aplicación

import { cva } from "class-variance-authority";

// Estilos de botón con variantes
export const buttonStyles = cva(
  "transition-all duration-200 font-medium rounded-xl flex items-center justify-center gap-2", 
  {
    variants: {
      intent: {
        primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
        danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg",
        orange: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg",
      },
      size: {
        sm: "text-xs py-2 px-3",
        md: "text-sm py-3 px-4",
        lg: "text-base py-3 px-6",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      disabled: false,
      fullWidth: false,
    },
  }
);

// Estilos de card con efectos de hover
export const cardStyles = cva(
  "bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden", 
  {
    variants: {
      hover: {
        lift: "hover:shadow-lg hover:-translate-y-1",
        scale: "hover:shadow-lg hover:scale-[1.02]",
        border: "border border-gray-100 hover:border-blue-200",
        glow: "hover:shadow-lg hover:shadow-blue-100/50",
        none: "",
      },
    },
    defaultVariants: {
      hover: "lift",
    },
  }
);

// Estilos de inputs con efectos de focus/hover
export const inputStyles = cva(
  "border rounded-xl focus:outline-none transition-all duration-200", 
  {
    variants: {
      intent: {
        primary: "focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300",
        orange: "focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-orange-300",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3",
        lg: "px-4 py-4 text-lg",
      },
      disabled: {
        true: "bg-gray-100 text-gray-500 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      disabled: false,
    },
  }
);

// Estilos para links con hover
export const linkStyles = cva(
  "transition-all duration-200", 
  {
    variants: {
      intent: {
        primary: "text-blue-600 hover:text-blue-800 hover:underline",
        subtle: "text-gray-600 hover:text-gray-800",
        orange: "text-orange-600 hover:text-orange-800 hover:underline",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

// Clase para añadir efecto hover general a cualquier elemento
export const hoverEffect = "transition-all duration-200 hover:opacity-90";
