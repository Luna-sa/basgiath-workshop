// Prefix a public-folder asset path with Vite's BASE_URL so it
// resolves correctly on every host (`/` on Render, `/basgiath-workshop/`
// on the GH Pages mirror). Pass paths with or without the leading
// slash - both forms are normalised before concatenation.
export const asset = (path) => {
  if (!path) return path
  const clean = String(path).replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${clean}`
}
