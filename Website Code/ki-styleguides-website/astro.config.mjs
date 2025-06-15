import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import versionManager from './src/integrations/version-manager.ts';

export default defineConfig({
  site: 'https://ki-styleguides.netlify.app',
  // output: 'hybrid',
  // adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap(),
    versionManager()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      langs: ['markdown', 'javascript', 'bash']
    }
  },
  build: {
    assets: 'assets'
  }
});