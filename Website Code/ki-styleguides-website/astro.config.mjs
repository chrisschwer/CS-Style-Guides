import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ki-styleguides.netlify.app',
  integrations: [
    tailwind(),
    sitemap()
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