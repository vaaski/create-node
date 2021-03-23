import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS({
      scan: {
        fileExtensions: ["vue", "html", "ts"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      $: resolve(__dirname, "./types"),
    },
  },
})
