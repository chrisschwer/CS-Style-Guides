# KI-Styleguides Website

Vollständig funktionale Astro-Website für die KI-Styleguides mit modernem Design und optimaler Performance.

## 🚀 Aktueller Status: LIVE & DEPLOYABLE

Die Website ist vollständig entwickelt und bereit für den produktiven Einsatz:

- ✅ Alle Seiten implementiert und funktional
- ✅ Dynamic routing für Styleguide-Details
- ✅ ZIP-Download-Funktionalität
- ✅ Copy-to-clipboard für alle Inhalte
- ✅ Responsive Design für alle Geräte
- ✅ Rechtliche Seiten (Impressum, Datenschutz, Lizenz)
- ✅ SEO-optimiert und performance-ready
- ✅ Community Acknowledgement System (Backend fertig)

## Technischer Stack

- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS 3.x
- **JavaScript**: JSZip für ZIP-Downloads
- **APIs**: GitHub REST API v3 für Contributors
- **Caching**: File-based 24h Cache System
- **Testing**: Vitest mit umfassender Test-Coverage
- **Deployment**: Netlify/Vercel ready
- **Performance**: Static Site Generation

## Projektstruktur

```
Website Code/
├── ki-styleguides-website/          # Vollständige Astro-Website
│   ├── src/
│   │   ├── components/              # Wiederverwendbare Komponenten
│   │   │   ├── Header.astro        # Navigation
│   │   │   ├── Footer.astro        # Footer mit allen Links
│   │   │   ├── CopyButton.astro    # Copy-to-clipboard
│   │   │   └── StyleguideCard.astro # Styleguide-Vorschau
│   │   ├── lib/                     # Backend-Services
│   │   │   ├── github.ts           # GitHub API Integration
│   │   │   ├── github.test.ts      # GitHub API Tests
│   │   │   ├── cache.ts            # File-based Caching
│   │   │   ├── cache.test.ts       # Cache Tests
│   │   │   ├── versioning.ts       # Versioning System
│   │   │   └── versioning.test.ts  # Versioning Tests
│   │   ├── layouts/
│   │   │   └── Layout.astro        # Basis-Layout
│   │   └── pages/
│   │       ├── index.astro         # Homepage
│   │       ├── anwendung.astro     # Schnellstart-Anleitung
│   │       ├── downloads.astro     # Download-Seite mit ZIP
│   │       ├── impressum.astro     # Impressum
│   │       ├── datenschutz.astro   # Datenschutz
│   │       ├── ueber.astro         # Über & Lizenz
│   │       └── styleguides/
│   │           ├── index.astro     # Alle Styleguides
│   │           └── [...slug].astro # Dynamic Detail-Seiten
│   ├── public/
│   │   └── files/                  # Alle Styleguide .md Dateien
│   └── package.json
├── planning/                        # Technische Planung (Archiv)
└── documentation/                   # Entwickler-Dokumentation
```

## Development Commands

```bash
cd "Website Code/ki-styleguides-website"

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Implementierte Features

### Core Features
- **Homepage**: Hero, Styleguide-Übersicht, Schnellstart-Guide
- **Styleguide-Details**: Individuelle Seiten für jeden Guide mit Copy-Funktionen
- **Downloads**: ZIP-Komplettpaket mit allen Dateien
- **Anwendung**: Detaillierte Anleitung für Claude, ChatGPT, Copilot

### Technical Features
- **Dynamic Routing**: `/styleguides/[slug]/` für alle Guides
- **Copy-to-Clipboard**: Ganze Guides oder einzelne Abschnitte
- **ZIP Generation**: Client-side mit JSZip
- **Responsive Design**: Mobile-first approach
- **Performance**: Static generation, optimierte Bilder
- **SEO**: Meta-tags, structured data

### Legal & Compliance
- **Impressum**: Vollständige Kontaktdaten
- **Datenschutz**: DSGVO-konform, keine Tracking-Tools
- **Lizenz**: CC BY 4.0 mit Attribution-Beispielen

## 📱 Verfügbare Seiten

| Route | Beschreibung | Status |
|-------|-------------|--------|
| `/` | Homepage mit Übersicht | ✅ |
| `/styleguides/` | Alle Styleguides | ✅ |
| `/styleguides/wolf-schneider/` | Wolf Schneider Details | ✅ |
| `/styleguides/gendergerecht-sternchen/` | Gender-Guide (Sternchen) | ✅ |
| `/styleguides/gendergerecht-neutral/` | Gender-Guide (Neutral) | ✅ |
| `/styleguides/praesentationen/` | Präsentations-Guide | ✅ |
| `/styleguides/charts/` | Gene Zelazny Charts | ✅ |
| `/styleguides/tufte/` | Tufte Visualisierung | ✅ |
| `/styleguides/beispielprompts/` | Beispielprompts | ✅ |
| `/anwendung/` | Schnellstart-Anleitung | ✅ |
| `/downloads/` | Download-Seite mit ZIP | ✅ |
| `/impressum/` | Impressum | ✅ |
| `/datenschutz/` | Datenschutzerklärung | ✅ |
| `/ueber/` | Über das Projekt & Lizenz | ✅ |

## 🚀 Deployment

Die Website ist bereit für Deployment auf:

- **Netlify**: Drag & Drop der `dist/` Folder
- **Vercel**: GitHub-Integration
- **GitHub Pages**: Static hosting
- **Beliebiger Static Host**: Nur HTML/CSS/JS

### Build & Deploy
```bash
npm run build    # Erstellt dist/ Folder
npm run preview  # Test vor Deployment
```

## Performance-Ziele (ERREICHT)

- ✅ Lighthouse Score: > 90
- ✅ Ladezeit: < 2 Sekunden  
- ✅ Core Web Vitals: Optimiert
- ✅ Mobile-first: Vollständig responsive
- ✅ Datenschutz: Keine Cookies/Tracking

## Dokumentation

- [Design-Konzept](../Website%20Design/design-konzept.md) - UI/UX Guidelines
- [Content-Texte](../Website%20Design/website-content.md) - Deutsche Website-Inhalte
- [Technischer Stack](planning/tech-stack.md) - Architektur-Entscheidungen