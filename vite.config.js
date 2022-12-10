import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 8080,
  },
  resolve: {
    alias: {
      "@": [__dirname, "src"].join("/"),
    },
  },
});
