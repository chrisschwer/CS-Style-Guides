# Technologie-Stack Definition

## Stack-Empfehlung: **Astro + Tailwind CSS**

### Warum diese Kombination?

#### **Astro** (Static Site Generator)
✅ **Performance**: Lädt nur benötigtes JavaScript
✅ **SEO-optimiert**: Server-side rendering by default  
✅ **Markdown-native**: Perfekt für unsere .md Styleguides
✅ **Einfacher Aufbau**: Keine komplexe Architektur nötig
✅ **Deutsche Docs**: Gut dokumentiert
✅ **GitHub Pages**: Kostenlose Hosting-Möglichkeit

#### **Tailwind CSS** (Styling)
✅ **Rapid Prototyping**: Schnelle Umsetzung der Wireframes
✅ **Responsive**: Mobile-first von Haus aus
✅ **Konsistenz**: Design-System durch Utility-Classes
✅ **Performance**: Purging von ungenutztem CSS
✅ **Dark Mode**: Einfache Implementierung

## Vollständiger Tech-Stack

### Frontend
```
Framework: Astro 4.x
Styling: Tailwind CSS 3.x
Icons: Heroicons oder Lucide
Fonts: Inter (Google Fonts)
Code-Highlighting: Prism.js oder Shiki
```

### Content Management
```
Styleguides: Markdown-Dateien (.md)
Frontmatter: YAML für Metadaten
Images: Optimierte WebP/AVIF
Static Files: Public-Ordner
```

### Interaktivität  
```
Copy-to-Clipboard: Navigator.clipboard API
Download-Tracking: Fathom Analytics (DSGVO-konform)
Search: Fuse.js (Client-side)
Animations: View Transitions API (Astro)
```

### Development & Deployment
```
Package Manager: npm oder pnpm
Build: Astro Build
Hosting: Netlify oder Vercel
CI/CD: GitHub Actions
Domain: Eigene Domain oder .netlify.app
```

## Projektstruktur

```
ki-styleguides-website/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── StyleguideCard.astro
│   │   ├── CopyButton.astro
│   │   ├── DownloadButton.astro
│   │   └── Modal.astro
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── StyleguideLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── index.astro (Homepage)
│   │   ├── styleguides/
│   │   │   ├── index.astro
│   │   │   ├── wolf-schneider.astro
│   │   │   ├── gendergerecht-sternchen.astro
│   │   │   ├── gendergerecht-neutral.astro
│   │   │   ├── praesentationen.astro
│   │   │   └── gene-zelazny.astro
│   │   ├── anwendung.astro
│   │   ├── downloads.astro
│   │   └── ueber.astro
│   ├── content/
│   │   └── styleguides/
│   │       ├── wolf-schneider.md
│   │       ├── gendergerecht-sternchen.md
│   │       ├── gendergerecht-neutral.md
│   │       ├── praesentationen.md
│   │       └── gene-zelazny.md
│   └── styles/
│       └── global.css
├── public/
│   ├── files/
│   │   ├── wolf-schneider.md
│   │   ├── gendergerecht-sternchen.md
│   │   ├── complete-package.zip
│   │   └── beispielprompts.md
│   ├── images/
│   │   ├── screenshots/
│   │   └── icons/
│   └── favicon.ico
├── package.json
├── tailwind.config.mjs
├── astro.config.mjs
└── README.md
```

## Detaillierte Implementierung

### Astro Configuration
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ki-styleguides.de',
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
```

### Tailwind Configuration
```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}
```

### Component-Beispiele

#### StyleguideCard.astro
```astro
---
export interface Props {
  title: string;
  description: string;
  icon: string;
  downloadUrl: string;
  detailUrl: string;
  downloadCount?: number;
}

const { title, description, icon, downloadUrl, detailUrl, downloadCount } = Astro.props;
---

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
  <div class="flex items-center gap-3 mb-4">
    <span class="text-2xl">{icon}</span>
    <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
  </div>
  
  <p class="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
  
  {downloadCount && (
    <p class="text-xs text-gray-500 mb-4">📊 {downloadCount} Downloads</p>
  )}
  
  <div class="flex gap-2">
    <a 
      href={downloadUrl} 
      class="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
      download
    >
      📥 Download
    </a>
    <a 
      href={detailUrl}
      class="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      Mehr erfahren
    </a>
  </div>
</div>
```

#### CopyButton.astro
```astro
---
export interface Props {
  content: string;
  label?: string;
}

const { content, label = "Kopieren" } = Astro.props;
---

<button 
  class="copy-button inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded border transition-colors"
  data-content={content}
>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
  </svg>
  <span class="button-text">{label}</span>
</button>

<script>
  // Copy functionality
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copy-button').forEach(button => {
      button.addEventListener('click', async () => {
        const content = button.dataset.content;
        const textElement = button.querySelector('.button-text');
        
        try {
          await navigator.clipboard.writeText(content);
          textElement.textContent = '✓ Kopiert!';
          button.classList.add('bg-green-100', 'text-green-700');
          
          setTimeout(() => {
            textElement.textContent = 'Kopieren';
            button.classList.remove('bg-green-100', 'text-green-700');
          }, 2000);
        } catch (err) {
          // Fallback für ältere Browser
          const textarea = document.createElement('textarea');
          textarea.value = content;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          
          textElement.textContent = '✓ Kopiert!';
        }
      });
    });
  });
</script>
```

### Content Collections
```javascript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const styleguideCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    category: z.enum(['sprache', 'praesentation', 'charts']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    downloadCount: z.number().optional(),
    lastUpdated: z.date(),
    tags: z.array(z.string())
  })
});

export const collections = {
  'styleguides': styleguideCollection
};
```

## Performance-Optimierungen

### Build-Optimierungen
```javascript
// Automatische Image-Optimierung
import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    })
  ]
});
```

### Progressive Enhancement
```astro
<!-- Loading nur critical CSS inline -->
<style is:inline>
  /* Critical CSS für Above-the-fold */
  .header { /* ... */ }
  .hero { /* ... */ }
</style>

<!-- Nicht-kritisches CSS lazy laden -->
<link rel="stylesheet" href="/styles/components.css" media="print" onload="this.media='all'">
```

### Service Worker (Optional)
```javascript
// public/sw.js - Für Offline-Funktionalität
const CACHE_NAME = 'ki-styleguides-v1';
const urlsToCache = [
  '/',
  '/styleguides/',
  '/files/wolf-schneider.md',
  '/files/gendergerecht-sternchen.md'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

## Deployment-Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Alternative: Einfacherer Stack

Falls Astro zu komplex erscheint:

### **Vanilla HTML + Tailwind**
```
- Statische HTML-Dateien
- Tailwind via CDN
- Vanilla JavaScript für Interaktionen
- Deployment via GitHub Pages
```

**Vorteile**: Einfacher, keine Build-Steps
**Nachteile**: Mehr Wartungsaufwand, weniger DRY

Der empfohlene **Astro + Tailwind Stack** bietet die beste Balance aus Performance, Entwicklungsgeschwindigkeit und Wartbarkeit für dieses Projekt.