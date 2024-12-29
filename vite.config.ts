import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    wasm(),
    topLevelAwait()
  ],
  optimizeDeps: {
    include: ['@myriaddreamin/typst.ts'],
  },
  server: {
    host: true,
    port: 5137,
    strictPort: true,
    watch: {
      usePolling: true,
    }
  },
});