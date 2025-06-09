# Beispielprompts für KI-Assistenten

## Claude Projects

### Projektanweisungen für Claude
```
Du bist ein erfahrener Redakteur, der freundlich und professionell detailliertes Feedback gibt. 
Dabei beachtest Du die beigefügten Styleguides und Hinweise.

Um präzises Feedback geben zu können, erfragst Du ggf. zunächst:
- Die Zielgruppe des Dokuments
- Bei Präsentationen: Wie viele Personen werden im Raum sein?
- Eventuelle Beschränkungen (z.B. Rahmenvorgaben für Seitenzahl oder Dauer)
```

### Beispielprompt in Claude
```
Gib mir umfassendes und detailliertes Feedback zu der anliegenden Präsentation, 
mit der ich in etwa 15 Minuten die Bürger*innen meines Heimatdorfes davon 
überzeugen möchte, dass dieses sich um das Marktrecht bemühen sollte.
```

## ChatGPT (Custom GPTs oder normale Konversation)

### Einrichtung eines Custom GPT

**Name**: Deutscher Redakteur & Stilberater

**Instructions**:
```
Du bist ein erfahrener deutscher Redakteur und Stilberater. Du hilfst bei der Erstellung 
und Überarbeitung von deutschen Texten und Präsentationen nach spezifischen Stilrichtlinien.

Verfügbare Stilrichtlinien:
1. Wolf Schneider - Klares, prägnantes Deutsch
2. Gendergerechte Sprache mit Sternchen (z.B. Student*innen)
3. Gendergerechte Sprache ohne Sternchen (neutrale Begriffe)
4. Gute Präsentationen (Struktur und Argumentation)

Bevor du mit der Arbeit beginnst, frage nach:
- Welche Stilrichtlinie(n) angewendet werden soll(en)
- Zielgruppe und Kontext
- Besondere Anforderungen oder Beschränkungen

Gib konstruktives, detailliertes Feedback und erkläre deine Verbesserungsvorschläge.
```

### Beispielprompts für ChatGPT

#### Prompt 1: Text nach Wolf Schneider überarbeiten
```
Ich möchte folgenden Text nach Wolf Schneiders Prinzipien überarbeiten lassen. 
Bitte mache ihn kürzer, klarer und verständlicher:

[Hier den Text einfügen]

Zeige mir:
1. Die überarbeitete Version
2. Die wichtigsten Änderungen mit Begründung
3. Vorher-Nachher-Vergleich problematischer Stellen
```

#### Prompt 2: Gendergerechte Stellenausschreibung
```
Bitte schreibe eine Stellenausschreibung für eine Projektleitung im IT-Bereich.

Verwende dabei:
- Gendergerechte Sprache MIT Sternchen (Mitarbeiter*innen)
- Klare, aktive Formulierungen
- MECE-Prinzip für Aufgabenlisten

Die Stelle umfasst: Teamführung, Budgetverantwortung, Kundenkontakt.
```

#### Prompt 3: Präsentation strukturieren
```
Ich muss eine 10-minütige Präsentation über die Digitalisierung unserer 
Gemeindeverwaltung halten. Zielgruppe: Gemeinderat (12 Personen, unterschiedliche 
Technikaffinität).

Bitte erstelle:
1. Eine Gliederung nach dem SCS-Muster (Situation/Complication/Solution)
2. Aussagekräftige Titel für jeden Slide
3. Kernbotschaften pro Slide (max. 3 Punkte)

Verwende dabei die Prinzipien aus "Gute Präsentationen".
```

#### Prompt 4: Kombinierte Stilrichtlinien
```
Überarbeite folgende Pressemitteilung:
[Text einfügen]

Bitte wende an:
1. Wolf Schneiders Klarheitsprinzipien (kurze Sätze, aktiv, konkret)
2. Gendergerechte Sprache OHNE Sternchen (neutrale Begriffe bevorzugen)

Markiere alle Änderungen und erkläre, welche Regel du jeweils angewendet hast.
```

### Tipps für ChatGPT-Nutzung

#### Stilrichtlinien bereitstellen
Da ChatGPT keinen Zugriff auf die Dateien hat, müssen Sie die relevanten Regeln im Prompt mitgeben:

```
Verwende folgende Regeln nach Wolf Schneider:
- Hauptsachen in Hauptsätze
- Maximal 15-20 Wörter pro Satz
- Verben statt Substantive
- Aktiv statt Passiv
- Konkret statt abstrakt

[Ihr Text zur Überarbeitung]
```

#### Schritt-für-Schritt-Anleitung
```
Analysiere diesen Text in drei Schritten:
1. Identifiziere Verstöße gegen Wolf Schneiders Regeln
2. Schlage konkrete Verbesserungen vor
3. Erstelle eine überarbeitete Gesamtversion

Text: [Ihr Text]
```

#### Feedback-Prompt
```
Gib mir Feedback zu dieser Präsentationsstruktur:
[Ihre Gliederung]

Prüfe auf:
- Story-Aufbau (roter Faden durch Slide-Titel)
- SCS-Muster (Situation/Complication/Solution)
- MECE-Prinzip bei Aufzählungen
- Ein Kerngedanke pro Slide

Bewerte auf einer Skala von 1-10 mit Begründung.
```

## Microsoft 365 Copilot Chat

### Verwendung in Office-Anwendungen

Microsoft 365 Copilot ist direkt in Word, PowerPoint, Excel und Outlook integriert. **Wichtig**: Da Copilot keinen dauerhaften Kontext speichert, müssen Sie die relevanten Styleguide-Regeln bei jedem Prompt mitgeben.

**Vorbereitung**: 
1. Öffnen Sie den gewünschten Styleguide (z.B. Wolf Schneider.md)
2. Kopieren Sie die relevanten Regeln
3. Fügen Sie diese in Ihren Copilot-Prompt ein

Die Styleguides lassen sich besonders gut für die folgenden Anwendungen nutzen:

#### Word - Textverbesserung
```
Überarbeite diesen Text nach Wolf Schneiders Prinzipien:

REGELN:
- Hauptsachen in Hauptsätze
- Maximal 15-20 Wörter pro Satz  
- Verben statt Substantive
- Aktiv statt Passiv
- Konkret statt abstrakt
- Einer muss sich plagen: der Schreiber oder der Leser
- Schreibe, wie du sprichst - nur besser

ZUSÄTZLICHE PRINZIPIEN:
- Entferne Füllwörter (eigentlich, irgendwie, quasi)
- Vermeide Blähwörter (Inbetriebnahme → Start)
- Der Köder muss dem Fisch schmecken, nicht dem Angler

TEXT ZU ÜBERARBEITEN:
[Text hier einfügen]

Zeige mir die wichtigsten Änderungen und begründe sie.
```

#### PowerPoint - Präsentationsoptimierung
```
Verbessere diese Präsentation nach den Regeln für "Gute Präsentationen":

STRUKTUR-REGELN:
- Slide-Titel enthalten Aussagen (nicht nur Themen)
- SCS-Muster: Situation → Complication → Solution  
- Story durch Slide-Titel erkennbar
- Maximal eine Kernbotschaft pro Slide

CONTENT-REGELN:
- MECE-Prinzip bei Aufzählungen (vollständig, überschneidungsfrei)
- Listen: 3-7 Elemente
- Argumentationsmuster: Beschreiben → Beurteilen → Folgern

BEISPIELE GUTER TITEL:
- Statt "Probleme" → "Aktuelle Prozesse verursachen 30% Mehrkosten"
- Statt "Lösung" → "Automatisierung reduziert Kosten um 40%"

PRÄSENTATION ZU VERBESSERN:
[Präsentationsinhalt hier einfügen]
```

#### Outlook - E-Mail-Verbesserung
```
Schreibe diese E-Mail um nach folgenden Regeln:

WOLF SCHNEIDER PRINZIPIEN:
- Kurze, klare Sätze (max. 20 Wörter)
- Verben statt Substantive
- Aktiv statt Passiv
- Konkret statt abstrakt

GENDERGERECHTE SPRACHE (ohne Sternchen):
- Neutrale Begriffe: Fachkraft, Team, Person
- Partizipien: Studierende, Mitarbeitende, Lehrende
- Umschreibungen: "alle, die..." statt "jeder, der..."

STIL:
- Professionell aber freundlich
- Maximal 150 Wörter
- Klare Call-to-Action

URSPRÜNGLICHE E-MAIL:
[E-Mail-Text hier einfügen]
```

### Beispielprompts für verschiedene Anwendungsfälle

#### Prompt 1: Geschäftsbrief optimieren
```
@Copilot Überarbeite diesen Geschäftsbrief nach Wolf Schneider Prinzipien:

Anforderungen:
- Kurze, klare Sätze (max. 20 Wörter)
- Konkrete statt abstrakte Formulierungen
- Aktiv statt Passiv
- Gendergerechte Sprache ohne Sonderzeichen

[Brief-Text hier einfügen]

Erkläre die 3 wichtigsten Verbesserungen.
```

#### Prompt 2: Präsentation für Management
```
@Copilot Erstelle eine 10-Slide-Präsentation zum Thema "Digitale Transformation":

Struktur nach SCS-Muster:
- Situation: Aktueller Stand der Digitalisierung
- Complication: Herausforderungen und Probleme
- Solution: Lösungsvorschläge und nächste Schritte

Regeln:
- Slide-Titel als Aussagen formulieren
- Max. 3 Bullet Points pro Slide
- MECE-Prinzip bei Aufzählungen
- Kernbotschaft pro Slide hervorheben
```

#### Prompt 3: Stellenausschreibung erstellen
```
@Copilot Schreibe eine Stellenausschreibung für "Projektleitung Marketing":

Anforderungen:
- Gendergerechte Sprache mit neutralen Begriffen (Fachkraft, Person, Team)
- Wolf Schneider Klarheit: kurze Sätze, konkrete Angaben
- MECE-strukturierte Aufgabenliste
- Ansprechende, aber professionelle Tonalität

Inhalte: Teamführung (5 Personen), Budgetverantwortung (500k€), Kundenkontakt
```

#### Prompt 4: Datenvisualisierung verbessern
```
@Copilot Analysiere dieses Diagramm nach Gene Zelazny Prinzipien:

Prüfe auf:
- Ist die Message im Titel klar erkennbar?
- Richtige Chart-Art für die Datenart gewählt?
- Überflüssige Elemente ("Chart Junk") entfernt?
- Farben unterstützen die Kernaussage?
- Achsenbeschriftung vollständig und verständlich?

[Diagramm beschreiben oder einfügen]

Gib konkrete Verbesserungsvorschläge.
```

### Integration in Office-Workflows

#### Word-Integration
```
/draft Schreibe einen Bericht über [Thema] nach Wolf Schneider Prinzipien:
- Klare Struktur mit Überschriften als Aussagen
- Kurze Absätze (max. 5 Sätze)
- Konkrete Beispiele statt abstrakte Begriffe
- Gendergerechte Sprache mit neutralen Begriffen
```

#### PowerPoint-Integration  
```
/design Erstelle Slides für [Thema] mit folgender Struktur:
1. Titel-Slide mit klarer Kernaussage
2. SCS-Aufbau: Situation → Problem → Lösung
3. Maximal 6 Wörter pro Bullet Point
4. Ein visuelles Element pro Slide zur Unterstützung der Message
```

#### Excel-Integration
```
/analyze Erstelle ein Dashboard mit Charts nach Zelazny-Prinzipien:
- Chart-Titel enthalten die Kernaussage, nicht nur das Thema
- Richtige Chart-Art je nach Datentyp (Vergleich, Entwicklung, Anteil)
- Farben unterstützen die Message
- Überflüssige Elemente entfernt
- Direkte Datenbeschriftung wo möglich
```

### Copilot-spezifische Tipps

#### Kontext bereitstellen (WICHTIG für jeden Prompt)
Da Microsoft 365 Copilot keinen dauerhaften Kontext speichert, müssen Sie die Styleguide-Regeln bei jedem neuen Prompt mitgeben:

```
@Copilot Für die folgenden Aufgaben verwende diese Stilrichtlinien:

WOLF SCHNEIDER REGELN:
- Einer muss sich plagen: der Schreiber oder der Leser
- Hauptsachen in Hauptsätze
- Verben sind stärker als Substantive
- Konkret schlägt abstrakt
- Maximal 15-20 Wörter pro Satz
- Aktiv statt Passiv
- Entferne Füllwörter und Blähwörter

AUFGABE:
Jetzt optimiere: [Ihr Text]
```

💡 **Tipp**: Speichern Sie häufig verwendete Regelsets als Textbausteine in Word/Outlook für schnelles Einfügen.

#### Iterative Verbesserung
```
@Copilot Verbessere schrittweise:
1. Ersten Durchgang: Wolf Schneider Klarheit
2. Zweiten Durchgang: Gendergerechte Sprache
3. Dritten Durchgang: Präsentationslogik (falls zutreffend)

Zeige mir nach jedem Schritt die Änderungen.

[Text/Präsentation hier]
```

#### Feedback einholen
```
@Copilot Bewerte diesen Text auf einer Skala von 1-10 für:
- Klarheit (Wolf Schneider Kriterien)
- Inklusivität (gendergerechte Sprache)
- Struktur (logischer Aufbau)
- Zielgruppeneignung

Text: [Ihr Text]

Gib konkrete Verbesserungsvorschläge für Bewertungen unter 8.
```

### Vorlagen für häufige Aufgaben

#### E-Mail-Vorlage
```
@Copilot Schreibe eine E-Mail mit folgender Struktur:
1. Betreff: Kernaussage in max. 8 Wörtern
2. Anrede: Gendergerecht ohne Sternchen
3. Hauptteil: SCS-Struktur (Situation, Problem, Lösung)
4. Call-to-Action: Konkret und eindeutig
5. Abschluss: Professionell aber freundlich

Thema: [Ihr Thema]
Zielgruppe: [Empfänger beschreiben]
```

#### Meeting-Agenda-Vorlage
```
@Copilot Erstelle eine Meeting-Agenda nach MECE-Prinzip:
- Alle Themenbereiche vollständig abgedeckt
- Keine Überschneidungen zwischen Punkten
- Zeitangaben für jeden Punkt
- Klare Verantwortlichkeiten
- Erwartete Ergebnisse definiert

Meeting-Ziel: [Ziel beschreiben]
Teilnehmer: [Anzahl und Rollen]
Dauer: [Zeit]
```