import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration - React app ko fast dev server deta hai
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend default port
    open: true, // Browser automatically khulega
  },
});
