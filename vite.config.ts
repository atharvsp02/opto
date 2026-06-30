import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("lightweight-charts")) return "charts";
          if (id.includes("recharts") || id.includes("d3-")) return "recharts";
          if (id.includes("firebase") || id.includes("@firebase")) return "firebase";
          if (id.includes("@fortawesome")) return "icons";
        },
      },
    },
  },
});
