import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <-- Importar el plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Añadirlo aquí
  ],
});