import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@google/generative-ai"],
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: "0.0.0.0",
    port: 3000,
  },
});
