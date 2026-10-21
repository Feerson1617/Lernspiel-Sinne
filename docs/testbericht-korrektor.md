# Korrektorprüfung für Pull Request #2

Die nachgewiesenen Bewertungsfehler wurden in den beiden Korrektormodulen behoben. Navigation, Farb-Feedback, Niveaus, Wortbank, Fortschrittsspeicherung und alle 24 Aufgaben sind gegenüber `e756d4a` unverändert. Die Offline-Einzeldatei wurde neu gebaut.

- T22 unterscheidet die Nennung fehlender Zellen von Behauptungen über ihre Anwesenheit. Verneinte Anwesenheit ist richtig, verneintes Fehlen falsch. Mehrere widersprechende Behauptungen ergeben Klärungsbedarf. Doppelte oder unklare Verneinungen werden vorsichtig behandelt.
- T15 prüft Gegenbehauptungen über gleichzeitige Formen beziehungsweise gleichzeitiges Scharfsehen vor jeder positiven Bewertung. Das gilt unabhängig davon, ob die Gegenbehauptung vor oder nach der Nah-/Fern-Zuordnung steht.
- T18 prüft die zur Erweiterung benannten Iris-Muskeln einschließlich der behaupteten Pupillenwirkung. Eine Verkleinerung oder Verwechslung mit Ziliar- beziehungsweise Schließmuskel wird zurückgewiesen. Einfache Tätigkeitsantworten bleiben ausreichend.
- Kontextgebundene Ergänzungen erkennen `Augenlider`, `mehr Licht hineinlassen` und die Umwandlung von Bewegung in elektrische Signale. Die umgekehrte Umwandlungsrichtung ist falsch. Die Prüfung unbekannter Wörter bleibt aktiv.

## Tatsächlich geprüfte Ergebnisse

Die [149 neuen Sollfälle](../tests/fixtures/correction-regressions.json) wurden unabhängig von den Regeln formuliert und durch `evaluateStep` an den tatsächlichen Aufgaben geprüft. Jeder Fall ist ein eigener Node-Test. Im Browser werden alle Fälle zusätzlich über die sichtbare Eingabe und das Feedback geprüft; falsche, unvollständige und unklare Antworten müssen den Weiter-Knopf gesperrt lassen. Es gibt keine vollständigen Antworttexte aus den Tests im Laufzeitcode.

Der unveränderte Ausgangskorrektor `e756d4a` erreicht 71/149 Sollbewertungen, der korrigierte Stand **149/149**. Die [maschinenlesbaren Ergebnisse](korrektor-ergebnisse.json) enthalten sämtliche Antworten, Sollwerte, tatsächlichen Vorher-/Nachher-Werte und SHA-256-Hashes der Regeln und Prüfdaten.

| Prüfung | Ergebnis |
|---|---|
| Spezifikationsprüfung | Bestanden: 24 Aufgaben, 96 Niveauvarianten, 242 Lernschritte, zwei Themen |
| Sämtliche Logiktests | 567 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| Ursprüngliche Golden Tests, zusätzlich separat ausgeführt | 176/176 bestanden; Datei gegenüber `main` unverändert |
| Neue unabhängige Korrektor-Fälle | 149/149 bestanden |
| Chromium lokal | 40 bestanden, 0 fehlgeschlagen, 1 ausdrücklich übersprungen (`file://`-Verwaltungsrichtlinie) |
| WebKit | Ausführung über den vorhandenen GitHub-Workflow; Ergebnis in den PR-Prüfungen |
| Offline-Build | Erfolgreich neu erzeugt |

Die einzige angepasste bisherige Erwartung ist `Keine Sinneszellen` im zusätzlichen Runde-2-Test: gemäß dem präzisierten Arbeitsauftrag jetzt `correct`. Keiner der 176 ursprünglichen Golden-Testfälle wurde geändert. Ein Spezifikationsvalidator allein prüft keinen tatsächlichen Korrektor; dafür stehen die separaten Node- und UI-Tests.

WebKit lässt sich in dieser Cloud nicht herunterladen: Die offiziellen Download-Adressen antworten mit HTTP 403 `Domain forbidden`. Der vorhandene GitHub-Workflow installiert Chromium und WebKit und führt alle Browserprüfungen mit beiden Engines aus. Dessen Ergebnis ist im [bestehenden PR #2](https://github.com/Feerson1617/Lernspiel-Sinne/pull/2/checks) überprüfbar. Die verwaltete lokale Chromium-Installation sperrt `file://`; der betreffende Test wird ausdrücklich als übersprungen ausgewiesen. Der separate Offline-Test über HTTP mit anschließend blockiertem Netzwerk wird ausgeführt. Ein WebKit-Test ist kein echter iPad-Gerätetest.

## Angeforderte Einzelantworten

| Aufgabe | Antwort | Tatsächlich geprüft |
|---|---|---|
| T22 MSA und AHR | Es gibt keine Sinneszellen | `correct` |
| T22 MSA und AHR | Dort gibt es gar keine Lichtsinneszellen | `correct` |
| T22 MSA und AHR | keine Sinneszellen | `correct` |
| T22 MSA und AHR | Keine Sinneszellen am blinden Fleck | `correct` |
| T22 MSA und AHR | Dort gibt es Stäbchen und Zapfen | `incorrect` |
| T22 MSA und AHR | Am blinden Fleck sind Stäbchen und Zapfen | `incorrect` |
| T22 MSA und AHR | Stäbchen und Zapfen | `correct` |
| T15_AHR_2 | nah rund fern flach. Die Linse kann aber gleichzeitig beide Formen haben. | `incorrect` |
| T15_AHR_2 | nah rund fern flach; und sie kann beides gleichzeitig | `incorrect` |
| T15_AHR_2 | Nah rund, fern flach, und beide sind gleichzeitig scharf | `incorrect` |
| T15_AHR_2 | nah rund fern flach | `correct` |
| T15_AHR_2 | Die Linse kann nicht gleichzeitig rund und flach sein | `correct` |
| T15_AHR_2 | Bei nah wird die Linse runder, bei fern flacher | `correct` |
| T18_ESA_5 | Die Muskeln ziehen sich zusammen und die Pupille wird kleiner. | `incorrect` |
| T18_ESA_5 | ziehen sich zusammen | `correct` |
| T18_ESA_5 | die Muskeln ziehen sich zusammen | `correct` |
| T18_ESA_5 | sie spannen sich an | `correct` |
| T23_MSA_1 | Augenlider | `correct` |
| T18_MSA_1 | mehr Licht hineinlassen | `correct` |
| T20_AHR_3 | Hörschnecke wandelt Bewegung in elektrische Signale um | `correct` |

Lokale Originalprotokolle: [Spezifikation](nachweise/korrektor-spezifikation.txt), [sämtliche Logiktests](nachweise/korrektor-logik.txt), [176 Golden Tests separat](nachweise/korrektor-golden.txt), [Chromium](nachweise/korrektor-chromium.txt).
