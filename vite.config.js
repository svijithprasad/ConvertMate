import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import path from "path";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"], // Exclude the ffmpeg package or any specific module that is causing issues
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(new URL("./", import.meta.url).pathname, "./src"),
    },
  },
});
