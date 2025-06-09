# KI-Styleguides Website

Astro-basierte Website für die KI-Styleguides mit modernem Design und optimaler Performance.

## Technischer Stack

- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS 3.x
- **Deployment**: Netlify/Vercel
- **Performance**: Static Site Generation

## Projektstruktur

```
Website Code/
├── ki-styleguides-website/    # Hauptprojekt (wird erstellt)
├── planning/                  # Technische Planung
│   ├── tech-stack.md         # Detaillierte Stack-Beschreibung
│   └── prototype-plan.md     # MVP-Entwicklungsplan
└── documentation/            # Entwickler-Dokumentation
    └── [Wird beim Setup erstellt]
```

## Setup

### Voraussetzungen
- Node.js 18+ 
- npm oder pnpm

### Installation
```bash
cd "Website Code"
npm create astro@latest ki-styleguides-website
cd ki-styleguides-website
npm install @astrojs/tailwind
npx astro add tailwind
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Nächste Schritte

1. **Astro-Projekt erstellen** (siehe Setup oben)
2. **Design implementieren** basierend auf `../Website Design/wireframes.md`
3. **Content integrieren** aus `../../Styleguides/`
4. **Deployment konfigurieren** für Netlify/Vercel

## Dokumentation

- [Technischer Stack](planning/tech-stack.md) - Detaillierte Technologie-Entscheidungen
- [Prototyp-Plan](planning/prototype-plan.md) - MVP-Entwicklung
- [Design-Konzept](../Website%20Design/design-konzept.md) - UI/UX Guidelines
- [Content-Texte](../Website%20Design/website-content.md) - Deutsche Website-Inhalte

## Performance-Ziele

- Lighthouse Score: > 90
- Ladezeit: < 2 Sekunden
- Core Web Vitals: Alle grün
- Mobile-first: Responsive Design