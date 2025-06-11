# KI-Styleguides Projekt

Professionelle Styleguides für KI-assistiertes Schreiben auf Deutsch.

## 📝 Styleguides bearbeiten / hinzufügen (für Contributors)

### Neuen Styleguide hinzufügen

1. **Erstellen Sie eine neue .md-Datei** im `Styleguides/` Ordner
2. **Fügen Sie das erforderliche Frontmatter hinzu**:
   ```yaml
   ---
   version: "1.0.0"
   lastUpdated: "YYYY-MM-DD"
   changeNotes: "Initial version"
   ---
   ```
3. **Strukturieren Sie den Inhalt** mit klaren Überschriften und Beispielen
4. **Testen Sie** den Guide mit KI-Tools (Claude, ChatGPT)
5. **Erstellen Sie einen Pull Request**

### Bestehende Styleguides bearbeiten

**⚠️ WICHTIG**: Bearbeiten Sie nur Dateien im `Styleguides/` Ordner!

1. **Bearbeiten Sie die gewünschte Datei** in `Styleguides/`
2. **Aktualisieren Sie das Frontmatter** (version, lastUpdated, changeNotes)
3. **Testen Sie Ihre Änderungen**
4. **Erstellen Sie einen Pull Request**

Detaillierte Anweisungen finden Sie in [CLAUDE.md](CLAUDE.md#adding-a-new-style-guide).

## 🚀 Projekt-Status

**Content**: ✅ 8 Styleguides komplett, inkl. Microsoft 365 Copilot Support
**Design**: ✅ Vollständiges Design-System und Wireframes
**Website**: ✅ Vollständig implementiert mit allen Detail-Seiten
**Deployment**: ✅ Produktionsbereit für sofortiges Deployment

## Projektstruktur

### 📋 Styleguides/
Die eigentlichen Styleguide-Dateien - ready to use mit KI-Tools:
- **Gutes Deutsch**: Klares, prägnantes Deutsch nach bewährten Prinzipien
- **Gendergerechte Sprache** (2 Varianten: mit/ohne Sternchen)
- **Gute Präsentationen**: SCS-Muster und MECE-Prinzip
- **Gute Charts**: Effektive Datenvisualisierung nach bewährten Prinzipien
- **Gute Protokolle**: Prägnante Meetingzusammenfassungen und Aufgabenverfolgung
- **Datenvisualisierung**: Elegante Informationsvisualisierung
- **Beispielprompts**: Ready-to-use Prompts für Claude, ChatGPT und Microsoft 365 Copilot

### 🎨 Website Design/
Design-Konzept, Wireframes und Content für die Website:
- Vollständiges Design-System
- Detaillierte Wireframes für alle Seiten
- Deutsche Website-Texte
- Interaktionsmuster und User Flows

### 💻 Website Code/
Vollständige Website-Implementierung:
- **Astro + Tailwind CSS** - Moderner Tech-Stack
- **Produktionsbereit** - Alle Seiten und Features implementiert
- **Responsive Design** - Mobile-first Ansatz
- **Copy-to-Clipboard** - Für einfache KI-Integration
- **ZIP Downloads** - Komplettpaket-Funktionalität
- **Dynamic Routing** - Individual-Seiten für alle Styleguides
- **Automatic Versioning** - Semantische Versionierung mit Git-Integration
- **German Date Formatting** - Durchgängige deutsche Datumsformatierung (dd.mm.yyyy)
- **Community Acknowledgement** - GitHub-Mitwirkenden-System mit Opt-Out-Mechanismus

## Quick Start

### Styleguides verwenden
1. Gehen Sie in den `Styleguides/` Ordner
2. Wählen Sie den passenden Guide aus
3. Kopieren Sie den Inhalt in Ihr KI-Tool (Claude, ChatGPT)
4. Referenzieren Sie die Regeln in Ihren Prompts

### Website entwickeln
1. Wechseln Sie in `Website Code/ki-styleguides-website/`
2. Führen Sie `npm install` und `npm run dev` aus
3. Website läuft auf `http://localhost:4321`
4. Siehe `planning/` für technische Dokumentation

### Website live ansehen
- **Status**: Vollständig implementiert und produktionsbereit
- **Features**: Alle 7 Styleguide-Seiten, Downloads, legale Seiten
- **Bereit für**: Sofortiges Deployment auf Netlify/Vercel

## Automatische Versionierung

Das Projekt verfügt über ein vollständiges automatisches Versionierungssystem:

### Features
- **Semantische Versionierung** - MAJOR.MINOR.PATCH für alle Styleguides
- **Git-basierte Änderungserkennung** - Automatische Analyse von Änderungen
- **Build-Integration** - Versionsprüfungen während des Build-Prozesses
- **Smart Version Bumps** - Intelligente Bestimmung der Versionstypen
- **Umfassende Dokumentation** - Vollständige Versionshistorie und Changelog

### Versionierung bei Änderungen

Wenn Sie Änderungen an Styleguides vornehmen und die Website aktualisieren möchten:

```bash
# 1. Nach der Bearbeitung im Styleguides/ Ordner
cd "Website Code/ki-styleguides-website"

# 2. Änderungen prüfen
npm run version:check

# 3. Versionen automatisch aktualisieren
npm run version:update

# 4. Build ausführen (synchronisiert automatisch alle Dateien)
npm run build
```

**Automatische Synchronisation:**
- Dateien in `public/files/` werden automatisch aus `Styleguides/` synchronisiert
- Ändern Sie niemals direkt Dateien in `public/files/` - diese werden überschrieben
- Das Versionierungssystem erkennt nur Änderungen in den Original-Dateien im `Styleguides/` Ordner

### Deployment auf Vercel/Netlify

✅ **Funktioniert automatisch!** Der Build-Prozess ist vollständig integriert:

**Workflow für Deployment:**
```bash
# 1. Styleguide lokal bearbeiten
# Beispiel: Bearbeiten Sie "Styleguides/Gutes Deutsch.md"

# 2. Versionierung lokal aktualisieren (empfohlen)
cd "Website Code/ki-styleguides-website"
npm run version:update

# 3. Zu Git hinzufügen und pushen
git add .
git commit -m "Update Gutes Deutsch styleguide"
git push

# 4. Vercel baut automatisch:
# - npm run prebuild (Dateien synchronisieren)
# - npm run build (mit Astro Versionierung)
# - npm run postbuild (Validierung)
```

**Zwei Optionen:**
- **Option A (Empfohlen)**: Versionen lokal aktualisieren vor dem Push
- **Option B**: Nur Styleguides bearbeiten, Vercel synchronisiert automatisch (aber ohne Versionierung)

**✅ VERCEL DEPLOYMENT BESTÄTIGT:**
Das System wurde erfolgreich getestet und funktioniert auf Vercel automatisch!

### Weitere Kommandos
```bash
# Versionshistorie anzeigen
npm run version:history

# Dateien manuell synchronisieren
npm run files:sync

# Nur Content-Hashes aktualisieren
npm run version:update-hashes
```

### Versionsdisplay
- Versionsnummern werden auf allen Seiten angezeigt (aktuell: v1.0.1)
- ZIP-Downloads enthalten Versionsmanifest und Changelog
- Homepage zeigt kürzlich aktualisierte Guides hervor
- Download-Seite bietet detaillierte Versionsinformationen
- Deutsche Datumsformatierung (dd.mm.yyyy) durchgängig implementiert

### Aktuelle Versionen (Stand: 09.06.2025)
Alle Styleguides wurden auf Version 1.0.1 aktualisiert mit korrigierten Erstellungsdaten und deutscher Datumsformatierung.

## Community Features

### GitHub-Mitwirkenden-Anerkennung
Das Projekt verfügt über ein vollständiges System zur Anerkennung von Community-Beiträgen:

**Features:**
- **Automatische Mitwirkenden-Liste** - Zeigt alle GitHub-Contributors der Reihe nach an
- **Opt-Out-Mechanismus** - Respektiert Privatsphäre-Wünsche (GitHub Issues, Repository-Dateien)
- **Caching-System** - 24-Stunden-Cache für bessere Performance
- **Fallback-Behandlung** - Graceful Degradation bei API-Ausfällen
- **Responsive Design** - Ansprechende Darstellung auf allen Geräten

**Implementierte Komponenten:**
- `ContributorsList.astro` - Vollständige Komponente mit Lazy Loading und Accessibility
- GitHub API Integration mit Retry-Logic und Fehlerbehandlung
- Umfassende Tests für alle Funktionalitäten

## Lizenz

Alle Inhalte stehen unter [CC BY 4.0](Styleguides/LICENSE) - kostenlos für private und kommerzielle Nutzung mit Namensnennung.

## Links

- [Hauptdokumentation](Styleguides/README.md)
- [Website-Design](Website%20Design/)
- [Website-Code](Website%20Code/)
- [GitHub Repository](https://github.com/chrisschwer/CS-Style-Guides)