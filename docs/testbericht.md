# Tatsächlich ausgeführter Anwendungstest

Stand des abschließenden Browserlaufs: 21.10.2026, 10:59 Uhr (Europe/Berlin). Linux-Cloud mit Node.js v24.19.0, Chromium 154.0.8037.57 und Playwright 1.58.2. Ergebnisse beziehen sich auf diesen Entwicklungsstand. Remote-GitHub-Actions, Veröffentlichung und neue Cloud-Tasks sind dadurch nicht automatisch geprüft.

| Prüfung | Ergebnis |
|---|---|
| Bereitgestellter Spezifikationsvalidator | Bestanden: 24 Missionen, 96 Varianten, 240 Lernschritte |
| Gemeinsame Laufzeitlogik mit `npm test` | 309 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| Beigefügte Golden Tests | Alle 176 Soll-Ergebnisse unverändert erfüllt |
| Falsche Annahmen / Ablehnungen / Klärungen im Golden-Bestand | 0 / 0 / 0 Abweichungen vom Soll |
| Chromium-Browserprüfungen | 23 bestanden, 0 fehlgeschlagen, 1 ausdrücklich übersprungen |
| Build, erneutes `npm ci` und Build-Wiederholung | Erfolgreich mit unveränderter Lockdatei |
| Server stoppen/starten, Unterpfad und Assets | HTTP 200 für `/Lernspiel-Sinne/`, `game.js`, `game.css`; Titel verifiziert |
| WebKit | Nicht ausgeführt: Browser ist in dieser Cloud nicht installiert |
| Echte iPads/Safari und Lerngruppe | Nicht durchgeführt |

Die 176 Golden-Fälle bestehen aus 73 richtigen, 39 falschen, 20 teilrichtigen und 37 zu klärenden Antworten sowie drei leeren, drei Hilfe- und einer überlangen Eingabe. Die zusätzlichen Tests prüfen neue Formulierungen, explizit falsche Subjekte, umgekehrte Richtungen und Negation. Das Ergebnis ist kein Nachweis einer fehlerfreien Interpretation beliebiger Schülertexte.

## Was im Browser ausgeführt wurde

- Vollständiger korrekter Weg durch alle 24 Missionen in jedem der vier Niveaus; alle 240 Lernschritte. Keine erfassten JavaScript-/Konsolenfehler, fehlerhaften HTTP-Assets oder externen Laufzeitanfragen in diesen Durchgängen.
- In allen 96 Niveau-Missionen ein unvollständiger Versuch, ein falscher Versuch, Hilfe und Lösung ansehen. Jeder Pfad bleibt abschließbar. Für Förder/ESA auch dabei keine Textfelder.
- Herausnehmen eines Begriffs aus einer bereits bestätigten, gerade ausgeblendeten Markierungsgruppe verlangt eine erneute Prüfung dieser Gruppe; kein Abschluss mit unvollständigen versteckten Feldern.
- Echte Antippzuordnung, Pointer-Drag, Tauschen, Entfernen, abgebrochener Drag, erhaltene korrekte Teilzuordnungen, Tastaturaktivierung und Sortieren mit Pfeilen.
- Bedienechte Auswahlklärung und getrennte Speicherung als „Mit Auswahl geklärt“; keine Rohtexte gespeichert. Wortbank vor jedem Fehlversuch erreichbar und als Unterstützung gezählt.
- Reload/Fortsetzen, Niveauwechsel, Neustart, wiederholtes Abschließen und physischer Doppelklick. Bearbeitete Eingabe entfernt korrektes altes Feedback und sperrt Weiter.
- Blockierter, beschädigter und veralteter Speicher; Daten anderer Anwendungen bleiben erhalten. Das Spiel bleibt nutzbar.
- Ansichten 1440×900, 768×1024, 1024×768 und 390×844 ohne horizontales Seitenüberlaufen. Sichtbares Feedback bei verkleinerter Höhe als Annäherung an Tastaturverdeckung; keine Behauptung eines echten Gerätetests.
- Touch-Kontext, reduzierte Bewegung, Tastatur-Niveauwechsel, Dialogschließen und sichere Darstellung von HTML-ähnlicher Eingabe.
- Einzeldatei-Export über HTTP geladen, danach alle weiteren Netzwerkanfragen blockiert und ein vollständiges Förder-Niveau mit 24 Missionen gespielt.

## Ausdrücklich übersprungen: lokaler Datei-Aufruf

Der Test für `file://`-Start von Multi-Datei- und Einzeldatei-Ausgabe erhält `ERR_BLOCKED_BY_ADMINISTRATOR`. Die Systemrichtlinie des Cloud-Chromium erlaubt nur bestimmte URL-Schemata. Sie wurde nicht geändert oder umgangen. Dieser Test ist als **übersprungen** protokolliert, nicht als bestanden. Die separate Einzeldatei-Prüfung mit nachfolgend gesperrtem Netzwerk besteht, ersetzt aber keinen echten lokalen Desktop-Aufruf.

## Sichtprüfung und Geometrie

Startseite, Ohr- und Augenschnitt wurden als echte Screenshots geprüft, einschließlich einer mobilen Darstellung. Ein zunächst außerhalb der inneren Netzhautkurve liegender Markierungsendpunkt wurde vor der Schlussprüfung korrigiert. Die endgültigen Endpunkte wurden an den gezeichneten Strukturen kontrolliert; die kleine Mittelohrdarstellung besitzt einen vergrößerten Ausschnitt. Die Bildvergrößerung lässt sich ohne Textfeld öffnen und schließen.

Beide Vergleichslinien liegen mit Länge 160 im selben SVG, beide mittleren Vergleichskreise haben Radius 18. Der Messmodus zeigt die Kreise deckungsgleich übereinander. Daten-/Geometrietests und Sichtprüfung ergänzen sich; keines ersetzt die fachliche Unterrichtserprobung.

[Start Desktop](abbildungen/start-desktop.png) · [Start mobil](abbildungen/start-mobil.png) · [Ohr mobil](abbildungen/ohr-mobil.png) · [Ohr ESA](abbildungen/ohr-esa.png) · [Auge ESA](abbildungen/auge-esa.png)

Die drei übernommenen JSON-Dateien sind bytegleich mit den hochgeladenen Vorgaben; ihre SHA-256-Werte stehen im [maschinenlesbaren Bericht](testergebnisse.json). Die [Runner-Ausgaben](nachweise/) und die Tests liegen im Repository. Die vom Nutzer mitgelieferte ursprüngliche Spezifikationsprüfung bleibt von diesen Anwendungstests getrennt.

Offene Punkte und Grenzen: [Restliste](restliste.md).
