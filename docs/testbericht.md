# Tatsächlich ausgeführte Prüfungen – Entwicklungsrunde 2

Abschließender Browserlauf: 21.10.2026, 12:24 Uhr (Europe/Berlin). Linux-Cloud mit Node.js v24.19.0, Chromium 154.0.8037.57 und Playwright 1.58.2. Ergebnisse gelten für diese Revision. Die neuen fachlich relevanten Fälle verwenden dieselbe Korrekturlogik wie der Browser.

| Prüfung | Ergebnis |
|---|---|
| Aktualisierter Spezifikationsvalidator | Bestanden: 24 Aufgaben, zwei Themen, 96 Varianten, 242 Lernschritte |
| Gemeinsame Laufzeitlogik | **418 bestanden**, 0 fehlgeschlagen, 0 übersprungen |
| Unveränderte ursprüngliche Golden Tests | **176 von 176** mit genau ihrem festgelegten Soll-Ergebnis |
| Abweichungen Annahme / Ablehnung / Klärung im Golden-Bestand | 0 / 0 / 0 |
| Chromium-Browserprüfungen | **33 bestanden**, 0 fehlgeschlagen, **1 ausdrücklich übersprungen** |
| Build und Offline-Einzeldatei | Erfolgreich; bereitgestellte Einzeldatei separat ohne weitere Requests durchgespielt |
| WebKit | Nicht ausgeführt: ausführbarer Browser in dieser Cloud nicht installiert |
| Echte iPads mit Safari / Lerngruppe | Nicht durchgeführt |
| Remote-CI / Live-Veröffentlichung dieser Revision | Nicht als ausgeführt oder erfolgreich behauptet |

Die zusätzlichen 109 Logikprüfungen gegenüber Runde 1 betreffen neue aufgabenspezifische Regeln, typische Schreibweisen, Negation und Gegenbehauptungen, Themenpartition, Eingabeformen, Kontextwechsel und Migration. Die 96 bestehenden Variantenprüfungen wurden auf die geänderten Eingabeformen erweitert und nutzen weiterhin unabhängige Fachfixtures. Die 176 ursprünglichen Soll-Fälle wurden nicht geändert.

## Konkrete Regressionsfälle

- `nah nicht rund fern flach` und `nah rund fern nicht flach` werden zurückgewiesen. Korrigierende Sätze wie `nah nicht flach sondern rund fern flach` bleiben richtig.
- Alle im zweiten Auftrag genannten neun richtigen Kurzformulierungen werden erkannt, einschließlich `Sie wirt dicker`, `Das Tromelfel wakelt` und der üblichen Verbformen zu Schwingungsübertragung und Signalumwandlung.
- Eine Reaktion der Zapfentypen auf unterschiedliche `Lichtstärke` allein ergibt nur einen unvollständigen Ansatz zur Farbempfindlichkeit.
- Alle neuen Inhaltsregeln besitzen positive, negative, unklare bzw. widersprüchliche Fälle. Explizite Verwechslungen von Iris-Erweiterungsmuskeln, Schließmuskeln und Ziliarmuskel werden nicht richtig gewertet.
- Beim blinden Fleck sind `Dort sind keine Sinneszellen` und `Es fehlen keine Sinneszellen` unterschiedliche Aussagen; eine mehrdeutige Kurzform wird geklärt.

## Ausgeführte Browserwege

- Ein vollständiger korrekter Durchgang je Niveau durch alle 24 Aufgaben in der neuen Themenreihenfolge; alle 242 Lernschritte. In diesen Durchgängen keine erfassten JavaScript-/Konsolenfehler, fehlerhaften HTTP-Assets oder externen Laufzeitanfragen.
- In allen 96 Niveau-Aufgaben unvollständiger Versuch, falscher Versuch, Hilfe und Lösung. Förder bleibt ohne Textfelder. ESA hat genau das eine neue T18-Textfeld, dessen Fehl-, Tippfehler- und Auswahlklärungspfad zusätzlich bedient wurde.
- Genau zwei auf- und zuklappbare Themen, je zwölf Aufgaben, direkter Themenwechsel aus einer Aufgabe, passende nächste Aufgabe im Thema, sichtbare Bearbeitungsmarkierungen und erhaltenes Niveau auch nach Reload.
- Wortbank in allen sechs Begriffsaktivitäten (T03, T07, T09, T13, T17, T19) auf MSA und AHR wiederholt geöffnet/geschlossen. Eigene Texte bleiben erhalten; Bankbegriffe werden nach Rückkehr ins Textfeld geprüft. Als Unterstützung und ohne zusätzlichen Fehlversuch gespeichert.
- Tatsächlich berechnete Farben von Feedbackbox, kleinen Teilrückmeldungen, Eingaberändern, falschen Radios, Sortierpositionen und Auswahlklärung kontrolliert. Symbole vorhanden; Palette mit mindestens 4,5:1 Textkontrast. Noch nicht bearbeitete Felder sind neutral. Geänderte Antworten entfernen alte Rückmeldungen einschließlich Fehlersymbolen.
- Bediente Kontextwechsel bei Hund/Schallquelle und Helligkeit mit angepasster Frage, Antwort-ID und Erklärung. Nah-/Fern-Abbildung ist bei festen Fragen gebunden; Dunkel-Zeitstufen zeigen beide eine große Pupille und unterscheiden die Netzhaut-Anpassung.
- Alter vollständiger ESA-Spielstand mit 24 Abschlüssen migriert, ohne eine Antwort für die neue Iris-Frage zu erzeugen. Diese bleibt beim freiwilligen Öffnen erreichbar. Teilfortschritt bleibt Teilfortschritt; fehlerhafte, unbekannte und blockierte Speicher werden geprüft. Fremde Daten bleiben erhalten.
- Antippen, echter Pointer-Drag, Tauschen, Entfernen, Drag-Abbruch, Tastatursortieren, Teilerfolg, Auswahlklärung, Neustart, Niveauwechsel, Doppelabschluss und physischer Doppelklick.
- Ansichten 1440×900, 768×1024, 1024×768 und 390×844. Die Tabletprüfung verifiziert, dass Anatomiebild und Eingabepanel oben zusammen beginnen und das Modell beim Fokussieren des letzten Begriffsfelds im Viewport bleibt. Verkleinerte Höhe simuliert nur begrenzten Raum; dies ist kein echter iPad-/Bildschirmtastaturtest.
- Selbstständige Offline-Datei über HTTP geladen und danach alle weiteren Netzwerkanfragen blockiert: ein vollständiges Förder-Niveau erfolgreich durchgespielt. Rohtexte werden nicht gespeichert oder übertragen.

## Sichtprüfung

Aktuelle Screenshots wurden zusätzlich gelesen: Themenübersicht und Dropdowns, MSA-Begriffseingaben, richtig/falsch/teilrichtig im selben Bild sowie Tabletansicht mit fokussiertem letztem Feld. Eine ungünstige vertikale Zentrierung des Anatomiepanels wurde behoben; das Modell bleibt seitlich sichtbar. Die anatomischen Zeichnungen selbst und ihre Markierungsendpunkte blieben erhalten.

[Übersicht Desktop](abbildungen/runde2/themen-1440.png) · [Geöffnete Themen](abbildungen/runde2/themen-geoeffnet.png) · [Übersicht mobil](abbildungen/runde2/themen-390.png) · [Drei Feedbackfarben](abbildungen/runde2/feedback-dreifarbig.png) · [Tablet, letztes Feld](abbildungen/runde2/tablet-letztes-feld.png)

## Übersprungen und offen

Der lokale Datei-Browsertest für `file://` erhält `ERR_BLOCKED_BY_ADMINISTRATOR` aufgrund der Cloud-Chromium-Verwaltungsrichtlinie. Diese wurde nicht verändert oder umgangen. Der Test ist ausdrücklich **übersprungen**, nicht bestanden. Die ergänzende Einzeldateiprüfung mit blockierten weiteren Requests besteht, ersetzt aber keinen lokalen Starttest auf einem freigegebenen Desktop.

WebKit ist nicht installiert. Echte iPad-/Safari-Bedienung, Lesetempo und Dauer mit Schülerinnen und Schülern sind offen. Die neu geschätzten Gesamtzeiten sind etwa 25,6 / 28,4 / 29,7 / 30,8 Minuten mit Puffer; keine Klasse hat diese Zeiten hier gemessen. Es gibt keine Garantie fehlerfreier allgemeiner Textinterpretation. Unbekanntes wird weiterhin geklärt.

[Maschinenlesbare Ergebnisse und Quell-/Artefaktprüfsummen](testergebnisse.json) · [Runner-Ausgaben](nachweise/) · [Restliste](restliste.md) · [Historischer Bericht Runde 1](testbericht-runde1.md)
