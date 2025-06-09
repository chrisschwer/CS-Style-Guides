# Interaktionsmuster & User Flows

## 1. Core Interaktionen

### Download-Funktionalität

#### Einzelne Styleguide-Downloads
```
User Journey:
1. User klickt "Download" Button
2. Browser lädt .md Datei herunter
3. Success-Toast: "Wolf Schneider Guide heruntergeladen ✓"
4. Download-Counter erhöht sich (+1)

Technische Umsetzung:
- Direct file download via href="/files/wolf-schneider.md"
- JavaScript für Analytics tracking
- Local Storage für Download-Historie
```

#### Komplettpaket-Download
```
User Journey:
1. User klickt "Alle Guides herunterladen"
2. Modal öffnet sich: "Bereite Download vor..."
3. ZIP-Datei wird generiert/geladen
4. Download startet automatisch
5. Success-Modal: "Komplettpaket erfolgreich heruntergeladen!"

Modal-Inhalt:
┌─────────────────────────────────────┐
│ 📦 Download wird vorbereitet...     │
│                                     │
│ Inhalte:                            │
│ ✓ Wolf Schneider.md                 │
│ ✓ Gendergerecht (Sternchen).md      │
│ ✓ Gendergerecht (Neutral).md        │
│ ✓ Gute Präsentationen.md            │
│ ✓ Beispielprompts.md                │
│ ✓ README.md                         │
│                                     │
│ [Progress Bar ████████░░] 80%       │
└─────────────────────────────────────┘
```

### Copy-to-Clipboard Funktionalität

#### Regeln kopieren
```
User Journey:
1. User klickt "📋 Regeln kopieren"
2. Gesamter Styleguide-Inhalt wird in Zwischenablage kopiert
3. Button ändert sich temporär: "✓ Kopiert!" (2 Sekunden)
4. Toast-Notification: "Regeln in Zwischenablage kopiert"

Code-Verhalten:
- Markdown-Inhalt als plain text
- Fallback für unsupported Browser
- Visual Feedback durch Button-Animation
```

#### Prompt-Snippets kopieren
```
User Journey:
1. User klickt "📋" Button neben Code-Block
2. Nur der Prompt-Text wird kopiert (ohne Code-Block-Syntax)
3. Mini-Toast erscheint: "Prompt kopiert"

Example Code-Block:
┌─────────────────────────────────────┐
│ ```                          [📋]   │
│ Verwende folgende Regeln nach       │
│ Wolf Schneider:                     │
│ - Hauptsachen in Hauptsätze        │
│ - Maximal 15-20 Wörter pro Satz    │
│ ```                                 │
└─────────────────────────────────────┘
```

### Navigation & Filtering

#### Styleguide-Filter (Homepage)
```
Filter-Optionen:
┌─────────────────────────────────────┐
│ Alle anzeigen  [Aktiv]              │
│ Sprache        [ ]                  │
│ Präsentationen [ ]                  │
│ Gendergerecht  [ ]                  │
└─────────────────────────────────────┘

Verhalten:
- Instant filtering (keine Seitenerneuerung)
- Smooth animations für Ein-/Ausblenden
- URL-State wird aktualisiert (?filter=sprache)
```

#### Search Functionality
```
Search Input (Header):
[🔍 Durchsuche alle Guides...        ]

Verhalten:
1. User tippt mindestens 3 Zeichen
2. Live-Search durch alle Guide-Inhalte
3. Dropdown mit Ergebnissen erscheint:

┌─────────────────────────────────────┐
│ 🔍 Ergebnisse für "hauptsatz"       │
├─────────────────────────────────────┤
│ 📝 Wolf Schneider                  │
│ "Hauptsachen in Hauptsätze"        │
│                                     │
│ 📊 Gute Präsentationen             │
│ "Hauptaussage im Slide-Titel"      │
└─────────────────────────────────────┘
```

## 2. Mobile Interaktionen

### Mobile Navigation
```
Hamburger Menu:
1. User tippt ☰ Icon
2. Slide-in Menu von links:

┌─────────────────────────────────┐
│ [×]                        KI-Styleguides │
├─────────────────────────────────┤
│ 🏠 Start                        │
│ 📋 Styleguides                  │
│   ├─ Wolf Schneider             │
│   ├─ Gendergerecht (*)          │
│   ├─ Gendergerecht (neutral)    │
│   └─ Präsentationen             │
│ 🚀 Anwendung                    │
│ 📥 Downloads                    │
│ ℹ️ Über                         │
├─────────────────────────────────┤
│ 📦 Alle Guides laden            │
└─────────────────────────────────┘
```

### Mobile Copy Actions
```
Long-Press Verhalten:
1. User hält Copy-Button gedrückt (1 Sekunde)
2. Context-Menu erscheint:

┌─────────────────────────────────┐
│ 📋 Vollständigen Guide kopieren │
│ 🎯 Nur Kernregeln kopieren      │
│ 🤖 Claude-Prompt generieren     │
│ 💬 ChatGPT-Setup kopieren       │
└─────────────────────────────────┘
```

## 3. Advanced Interactions

### Claude Project Integration
```
"🤖 Für Claude verwenden" Button:
1. User klickt Button
2. Modal öffnet sich mit Schritt-für-Schritt Anleitung:

┌─────────────────────────────────────┐
│ Claude Project Setup                │
│                                     │
│ 1️⃣ Guide wurde in Zwischenablage   │
│    kopiert ✓                       │
│                                     │
│ 2️⃣ Nächste Schritte:               │
│    • Gehen Sie zu claude.ai        │
│    • Erstellen Sie ein neues       │
│      Projekt                       │
│    • Fügen Sie den kopierten       │
│      Text hinzu                    │
│                                     │
│ [🎥 Video-Tutorial] [❌ Schließen] │
└─────────────────────────────────────┘
```

### Kombinierte Guides
```
Multi-Select für Guide-Kombination:
┌─────────────────────────────────────┐
│ Guides kombinieren:                 │
│                                     │
│ ☑️ Wolf Schneider                   │
│ ☑️ Gendergerecht (ohne Sternchen)   │
│ ☐ Gute Präsentationen              │
│                                     │
│ [📋 Kombination kopieren]           │
│ [🤖 Claude-Prompt generieren]       │
└─────────────────────────────────────┘

Generierter Combined Prompt:
"Verwende folgende Stilrichtlinien:
1. Wolf Schneider Prinzipien: ...
2. Gendergerechte Sprache (ohne Sternchen): ..."
```

## 4. Feedback & Analytics

### User Feedback Collection
```
Feedback Widget (Bottom Right):
┌─────────────────────────────────┐
│ 💭 Feedback                     │
├─────────────────────────────────┤
│ War dieser Guide hilfreich?     │
│ 👍 Ja    👎 Nein               │
│                                 │
│ [💬 Kommentar hinterlassen]     │
└─────────────────────────────────┘
```

### Download Analytics (Privacy-friendly)
```
Tracked Events (ohne persönliche Daten):
- Guide-Downloads (welcher Guide)
- Copy-Actions (welche Funktion)
- Page-Views (welche Seite)
- Search-Terms (anonymisiert)

Display für Admin:
📊 Dashboard (nur für Entwickler)
- Wolf Schneider: 1.234 Downloads
- Gendergerecht (*): 567 Downloads
- Beliebteste Suchbegriffe: "hauptsatz", "verben"
```

## 5. Error Handling & Edge Cases

### Download Fehler
```
Wenn Download fehlschlägt:
┌─────────────────────────────────────┐
│ ⚠️ Download fehlgeschlagen           │
│                                     │
│ Der Download konnte nicht gestartet │
│ werden. Bitte versuchen Sie:        │
│                                     │
│ • Browser neu laden                 │
│ • Anderen Browser verwenden         │
│ • Direkt von GitHub laden           │
│                                     │
│ [🔄 Erneut versuchen]               │
│ [🔗 GitHub öffnen]                  │
└─────────────────────────────────────┘
```

### Clipboard API nicht verfügbar
```
Fallback für ältere Browser:
┌─────────────────────────────────────┐
│ 📋 Text zum Kopieren:               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Kompletter Styleguide-Text]   │ │
│ │ (selektierbar)                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Markieren Sie den Text und         │
│ drücken Sie Strg+C (Cmd+C)         │
└─────────────────────────────────────┘
```

### Offline-Funktionalität
```
Service Worker für wichtige Inhalte:
- Alle Styleguide-Texte gecacht
- Offline-Banner wenn keine Verbindung:

┌─────────────────────────────────────┐
│ 📡 Keine Internetverbindung        │
│ Sie können die Guides weiterhin    │
│ lesen und kopieren.                │
└─────────────────────────────────────┘
```

## 6. Performance Optimierungen

### Lazy Loading
- Bilder erst laden wenn im Viewport
- Code-Highlighting nur bei Bedbedarf
- Modal-Inhalte erst bei Öffnung laden

### Smooth Animations
```CSS
/* Beispiel für Button-Feedback */
.copy-button {
  transition: all 0.2s ease;
}

.copy-button.clicked {
  transform: scale(0.95);
  background-color: #10b981;
}

.copy-button.success {
  animation: success-pulse 0.6s ease;
}
```

Diese Interaktionsmuster sorgen für eine intuitive, responsive Nutzererfahrung mit klaren Feedback-Mechanismen und Fehlerbehandlung.