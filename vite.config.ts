import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: resolve(__dirname, "./src/components"),
      types: resolve(__dirname, "./src/types"),
      hooks: resolve(__dirname, "./src/hooks"),
      imgs: resolve(__dirname, "./src/imgs"),
    },
  },
});
