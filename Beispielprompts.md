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