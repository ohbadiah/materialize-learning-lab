/** Resolves a file in `public/` against the app's base path (e.g. GitHub Pages subpath). */
export function publicAsset(path: string): string {
  // `import.meta.env` is undefined when Playwright specs import this outside Vite.
  const baseUrl = import.meta.env?.BASE_URL ?? '/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}
