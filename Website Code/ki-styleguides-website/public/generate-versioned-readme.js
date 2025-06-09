/**
 * Generate README with version information for ZIP downloads
 * This file is loaded dynamically in the browser
 */

async function generateVersionedReadme() {
  try {
    // Load version manifest
    const response = await fetch('/versions.json');
    const manifest = await response.json();
    
    // Get current date
    const currentDate = new Date().toLocaleDateString('de-DE');
    
    // Generate file list with versions
    const fileList = Object.values(manifest.styleguides)
      .map(entry => `- ✅ ${entry.filename} (v${entry.version} - ${entry.lastUpdated})`)
      .join('\n');
    
    // Find latest update
    const latestUpdate = Object.values(manifest.styleguides)
      .map(e => new Date(e.lastUpdated))
      .reduce((latest, current) => current > latest ? current : latest)
      .toLocaleDateString('de-DE');
    
    // Generate README content
    const readmeContent = `# KI-Styleguides Komplettpaket

Vielen Dank für das Herunterladen!

## Enthaltene Dateien mit Versionen

${fileList}

## Versionsinformationen

- **Paket erstellt am:** ${currentDate}
- **Letzte Aktualisierung:** ${latestUpdate}
- **Gesamtanzahl Styleguides:** ${Object.keys(manifest.styleguides).length}

## Verwendung

1. Wählen Sie den passenden Styleguide für Ihr Projekt
2. Kopieren Sie den Inhalt in Ihr KI-Tool (Claude Projects, ChatGPT Custom Instructions, etc.)
3. Schreiben Sie bessere Texte mit konsistenter Qualität

## Weitere Informationen

- Website: https://cs-style-guides.vercel.app
- Anleitung: https://cs-style-guides.vercel.app/anwendung/
- GitHub: https://github.com/chrisschwer/CS-Style-Guides

## Versionshistorie

Die folgenden Styleguides wurden kürzlich aktualisiert:

${Object.values(manifest.styleguides)
  .filter(entry => {
    const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(entry.lastUpdated).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate <= 30;
  })
  .map(entry => `- **${entry.filename}** (v${entry.version}): ${entry.changeNotes}`)
  .join('\n')}

## Lizenz

Alle Inhalte stehen unter der CC BY 4.0 Lizenz.
- ✅ Kostenlose Nutzung für private und kommerzielle Zwecke
- ✅ Bearbeitung und Weiterverteilung erlaubt  
- ℹ️ Namensnennung erforderlich

**Attribution-Beispiel:**
Basierend auf "KI-Styleguides" von Christoph Schwerdtfeger, CC BY 4.0

---
Generiert am: ${currentDate}
Paket-Version: ${manifest.schema?.version || '1.0'}`;

    return readmeContent;
    
  } catch (error) {
    console.error('Error generating versioned README:', error);
    
    // Fallback README without version info
    return `# KI-Styleguides Komplettpaket

Vielen Dank für das Herunterladen!

## Verwendung

1. Wählen Sie den passenden Styleguide für Ihr Projekt
2. Kopieren Sie den Inhalt in Ihr KI-Tool (Claude Projects, ChatGPT Custom Instructions, etc.)
3. Schreiben Sie bessere Texte mit konsistenter Qualität

## Weitere Informationen

- Website: https://cs-style-guides.vercel.app
- Anleitung: https://cs-style-guides.vercel.app/anwendung/
- GitHub: https://github.com/chrisschwer/CS-Style-Guides

## Lizenz

Alle Inhalte stehen unter der CC BY 4.0 Lizenz.
- ✅ Kostenlose Nutzung für private und kommerzielle Zwecke
- ✅ Bearbeitung und Weiterverteilung erlaubt  
- ℹ️ Namensnennung erforderlich

**Attribution-Beispiel:**
Basierend auf "KI-Styleguides" von Christoph Schwerdtfeger, CC BY 4.0

---
Erstellt am: ${new Date().toLocaleDateString('de-DE')}`;
  }
}

// Make function available globally
window.generateVersionedReadme = generateVersionedReadme;