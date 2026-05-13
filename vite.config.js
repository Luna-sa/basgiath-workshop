import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `BASE_PATH` env var lets us reuse the same Vite build for two
// hosting destinations:
//   • Render serves the SPA at the root (/) — leave BASE_PATH empty
//   • GitHub Pages serves it at /<repo>/ — set BASE_PATH to
//     "/basgiath-workshop/" in the workflow before `vite build`
// Default is "/" (Render-compatible).
const base = process.env.BASE_PATH || '/'

export default defineConfig(({ mode }) => {
  // Vite's default env loading only reads VITE_* values from .env
  // files in the project root. CI flows like GitHub Actions need
  // those values to come from the runner's process.env (set via
  // workflow `env:` blocks fed from repo secrets). We bridge the
  // gap manually: walk process.env, take every VITE_*, and pass
  // them through `define` so they're inlined at build time just
  // like `loadEnv` would do.
  //
  // Order of preference (process.env wins so CI overrides any
  // committed .env in the workspace):
  //   1. process.env.VITE_*          (CI / shell)
  //   2. loadEnv(mode, cwd, 'VITE_') (local .env / .env.production)
  const fileEnv = loadEnv(mode, process.cwd(), 'VITE_')
  const merged = { ...fileEnv }
  for (const k of Object.keys(process.env)) {
    if (k.startsWith('VITE_') && process.env[k]) merged[k] = process.env[k]
  }
  const define = {}
  for (const k of Object.keys(merged)) {
    define[`import.meta.env.${k}`] = JSON.stringify(merged[k] ?? '')
  }

  return {
    base,
    define,
    plugins: [react(), tailwindcss()],
  }
})
