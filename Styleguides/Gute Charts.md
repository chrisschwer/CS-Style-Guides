---
version: "2.0.0"
lastUpdated: "2025-06-10"
changeNotes: "Major structural changes and updates: Updated section headings, Added new content"
---

# Gute Charts

## Anwendungsbereich
Diese Stilrichtlinien basieren auf Gene Zelaznys Prinzipien für effektive Datenvisualisierung und Geschäftscharts. Sie sind anzuwenden, wenn Diagramme, Grafiken oder datenbasierte Präsentationen erstellt werden sollen.

## Grundprinzipien

### Die Chart-Message steht im Mittelpunkt
* Jedes Diagramm muss eine klare, eindeutige Botschaft vermitteln
* Die Botschaft bestimmt die Chart-Art, nicht umgekehrt
* Ohne klare Message ist ein Chart nutzlos

### Der Titel ist die Botschaft
* Der Chart-Titel soll die Kernaussage enthalten, nicht nur das Thema beschreiben
* **Gut**: "Umsätze steigen kontinuierlich seit 2020"
* **Schlecht**: "Umsatzentwicklung 2020-2024"

## Chart-Auswahl nach Message-Typ

### Vergleiche zeigen
**Wann verwenden**: Unterschiede zwischen Kategorien darstellen

#### Säulendiagramm (Column Chart)
* **Beste Wahl für**: Vergleich von 2-7 Kategorien
* **Anordnung**: Größte Werte links, dann absteigend
* **Achsen**: Y-Achse bei 0 beginnen

#### Balkendiagramm (Bar Chart)  
* **Beste Wahl für**: Viele Kategorien (8+) oder lange Labels
* **Anordnung**: Größte Werte oben, dann absteigend

### Zusammensetzung zeigen
**Wann verwenden**: Teile eines Ganzen darstellen

#### Kreisdiagramm (Pie Chart)
* **Maximum 5 Segmente** - bei mehr: "Sonstige" verwenden
* **Größtes Segment bei 12 Uhr** beginnen, dann im Uhrzeigersinn absteigend
* **Prozentangaben** immer hinzufügen
* **Vermeiden bei**: Vergleichen ähnlicher Werte

#### Gestapelte Säulen
* **Beste Wahl für**: Entwicklung der Zusammensetzung über Zeit
* **Wichtigste Kategorie unten** platzieren (stabilste Basis)

### Entwicklung über Zeit zeigen
**Wann verwenden**: Trends und Veränderungen darstellen

#### Liniendiagramm
* **Kontinuierliche Daten**: Umsatz, Temperatur, Aktienkurse
* **Mehrere Linien**: Maximal 4-5 für Übersichtlichkeit
* **Y-Achse**: Sinnvoller Nullpunkt oder Bruch kennzeichnen

#### Säulen über Zeit
* **Diskrete Zeiträume**: Quartale, Jahre
* **Weniger Datenpunkte**: Maximal 12-15 Säulen

### Korrelation zeigen
**Wann verwenden**: Zusammenhang zwischen zwei Variablen

#### Streudiagramm (Scatter Plot)
* **X-Achse**: Unabhängige Variable
* **Y-Achse**: Abhängige Variable
* **Trendlinie**: Bei klarem Zusammenhang hinzufügen

## Design-Prinzipien

### Einfachheit und Klarheit
* **Entferne alles Überflüssige**: Keine Verzierungen, 3D-Effekte, unnötige Rahmen
* **Chart Junk vermeiden**: Alles was nicht zur Message beiträgt, weglassen
* **Farben sparsam verwenden**: 2-3 Farben maximum für Hervorhebungen

### Symmetrie und gleichmäßige Verteilung
* **Kategorische Elemente symmetrisch anordnen**: Bei Schaubildern mit mehreren gleichwertigen Kategorien
* **Gleichmäßige Abstände**: Alle Weißräume zwischen gleichen Elementen identisch dimensionieren
* **Beispiel Säulendiagramm**: Alle Säulenabstände gleich breit (z.B. jeweils 15px), alle Säulen gleicher Kategorie identisch breit
* **Beispiel Kreisdiagramm**: Bei mehreren Kreisen in einer Darstellung gleichmäßige Abstände und identische Größen für vergleichbare Daten
* **Ausnahme**: Bewusste Gewichtung durch Größenunterschiede nur bei hierarchischen Unterschieden

### Konsistente Gestaltung
* **Einheitliche Farbpalette** durch die gesamte Präsentation
* **Gleiche Schriftarten und -größen** für ähnliche Elemente
* **Konsistente Achsenskalierung** bei vergleichbaren Charts

### Leserfreundlichkeit
* **Schriftgröße mindestens 12pt** - auch in gedruckter Form lesbar
* **Horizontale Beschriftung** bevorzugen (weniger Augenrotation)
* **Direkte Beschriftung** statt Legenden wo möglich

## Konkrete Gestaltungsregeln

### Achsen und Skalierung
* **Y-Achse bei 0 beginnen** bei absoluten Werten
* **Achsenbrüche kennzeichnen** wenn Nullpunkt nicht sinnvoll
* **Skalierung linear halten** - logarithmische Skalen nur wenn nötig und gekennzeichnet
* **Gitterlinien sparsam** - nur zur Orientierung, nicht überladen

### Farben und Hervorhebung
* **Hauptbotschaft hervorheben**: Wichtigste Daten in Signalfarbe
* **Neutrale Farben für Kontext**: Grau für weniger wichtige Daten
* **Farbblindheit beachten**: Rot-Grün-Kombinationen vermeiden
* **Konsistente Farbkodierung**: Gleiche Kategorie = gleiche Farbe

### Titel und Beschriftung
* **Aussagekräftige Titel**: Die Message, nicht nur das Thema
* **Quellenangabe**: Immer am unteren Rand
* **Einheiten klar angeben**: €, %, Millionen etc.
* **Direkte Datenbeschriftung**: Werte direkt am Datenpunkt wenn Platz

## Häufige Fehler vermeiden

### Chart-Typ-Fehler
* **Kein Kreisdiagramm für Entwicklung über Zeit** → Liniendiagramm verwenden
* **Keine 3D-Charts** → Erschweren das Ablesen exakter Werte
* **Keine Doppel-Y-Achsen** → Können irreführen, besser separate Charts

### Skalierungs-Fehler
* **Verkürzte Y-Achse bei Vergleichen** → Übertreibt Unterschiede
* **Zu weite Y-Achse** → Minimiert erkennbare Unterschiede
* **Inkonsistente Zeitachsen** → Erschwert Vergleiche zwischen Charts

### Design-Fehler
* **Zu viele Farben** → Verwirrt den Betrachter
* **Zu kleine Schrift** → Nicht lesbar
* **Überladene Charts** → Message geht verloren

## Spezielle Chart-Arten

### Organisationscharts
* **Verwendung**: Darstellung von Unternehmensstrukturen und Hierarchien
* **Hierarchie-Prinzip**: Größere Kästchen für hierarchisch wichtigere Positionen/Einheiten, falls optische Hervorhebung der Hierarchie erwünscht
* **Gleiche Ebene = gleiche Größe**: Alle Organisationseinheiten oder Personen auf derselben Hierarchieebene erhalten identisch dimensionierte Kästchen
* **Beispiel**: 
  - Geschäftsführung: 120x60px Kästchen
  - Abteilungsleiter (alle): 100x50px Kästchen
  - Teamleiter (alle): 80x40px Kästchen
* **Abstände**: Gleichmäßige Abstände zwischen Kästchen derselben Ebene

### Wasserfalldiagramm
* **Verwendung**: Aufschlüsselung von Veränderungen (Budget zu Ist)
* **Aufbau**: Startpunkt → einzelne Veränderungen → Endpunkt
* **Farben**: Positive Veränderungen grün, negative rot

### Gantt-Diagramm
* **Verwendung**: Projektpläne und Zeitschienen
* **Aufbau**: Aktivitäten vertikal, Zeit horizontal
* **Hervorhebung**: Kritischer Pfad in Signalfarbe

### Marimekko-Diagramm
* **Verwendung**: Marktanteile mit zwei Dimensionen
* **Aufbau**: Säulenbreite = eine Dimension, Höhe = andere Dimension
* **Komplexität**: Nur für erfahrene Zielgruppen

## Präsentations-Tipps

### Schrittweise Entwicklung
* **Build-Up-Animation**: Komplexe Charts schrittweise aufbauen
* **Highlight-Sequenz**: Wichtige Punkte nacheinander hervorheben
* **Storytelling**: Charts in logischer Reihenfolge präsentieren

### Interaktion mit dem Publikum
* **Fragen stellen**: "Was sehen Sie hier?"
* **Pause nach Chart-Wechsel**: Zeit zum Erfassen geben
* **Key Message wiederholen**: Nach jedem Chart die Botschaft zusammenfassen

## Checkliste für Charts

### Vor der Erstellung
- [ ] Klare Message definiert?
- [ ] Richtige Chart-Art gewählt?
- [ ] Zielgruppe berücksichtigt?

### Nach der Erstellung
- [ ] Titel enthält die Message?
- [ ] Überflüssige Elemente entfernt?
- [ ] Schrift groß genug?
- [ ] Farben unterstützen die Message?
- [ ] Quelle angegeben?
- [ ] Symmetrie und gleichmäßige Verteilung beachtet?
- [ ] Bei Organisationscharts: Gleiche Ebene, gleiche Größe?


### Vor der Präsentation
- [ ] Chart in 5 Sekunden verständlich?
- [ ] Aus 3 Meter Entfernung lesbar?
- [ ] Message ohne Erklärung klar?

## Integration mit anderen Styleguides

### Kombination mit Präsentationsregeln
* Charts folgen der **SCS-Struktur**: Situation → Complication → Solution
* Jeder Chart unterstützt eine **Kernaussage** des Slides
* **MECE-Prinzip**: Daten vollständig und überschneidungsfrei

### Kombination mit Wolf Schneider
* **Chart-Titel wie Überschriften**: Aussage statt Thema
* **Einfachheit**: Keine überflüssigen visuellen Elemente
* **Verständlichkeit**: Für die "dümmste anzunehmende Person" im Publikum

### Zitate und historische Daten
Charts mit historischen Daten behalten ihre ursprüngliche Darstellung, wenn sie als Quelle zitiert werden. Bei eigener Aufbereitung historischer Daten gelten die modernen Gestaltungsregeln.