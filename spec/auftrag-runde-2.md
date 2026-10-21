# Codex – Entwicklungsrunde 2: Mission Sinneslabor

## Ausgangslage

Arbeite im bestehenden GitHub-Repository `Feerson1617/Lernspiel-Sinne`.

Das Spiel ist bereits vollständig programmiert und über GitHub Pages veröffentlicht:

https://feerson1617.github.io/Lernspiel-Sinne/

Eine unabhängige Prüfung hat konkrete technische und didaktische Verbesserungsmöglichkeiten ergeben. Hinzu kommen neue Anforderungen der Lehrkraft an Navigation, Niveaudifferenzierung und Feedback.

**Auftrag:** Überarbeite das bestehende Spiel gezielt. Behalte alle 24 Aufgaben, alle vier Niveaustufen und die funktionierende technische Grundlage bei.

Keine Neuentwicklung, kein unnötiger Austausch der technischen Architektur.

### Oberste Prioritäten

1. Fachliche Richtigkeit sämtlicher Fragen, Lösungen und Rückmeldungen.
2. Äußerst einfache Sprache für eine heterogene 8. Klasse.
3. Zuverlässige Antwortbewertung, insbesondere bei Freitexten.
4. Klare, verständliche Benutzerführung.
5. Deutlichere Unterschiede zwischen ESA, MSA und AHR.
6. Möglichst 30 Minuten Bearbeitungszeit.

---

# TEIL 1 – FEEDBACK UND FARBEN

## 1. Farbsystem grundlegend überarbeiten

Die Rückmeldungen sind derzeit farblich nicht eindeutig.

Insbesondere ist die Schrift bei falschen Einzelzuordnungen teilweise grün. Das ist didaktisch problematisch.

Verwende zukünftig folgende verbindliche Farbzuordnung:

### GRÜN – richtig

Grün wird ausschließlich für fachlich richtige Antworten oder richtig zugeordnete Begriffe verwendet.

Beispiele:
- „Richtig!“
- „Das passt!“
- Eine korrekt beschriftete anatomische Struktur.

Gestalte die Rückmeldung mit klar erkennbarem Grün und einem Häkchen.

### ROT – falsch

Rot wird ausschließlich für eindeutig fachlich falsche Antworten oder Zuordnungen verwendet.

Beispiele:
- „Das passt noch nicht.“
- „Versuche es erneut.“
- Ein falsch zugeordneter anatomischer Begriff.

Die betreffende Beschriftung, Markierung oder Antwort erhält eine rote Kennzeichnung.

**Besonders wichtig:** Auch die kleinen Texte unter falschen Einzelzuordnungen müssen rot erscheinen. Sie dürfen keine grüne Schriftfarbe erben.

### GELB – teilweise richtig oder unklar

Gelb wird verwendet, wenn die Antwort:
- teilweise richtig ist;
- nicht eindeutig verstanden wurde;
- noch ergänzt werden muss;
- eine Rückfrage auslöst;
- zusätzliche Hilfe benötigt.

Beispiele:
- „Ein Teil stimmt schon.“
- „Ich bin nicht sicher, was du meinst.“
- „Du bist auf dem richtigen Weg.“

Hilfehinweise und Auswahlklärungen sollen ebenfalls gelb gekennzeichnet werden.

### NEUTRAL – noch nicht beantwortet

Unbearbeitete Felder müssen neutral dargestellt werden.

Keine rote Fehlerkennzeichnung, solange noch keine falsche Antwort abgegeben wurde.

### Technische Anforderungen

Überprüfe insbesondere:
- `.feedback.correct`
- `.feedback.incorrect`
- `.feedback.partial`
- `.feedback.clarify`
- `.part-feedback`
- `.is-correct`
- Einzelrückmeldungen innerhalb von Beschriftungsaufgaben

Eine Korrektur der globalen Feedbackbox genügt nicht. Alle einzelnen Eingabe- und Zuordnungselemente müssen das gleiche Farbsystem verwenden.

Verwende gute Kontraste, gut lesbare Schrift und eindeutige Symbole.

Farbe darf nicht das einzige Erkennungsmerkmal sein. Ergänze Symbole und kurze Texte.

Keine blinkenden oder übermäßig auffälligen Fehleranimationen.

---

# TEIL 2 – DIE NAVIGATION GRUNDLEGEND VEREINFACHEN

## 2. Vier Laborbereiche durch zwei Hauptbereiche ersetzen

Die bisherige Unterteilung in:
- Hörstudio
- Augenlabor
- Wahrnehmungslabor
- Große Sinnes-Mission

wird vollständig aus der Schülernavigation entfernt.

Stattdessen gibt es genau zwei große Hauptbereiche:

**Hören mit den Ohren**

**Sehen mit den Augen**

Diese beiden Bezeichnungen sollen konsequent in der gesamten Benutzeroberfläche verwendet werden.

Die Bezeichnung „Mission“ kann im Namen des Spiels erhalten bleiben, sollte aber nicht mehr ständig für einzelne Aufgaben und Bereiche benutzt werden.

Bezeichne die einzelnen Lernaktivitäten vorzugsweise als „Aufgaben“.

### Neue Hauptnavigation

Nach Auswahl des Niveaus sehen die Lernenden zwei große, deutlich unterscheidbare Schaltflächen:

**Hören mit den Ohren**
- Symbol oder Abbildung eines Ohrs.
- Fortschritt, beispielsweise „4 von 12 Aufgaben geschafft“.
- Durch Anklicken öffnet sich ein Drop-down-Menü mit den zugehörigen Aufgaben.

**Sehen mit den Augen**
- Symbol oder Abbildung eines Auges.
- Fortschritt, beispielsweise „7 von 12 Aufgaben geschafft“.
- Durch Anklicken öffnet sich ein Drop-down-Menü mit den zugehörigen Aufgaben.

Die einzelnen Aufgaben erscheinen direkt unter der jeweiligen großen Schaltfläche.

Jede Aufgabe lässt sich einzeln anwählen.

Im Drop-down-Menü wird angezeigt, welche Aufgaben bereits bearbeitet wurden.

Beispiel:

Hören mit den Ohren ▼
- Das Ohr untersuchen
- Wie hören wir?
- Woher kommt ein Geräusch?
- Das laute Konzert
- ...

Verwende möglichst einfache und verständliche Aufgabentitel.

Keine abstrakten Bezeichnungen wie „Labor 04“, „Wahrnehmungslabor“ oder „große Sinnes-Mission“ in der Schüleransicht.

### Zuordnung der vorhandenen Aufgaben

Erhalte alle bisherigen Aufgaben-IDs.

Ordne sie wie folgt zu:

**Hören mit den Ohren (12 Aufgaben):**

T01, T02, T03, T04, T05, T06, T13, T14, T16, T19, T20, T21

**Sehen mit den Augen (12 Aufgaben):**

T07, T08, T09, T10, T11, T12, T15, T17, T18, T22, T23, T24

Die Aufgaben T17 und T24 dürfen weiterhin beide Sinnesorgane vergleichen. Sie werden für die Navigation dem Sehen zugeordnet, da dort bereits wichtige Unterschiede zwischen Auge und Ohr aufgegriffen werden.

### Weitere Navigationsregeln

- Beide Bereiche müssen jederzeit erreichbar sein.
- Die Drop-down-Menüs müssen sich öffnen und wieder schließen lassen.
- Das ausgewählte Niveau bleibt erhalten.
- Bereits bearbeitete Aufgaben werden markiert.
- Der Fortschritt bleibt gespeichert.
- Nach einer Aufgabe kann zur nächsten Aufgabe des Bereichs gewechselt werden.
- Es muss einen einfachen Weg zurück zur Themenübersicht geben.
- Keine unnötigen zusätzlichen Bildschirme.
- Gute Darstellung auf Desktop und iPad.

Passe auch die Abschlussübersicht an die zwei Themenbereiche an.

Anstelle von vier Labor-Abzeichen reichen zwei erkennbare Themenabschlüsse.

### Technische Migration

Die bisherigen gespeicherten Fortschritte sollen möglichst erhalten bleiben.

Verwende die vorhandenen Aufgaben-IDs und leite die neue Themenzugehörigkeit aus diesen IDs ab.

Ein notwendiger Wechsel der Datenversion darf nicht kommentarlos sämtliche gespeicherten Schülerfortschritte löschen.

Wenn sich eine Migration nicht zuverlässig umsetzen lässt, dokumentiere das.

---

# TEIL 3 – INFOTEXT VEREINFACHEN

## 3. Die Schaltfläche „Info“ überarbeiten

Der bisherige Infotext enthält zu viele technische und organisatorische Informationen.

Er ist eher für Lehrkräfte oder Entwickler geschrieben und nicht für Schülerinnen und Schüler einer 8. Klasse.

Entferne aus der Schüleransicht ausführliche Texte über:
- technische Speicherung;
- diagnostische Validierung;
- Programmiersprachen;
- Softwaregrenzen;
- Entwicklungsstand;
- Testumgebungen.

Diese Informationen gehören bei Bedarf in die README-Datei.

### Neuer Infotext

Verwende in etwa folgenden Text:

**So funktioniert das Spiel**

„Wähle dein Niveau.

Suche dir Hören oder Sehen aus.

Löse die Aufgaben.

Du weißt etwas nicht? Dann tippe auf Hilfe.

Grün bedeutet richtig.

Rot bedeutet noch nicht richtig.

Gelb bedeutet: Schau noch einmal hin oder ergänze deine Antwort.

Du kannst Aufgaben wiederholen.“

Gestalte dies möglichst übersichtlich mit kleinen passenden Symbolen.

Der Text darf sprachlich weiter vereinfacht werden.

Falls die Info-Schaltfläche nach der Überarbeitung keine zusätzliche Hilfe bietet, darf sie auch entfernt werden. Die Bedienung muss dann direkt im Spiel ausreichend erklärt sein.

---

# TEIL 4 – NIVEAUDIFFERENZIERUNG ÜBERARBEITEN

## 4. Förderniveau

Das Förderniveau bleibt bei der bisherigen grundlegenden Aufgabenstruktur.

- Keine Freitexte.
- Keine selbstständige Eingabe von Fachbegriffen.
- Antippen, Ankreuzen und einfaches Zuordnen.
- Sehr kurze Aufgaben.
- Hilfen jederzeit verfügbar.

Keine zusätzliche Erschwerung.

## 5. ESA

ESA arbeitet überwiegend mit:
- Zuordnungsaufgaben;
- Drag-and-drop;
- Ankreuzaufgaben;
- Reihenfolgeaufgaben.

Das Zuordnen vorgegebener Wörter zu anatomischen Strukturen ist für ESA ausdrücklich geeignet.

Die bisherige Schwierigkeit soll weitgehend erhalten bleiben.

Neu ist eine einzelne, extrem kurze Texteingabe zur Iris-Muskulatur in Aufgabe T18. Diese Ausnahme ist ausdrücklich gewünscht.

Alle übrigen ESA-Aufgaben dürfen weiterhin ohne Freitext bearbeitet werden.

## 6. MSA – mehr selbstständige Fachbegriffe und kurze Antworten

Die MSA-Variante enthält derzeit zu wenige offene Aufgaben.

Viele Aufgaben sind nahezu identisch mit ESA und verlangen lediglich das Verschieben vorgegebener Begriffe.

Das soll überarbeitet werden.

**Grundsatz: Bei MSA sollen die Lernenden Fachbegriffe häufiger selbst schreiben, statt vorgegebene Wortkarten zu verschieben.**

### Besonders wichtige Aufgaben

**T03 – Das Ohr beschriften**

Die Schülerinnen und Schüler schreiben die Namen der sieben markierten Ohrteile selbst.

Dies ist teilweise bereits umgesetzt. Prüfe und erhalte diese Funktion.

**T07 – Das Auge beschriften**

Die Schülerinnen und Schüler schreiben die sieben Begriffe selbst.

Ebenfalls bereits teilweise umgesetzt.

**T09 – Die Reise des Lichts**

Die Lernenden ergänzen die passenden anatomischen Begriffe als kurze Texteingaben.

Nicht einfach die vorgegebenen Wörter per Drag-and-drop verschieben.

**T17 – Zwei Wege zum Gehirn**

Hörnerv und Sehnerv sollen eigenständig eingegeben werden.

**T19 – Reiz-Reaktionskette**

Reiz und Reaktion bleiben vorgegeben.

Förder und ESA ordnen die Zwischenstationen weiterhin durch Antippen beziehungsweise Drag-and-drop zu.

Für MSA und AHR soll eine Variante mit selbstständig eingetragenen Fachbegriffen beziehungsweise Stationen angeboten werden.

Die erwarteten Begriffe sind eng begrenzt.

Es müssen keine vollständigen Sätze geschrieben werden.

**T13 – Die drei Gehörknöchelchen**

Prüfe, ob MSA die drei Namen selbst in die richtige Reihenfolge schreiben kann.

**T24 – Abschließende Wiederholung**

Die bisherigen selbstständig eingegebenen Begriffe bleiben erhalten.

### Zusätzliche kurze Freitexte

Ersetze ausgewählte sehr einfache Multiple-Choice-Aufgaben durch kurze, eng begrenzte Texteingaben.

Geeignete Aufgaben:

- T04: Warum erreicht der Schall ein Ohr meist zuerst?
- T08: Warum wird die Pupille bei hellem Licht kleiner?
- T11: Welche Sinneszellen helfen beim Farbensehen?
- T14: Wobei hilft das Gleichgewichtsorgan?
- T18: Warum wird die Pupille im Dunkeln größer?
- T22: Was fehlt am blinden Fleck?
- T23: Was schützt das Auge vor Staub?

Verwende nicht zwangsläufig alle als zusätzliche Pflichtfragen. Wähle einen sinnvollen Umfang, damit der gesamte Durchgang weiterhin etwa 30 Minuten dauert.

Ersetze vorhandene einfache Auswahlfragen bevorzugt durch eine kurze Texteingabe, statt den Umfang ständig zu vergrößern.

Beispiele ausreichender MSA-Antworten:

Frage: „Welche Zellen helfen beim Farbensehen?“
- „Zapfen“
- „Zapfn“

Frage: „Was fehlt am blinden Fleck?“
- „Sinneszellen“
- „Lichtsinneszellen“

Frage: „Warum wird die Pupille im Dunkeln größer?“
- „Mehr Licht“
- „Damit mehr Licht reinkommt“

Frage: „Wobei hilft das Gleichgewichtsorgan?“
- „Gleichgewicht“
- „Drehungen erkennen“

Die kurzen Antworten dürfen fachlich vereinfacht sein.

### AHR

AHR soll mindestens die gleichen Anforderungen an das selbstständige Abrufen von Fachbegriffen erfüllen wie MSA.

Darüber hinaus bleiben kurze Erklärungen zu:
- Schallübertragung;
- Farbensehen;
- Nah- und Fernsicht;
- Anpassung an Helligkeit

bestehen.

Keine langen Aufsätze. Zwei kurze Sätze reichen in der Regel aus.

---

# TEIL 5 – NEUE AUFGABE ZUR PUPILLENVERÄNDERUNG

## 7. Aufgabe T18 „Im dunklen Raum“ erweitern

Diese Aufgabe soll stärker auf das Verständnis der Pupillenveränderung eingehen.

### Verbindliche biologische Grundlage

Die Pupille ist eine Öffnung in der Iris.

Ihre Größe wird durch Muskeln der Iris verändert.

Es gibt hierbei unterschiedliche Muskelgruppen:
- Ringförmige Schließmuskeln verkleinern die Pupille bei Anspannung.
- Radial angeordnete Erweiterungsmuskeln vergrößern die Pupille bei Anspannung.

Der Ziliarmuskel beziehungsweise die Ringmuskulatur des Linsenapparats verändert die Linsenform zur Akkommodation und ist nicht für die Pupillenerweiterung zuständig.

Vermische diese Vorgänge keinesfalls.

Diese anatomischen Einzelheiten müssen aber nicht vollständig von den Schülerinnen und Schülern gelernt werden.

### Förder

Behalte die einfachen Auswahlfragen.

Beispiel:

„Es wird dunkel. Wie wird die Pupille?“

Antwort:
- Größer – richtig.
- Kleiner – falsch.

Zusätzlich:

„Wozu wird die Pupille größer?“

Antwort:
- Damit mehr Licht ins Auge kommt – richtig.
- Damit weniger Licht ins Auge kommt – falsch.

### ESA

Füge eine einzige sehr einfache, eng geführte Texteingabe hinzu.

Beispielsweise:

„In der Iris gibt es Muskeln, die die Pupille größer machen. Was machen diese Muskeln?“

Akzeptiere:
- „ziehen sich zusammen“
- „zusammenziehen“
- „sie spannen sich an“
- „Muskeln ziehen sich zusammen“

Es wird keine exakte Bezeichnung der Erweiterungsmuskeln verlangt.

Die Aufgabenstellung muss eindeutig erkennen lassen, welche Muskelgruppe gemeint ist.

**Wichtig:** Die Aussage „Der Ziliarmuskel macht die Pupille größer“ oder „Der ringförmige Schließmuskel zieht sich zusammen und macht die Pupille größer“ darf nicht als richtig gewertet werden.

Alternativ kannst du die Frage in eine noch einfachere Lückeneingabe verwandeln, wenn dies eine zuverlässigere Korrektur ermöglicht.

### MSA

Ergänze mindestens eine kurze Freitextfrage:

„Warum wird die Pupille im Dunkeln größer?“

Vollständig ausreichende Antworten:
- „Mehr Licht“
- „Damit mehr Licht reinkommt“
- „Damit das Auge mehr Licht bekommt“
- Vergleichbare einfache Aussagen.

Außerdem darf eine zweite kurze Frage nach den beteiligten Muskeln gestellt werden.

Beispiel:

„Was verändert die Größe der Pupille?“

Richtig:
- „Muskeln“
- „Muskeln in der Iris“
- „Iris“

Die Frage darf nicht gleichzeitig eine ausführliche mechanische Erklärung verlangen, wenn nur die Struktur genannt werden soll.

### AHR

AHR erklärt möglichst kurz den Zweck und den Mechanismus:

„Warum wird die Pupille im Dunkeln größer und welcher Teil des Auges sorgt dafür?“

Beispiel einer ausreichenden Antwort:

„Damit mehr Licht ins Auge kommt. Muskeln in der Iris machen die Pupille größer.“

Diese Antwort muss ohne Nennung der spezifischen Muskeln als richtig erkannt werden.

Eine genauere richtige Erklärung darf ebenfalls akzeptiert werden.

### Feedback

Nach der Aufgabe erscheint eine sehr einfache Erklärung:

„Im Dunkeln wird die Pupille größer. So kommt mehr Licht ins Auge. Muskeln in der Iris verändern ihre Größe.“

Weitere anatomische Einzelheiten nur bei einer zusätzlichen Hilfe oder auf AHR-Niveau.

Unterscheide weiterhin zwischen Pupillenreflex und der zusätzlichen Anpassung der Netzhaut an Dunkelheit.

---

# TEIL 6 – WORTBANK VERBESSERN

## 8. Wortbank muss geöffnet UND geschlossen werden können

Aktuell lässt sich die Wortbank öffnen, anschließend aber nicht zuverlässig wieder schließen.

Behebe das.

### Gewünschtes Verhalten

1. Standardmäßig sind bei MSA und AHR die Eingabefelder für selbst geschriebene Begriffe sichtbar.
2. Ein Button „Wortbank öffnen“ blendet die Wortbank ein.
3. Derselbe Button beziehungsweise ein zweiter Button „Wortbank schließen“ blendet sie wieder aus.
4. Danach sind die Texteingaben wieder sichtbar und verwendbar.

**Wichtig: Bereits eingegebene Begriffe dürfen beim Öffnen oder Schließen nicht verloren gehen.**

Die Wortbank soll eine freiwillige Hilfe bleiben.

Öffnen und Schließen müssen beliebig oft möglich sein.

### MSA und AHR

Die Wortbank ist eine Unterstützung. Die reguläre Aufgabe verlangt weiterhin die eigenständige Eingabe.

Eine geöffnete Wortbank darf die Aufgabe nicht dauerhaft in eine ESA-Zuordnungsaufgabe verwandeln.

Nach dem Schließen kehrt die ursprüngliche Eingabeform zurück.

### ESA und Förder

Für diese Niveaus darf die Wortbank dauerhaft als normale Auswahlhilfe sichtbar sein, wo vorgegebene Begriffe zur Aufgabe gehören.

### Automatische Auswertung

Wenn die Wortbank als Hilfe verwendet wurde, darf dies intern als Unterstützung dokumentiert werden.

Es gibt weiterhin keinen Punktabzug.

---

# TEIL 7 – FEEDBACKKORREKTOR VERBESSERN

## 9. Nachgewiesene Fehlbewertungen beseitigen

Die unabhängige Prüfung von `src/evaluate.js` hat fachlich falsche Auswertungen festgestellt.

Beispielsweise wird bei `T15_AHR_2` derzeit Folgendes als richtig bewertet:

- `nah nicht rund fern flach`
- `nah rund fern nicht flach`

Beide Aussagen enthalten fachlich falsche Zusammenhänge.

Überarbeite die Regel `FOCUS_REASON`, sodass Verneinungen und Widersprüche nicht übersehen werden.

Eine richtige Abfolge von Schlüsselwörtern genügt niemals als alleiniger Richtigkeitsnachweis.

### Richtige Antworten werden derzeit nicht immer erkannt

Folgende Antworten müssen künftig zuverlässig als richtig erkannt werden:

- `Linse wird gewölbter`
- `In der Nähe wird die Linse runder`
- `Sie wirt dicker`
- `Der Schall bringt das Trommelfell zum Schwingen`
- `Das Tromelfel wakelt`
- `Die Gehörknöchelchen übertragen die Schwingungen`
- `Sie leiten die Schwingungen weiter`
- `Die Hörschnecke wandelt die Schwingungen in Nervensignale um`
- `Die Signale werden zum Gehirn geleitet`

Der aktuelle Korrektor stuft mehrere dieser Antworten unnötig als unklar ein.

Prüfe insbesondere die eingeschränkten Wortlisten und die Erkennung üblicher Verbformen.

Füge kontrollierte Synonyme und typische Schreibfehler hinzu.

Kein unkontrolliertes globales Fuzzy Matching.

### Farbensehen

Prüfe `CONE_DIFFERENCE`.

Die Aussage:

„Die Zapfentypen reagieren unterschiedlich auf die Lichtstärke.“

ist keine vollständige Erklärung der unterschiedlichen Farbempfindlichkeit.

Die Aufgabe erwartet den Zusammenhang mit unterschiedlichen Lichtfarben beziehungsweise Wellenlängen.

### Neue Freitexte

Für sämtliche neu eingeführten MSA-, ESA- und AHR-Texteingaben müssen eigene, aufgabenspezifische Korrekturregeln erstellt werden.

Akzeptiere:
- Ein-Wort-Antworten, wenn ausreichend.
- Vereinfachte Formulierungen.
- Häufige Rechtschreibfehler.
- Alltagssprache.
- Unvollständige Sätze mit erkennbarem richtigen Fachinhalt.

Erkenne:
- fachlich falsche Aussagen;
- Verneinungen;
- widersprüchliche Formulierungen;
- vertauschte Strukturen;
- falsche Ursache-Wirkungs-Beziehungen.

Bleibt eine Antwort unklar, muss weiterhin eine Auswahlklärung möglich sein.

**Keine voreilige Rot-Bewertung bei unklaren Antworten.**

---

# TEIL 8 – INTERAKTIVE AUFGABEN

## 10. Frage und Abbildung synchronisieren

Prüfe insbesondere T04 „Woher kommt das Geräusch?“.

Derzeit lässt sich die Schallquelle unabhängig von der Aufgabenfrage verschieben. Dadurch können Text und Abbildung einander widersprechen.

Behebe dies.

Wenn der Hund im Bild links steht, muss die dazugehörige Frage beziehungsweise die richtige Antwort dazu passen.

Prüfe vergleichbare Effekte bei:
- T08: Licht und Pupille;
- T15: Nah- und Fernsicht;
- T18: Dunkelanpassung.

Die Schülerinnen und Schüler dürfen durch Ausprobieren nicht ungewollt eine widersprüchliche Aufgabe erhalten.

## 11. Antwortmöglichkeiten verbessern

Insbesondere bei MSA und AHR sollen falsche Antwortmöglichkeiten häufiger typische biologische Fehlvorstellungen abbilden.

Vermeide zu viele völlig fachfremde Distraktoren.

Beispiele:
- Trommelfell und Gehörknöchelchen verwechseln.
- Pupille und Iris verwechseln.
- Stäbchen und Zapfen verwechseln.
- Hörnerv und Sehnerv verwechseln.
- Nahsicht und Fernsicht verwechseln.

Förder bleibt bewusst sehr einfach.

Die Aufgaben dürfen nicht unnötig schwerer oder sprachlich komplizierter werden.

---

# TEIL 9 – ZEITRAHMEN UND QUALITÄTSSICHERUNG

## 12. Spieldauer weiterhin ungefähr 30 Minuten

Durch die zusätzlichen Texteingaben könnte die Bearbeitungszeit steigen.

Achte deshalb darauf, dass die neuen MSA-Aufgaben überwiegend bisherige Auswahlaufgaben ersetzen.

Nicht einfach immer neue Fragen anhängen.

Bei Fachbegriffen reicht ein einzelnes Wort.

Bei kurzen Erklärungen reicht häufig ein kurzer Satz.

Der Durchgang soll weiterhin möglichst in 30 Minuten zu schaffen sein.

## 13. Automatische Tests erweitern

Ergänze Tests für sämtliche neuen Funktionen.

### Farbsystem

- Richtige Antworten grün.
- Falsche Antworten rot.
- Teilweise richtige und unklare Antworten gelb.
- Leere Felder neutral.
- Falsche Einzelzuordnungen niemals grün.
- Gut lesbare Kontraste und zusätzliche Symbole.

### Neue Navigation

- Genau zwei Hauptbereiche.
- Je zwölf Aufgaben.
- Drop-down-Menüs funktionieren.
- Alle 24 Aufgaben erreichbar.
- Fortschritt korrekt.
- Navigation zwischen Bereichen möglich.
- Bereits abgeschlossene Aufgaben bleiben abgeschlossen.
- Kein Fortschrittsverlust durch die Umstrukturierung, soweit zuverlässig migrierbar.

### Niveau

- Förder ohne Freitext.
- ESA überwiegend Zuordnung und Auswahl; nur die ausdrücklich ergänzte sehr kurze T18-Texteingabe.
- MSA mit deutlich mehr selbstständig geschriebenen Fachbegriffen und kurzen Antworten.
- AHR mit Fachbegriffen und kurzen Erklärungen.
- Keine unerwarteten ESA-artigen Wortkarten als regulärer Ersatz für MSA-Texteingaben.

### Wortbank

- Öffnen.
- Schließen.
- Erneut öffnen.
- Bereits eingegebene Wörter bleiben erhalten.
- Keine blockierte Aufgabe nach dem Umschalten.
- Kein unnötiges Zurücksetzen des gesamten Spiels.

### Antwortkorrektur

- Alle bisherigen Golden Tests.
- Neue Testfälle zu Pupillenveränderung.
- Fachlich richtige kurze Antworten.
- Starke Rechtschreibfehler.
- Negationen.
- Widersprüche.
- Fachlich falsche Antworten mit richtigen Schlüsselwörtern.
- Unklare Antworten und Auswahlklärung.

Dokumentiere die tatsächlichen Testergebnisse.

## 14. Abschließende Überprüfung

Prüfe die veröffentlichungsfähige Version erneut auf:

- Desktop.
- iPad-Hochformat.
- iPad-Querformat.
- Chromium.
- WebKit, soweit verfügbar.

Überprüfe, ob bei längeren Aufgaben die Eingabefelder und anatomischen Bilder sinnvoll dargestellt werden.

Achte besonders darauf, dass die Schülerinnen und Schüler nicht unnötig weit zwischen Grafik und Textfeldern scrollen müssen.

## 15. Abschluss und Pull Request

Arbeite in einem neuen Branch.

Erhalte die bestehende Projektstruktur und die ursprünglichen Aufgaben-IDs.

Erstelle nach Abschluss einen Pull Request gegen `main`.

**Nicht automatisch mergen.**

Liefere eine kurze, verständliche Zusammenfassung:

1. Welche Funktionen wurden geändert?
2. Welche Fehler wurden behoben?
3. Welche neuen MSA- und ESA-Freitextaufgaben wurden ergänzt?
4. Welche Tests wurden tatsächlich bestanden?
5. Welche Einschränkungen bestehen noch?

### Abschließender Grundsatz

Das Spiel soll nicht schwieriger, sondern lernwirksamer werden.

Die Schülerinnen und Schüler sollen eigene Fachbegriffe verwenden können, ohne wegen Rechtschreibfehlern benachteiligt zu werden.

Richtiges Wissen muss erkannt werden.

Falsches Wissen muss sachlich korrigiert werden.

Und die gesamte Bedienung soll auch für eine lernschwache 8. Klasse möglichst selbstverständlich sein.

**Setze diese Änderungen jetzt vollständig im bestehenden Repository um und erstelle anschließend einen Pull Request.**
