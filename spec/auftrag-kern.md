# Verbindlicher Codex-Auftrag – Mission Sinneslabor
## Fassung 2.0 · kritisch überarbeitet am 21.10.2026

**Repository:** `Lernspiel-Sinne`.
**Ziel:** Ein vollständiges, einfaches und zuverlässig bedienbares Lernspiel für Biologie, Klasse 8. Baue das Spiel tatsächlich; liefere nicht nur einen Plan. Diese Fassung ersetzt die früheren Entwicklungsaufträge. Keine alten widersprüchlichen Bewertungsbeispiele zusätzlich übernehmen.

Die Anhänge A–D dieses vollständigen Auftrags enthalten die konkrete Aufgabenbank, Bewertungsregeln, verbindliche Antwort-Testfälle sowie Quellen und Einschränkungen. Sie sind Bestandteil des Auftrags. Falls parallel JSON-Dateien vorliegen, sind sie dieselben Vorgaben in maschinenlesbarer Form. Bei einem Konflikt dokumentiere ihn; erfinde keine fachliche Entscheidung, nur damit Tests grün werden.

## 1. Prioritäten und Grenzen

Priorität: **fachlich korrekte Rückmeldung → verständliche Aufgaben → sichere Bedienung → ansprechende Gestaltung**. Keine komplexe Technik als Selbstzweck. Die richtige Antwort darf ein Wort sein. Rechtschreibung ist kein Lernziel. Unverständliche Antworten sind kein Beleg für fehlendes Fachwissen.

Baue kein System, das behauptet, beliebige Schülertexte fehlerfrei zu verstehen. Es erkennt eine begrenzte Menge aufgabenspezifischer Aussagen. Bei Unsicherheit klärt es mit einer einfachen Auswahl nach. Es gibt keine KI-API, keine Konten, keine Rangliste, keine Schulnote und keinen Zeitdruck. Die Anwendung ist ein Übungsangebot, kein diagnostisch validierter Test.

Arbeite im ausgewählten Repository. Prüfe vorhandene Dateien und `AGENTS.md`. Erhalte funktionierende Bestandteile; keine destruktiven Änderungen. Verwende die vorhandenen kostenlosen Entwicklungs- und Testmöglichkeiten. Ohne ausdrückliche Freigabe keine Original-Klassenarbeit, Schulbuchbilder oder privaten Unterrichtsdokumente veröffentlichen. Keine Änderungen an anderen Repositories. Änderungen auf einem Branch vorbereiten; Commit/PR nur soweit die Umgebung das unterstützt. Keine erfundenen Links, Commits oder Testergebnisse.

## 2. Basis, Umfang und Differenzierung

Themen: Aufbau/Funktion des Ohrs; Schallübertragung; Richtungshören; Gleichgewicht; Hörbeeinträchtigung und Gebärdensprache; Aufbau/Funktion des Auges; Lichtweg; Nah-/Fernsehen; Pupillenreaktion und Dunkelanpassung; Zapfen/Stäbchen; räumliches Sehen; optische Täuschungen; Augenschutz; eine bewusste Reiz-Reaktionskette. **Keine Hautkunde.**

Die früher erwähnten 3D-Modelle und die frühere Stationsarbeit zu optischen Täuschungen liegen in diesem Auftrag nicht vor. Behaupte nicht, diese zu übernehmen oder zu prüfen. Erstelle eigene fachlich nachvollziehbare Abbildungen und zwei eigene Sehtrick-Beispiele. Keine echten Gebärden erfinden oder aus ASL ungeprüft als DGS ausgeben.

24 Missionen, vier Bereiche mit je sechs Missionen. Alle vier Niveaus erhalten diese 24 Missionen. Eine Mission kann mehrere sehr kurze Entscheidungen enthalten; keine zusätzlichen verdeckten langen Prüfungen. Der ausgewählte Modus ändert Hilfen und Antwortform, nicht die grundsätzliche Wertigkeit der Lernenden.

- **Förder:** Kein Texteingabefeld, auch nicht zur Anmeldung, in Rückfragen oder bei Wiederholungen. Zwei Optionen pro Auswahlfrage, Zuordnen/Sortieren mit Bildern. Fünf Ohr- und fünf Augenbegriffe.
- **ESA:** Ebenfalls ohne Texteingaben. Sieben Ohr- und sieben Augenbegriffe. Aufgaben aus der Förderstufe dürfen übernommen werden.
- **MSA:** Dieselben sieben Begriffe pro Organ. Bei Beschriftungen zunächst ein Wort selbst versuchen; eine Wortbank ist jederzeit erreichbar. Vier eng geführte inhaltliche Kurzantwortfelder im Durchgang, außerdem Begriffsfelder.
- **AHR:** Gleiche Begriffe; sieben eng geführte inhaltliche Kurzantwortfelder, zusätzlich Begriffsfelder. Nur bei der Nah-/Fern-Erklärung ein bis zwei eigene kurze Sätze. Kein frei bewerteter Aufsatz.

Die Wortbank zählt als Unterstützung, nicht als Fehler. „Noch einmal ohne Wortbank“ ist freiwillig und darf die 30-Minuten-Route nicht verlängern. MSA/AHR müssen nicht zuerst scheitern, um zur Auswahl zu wechseln.

## 3. Verbindliche Abdeckung der Klassenarbeit

**Förder Ohr:** Ohrmuschel, Gehörgang, Trommelfell, Gehörknöchelchen, Hörnerv; fünf Schritte des Hörens einschließlich Hörschnecke.
**Förder Auge:** Hornhaut, Pupille, Linse, Glaskörper, Netzhaut; Lichtweg einschließlich Funktionen „bündelt Licht“ und „optisches Bild entsteht“.
**ESA/MSA/AHR Ohr:** Trommelfell, Hammer, Amboss, Steigbügel, Hörschnecke, Hörnerv, Gleichgewichtsorgan.
**ESA/MSA/AHR Auge:** Hornhaut, Pupille, Iris, Linse, Glaskörper, Netzhaut, Sehnerv.
**ESA/MSA zusätzlich:** Schallübertragung, Rolle der Nerven, Scharfstellung durch Ringmuskel/Bänder/Linse in vereinfachter korrekter Form, Stäbchen/Zapfen, blinder Fleck.
**MSA:** Geführte Erklärung der drei Kernfunktionen Trommelfell/Gehörknöchelchen/Hörnerv.
**AHR:** Zusätzlich Umwandlung in Nervensignale in der Hörschnecke; unterschiedliche Zapfentypen und Verarbeitung im Gehirn; Begründung der unterschiedlichen Einstellung für deutlich nahe/ferne Gegenstände.

Eine Beschriftung per Auswahl ist nicht dasselbe wie freier Begriffsabruf. Deshalb wird bei MSA/AHR zunächst ein Einzelwort versucht; der Wechsel zur Wortbank bleibt offen. Eine geführte Erklärung ist nicht dasselbe wie ein selbstständig strukturierter Aufsatz. Benenne diese Grenze im Lehrkräftehinweis, nicht als Defizit der Lernenden.

## 4. Fachliche Festlegungen und ausdrücklich korrigierte Quellenaussagen

Die Unterrichtsmaterialien bestimmen Wortschatz, Themen und Niveau. Fehler oder missverständliche Formulierungen werden jedoch **nicht** als Lösungen übernommen:

1. **Ringmuskel:** Er verändert über die Linsenbänder die Linsenform. Nah: Muskel zieht sich zusammen, Bänder werden entlastet, Linse runder. Fern: Muskel entspannter, Bänder stärker gespannt, Linse flacher. „Der Ringmuskel zieht direkt an der Linse“ ist keine verbindliche richtige Antwort. Die problematische Auswahlformulierung der Klassenarbeit ist separat im Prüfbericht markiert.
2. **Pupille/Iris:** Die Pupille ist eine Öffnung, kein schwarzer Körper und keine eigene Linse. Muskeln der Iris ändern die Öffnung. Die für Akkommodation zuständige Ringmuskulatur ist nicht mit der Pupillenmuskulatur gleichzusetzen.
3. **Lichtweg:** Im vereinfachten Modell Hornhaut → Pupille → Linse → Glaskörper → Netzhaut. Hornhaut UND Linse brechen Licht. Der Sehnerv führt Nervensignale, nicht Lichtstrahlen. Das optische Bild auf der Netzhaut ist nicht der bewusste Seheindruck im Gehirn.
4. **Dunkelanpassung:** Pupille wird größer, aber das allmählich bessere Sehen ist nicht allein dadurch erklärt. Auch die Netzhaut passt ihre Empfindlichkeit an; Stäbchen sind bei wenig Licht wichtig. Keine Biochemie als Pflichtwissen. Ohne Licht können Gegenstände auch nach Warten nicht gesehen werden.
5. **Farben:** Drei Zapfentypen reagieren unterschiedlich stark auf unterschiedliche Lichtbereiche; ihre Empfindlichkeiten überlappen. Für Schüler genügt „verschiedenfarbiges Licht“. Keine Gleichsetzung mit jeweils ausschließlich einer einzigen Farbe. Stäbchen sind besonders bei wenig Licht wichtig; nicht behaupten, Zapfen könnten keine Helligkeit wahrnehmen.
6. **Hören:** Schall bewegt Trommelfell und Gehörknöchelchen. In der Hörschnecke wandeln Sinneszellen mechanische Reize in elektrische Signale um. Hörnerv → Gehirn. Keine Schallwellen im Hörnerv. „Ton zum Gehirn“ als Alltagssprache ist nicht automatisch ein fachlicher Fehler; explizite Aussagen über physische Schallwellen im Nerv sind es.
7. **Richtung:** Seitliche Quelle → kürzerer Schallweg zu diesem Ohr, meist früheres Eintreffen und oft Lautstärkeunterschied. Kein „nur Lautstärke“ und kein „nur Zeit“. Die Grafik muss Perspektive und links/rechts eindeutig ausweisen. Verlangsamte Wellen sind ein Modell.
8. **Gleichgewicht:** Bogengänge sind ein Teil des Gleichgewichtsorgans, nicht dessen vollständige Anatomie. Sie helfen bei der Wahrnehmung von Drehbewegungen. Keine Drehversuche mit Kindern verlangen.
9. **Reiz/Reaktion:** Gong → Ohr → Hörnerv → Gehirn → Nerven zu den Beinmuskeln → Beinmuskeln → bewusstes Aufstehen. Das Beispiel ist kein Reflexbogen. Das Rückenmark wird im vereinfachten Weg ausgelassen, nicht als nicht vorhanden behauptet. Nicht jede mögliche Körperreaktion benötigt genau diesen Weg.
10. **Inklusion:** Gebärdensprachen sind eigenständige visuelle Sprachen; nicht alle Menschen mit Hörbeeinträchtigung verwenden dieselbe Sprache oder Kommunikationsform. Nicht hören heißt nicht nicht sprechen, nicht denken oder nicht kommunizieren. Keine Diagnose aus einer Spielantwort, keine pauschalen Heilversprechen.
11. **Sehtricks:** Eine subjektive Wahrnehmung ist keine falsche Antwort. Vermutungen bleiben unbewertet. Erst die Messung/Überlagerung und deren sachliche Auswertung werden bewertet. Der blinde Fleck ist eine rezeptorfreie Stelle, keine allgemeine Blindheit; ein misslungener Selbstversuch darf keine Fehlwertung erzeugen.
12. **Nah/fern:** Nutze einen nahen Stift und einen deutlich fernen Baum. „Die Linse kann nicht gleichzeitig für beide Entfernungen passend eingestellt sein“ ist das Schulmodell. Keine absolute Aussage, dass nie zwei unterschiedlich weit entfernte Gegenstände zugleich hinreichend scharf erscheinen könnten; Tiefenschärfe ist hier nicht Pflichtwissen.

## 5. Mischung und realistische Zeitplanung

Intern P = prüfungsnahe Leistung und Z = überwiegend zusätzliche Leistung; nicht auf Schülerbildschirmen anzeigen. Pro Niveau zwölf P- und zwölf Z-Missionen. „Gleichgewichtsorgan benennen“ ist P, seine Funktion erkunden Z. Den blinden Fleck nicht als völlig neuen Zusatzinhalt ausgeben: Er kommt bereits in den Auswahlaussagen der Arbeit vor.

Zähle zusätzlich die fachlich auswertbaren Teilantworten, nicht nur Missionstitel. Im beigefügten Bestand gibt es je Niveau mindestens so viele Z- wie P-Teilantworten. Der Z-Umfang darf nicht durch leere Klicks, Pflichtanimationen oder wiederholte identische Fragen aufgebläht werden. Diese Zählung ist eine Planungsgröße, keine objektive Messung aller Lerninhalte. Prüfe außerdem Themenvielfalt und Bearbeitungszeit.

Die Zielzeiten im Anhang sind **Schätzungen**, keine Messwerte. Geplant sind etwa 21–25 Minuten Aufgabenbearbeitung, 1,5 Minuten Einstieg/Abschluss und etwa drei Minuten Hilfepuffer. Ziel: ungefähr 30 Minuten. Eine Maximalzeit für jedes Kind ist ohne Erprobung nicht garantierbar. Keine Stoppuhr, keine automatische Zeitstrafe, keine Sperre nach 30 Minuten.

Gibt es in einer späteren Erprobung Zeitprobleme, zuerst Texte und Bedienwege kürzen. Nicht heimlich Kerninhalte oder die Hälfte der Zusatzinhalte streichen. Freiwillige Wiederholungen am Ende getrennt von der Kernroute kennzeichnen.

## 6. Spiel und Oberfläche

Starttitel: **Mission Sinneslabor**.
Text: „Entdecke, wie Augen und Ohren arbeiten. Löse kurze Aufgaben. Du kannst Hilfe nutzen. Das Spiel dauert ungefähr 30 Minuten.“
Vier gleichwertige Niveaukarten: **Förder · ESA · MSA · AHR**. Keine Bewertung „schwach/stark“. Ein Button „Starten“. Bei vorhandenem passenden Fortschritt zusätzlich „Weitermachen“ und „Neu beginnen“. Keine Namensabfrage.

Vier Laborbereiche: Hörstudio, Augenlabor, Wahrnehmungslabor, Große Sinnes-Mission. Nach sechs abgeschlossenen Missionen ein Abzeichen. Eine Station wird durch kurze sichtbare Handlung erkundet, dann mit passenden Fragen gesichert. Kein Avatar, Shop oder zusätzlicher Spielzwang, der vom Lernen ablenkt.

Bedienung kurz erklären: „Tippe einen Begriff an. Tippe dann auf das passende Feld. Du kannst auch ziehen.“ Der alternative Tippweg muss ALLE Ziehhandlungen ersetzen können. Maus, Touch und Tastatur (Tab/Enter, Pfeile zum Sortieren) unterstützen. Einzelwahl als Radio-Optionen bzw. Auswahlbuttons, nicht irreführend als Mehrfachauswahl gestalten.

„Antwort prüfen“, „Hilfe“, „Weiter“ eindeutig beschriften. Kein automatisches Weiterblättern, während Feedback noch gelesen wird. Eine Antwortwahl vor „Prüfen“ bleibt änderbar. Nach Bearbeitung einer Eingabe altes Feedback als veraltet zurücksetzen; nach „Weiter“ keine doppelten Abschlüsse zählen.

Große Schrift, kurze Textblöcke, großzügige Touchflächen (Zielgröße 44–48 CSS-Pixel als Designvorgabe), sichtbarer Fokus. Erfolg nicht nur durch Rot/Grün vermitteln. Keine Tonpflicht, kein Farbunterscheidungstest als Voraussetzung für Farbensehen-Wissen. Bewegungen abschaltbar, `prefers-reduced-motion` beachten. Keine flackernden Lichtquellen, keine lauten Hörtests.

## 7. Abbildungen und Zuordnen

Eigene SVGs, kein komplexes 3D. Anatomie prüfbar und lesbar statt dekorativ. Klare Nummern mit Linien zu den tatsächlich gemeinten Teilen. Kleine Strukturen in Ausschnitten vergrößern, statt unsichtbare Trefferzonen zu verlangen. Der Endpunkt einer Linie liegt im richtigen Gewebe bzw. in der richtigen Öffnung.

Ohr: Ohrmuschel → Gehörgang → Trommelfell; Hammer am Trommelfell, Amboss dazwischen, Steigbügel am Übergang zum Innenohr; Hörschnecke getrennt von Bogengängen; Hörnerv an der Hörschnecke. Ein nicht differenzierter gelber Nervenstrang darf nicht fälschlich als ausschließlich anatomischer Hörnerv suggeriert werden, wenn Gleichgewichtsfasern dargestellt werden.

Auge: Hornhaut vorne, dahinter Iris mit freier Pupillenöffnung, Linse hinter der Iris; Glaskörper hinter der Linse; Netzhaut innen an der hinteren Augenwand; Sehnerv am Hinterpol. Kein durch Pupille oder Linse hindurchgehender „Hörnerv“. Ringmuskel/Bänder als eigener Hilfedetail-Ausschnitt, nicht mit Iris verwechseln.

Die beiden Vergleichslinien bzw. Vergleichskreise einer Illusion stehen jeweils im selben SVG mit gemeinsamem Maßstab; keine unterschiedlich skalierten Container. Beispiel: beide Linien 160 SVG-Einheiten lang, beide mittleren Kreise Radius 18. Pfeilenden zählen nicht zur gemessenen Linienlänge.

Die interne `targetLabel`-Beschreibung der Aufgabenbank ist für den Entwickler und Hilfen bestimmt. Zeige sie bei der ersten Beschriftung nicht als Lösungshinweis. Anfangs nur Nummer/Markierung, nach Hilfe die passende Beschreibung. Bei MSA/AHR prüft der Fachwort-Korrektor den tatsächlich markierten Teil, nicht irgendeinen Begriff des Bildes.

Zuordnungen lassen sich tauschen, entfernen und neu setzen. Korrekte Teilzuordnungen bleiben nach Prüfung erhalten. Falsche werden nicht pauschal alle gelöscht. Reihenfolgeaufgaben zeigen alle benötigten Karten; Begriffe müssen in einem Durchgang genau einmal verwendet werden. Eine absichtlich gruppierte Station wie „Ohrmuschel und Gehörgang“ ist eine gemeinsame Karte, keine übersprungene Struktur.

## 8. Antwortprüfung: bewusst begrenzt und aufgabenspezifisch

Bewerte nie die bloße Anzahl passender Wörter. Verwende getrennte Auswerter für geschlossene Antworten, anatomische Fachbegriffe und die wenigen inhaltlichen Kurzantworten. Rohtexte werden niemals als Code, HTML oder Anweisung interpretiert.

### 8.1 Geschlossene Antworten

Stabile IDs bestimmen richtige Antworten. Antwortpositionen dürfen gemischt werden, bleiben aber während einer Aufgabe stabil. Der erste Datenbankeintrag ist nicht immer die erste sichtbare richtige Antwort. Für jede Zuordnung und Reihenfolge die tatsächlichen IDs prüfen. Kein „alle anklicken = richtig“. Bei unvollständiger Eingabe zunächst zum Ergänzen auffordern, nicht sofort fachlich falsch werten.

### 8.2 Fachbegriffe

Zuerst gegen das gesamte anatomische Lexikon prüfen. Ein gültiger, aber an dieser Stelle falscher Zielbegriff aus dem Lernlexikon bleibt falsch. Ein anderer medizinischer Begriff außerhalb des Lernlexikons, etwa „Papille“, wird bei möglicher Schreibverwechslung geklärt. Erst danach Tippfehler in unbekannten Tokens prüfen. Eindeutige feste Schreibvarianten stehen im Lexikon. Automatisches Fuzzy Matching nur bei ausreichender Eindeutigkeit: maximal ein Edit bei 5–8 Buchstaben, maximal zwei bei längeren Wörtern, deutlicher Abstand zum zweitbesten Kandidaten. Kurze Wörter nur exakt oder als explizite Variante. Bei Mehrdeutigkeit Auswahl zur Bestätigung, nicht automatisch korrigieren. „Papille“ nicht zu „Pupille“, „Sehnerv“ nicht zu „Hörnerv“ umdeuten. „Bogengänge“ bei Ziel Gleichgewichtsorgan ist ein erkannter Teil, nicht einfach der volle Organname.

### 8.3 Inhaltliche Kurzantworten

Jeder Antwortbereich bekommt seinen eigenen `ruleId` und den tatsächlichen Fragetext als Kontext. In T20 werden Tätigkeiten/Ziel jeweils getrennt gefragt: „schwingt“, „Schwingungen“ und „Gehirn“ können deshalb vollständig richtig sein. In einer globalen Erklärung wären dieselben Wörter ohne Beziehungen nicht automatisch eine vollständige Erklärung. Alte globale Hörerklärungs-Tests sind damit ausdrücklich ersetzt.

AHR Farben: Zwei Teilfragen. Erst Unterschied der Zapfentypen, dann Verarbeitung im Gehirn. „Zapfen reagieren auf Licht und Gehirn macht Farben“ beantwortet den Unterschied noch nicht vollständig. AHR Fokussierung: Ein oder zwei kurze Sätze, keine zusätzliche Pflicht zu Ringmuskel-Fachwörtern, wenn der Zusammenhang der Linsenformen verständlich richtig ist.

Normalisierung: Unicode, Kleinschreibung, Leerraum und gebräuchliche Umlautvarianten. Satzgrenzen, „nicht“, „kein“, „nur“, „sondern“, „oder“ und Richtungsangaben erhalten. Negationswörter und fachliche Gegensatzpaare nie unscharf ineinander korrigieren. Tippfehlerbeispiele wie „nich“ nur als explizite Negationsvariante behandeln.

Aussagen satzteilbezogen prüfen. „Nicht flach, sondern rund“ ist richtig. „Nicht rund, sondern flach“ ist falsch. „Kann nicht gleichzeitig rund und flach sein“ ist die richtige AHR-Begründung. Nicht erkannte Satzstruktur führt zu einer Klärung, nicht zu einer selbstsicheren Korrektur. Bestätigte fachliche Widersprüche verhindern das Ergebnis „richtig“; korrekt verneinte Distraktoren dürfen es nicht verhindern.

Akzeptiere bekannte sinnvolle Alltagssprache, präzisiere im Feedback. Keine verpflichtenden vollständigen Sätze. Grammatik und Rechtschreibung nie bepunkten. Präzise Operatorwörter nur im Entwicklerteil, nicht im Schülerfeedback.

### 8.4 Ergebniszustände und Priorität

`correct`: gefragter Kern erkannt, keine erkennbare Gegenbehauptung.
`partial`: richtiger, relevanter Ansatz, aber ein konkret benennbarer Bestandteil fehlt.
`clarify`: Bedeutung, Subjekt, Negationsbereich oder Widerspruch nicht sicher. Kein fachlicher Fehlversuch.
`incorrect`: klar falscher Begriff an der Stelle oder eine sicher erkannte falsche Beziehung. Rückmeldung benennt die betroffene Aussage, nicht eine pauschale schlechte Leistung.

Zusätzliche Eingabeereignisse: `empty` (noch keine Antwort), `help_requested` („weiß nicht“), `too_long` (über 800 Zeichen). Diese sind keine fachlichen Fehler. Nichts stillschweigend abschneiden, weil ein späteres „nicht“ die Bedeutung verändern kann.

Bei `clarify`: „Ich bin nicht sicher, was du meinst. Wähle die passende Antwort.“ Die im Anhang hinterlegte geschlossene Nachfrage muss wirklich bedienbar sein. Bei Erfolg: „Mit Auswahl geklärt“, nicht rückwirkend „Dein ursprünglicher Text war vollständig richtig“. Reine Unsicherheit des Programms darf nicht als Wissenslücke gespeichert werden.

Pro Antwort höchstens eine automatische Klärung; anschließend Hilfe/Lösung erreichbar. Keine Endlosschleife und kein Warten auf eine Lehrkraft. Unbekannte, vielleicht richtige Formulierungen werden nicht rot abgewertet. Du darfst wegen technischer Schwierigkeiten nicht pauschal alle freien Felder durch Multiple Choice ersetzen. Falls eine Regel nicht belastbar implementiert werden kann, dokumentiere die konkrete Grenze und nutze den vorgesehenen Klärungsweg.

## 9. Feedback und Fortschritt

Jede Frage hat konkrete Hilfen im Anhang. Erste falsche Antwort: kurzer Hinweis. Zweite: deutlicherer Hinweis. „Lösung ansehen“ ist jederzeit erreichbar und zeigt die vollständige fachlich richtige Lösung. Danach darf die Mission abgeschlossen werden. Keine Pflicht, die gerade eingeblendete Lösung zur Scheineigenleistung noch einmal abzuschreiben.

Korrekte Antworten erhalten einen kurzen erklärenden Satz. Bei Zuordnungen nicht die ganze Aufgabe als falsch deklarieren, wenn nur eine Verbindung falsch ist. Unpassende Distraktoren dürfen nicht zu falschen allgemeinen Erklärungen führen: Eine Hornhaut kann Licht brechen, auch wenn in einer konkreten Aufgabe die Linse gesucht wird.

Getrennt speichern: ohne Hilfe beantwortet / mit inhaltlicher Hilfe / durch Auswahl geklärt / Lösung angesehen. Ein Abzeichen bedeutet „Bereich bearbeitet“, nicht „alles sicher beherrscht“. Kein Fortschrittsgewinn durch doppeltes Drücken oder Zurück/Weiter. Keine Note und keine vergleichenden Prozentwerte zwischen Niveaus.

Abschluss: vier bearbeitete Bereiche, höchstens zwei freiwillige Wiederholhinweise. Beispiel: „Schau dir die Linsenform noch einmal an.“ Nicht: „Du kannst das Auge nicht.“ Empfehlungen nur aus tatsächlich fachlich bestätigten Fehlantworten oder ausdrücklich gewünschter Hilfe ableiten; nicht allein aus Korrektor-Unsicherheit.

## 10. Technische Zielarchitektur

Statische HTML/CSS/JavaScript-Anwendung mit eigenen SVGs. Keine Runtime-CDNs, Analytics, externen Fonts oder API-Schlüssel. Für diese text- und diagrammbasierte Anwendung kein Phaser/Three.js nötig. DOM für Eingaben und Feedback, SVG für Modelle. Daten, Auswertung, Zustand und Darstellung trennen.

Primärer Betrieb: HTTPS auf GitHub Pages im Unterpfad `/Lernspiel-Sinne/`. Relative Assetpfade; nicht nur die Root-URL testen. Keine automatische Router-Umleitung nötig. Nach dem Laden funktioniert die Antwortprüfung ohne Netzwerk. Erstaufruf der Website benötigt natürlich Zugriff auf die Dateien. Behaupte keine pauschale Offline-Verfügbarkeit der Website ohne entsprechende Implementierung.

Zusätzlicher lokaler Desktopbetrieb: statische `index.html` mit gebündelten/klassisch eingebundenen Skripten und lokalen Assets, kein Runtime-`fetch()` der Aufgaben-JSON über `file://`. Alternativ zusätzlich ein fertiger Offline-Einzeldatei-Export. Keine Installation auf Schülergeräten voraussetzen. Entwickler dürfen einen Testserver verwenden. iPad-Nutzung wird über HTTPS vorgesehen, nicht über eine lokal geöffnete Datei.

`localStorage` nur geschützt mit try/catch und Schema-/Versionsprüfung. Bei blockiertem oder kaputtem Speicher bleibt das Spiel in einer Sitzung nutzbar und meldet schlicht, dass Fortschritt nicht dauerhaft gespeichert wird. Keine Daten anderer Anwendungen löschen. Fortschritt nach Niveau trennen. Keine Rohtexte, Namen oder personenbezogenen Daten dauerhaft speichern oder übertragen. Neuer Inhalt darf alten Fortschritt nicht fälschlich als vollständig beherrscht übernehmen.

Speichere fachliche Inhalte in einer strukturierten Bank; Generatoren zum Erzeugen browserkompatibler Daten sind erlaubt. Runtime und Tests nutzen dieselbe Bewertungslogik. Testantworten dürfen nicht als auswendig gelernte vollständige Zeichenketten die gesamte Bewertungslogik ersetzen; erkenne die begrenzten Konzepte und Beziehungen sowie Varianten. Nur sichere, aufgabenspezifische Regeln anwenden. Ein Testdummy mit anderer Korrekturfunktion ist unzulässig. Fehler beim Start mit verständlicher Meldung statt leerem Bildschirm abfangen.

## 11. Verbindliche Tests und Nachweise

1. **Datenprüfung:** 24 eindeutige Mission-IDs, alle vier Niveaus explizit aufgelöst, keine Lücken oder TODOs, Lösungen referenzieren vorhandene Antwort-IDs. Vollständige Ohren-/Augenbegriffe. Förder/ESA enthalten auch in Fallbacks keine Texteingaben. P/Z-Mix und Teilantwortzahlen aus den tatsächlichen Daten berechnen.
2. **Alle 96 Niveau-Missionen:** Lösungspfad und mindestens ein Fehl-/Hilfepfad prüfen, bei Zuordnungen zusätzlich Teilerfolg. Unabhängiger Testdatensatz für richtige Zuordnungen; Tests nicht ausschließlich aus der implementierten Lösung selbst erzeugen.
3. **Freitext:** Alle Fälle aus Anhang C verwenden. Keine Umbenennung erwarteter Ergebnisse, nur damit eine falsche Implementierung besteht. Generierte Groß-/Kleinschreibungsvarianten sind nicht 100 unabhängige fachliche Testfälle. Ergänze neue Formulierungen und Kontextwechsel; protokolliere Fehlannahmen, Ablehnungen und Klärungen getrennt. Null falsche Annahmen im bekannten Testbestand ist ein Abnahmekriterium, keine Garantie für beliebige Texte.
4. **Negation und Kontext:** positive/negative Minimalpaare, korrigierende Sätze mit „sondern“, echte Widersprüche, gültige falsche Fachwörter, falsches Subjekt, umgekehrte Richtung und lange Eingaben. Buchstabenähnlichkeit darf keine Gegenbegriffe korrigieren.
5. **Browser:** vollständiger Durchgang je Niveau unter Chromium; soweit verfügbar zusätzlich WebKit. Ansichten ca. 1440×900, 768×1024, 1024×768 und 390×844. Nicht nur Screenshots: echte Tippalternative, Pointer-Drag, Tastatur, virtuelle Tastatur-Verdeckung und sichtbare Feedbackbereiche prüfen. Touch-Emulation ist kein echter iPad-Test; WebKit ist nicht die Safari-App. Nicht getestete echte Geräte ausdrücklich offenlassen.
6. **Zustand:** Reload, blockierter Speicher, beschädigter Speicher, Zurück/Weiter, Hilfe, Lösung, Klärung, Neustart, Niveauwechsel, Doppelklick, geänderte Eingabe nach richtigem Feedback, abgebrochener Drag. Jede Mission bleibt erreichbar und abschließbar.
7. **Abbildungen:** Ohr-/Augenmodelle und Vergrößerungen als Screenshots visuell gegen die anatomische Spezifikation prüfen. Ein grüner Unit-Test ist kein Beweis für richtige Pfeilendpunkte. Illusionen zusätzlich geometrisch auf gleiche Länge/Größe testen. Keine bereits beschrifteten Lösungen vor dem ersten Versuch.
8. **Zeit:** Nur gemessene Zeiten als Messwerte ausgeben. Automatische Browserklicks ersetzen keine Lesetempo-Erprobung. Führe eine offene Restliste für Lerngruppenzeit und echte iPad-Bedienung.
9. **Datenschutz/Offline:** keine Netzwerkübertragung von Antworten, keine eingebundenen Klassenarbeitsseiten. Lokaler Export separat vom HTTPS-Pages-Betrieb prüfen. Fehlerhafte Assets und JavaScript-Fehler erfassen.

## 12. Arbeitsreihenfolge und Abgabe

Zuerst Inhalte und Bewertungsregeln übernehmen; dann einen vollständigen Beispielpfad pro Aufgabentyp bauen und testen; danach alle Missionen anbinden. Anschließend Darstellungen, Hinweise, Speichern und alle Browserpfade prüfen. Nicht mit aufwendigen Animationen beginnen und beim Daten-Grundgerüst aufhören.

Abgabe im Repository: vollständiger lauffähiger Stand, README mit sehr einfacher Start-/Pages-Anleitung, Aufgaben-/Abdeckungsmatrix, Korrektor-Tests, tatsächlich ausgeführter Testbericht, Quellen-/Abweichungsnachweis, Restliste. Vorhandene Quellen-Datei und Prüfbericht nicht als Schülertext anzeigen. Originalmaterialien nicht mit veröffentlichen.

Wenn Funktionen technisch fertig, aber echte iPad- oder Lerngruppentests offen sind, schreibe genau das. Keine pauschale Aussage „auf iPad geprüft“ nach bloßer Änderung der Fenstergröße. Keine „100 % zuverlässige Freitextkorrektur“ behaupten.

**Setze nun die vollständige Anwendung im Repository `Lernspiel-Sinne` um. Die folgenden Anhänge sind die verbindliche konkrete Inhalts- und Prüfbasis.**
