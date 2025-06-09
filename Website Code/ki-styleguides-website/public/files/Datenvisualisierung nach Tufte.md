# Datenvisualisierung nach Edward Tufte

## Anwendungsbereich
Diese Stilregeln basieren auf Edward Tuftes Prinzipien für exzellente Datenvisualisierung. Sie sind anzuwenden bei der Erstellung von Diagrammen, Grafiken und datenbasierten Präsentationen.

## Grundprinzipien

### 1. Maximiere das Daten-Tinten-Verhältnis
Jeder Tropfen Tinte sollte Daten darstellen, nicht Dekoration.

**Entfernen Sie**:
- Unnötige Gitterlinien
- Redundante Achsenbeschriftungen
- Dekorative Elemente
- 3D-Effekte bei 2D-Daten
- Überflüssige Rahmen und Hintergründe

**Beispiel**:
- **Schlecht**: Balkendiagramm mit gemusterten Füllungen, dicken Rahmen, Schatten
- **Gut**: Einfache graue Balken ohne Rahmen, nur horizontale Hilfslinien wo nötig

### 2. Zeige die Daten
Die Daten selbst sind der Star, nicht das Design.

**Prinzipien**:
- Verwende eine hohe Datendichte
- Zeige Datenpunkte, nicht nur Zusammenfassungen
- Ermögliche Vergleiche
- Integriere Text und Grafik

**Beispiel**:
Statt eines Tortendiagramms mit 5 Kategorien → Verwende eine Tabelle mit Sparklines

### 3. Vermeide Chartjunk
Eliminiere alle nicht-informativen Elemente.

**Chartjunk umfasst**:
- Moiré-Muster
- Gitter aus dicken Linien
- Überflüssige Texte und Symbole
- Pseudo-3D
- Ablenkende Hintergrundbilder

### 4. Nutze Small Multiples
Zeige Veränderungen über Zeit, Raum oder Kategorien durch wiederholte kleine Grafiken.

**Vorteile**:
- Ermöglicht direkten visuellen Vergleich
- Zeigt Muster und Ausnahmen
- Effiziente Nutzung des Raums

**Beispiel**:
12 kleine Liniendiagramme (je eines pro Monat) statt ein überladenes Diagramm mit 12 Linien

## Konkrete Gestaltungsregeln

### Farben
- **Sparsam verwenden**: Maximal 3-4 Farben pro Grafik
- **Zweckmäßig einsetzen**: Farbe zur Hervorhebung, nicht zur Dekoration
- **Grautöne bevorzugen**: Für die meisten Elemente
- **Konsistenz**: Gleiche Farbe = gleiche Bedeutung

### Typografie in Grafiken
- **Klein aber lesbar**: 8-10pt für Beschriftungen
- **Direkte Beschriftung**: Text nah bei den Daten, nicht in separater Legende
- **Horizontaler Text**: Vermeiden Sie gedrehte Beschriftungen
- **Sans-serif**: Für kleine Beschriftungen

### Achsen und Skalen
- **Nullpunkt zeigen**: Bei Verhältnisdaten immer bei Null beginnen
- **Dünne Linien**: Achsen nicht dicker als die Daten
- **Sinnvolle Intervalle**: Runde, intuitive Zahlen
- **Einheiten angeben**: Direkt an der Achse, nicht im Titel

### Legenden
- **Vermeiden wenn möglich**: Direkte Beschriftung bevorzugen
- **Wenn nötig**: Klein und nah bei den Daten
- **Natürliche Reihenfolge**: Wie sie in der Grafik erscheinen

## Spezielle Diagrammtypen

### Sparklines
Wortgroße Grafiken im Fließtext
- Ideal für Trends
- Keine Achsen nötig
- Minimum/Maximum markieren
- Endwert hervorheben

**Beispiel**: Die Aktienkursentwicklung ▁▂▄▆▇▆▄▃▂▃▄▅▆ zeigt Volatilität

### Slope Graphs
Für Vorher-Nachher-Vergleiche
- Nur zwei Zeitpunkte
- Direkte Beschriftung
- Steigung zeigt Veränderung

### Dot-Dash-Plots
Alternative zu Balkendiagrammen
- Punkt zeigt Wert
- Linie zeigt Bereich oder Verbindung
- Platzsparender als Balken

## Integration von Grafik und Text

### Prinzipien
- **Grafiken im Textfluss**: Nicht auf separaten Seiten
- **Erklärungen integrieren**: Direkt in der Grafik, nicht darunter
- **Konsistente Verweise**: Gleiche Begriffe in Text und Grafik

### Platzierung
- **Beim ersten Verweis**: Grafik erscheint bei der ersten Erwähnung
- **Rechtsbündig**: Bei schmalen Grafiken
- **Volle Breite**: Bei komplexen Darstellungen

## Tabellen nach Tufte

### Gestaltung
- **Keine vertikalen Linien**
- **Minimale horizontale Linien**: Nur zur Gruppierung
- **Weißraum**: Zur visuellen Trennung
- **Rechtsbündige Zahlen**: Für einfachen Vergleich

### Beispiel
```
Jahr    Umsatz    Gewinn    Marge
2021    120.5     12.3      10.2%
2022    135.8     15.7      11.6%
2023    142.3     14.9      10.5%
```

## Häufige Fehler vermeiden

### Lügen mit Statistik
- **Verzerrte Achsen**: Y-Achse nicht bei Null beginnen
- **Cherry-Picking**: Nur günstige Zeiträume zeigen
- **Falsche Korrelationen**: Kausalität implizieren

### Überladung
- **Zu viele Variablen**: Maximal 3-4 Dimensionen
- **Zu viele Datenpunkte**: Aggregieren wenn nötig
- **Zu viele Farben**: Verwirrt mehr als es hilft

## Qualitätskontrolle

### Checkliste für jede Grafik
1. Kann ich Tinte entfernen ohne Informationsverlust?
2. Ist das Daten-Tinten-Verhältnis maximiert?
3. Sind alle Elemente notwendig?
4. Kann der Leser die Hauptaussage in 5 Sekunden erfassen?
5. Sind Vergleiche einfach möglich?
6. Ist die Grafik ehrlich und unverzerrend?

### Test-Methode
1. **Schwarz-Weiß-Test**: Funktioniert die Grafik ohne Farbe?
2. **Entfernungstest**: Ist die Hauptaussage aus 2m Entfernung erkennbar?
3. **Kontext-Test**: Versteht man die Grafik ohne den umgebenden Text?

## Beispiele guter Praxis

### Dashboard-Design
- **Eine Zahl groß**: Die wichtigste Kennzahl prominent
- **Sparklines**: Für Trends
- **Kleine Vielfache**: Für Vergleiche
- **Graustufen**: Als Basis, Farbe nur für Alarme

### Berichte
- **Integrierte Grafiken**: Im Textfluss
- **Marginalen nutzen**: Für zusätzliche Details
- **Konsistentes Design**: Über alle Seiten
- **Datenanhang**: Rohdaten für Interessierte

## Werkzeuge und Umsetzung

### Empfohlene Tools
- **R/ggplot2**: Mit theme_tufte()
- **Python/matplotlib**: Mit despine() und minimalen Themes
- **D3.js**: Für interaktive Visualisierungen
- **Excel**: Nur mit starker Nachbearbeitung

### Anti-Patterns
- **Keine Tortendiagramme**: Schwer zu vergleichen
- **Keine 3D-Diagramme**: Verzerren die Wahrnehmung
- **Keine Donut-Charts**: Noch schwerer zu lesen
- **Keine gestapelten Flächen**: Nur die unterste ist akkurat