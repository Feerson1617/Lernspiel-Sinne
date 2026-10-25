# Technische Prüfung der SCORM-1.2-Verpackung

Geprüfte Spielgrundlage: Hauptbranch `f55925a` mit den Korrekturen aus PR #2. Die Spielquellen, Aufgabenbank, Golden-Testdaten, SVG-Abbildungen und der vorhandene HTML-Einzeldatei-Export sind unverändert. Die Ergänzungen liegen im Branch `feat/scorm-1-2`.

## Lokal tatsächlich ausgeführt

Linux-Cloud, Node.js 24.19.0, Python 3.12.14, lxml 6.1.1, Playwright 1.58.2 und Chromium 154.0.8037.57.

| Prüfung | Ergebnis |
|---|---|
| Spezifikation | Bestanden: 24 Aufgaben, zwei Themen, 96 Varianten, 242 Lernschritte |
| Alle Node-Logiktests | 583 bestanden, darunter alle 176 unveränderten Golden Tests, 149 Korrektor-Fälle und 16 SCORM-Lifecycle-Prüfungen |
| Paketprüfungen einschließlich ungültiger Gegenbeispiele | 21 bestanden |
| Bestehende Chromium-Browserprüfungen | 40 bestanden; 1 `file://`-Prüfung wegen Cloud-Verwaltungsrichtlinie ausdrücklich übersprungen |
| Zusätzlicher HTTPS-SCORM-Player in Chromium | 29 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| XML-/XSD-Prüfung des tatsächlich erzeugten ZIP | Bestanden; Manifest direkt an der ZIP-Wurzel, alle Referenzen lokal und vorhanden |
| Spielinhalt in der SCORM-Startdatei | Nach Entfernen der abgegrenzten SCORM-Ergänzung bytegleich mit dem bestehenden Export |
| Erhalt der bestehenden Website/Pages-Konfiguration | Quellvergleich mit Hauptbranch ohne Änderungen an Spiel, Export, bisherigem Build oder Pages-Workflow |

Die ergänzten Browserprüfungen laden die **aus dem ZIP extrahierten Dateien** über einen HTTPS-Testserver unter einem verschachtelten Pfad. Sie prüfen vier komplette Niveaudurchgänge im iframe und einen kompletten AHR-Durchgang im separaten Fenster. Alle 149 Korrektor-Regressionsfälle laufen zusätzlich über den SCORM-Player. Nach dem Start wird in den Komplettdurchgängen weiterer Netzwerkzugriff blockiert; das vollständige Spiel bleibt nutzbar. Es werden keine externen Laufzeitanfragen beobachtet.

Die unabhängige API-Nachbildung würde beim Beenden eines neuen Versuchs ohne Statusmeldung automatisch `completed` setzen. Die Tests bestätigen, dass die Verpackung dies mit `incomplete` verhindert. **Auch nach allen 24 Aufgaben bleibt der LMS-Status `incomplete`.** Der Abschlussbildschirm des Spiels schreibt keine LMS-Bewertung. Die API-Aufzeichnungen enthalten nur Initialisierung, den Statuszugriff, Commit und Finish; keine Punktzahl, Antworten, Interaktionen, Namen, IDs oder Suspend-Daten.

Zusätzlich getestet: Eltern-/Opener-Suche, verschachtelte Frames, API-Fehler bei Initialisierung/Lesen/Schreiben/Commit/Finish, fehlende API, gesperrter Cross-Origin-Zugriff, mehrfaches Beenden, Fensterschließen, Frame-Navigation, Hintergrundwechsel, simulierte Rückkehr aus dem Seitencache, bestehende LMS-Statuswerte, lokaler Fortschritt nach Reload, gesperrter Browserspeicher, Wortbank, falsche und unklare Eingaben, Hilfe, Auswahlklärung sowie Touch in Hoch- und Querformat.

Die negativen Paketprüfungen weisen unter anderem falsche Version, falsches `scormtype`, fehlende Attribute/Titel, unaufgelöste Referenzen, fehlende Startdatei, falsche ZIP-Wurzel, Pfadtraversierung, Dateikollisionen, fehlende/veränderte Schemata und externe oder fehlende Ressourcen zurück. Der Validator lädt keine entfernten Schemata.

## GitHub Actions und WebKit

Der Workflow [SCORM 1.2 – Paket und Prüfungen](../.github/workflows/scorm.yml) installiert Chromium und WebKit und prüft dasselbe Paket mit beiden Engines. Er führt auch die bisherigen Browserprüfungen mit beiden Engines aus. Die JSON-Berichte und lokalen Test-Screenshots werden unter **SCORM-Testnachweise** gespeichert; die Zusammenfassung des Laufs weist bestandene, fehlgeschlagene und übersprungene Tests getrennt aus. Ein Paketdownload wird nur nach erfolgreichen Prüfungen erstellt und anschließend durch erneuten Download validiert.

WebKit kann in dieser lokalen Cloud nicht installiert werden: Die offiziellen Download-Adressen antworten mit HTTP 403 `Domain forbidden`. Lokale Chromium-Ergebnisse sind deshalb kein behaupteter lokaler WebKit-Lauf. Das tatsächliche WebKit-Ergebnis gehört zum jeweiligen Actions-Lauf. Bei einem fehlgeschlagenen oder noch laufenden Workflow darf dessen Download nicht als fertig geprüft gelten.

## Gefundene Probleme und Umsetzung

- Die alte XML-Namensraum-Schemadatei hat eine mit heutigen Parsern ungültige Namespace-Bindung. Die unveränderte XML-Namensraumdatei aus der offiziellen ADL-Testsuite einschließlich lokaler DTD-Dateien ersetzt diese Kopie. Die XSD-Prüfung bleibt eingeschaltet; die Paketversion ist weiterhin SCORM 1.2. Quellen und Hashes sind eingecheckt.
- SCORM 1.2 kann ein neues, beim Beenden ungemeldetes Lernobjekt standardmäßig als abgeschlossen behandeln. Der Adapter setzt deshalb nur für neue Versuche `incomplete`; vorhandene Statuswerte werden nicht überschrieben.
- Eine SCORM-Sitzung und ein bearbeitetes Spiel sind unterschiedliche Dinge. Das Beenden sendet `LMSFinish`, ohne einen Bearbeitungs-/Bewertungsabschluss zu erfinden. Die Sitzungsleiste macht diesen Unterschied sichtbar.
- Der vorhandene Desktop-Offline-Link bleibt auf eine im Paket enthaltene, unveränderte Einzeldatei auflösbar. Es gibt keine zusätzlichen Downloads von externen Servern.
- Ein GitHub-Artefakt mit einer ZIP als einziger Datei wäre ein verschachtelter Download. Stattdessen lädt der Workflow die Paketdateien direkt als Artefakt hoch und prüft den Rückdownload. Der heruntergeladene Artefakt-ZIP ist direkt das SCORM-Paket.
- `file://` ist in der verwalteten lokalen Chromium-Installation administrativ gesperrt. Das betrifft den bisherigen Desktop-Export-Test; das SCORM-Paket wird bestimmungsgemäß über HTTPS geprüft.

## Noch zwingend manuell zu prüfen

Ein echter itslearning-Import und Tests auf physischen iPads wurden **nicht durchgeführt**. Daraus folgt keine bereits nachgewiesene Kompatibilität mit der schleswig-holsteinischen Installation. Offene Punkte sind die realen Player-/Sandbox-/Same-Origin-Einstellungen, Rollenrechte, separate Fenster und Popup-Freigaben, echte Safari-Versionen, Bildschirmtastatur, Touch und Scrollen sowie Wiedereinstieg, Speicherfreigaben und LMS-Abschlussregeln. Die [Import-Checkliste](SCORM-1.2.md#import-und-notwendige-prüfung-in-itslearning) beschreibt das Vorgehen.

WebKit unter Linux, emulierte Tabletgrößen, ein selbst signierter HTTPS-Testserver und synthetische `pagehide`-/`pageshow`-Ereignisse ersetzen keine echten Safari-/iPadOS-Lebenszyklus- und Gerätetests. Ein Browserabsturz oder hartes Beenden kann keine zuverlässige Ausführung von JavaScript garantieren. Auch bei einem LMS-API-Fehler kann die Verpackung den vom LMS gespeicherten Status nicht garantieren; sie überträgt trotzdem keine künstliche Bewertung.

Lokale Originalprotokolle: [Logik](nachweise/scorm/logik-lokal.txt), [Spezifikation](nachweise/scorm/spezifikation-lokal.txt), [Paket](nachweise/scorm/paket-lokal.txt), [bisherige Browserprüfungen](nachweise/scorm/browser-bisher-lokal.txt), [SCORM-Player](nachweise/scorm/browser-scorm-lokal.txt), [Kennzahlen und Hashes](nachweise/scorm/ergebnisse-lokal.json). Aktuelle Remote-Ergebnisse: [SCORM-Actions-Läufe](https://github.com/Feerson1617/Lernspiel-Sinne/actions/workflows/scorm.yml).
