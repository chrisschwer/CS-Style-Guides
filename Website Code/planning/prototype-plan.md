# Funktionaler Prototyp - Entwicklungsplan

## Prototyp-Umfang (MVP)

### Was wird implementiert
1. **Homepage** - Hero, Styleguide-Cards, Schnellstart
2. **Eine Styleguide-Detail-Seite** - Wolf Schneider als Beispiel
3. **Downloads-Seite** - Einzeldownloads und Komplettpaket
4. **Basic Navigation** - Header, Footer, Responsive

### Was wird NICHT implementiert (v1.0)
- Vollständige Anwendungsseite (nur Platzhalter)
- Search-Funktion
- Analytics/Download-Tracking
- Service Worker/Offline
- Alle 5 Detail-Seiten (nur Wolf Schneider)

## Entwicklungsschritte

### Schritt 1: Grundgerüst (Astro Setup)
```bash
# Neues Astro-Projekt erstellen
npm create astro@latest ki-styleguides-website
cd ki-styleguides-website
npm install

# Tailwind CSS hinzufügen  
npx astro add tailwind

# Zusätzliche Pakete
npm install @astrojs/sitemap
npm install @heroicons/react
```

### Schritt 2: Basis-Layout
```
src/layouts/Layout.astro
- HTML-Grundgerüst
- Meta-Tags für SEO
- Tailwind CSS
- Google Fonts (Inter)
```

### Schritt 3: Komponenten entwickeln
```
src/components/
├── Header.astro (Navigation)
├── Footer.astro (Links + Copyright)
├── StyleguideCard.astro (Homepage Cards)
├── CopyButton.astro (Copy-to-Clipboard)
├── DownloadButton.astro (Download-Funktionalität)
└── Hero.astro (Homepage Hero-Bereich)
```

### Schritt 4: Seiten implementieren
```
src/pages/
├── index.astro (Homepage)
├── styleguides/
│   ├── index.astro (Übersicht)
│   └── wolf-schneider.astro (Detail-Beispiel)
├── downloads.astro
└── anwendung.astro (Platzhalter)
```

### Schritt 5: Content Integration
```
public/files/
├── wolf-schneider.md
├── gendergerecht-sternchen.md
├── gendergerecht-neutral.md
├── praesentationen.md
├── gene-zelazny.md
├── beispielprompts.md
└── complete-package.zip
```

### Schritt 6: JavaScript-Funktionalität
```
- Copy-to-Clipboard
- Download-Tracking (Basic)
- Mobile Navigation
- Smooth Scrolling
```

## Kritische Features für MVP

### Copy-to-Clipboard
```javascript
// Einfache Implementation
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('✓ In Zwischenablage kopiert');
  } catch (err) {
    // Fallback für ältere Browser
    fallbackCopy(text);
  }
}
```

### Download-Generierung
```javascript
// ZIP-Erstellung im Browser
import JSZip from 'jszip';

async function createCompletePackage() {
  const zip = new JSZip();
  
  // Alle .md Dateien hinzufügen
  const files = ['wolf-schneider.md', 'gendergerecht-sternchen.md', ...];
  for (const file of files) {
    const content = await fetch(`/files/${file}`).then(r => r.text());
    zip.file(file, content);
  }
  
  // ZIP downloaden
  const content = await zip.generateAsync({type: 'blob'});
  downloadBlob(content, 'ki-styleguides-complete.zip');
}
```

### Responsive Navigation
```javascript
// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const isOpen = menu.classList.contains('open');
  
  if (isOpen) {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  } else {
    menu.classList.add('open');
    document.body.classList.add('menu-open');
  }
}
```

## Deployment-Vorbereitung

### Netlify Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

# Redirects für SPA-ähnliche Navigation
[[redirects]]
  from = "/styleguides/*"
  to = "/styleguides/index.html"
  status = 200
```

### Environment Variables
```javascript
// astro.config.mjs
export default defineConfig({
  site: import.meta.env.PROD 
    ? 'https://ki-styleguides.netlify.app' 
    : 'http://localhost:3000'
});
```

## Testing-Checkliste

### Functionality Testing
- [ ] Alle Download-Links funktionieren
- [ ] Copy-Buttons funktionieren in verschiedenen Browsern  
- [ ] Mobile Navigation klappt auf/zu
- [ ] Responsive Design auf verschiedenen Bildschirmgrößen
- [ ] ZIP-Download enthält alle Dateien

### Performance Testing
- [ ] Lighthouse Score > 90
- [ ] Ladezeit < 2 Sekunden
- [ ] Images optimiert (WebP)
- [ ] CSS minimiert
- [ ] JavaScript minimiert

### Browser Testing
- [ ] Chrome (Desktop/Mobile)
- [ ] Firefox (Desktop/Mobile)  
- [ ] Safari (Desktop/Mobile)
- [ ] Edge (Desktop)

### Content Testing
- [ ] Alle Styleguide-Texte korrekt dargestellt
- [ ] Deutsche Umlaute richtig kodiert
- [ ] Links zu GitHub funktionieren
- [ ] Impressum/Datenschutz vorhanden

## Prototype Limitations

### Bekannte Einschränkungen
1. **Nur eine Detail-Seite**: Wolf Schneider als Template
2. **Kein echtes CMS**: Content hardcoded
3. **Basic Analytics**: Nur Download-Counter
4. **Keine Suche**: Wird in v2.0 implementiert
5. **Englische Error-Messages**: Browser-Standard

### Workarounds
1. **Template-System**: Andere Seiten nach Wolf Schneider-Muster
2. **Static Files**: Markdown in public/files/
3. **Local Storage**: Für Download-Tracking
4. **Site-weite Suche**: Externe Lösung (Algolia) später
5. **Custom Error Pages**: Deutsche 404-Seite

## Launch-Vorbereitung

### Pre-Launch Checklist
- [ ] Domain registriert/konfiguriert
- [ ] SSL-Zertifikat aktiv
- [ ] Analytics eingerichtet (Fathom)
- [ ] Sitemap generiert
- [ ] robots.txt konfiguriert
- [ ] Open Graph Meta-Tags
- [ ] Favicon eingerichtet

### Content Final Check
- [ ] Alle Styleguides aktuell
- [ ] Rechtschreibung/Grammatik geprüft
- [ ] Lizenzangaben vollständig
- [ ] Kontaktdaten aktuell
- [ ] GitHub-Links funktionieren

### Post-Launch Monitoring
- [ ] Uptime-Monitoring (UptimeRobot)
- [ ] Error-Tracking (Sentry)
- [ ] Performance-Monitoring (Lighthouse CI)
- [ ] User-Feedback sammeln
- [ ] Download-Statistiken überwachen

Der Prototyp wird als solide Basis dienen und kann iterativ zu einer vollständigen Website ausgebaut werden.