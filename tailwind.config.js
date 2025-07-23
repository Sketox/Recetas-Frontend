/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}" // si usas carpeta `app/`
  ],
  theme: {
    extend: {
      fontFamily: {
        balsamiq: ['BalsamiqSans-Regular', 'sans-serif'],
      },
    },
  },

  theme: {
  extend: {
    animation: {
      fadeIn: 'fadeIn 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0, transform: 'scale(0.95)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },
    },
  },
},
 
  plugins: [],
  
};
// Si usas Tailwind CSS con Next.js, asegúrate de tener instalado el paquete `@tailwindcss/postcss`
// y de que tu archivo `postcss.config.js` esté configurado correctamente.