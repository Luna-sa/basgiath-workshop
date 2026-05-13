import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `BASE_PATH` env var lets us reuse the same Vite build for two
// hosting destinations:
//   • Render serves the SPA at the root (/) — leave BASE_PATH empty
//   • GitHub Pages serves it at /<repo>/ — set BASE_PATH to
//     "/basgiath-workshop/" in the workflow before `vite build`
// Default is "/" (Render-compatible).
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
