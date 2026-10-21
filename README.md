# Mission Sinneslabor

Ein Biologie-Lernspiel für Klasse 8: **24 Aufgaben, zwei Themenbereiche und vier gleichwertige Niveaus, eigene SVG-Modelle**. Keine Anmeldung, keine kostenpflichtigen Dienste, keine Werbung und kein Zeitlimit. Förder bleibt vollständig ohne Texteingaben. ESA hat genau ein sehr kurzes Textfeld zur Iris-Muskulatur in T18. MSA und AHR üben Fachbegriffe und eng geführte Kurzantworten; ihre Wortbank lässt sich jederzeit öffnen und schließen.

## Direkt am Desktop spielen

1. Lade [Mission-Sinneslabor-offline.html](spiel/Mission-Sinneslabor-offline.html) herunter (auf GitHub: Datei öffnen → „Download raw file“).
2. Öffne die heruntergeladene HTML-Datei im Browser. Sie enthält das gesamte Spiel. Es ist keine Installation und kein Internet nötig.

Manche verwalteten Schulbrowser sperren lokale HTML-Dateien. Dann die Website über HTTPS nutzen. Der lokale `file://`-Aufruf ist in der hier verwendeten Cloud-Browserumgebung administrativ gesperrt; siehe [Testbericht](docs/testbericht.md). Mit der Einzeldatei wurde ein vollständiges Niveau ohne weitere Netzwerkanfragen durchgespielt.

## Auf GitHub Pages bereitstellen

1. Änderungen des Entwicklungsbranches nach `main` übernehmen.
2. Im Repository **Settings → Pages → Build and deployment → Source: GitHub Actions** wählen.
3. Der Workflow **GitHub Pages veröffentlichen** baut die Dateien und veröffentlicht sie nach einem Push auf `main`. Alternativ in **Actions** manuell starten.
4. Den tatsächlich von GitHub angezeigten Pages-Link verwenden. Erwarteter Unterpfad: `/Lernspiel-Sinne/`. Eine erfolgte Veröffentlichung ist erst durch einen erfolgreichen Workflow belegt.

Für ein iPad die HTTPS-Website verwenden. Ein echter iPad-/Safari-Gerätetest steht noch aus. Auf der Startseite der Website lässt sich auch der vollständige Desktop-Offline-Export herunterladen. Die Website lädt keine Fonts, Bibliotheken, Aufgaben oder Dienste von Dritten nach. Ein frischer Website-Aufruf braucht Netz; es gibt keinen Service Worker.

## Entwickeln

Voraussetzungen: Node.js 22 oder neuer, npm; Python 3 nur für den beigefügten Spezifikationsvalidator.

```sh
npm ci
npm run build
npm start
```

Der Entwicklungs-Testserver nutzt Port `4173` und unterstützt ausdrücklich `/Lernspiel-Sinne/`. `dist/index.html` und `dist/Mission-Sinneslabor-offline.html` sind die Browserausgaben. Die `index.html` im Projektwurzelverzeichnis ist die Buildvorlage.

```sh
npm run test:spec   # Struktur der gelieferten Spezifikation
npm test           # echter Korrektor, alle 96 Varianten, Zustand und Geometrie
npm run build
npm run test:browser
```

Browserprüfung mit Playwright: einen vorhandenen Chromium über `CHROMIUM_PATH` auswählen oder `npx playwright install chromium` ausführen. Für WebKit zusätzlich `npx playwright install webkit`, dann `TEST_WEBKIT=1 npm run test:browser`. GitHub Actions installiert beide Browser samt Systemabhängigkeiten. Browser-Downloads können in verwalteten Umgebungen zusätzliche Netzfreigaben benötigen. Testberichte stehen anschließend in `test-results/`.

## Was Entwicklungsrunde 2 ändert

Die Navigation hat genau zwei aufklappbare Themen: **Hören mit den Ohren** und **Sehen mit den Augen**, jeweils zwölf Aufgaben. Jede Aufgabe bleibt direkt erreichbar. Nach einer Aufgabe geht es innerhalb desselben Themas weiter. Zwei Themenabschlüsse ersetzen die früheren vier Labor-Abzeichen.

Feedback ist überall gleich: Grün mit Häkchen für richtig, Rot mit Kreuz für eindeutig falsch, Gelb für teilweise richtig, unklar oder Hilfe. Noch nicht bearbeitete Felder bleiben neutral. Das gilt auch für die kleinen Texte und Ränder unter einzelnen Zuordnungen.

MSA/AHR schreiben zusätzlich in T09, T13, T17 und T19 selbst kurze Begriffe. Bei MSA ersetzen kurze Antworten in T11, T14, T18, T22 und T23 bisherige Auswahlfragen. AHR behält Farb- und Nah-/Fern-Erklärungen und erklärt in T18 Zweck und Iris-Beteiligung. Ein Wort reicht oft aus, lange Aufsätze sind nicht vorgesehen.

Die neue Inhaltsversion liest den bisherigen Speicher-Schlüssel weiter. Spielstände der vorherigen Version werden anhand der stabilen Schritt-IDs übernommen. Früher vollständig bearbeitete Aufgaben bleiben markiert; neu ergänzte Teilfragen erhalten dabei keine erfundenen Antworten und lassen sich freiwillig öffnen. Unbekannte oder beschädigte Speicherformate werden mit einer sichtbaren Meldung abgewiesen.

Die geschätzten Gesamtzeiten mit Hilfepuffer sind Förder 25,6, ESA 28,4, MSA 29,7 und AHR 30,8 Minuten. Das sind Entwurfsschätzungen, keine gemessenen Lerngruppenzeiten.

## Aufbau und fachliche Grenzen

- `spec/`: Aufgabenbank und Regeln mit den Änderungen aus Entwicklungsrunde 2, die unveränderten 176 ursprünglichen Golden Tests und didaktische Dokumentation; keine Original-Klassenarbeit oder Schulbuchbilder.
- `src/evaluate.js`, `src/scoped-rules.js`: gemeinsame begrenzte Antwortprüfung für Spiel und Tests; keine KI-API und kein Auswendiglernen der Golden-Antworttexte.
- `src/state.js`: versionierter Fortschritt je Niveau, Speicherung mit Fehlerbehandlung; keine dauerhaften Rohtexte.
- `src/topics.js`: Themenzuordnung und Synchronisierung von Modell, Frage und Antwort-IDs.
- `src/visuals.js`: eigene schematische SVGs und geometrisch gleiche Sehtricks.
- `src/app.js`, `src/style.css`: Oberfläche, Tipp-/Ziehalternative, Tastatur, Hilfen und Auswahlklärung.
- `tests/`: Golden Tests, unabhängige Fachfixtures, Zustandsprüfungen und echte Browserabläufe.
- `spiel/`: fertig gebauter Einzeldatei-Export; wird von `npm run build` aktualisiert.

Bei unbekannten Formulierungen fragt die Software nach. Eine Auswahlklärung wird nicht als automatische Bestätigung des ursprünglichen Textes gespeichert. „Lösung angesehen“ bedeutet bearbeitet, nicht eigenständig beherrscht. Die Anwendung ist ein Übungsangebot und kein diagnostisch validierter Test. Die ungefähr 30 Minuten sind eine Planungsschätzung, keine mit Kindern gemessene Dauer.

[Abdeckung und Zeitplanung](spec/abdeckungsmatrix.md) · [Quellen und fachliche Präzisierungen](spec/quellen-und-abweichungen.md) · [Umsetzung](docs/umsetzung.md) · [tatsächliche Tests](docs/testbericht.md) · [Korrektor-Nachprüfung](docs/testbericht-korrektor.md) · [offene Erprobung](docs/restliste.md)
