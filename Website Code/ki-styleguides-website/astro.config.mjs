import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import versionManager from './src/integrations/version-manager.ts';
import auth from 'auth-astro';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://ki-styleguides.netlify.app',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap(),
    versionManager(),
    auth()
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