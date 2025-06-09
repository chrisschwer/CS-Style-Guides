# Design-Konzept für KI-Styleguides Website

## Design-Philosophie

### Zielgruppe
- **Primär**: Professionelle, die regelmäßig mit KI-Tools arbeiten
- **Sekundär**: Studierende und Berufseinsteiger*innen
- **Kenntnisstand**: Basic bis fortgeschritten in KI-Nutzung

### Design-Prinzipien
1. **Klarheit vor Kreativität** - Information steht im Vordergrund
2. **Zugänglichkeit** - Für alle Endgeräte und Nutzer*innen
3. **Effizienz** - Schneller Zugang zu benötigten Informationen
4. **Vertrauen** - Seriöse, professionelle Ausstrahlung

## Visuelle Identität

### Farbpalette
```
Primärfarben:
- Dunkelblau: #1e40af (Navigation, Überschriften)
- Hellblau: #3b82f6 (Links, CTAs)

Sekundärfarben:
- Grau 900: #111827 (Haupttext)
- Grau 600: #4b5563 (Sekundärtext)
- Grau 100: #f3f4f6 (Hintergrund, Cards)

Akzentfarben:
- Grün: #059669 (Erfolg, Downloads)
- Orange: #ea580c (Warnungen, Highlights)
- Rot: #dc2626 (Fehler, Wichtige Hinweise)
```

### Typografie
```
Überschriften:
- Font: Inter (Google Fonts)
- Gewichte: 600 (Semibold), 700 (Bold)
- Größen: H1(2.5rem), H2(2rem), H3(1.5rem)

Fließtext:
- Font: Inter (Regular 400)
- Größe: 16px (1rem)
- Zeilenhöhe: 1.6

Code/Prompts:
- Font: JetBrains Mono
- Größe: 14px (0.875rem)
- Hintergrund: #f8fafc
```

## Layout-System

### Grid & Spacing
```
Container: max-width 1200px, zentriert
Spalten: 12-Spalten-Grid
Abstände: 8px Basis-Einheit (8, 16, 24, 32, 48, 64px)
```

### Responsive Breakpoints
```
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

## Homepage Design

### Header
```
[Logo] KI-Styleguides                    [Navigation]    [Download]
                                        Start│Guides│Anwendung│Über    Button
```

### Hero-Bereich
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    Professionelle Styleguides für KI-assistiertes         │
│                   Schreiben auf Deutsch                    │
│                                                             │
│   Klare Regeln für Claude, ChatGPT & Co. - Von Wolf      │
│         Schneider bis gendergerechter Sprache             │
│                                                             │
│     [Alle Guides herunterladen]  [Anleitung ansehen]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Styleguide-Übersicht (4er-Grid)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Wolf        │ │ Gendergerecht│ │ Gendergerecht│ │    Gute      │
│ Schneider    │ │(mit Sternchen│ │(ohne Sternchen│ │Präsentationen│
│              │ │              │ │              │ │              │
│ Klares,      │ │ Student*innen│ │ Studierende, │ │ SCS-Muster,  │
│ prägnantes   │ │ Professor*in │ │ Fachkräfte   │ │ MECE-Prinzip │
│ Deutsch      │ │              │ │              │ │              │
│              │ │              │ │              │ │              │
│ [Download]   │ │ [Download]   │ │ [Download]   │ │ [Download]   │
│ [Mehr Info]  │ │ [Mehr Info]  │ │ [Mehr Info]  │ │ [Mehr Info]  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Schnellstart-Sektion
```
┌─────────────────────────────────────────────────────────────┐
│                   Schnellstart                             │
│                                                             │
│  1. Guide auswählen     2. In KI-Tool kopieren    3. Los!  │
│                                                             │
│  📋 Wolf Schneider      🤖 Claude Project         ✍️ Text   │
│     herunterladen          einrichten               schreiben│
│                                                             │
│           [Detaillierte Anleitung ansehen]                 │
└─────────────────────────────────────────────────────────────┘
```

## Seiten-Templates

### Styleguide-Detail-Seite
```
Breadcrumb: Start > Styleguides > Wolf Schneider

┌─────────────────────────────────────────────────────────────┐
│  Wolf Schneider - Klares Deutsch                           │
│                                                             │
│  Regeln für verständliches, prägnantes Schreiben          │
│  [📥 Download .md] [📋 Regeln kopieren] [🤖 Für Claude]   │
└─────────────────────────────────────────────────────────────┘

Sidebar (30%):                  Hauptinhalt (70%):
┌─────────────────────┐        ┌──────────────────────────────┐
│ Inhaltsverzeichnis  │        │ ## Grundprinzipien          │
│ • Grundprinzipien   │        │                              │
│ • Satzbau          │        │ Verständlichkeit ist...      │
│ • Wortwahl         │        │                              │
│ • Beispiele        │        │ ### Beispiele                │
│                     │        │ **Gut**: Der Hund bellt     │
│ Quick Actions:      │        │ **Schlecht**: Das Tier...   │
│ [📋 Kopieren]       │        │                              │
│ [🤖 Claude-Prompt]  │        │ ## Satzbau                  │
│ [💬 ChatGPT-Setup]  │        │ ...                          │
└─────────────────────┘        └──────────────────────────────┘
```

### Anwendungs-Seite
```
┌─────────────────────────────────────────────────────────────┐
│                    Anwendung                               │
│                                                             │
│  Tab-Navigation:                                           │
│  [Claude Projects] [ChatGPT] [Andere Tools] [Kombinationen]│
└─────────────────────────────────────────────────────────────┘

Aktiver Tab: Claude Projects
┌─────────────────────────────────────────────────────────────┐
│ Schritt 1: Projekt erstellen                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Screenshot: Claude Projects Interface]                 │ │
│ │                                                         │ │
│ │ 1. Gehen Sie zu claude.ai                             │ │
│ │ 2. Klicken Sie auf "New Project"                      │ │
│ │ 3. Wählen Sie "Add content"                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Schritt 2: Styleguide hinzufügen                          │
│ [Weitere Schritte...]                                     │
└─────────────────────────────────────────────────────────────┘
```

## Interaktive Elemente

### Buttons
```
Primär (CTA):
- Hintergrund: #3b82f6
- Text: Weiß
- Padding: 12px 24px
- Border-radius: 6px
- Hover: #2563eb

Sekundär:
- Border: 2px solid #3b82f6
- Text: #3b82f6
- Hintergrund: Transparent
- Hover: Hintergrund #3b82f6, Text weiß

Download:
- Icon: ⬇️ oder 📥
- Grüner Akzent: #059669
```

### Cards
```
┌─────────────────────────────────────┐
│ Shadow: 0 1px 3px rgba(0,0,0,0.1)   │
│ Border: 1px solid #e5e7eb           │
│ Border-radius: 8px                  │
│ Padding: 24px                       │
│ Hover: Shadow vergrößern            │
└─────────────────────────────────────┘
```

### Code-Blöcke
```
┌─────────────────────────────────────┐
│ Hintergrund: #f8fafc                │
│ Border: 1px solid #e2e8f0           │
│ Border-radius: 6px                  │
│ Font: JetBrains Mono                │
│ [📋 Kopieren] Button rechts oben    │
└─────────────────────────────────────┘
```

## Mobile Adaptierung

### Navigation
- Hamburger-Menü < 768px
- Sticky Header
- Touch-optimierte Button-Größen (min. 44px)

### Cards
- 1 Spalte auf Mobile
- 2 Spalten auf Tablet
- 4 Spalten auf Desktop

### Sidebar → Akkordeon
- Inhaltsverzeichnis wird zu aufklappbarem Menü

## Accessibility Features

- **Kontrast**: WCAG AA Standard (min. 4.5:1)
- **Keyboard Navigation**: Tab-Order, Focus States
- **Screen Reader**: Semantische HTML-Struktur
- **Alt-Texte**: Für alle Bilder/Icons
- **Skip Links**: Zum Hauptinhalt

## Performance-Ziele

- **Ladezeit**: < 2 Sekunden
- **Core Web Vitals**: Alle grün
- **Bildoptimierung**: WebP Format
- **Font-Loading**: font-display: swap

Soll ich als nächstes einen spezifischen Bereich detaillierter ausarbeiten oder haben Sie Anpassungswünsche am Design-Konzept?