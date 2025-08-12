import { extname, resolve } from "node:path"
import { defineConfig } from "vite"
import { glob } from "glob"

const __dirname = import.meta.dirname
const root = resolve(__dirname, "src")

const files = await glob("pages/**/*.html", { cwd: root })
const pages = Object.fromEntries(files.map((path) => [path.replace(extname(path), ""), resolve(root, path)]))
console.log(pages)

export default defineConfig({
  root,
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        ...pages,
      },
    },
  },
  resolve: {
    alias: {
      "@": `${root}`,
    },
  },
})
