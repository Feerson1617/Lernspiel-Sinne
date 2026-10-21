# Mission Sinneslabor

Ein Biologie-Lernspiel für Klasse 8: **24 Missionen, vier gleichwertige Niveaus, eigene SVG-Modelle**. Keine Anmeldung, keine kostenpflichtigen Dienste, keine Werbung und kein Zeitlimit. Förder und ESA kommen vollständig ohne Texteingaben aus. MSA und AHR üben zusätzlich Fachbegriffe und eng geführte Kurzantworten.

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

## Aufbau und fachliche Grenzen

- `spec/`: unveränderte bereitgestellte Aufgabenbank, Regeln, Golden Tests und didaktische Dokumentation; keine Original-Klassenarbeit oder Schulbuchbilder.
- `src/evaluate.js`: gemeinsame begrenzte Antwortprüfung für Spiel und Tests; keine KI-API und kein Auswendiglernen der Golden-Antworttexte.
- `src/state.js`: versionierter Fortschritt je Niveau, Speicherung mit Fehlerbehandlung; keine dauerhaften Rohtexte.
- `src/visuals.js`: eigene schematische SVGs und geometrisch gleiche Sehtricks.
- `src/app.js`, `src/style.css`: Oberfläche, Tipp-/Ziehalternative, Tastatur, Hilfen und Auswahlklärung.
- `tests/`: Golden Tests, unabhängige Fachfixtures, Zustandsprüfungen und echte Browserabläufe.
- `spiel/`: fertig gebauter Einzeldatei-Export; wird von `npm run build` aktualisiert.

Bei unbekannten Formulierungen fragt die Software nach. Eine Auswahlklärung wird nicht als automatische Bestätigung des ursprünglichen Textes gespeichert. „Lösung angesehen“ bedeutet bearbeitet, nicht eigenständig beherrscht. Die Anwendung ist ein Übungsangebot und kein diagnostisch validierter Test. Die ungefähr 30 Minuten sind eine Planungsschätzung, keine mit Kindern gemessene Dauer.

[Abdeckung und Zeitplanung](spec/abdeckungsmatrix.md) · [Quellen und fachliche Präzisierungen](spec/quellen-und-abweichungen.md) · [Umsetzung](docs/umsetzung.md) · [tatsächliche Tests](docs/testbericht.md) · [offene Erprobung](docs/restliste.md)
