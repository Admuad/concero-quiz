import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  base: "./",
  server: {
    host: true,
    allowedHosts: [
      'bce78878419d.ngrok-free.app',
      'localhost',
      '127.0.0.1'
    ]
  }
});
