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
  plugins: [],
};
// Si usas Tailwind CSS con Next.js, asegúrate de tener instalado el paquete `@tailwindcss/postcss`
// y de que tu archivo `postcss.config.js` esté configurado correctamente.