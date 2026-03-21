import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "react-dom", "@sanity/client", "@sanity/image-url"],
  },
  fs: { strict: false },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Enable HMR by setting to true or removing this line
    hmr: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      "/api/sanity": {
        target: "https://api.sanity.io",
        changeOrigin: true,
        secure: true,
      },
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "sanity-vendor": ["@sanity/client", "@sanity/image-url"],
        },
      },
    },
  },
});
