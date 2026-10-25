# Mission Sinneslabor als SCORM 1.2

Das Paket verpackt den Spielstand von `f55925a` (Hauptbranch mit dem korrigierten Korrektor aus PR #2). Alle 24 Aufgaben, vier Niveaus, 242 Lernschritte, SVG-Abbildungen, Hilfen, Wortbank, Feedback, Bewertungen und lokale Fortschrittsspeicherung bleiben erhalten. `src/`, `spec/`, der vorhandene HTML-Einzeldatei-Export und der Pages-Workflow werden nicht verändert.

Die Startdatei ist der vorhandene Einzeldatei-Export plus einer abgegrenzten SCORM-Sitzungsleiste und dem Adapter. Der Validator entfernt diese Ergänzung probeweise und vergleicht das Ergebnis bytegenau mit dem bestehenden Export. Dieser liegt zusätzlich unverändert als `Mission-Sinneslabor-offline.html` im Paket; der vorhandene Offline-Download im Spiel bleibt auflösbar.

## Download ohne Terminal

1. Im Repository **Actions → SCORM 1.2 – Paket und Prüfungen** öffnen und einen **erfolgreichen** Lauf wählen.
2. Unter **Artifacts** auf **Mission-Sinneslabor-SCORM-1.2** klicken. GitHub lädt **Mission-Sinneslabor-SCORM-1.2.zip** herunter. Für Actions-Artefakte ist eine GitHub-Anmeldung erforderlich.
3. Genau diese ZIP in itslearning importieren. **Nicht entpacken.** Sie enthält `imsmanifest.xml` direkt im Hauptverzeichnis, keine weitere ZIP und keinen übergeordneten Paketordner. Auch die Zusammenfassung des Laufs enthält den Download-Link.

Der Workflow lädt bewusst die ausgepackten, bereits validierten Paketdateien als Artefakt hoch. GitHub erstellt daraus den direkt importierbaren ZIP-Download. Danach lädt derselbe Workflow das Artefakt wieder herunter, prüft Dateipfade und identische Dateiinhalte und validiert es nochmals. Die ZIP-Komprimierung und damit der ZIP-Hash können sich vom lokal erzeugten ZIP unterscheiden; die enthaltenen Dateien müssen exakt identisch sein.

Der Workflow enthält `workflow_dispatch`. Nach Übernahme der Workflowdatei auf den Standardbranch kann er mit **Run workflow** manuell ausgeführt werden; dabei kann der SCORM-Branch gewählt werden. Solange die Änderungen ausschließlich im SCORM-Branch liegen, erzeugt ein Push auf diesen Branch das Paket. Ein vorhandener Lauf kann ohne Terminal über **Re-run all jobs** erneut ausgeführt werden. Artefakte bleiben 90 Tage verfügbar. Der Workflow veröffentlicht keine Website und verwendet keine Pages-Berechtigungen.

## Import und notwendige Prüfung in itslearning

Die schleswig-holsteinische Installation wurde hier **nicht tatsächlich getestet**. Ein gültiges SCORM-Paket und ein erfolgreicher Testplayer beweisen noch keine itslearning-Kompatibilität. In einem Testkurs über die angebotene Funktion für SCORM-Lernpakete die vollständige ZIP importieren. Die genauen Menübezeichnungen und Berechtigungen können je nach Installation abweichen.

Mit einem Testzugang in der Lernendenrolle prüfen:

- Das Paket öffnet sich über HTTPS sowohl eingebettet als auch im separaten Fenster. Gegebenenfalls Popups für itslearning erlauben. Es erscheint kein Hinweis auf eine fehlende Lernplattform-Verbindung.
- Auf physischen iPads mit Safari Hoch- und Querformat, Scrollen im Player, Touch-Zuordnung, Wortbank, Sortieren, Hilfen, Bildschirmtastatur und sichtbares Feedback testen. Mehrere Aufgaben pro Niveau bearbeiten; alle Aufgaben müssen zugänglich sein.
- Browser-/Player-Neuladen und erneutes Öffnen prüfen. Die lokale Fortschrittsspeicherung hängt vom Ursprung, Profil und erlaubtem Browserspeicher ab; sie ist keine geräte- oder kontenübergreifende LMS-Synchronisierung.
- **Sitzung beenden** verwenden, danach den Player schließen. Auch Navigation und Schließen des separaten Fensters prüfen. Beim bloßen Wechsel in den Hintergrund darf die Sitzung nicht fälschlich als abgeschlossen gelten.
- Nach allen 24 Aufgaben und nach dem Beenden dürfen keine Note, Punktzahl oder Freitextantworten in itslearning erscheinen. Der Adapter sendet kein `completed`, `passed` oder `failed`. Eigene Abschlussregeln von itslearning (zum Beispiel „beim Öffnen erledigt“) separat kontrollieren.
- Zurück-/Vorwärtsnavigation, Rückkehr nach Hintergrundwechsel sowie Safari-Neustart prüfen. Ein hartes Beenden von iPadOS/Safari, ein Absturz oder abgebrochene Netzwerkverbindung kann kein JavaScript-Abschlussereignis garantieren.
- Bei Verbindungsfehlern den Inhalt aus itslearning neu öffnen und die Player-/Sandbox-Einstellungen prüfen. Cross-Origin-Zugriffssperren werden nicht umgangen. Es gibt keinen versteckten alternativen Datenkanal.

Der Import, die Geräte-/Safari-Versionen, Darstellungsart und Beobachtungen sollten im Testkurs dokumentiert werden, bevor das Paket für eine Lerngruppe eingesetzt wird.

## SCORM-Verhalten und Datenumfang

Der Adapter sucht die SCORM-1.2-`API` im eigenen Fenster, in Elternfenstern sowie im öffnenden Fenster und dessen Eltern. Die Suche ist begrenzt und behandelt unzugängliche Fenster. SCORM 2004 (`API_1484_11`) wird nicht verwendet; das ZIP bleibt ein SCORM-1.2-Paket.

| Aufruf | Zweck |
|---|---|
| `LMSInitialize("")` | Eine Sitzung initialisieren |
| `LMSGetValue("cmi.core.lesson_status")` | Nur den vorhandenen Bearbeitungsstatus lesen |
| `LMSSetValue("cmi.core.lesson_status", "incomplete")` | Ausschließlich bei einem neuen/nicht gemeldeten Versuch; verhindert den SCORM-1.2-Standardabschluss beim Beenden |
| `LMSCommit("")` | Statusänderung, Hintergrundwechsel und Beenden sichern |
| `LMSFinish("")` | Über die Sitzungsleiste oder beim Verlassen ordentlich beenden; erfolgreiche Beendigung nur einmal pro Sitzung |
| `LMSGetLastError()` | Rückgabewerte und Fehler kontrollieren |

Bestehende LMS-Statuswerte bleiben erhalten. Es gibt keine Kopplung der spielinternen Bewertungszustände oder des Abschlussbildschirms an das LMS. Weder `cmi.core.score`, `cmi.interactions`, `cmi.suspend_data`, Lernendenname noch Lernenden-ID werden gelesen oder beschrieben. Freitextantworten werden nicht in die SCORM-Kommunikation übernommen. Das LMS kennt unabhängig davon den angemeldeten Account und kann seine üblichen Sitzungs-/Zugriffsmetadaten führen.

`visibilitychange` auf „hidden“ führt nur zu Commit. `pagehide` beendet die Sitzung. Bei einer Rückkehr aus dem Browser-Seitencache versucht der Adapter eine neue Initialisierung; Ablehnung durch das echte LMS wird angezeigt. Die Simulation dieses Ereignisses prüft den Adapter, ersetzt aber keinen echten Safari-Seitencache-Test. Ein erfolgreicher Abschluss setzt das Spiel auf inaktiv; die Meldung betrifft ausschließlich die Sitzung, nicht das Bestehen des Spiels.

Bei fehlender API oder API-Fehlern bleibt das Spiel nutzbar und zeigt einen Hinweis. Fehlerhafte Initialisierung führt nicht zu einem vorgetäuschten erfolgreichen `LMSFinish`. Wenn das LMS selbst notwendige Statusänderungen ablehnt, lässt sich dessen gespeicherter Status nicht garantieren; der Adapter sendet dennoch keine künstliche Abschlussbewertung.

## Aufbau und Validierung

Im ZIP-Hauptverzeichnis liegen Manifest, Startdatei, unveränderter Offline-Export, Hinweise, Herkunftsnachweise, Paketinformationen und lokale XML-Schemata. Keine Laufzeitressourcen stammen von externen CDNs, Schriftservern, Bilddiensten, APIs oder Trackingdiensten. XML-Namensraum-URIs sind Bezeichner; die Schema-Dateipfade verweisen auf lokale Dateien.

Das Manifest verwendet IMS CP 1.1.2 und ADL SCORM 1.2 mit einem SCO, einer Organisation und dem Einstieg `index.html`. Es enthält keine Mastery-Score-, Prerequisite-, Grade- oder Sequencing-Vorgaben. Die XSD-Prüfung lädt die vertrauenswürdig eingecheckten IMS-/ADL-Schemata und kontrolliert zusätzlich den SCORM-Paketaufbau, Referenzen, sichere Pfade, Dateikollisionen und die Unverändertheit der Schema-Kopien.

Die ursprüngliche alte `ims_xml.xsd`-Kopie verwendet eine heute ungültige Default-Bindung des reservierten XML-Namensraums. Statt diese Schema-Prüfung zu umgehen, wird die unveränderte XML-Namensraumdatei aus der offiziellen ADL-Testsuite unter dem erforderlichen Importdateinamen beigelegt, einschließlich ihrer lokalen DTD-Abhängigkeiten. Sie ist unabhängig von der SCORM-Version. Quellen, feste Revisionen und SHA-256 stehen in [sources.json](../scorm/schemas/sources.json). Optionale IMS-Lernobjekt-Metadaten werden nicht verwendet; dafür ist kein zusätzliches Metadaten-Schema nötig. Originalhinweise stehen in [THIRD-PARTY-NOTICES.txt](../scorm/THIRD-PARTY-NOTICES.txt).

## Entwicklung und reproduzierbare Prüfungen

Node.js 24, Python 3.12, OpenSSL und die Abhängigkeiten aus Lockfile und `requirements-scorm.txt` werden verwendet. Lokal muss `lxml` verfügbar sein. Der SCORM-Testserver extrahiert das tatsächlich validierte ZIP und stellt es unter einem verschachtelten HTTPS-Pfad bereit. Seine kurzlebigen, selbst signierten Zertifikate werden nur für Tests erzeugt und nicht in das Lernpaket übernommen. `ignoreHTTPSErrors` gilt ausschließlich für diese lokale Testverbindung.

```sh
npm ci
python3 -m pip install -r requirements-scorm.txt
npm run test:spec
npm test
npm run build:scorm
npm run validate:scorm
npm run test:scorm:package
npx playwright install --with-deps chromium webkit
TEST_WEBKIT=1 npm run test:browser
TEST_WEBKIT=1 npm run test:scorm:browser
```

Die fertige Datei liegt unter `artifacts/scorm/Mission-Sinneslabor-SCORM-1.2.zip`. Wiederholte Paketbildung mit identischen Dateien ist deterministisch. GitHubs Artefakt-ZIP kann wegen eigener Metadaten andere ZIP-Bytes haben. Die erzeugten Dateien liegen außerhalb von `dist/`; `npm run build` und die Pages-Ausgabe bleiben unverändert.

Ergebnisse, bekannte Probleme und Grenzen: [SCORM-Prüfbericht](SCORM-Testbericht.md).
