import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss(),
    lucidePreprocess(),
    process.env.BASIC_SSL ? basicSsl() : null,
  ],
  optimizeDeps: {
    // https://github.com/vitejs/vite/issues/14609
    exclude: ["@rollup/browser", "onnxruntime-web"],
  },
  build: {
    // Increase chunk size warning limit for ML libraries.
    chunkSizeWarningLimit: 4000,
    minify: "esbuild",
  },
  esbuild: {
    // tfjs-backend-wasm serializes Emscripten worker functions with toString().
    // Syntax minifiers can rewrite `typeof x === "undefined"` guards into direct
    // references, which breaks threaded SIMD workers:
    // https://github.com/tensorflow/tfjs/tree/tfjs-v4.22.0/tfjs-backend-wasm#js-minification
    minifySyntax: false,
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
