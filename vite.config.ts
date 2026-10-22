import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { documentTitle, staticRoutes, SITE_TITLE, type StaticRoute } from './src/app/staticRoutes';

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function withRouteHead(html: string, route: StaticRoute) {
  const title = escapeHtml(documentTitle(route));
  const description = escapeHtml(route.description);
  const meta = [
    `<meta property="og:site_name" content="${escapeHtml(SITE_TITLE)}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title ?? SITE_TITLE)}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="website" />`,
  ].join('\n    ');
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`)
    .replace('</head>', `  ${meta}\n  </head>`);
}

// Static hosts like GitHub Pages have no SPA fallback, so give each linkable route its own
// copy of the app shell (with per-page preview metadata), and serve the shell as 404.html too.
function staticRouteFiles(): Plugin {
  return {
    name: 'static-route-files',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (index?.type !== 'asset' || typeof index.source !== 'string') return;
      const shell = index.source;
      this.emitFile({ type: 'asset', fileName: '404.html', source: shell });
      for (const route of staticRoutes) {
        const html = withRouteHead(shell, route);
        if (route.path === '/') index.source = html;
        else this.emitFile({ type: 'asset', fileName: `${route.path.slice(1)}/index.html`, source: html });
      }
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/materialize-learning-lab/' : '/',
  plugins: [react(), tailwindcss(), staticRouteFiles()],
});
