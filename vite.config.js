import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs/promises";
import path from "node:path";

const spaFallbackPlugin = () => ({
  name: "spa-fallback",
  enforce: "pre",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || "";

      if (
        req.method !== "GET" ||
        url.startsWith("/api") ||
        url.startsWith("/@") ||
        url.startsWith("/@vite") ||
        url.startsWith("/src") ||
        url.startsWith("/node_modules") ||
        url.includes(".")
      ) {
        return next();
      }

      return fs
        .readFile(path.resolve(process.cwd(), "index.html"), "utf-8")
        .then((html) => server.transformIndexHtml(url, html))
        .then((html) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          res.end(html);
        })
        .catch(() => next());
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  optimizeDeps: {
    include: ["react", "react-dom"],
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
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
  },
});
