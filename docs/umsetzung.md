# Umsetzung – Entwicklungsrunde 2

Grundlage ist `spec/auftrag-runde-2.md`; die dort ausdrücklich geänderten Anforderungen ersetzen die entsprechenden Abschnitte des Ausgangsauftrags. Alle 24 Aufgaben-IDs und alle vier Niveaus sind erhalten. Die Anwendung bleibt statisches HTML/CSS/JavaScript mit eigenen SVGs und ohne Runtime-Dienste.

## Zwei Themen statt vier Laborbereiche

Die einzige Schülernavigation besteht aus „Hören mit den Ohren“ und „Sehen mit den Augen“. Die verbindlichen je zwölf IDs stehen in `aufgabenbank.json` unter `topics`; `src/topics.js` verwendet dieselben Daten für Zuordnung und Reihenfolge. Beide Dropdowns sind in Übersicht, Aufgabe und Abschluss erreichbar. Die nächste Aufgabe bleibt im aktuellen Thema. Zwei Themenabschlüsse ersetzen die vier Zwischenabzeichen; zusätzliche Abzeichenbildschirme entfallen.

Die ursprünglich gelieferten `area`-Nummern bleiben historische Daten der Spezifikation und werden nicht mehr zur Schülernavigation ausgewertet. Der interne P/Z-Mix bleibt erhalten und wird weiterhin nicht auf Schülerbildschirmen angezeigt.

## Einheitliche Rückmeldung

Alle Feedbackflächen und Teilantworten verwenden dieselben CSS-Variablen: Grün mit Häkchen = richtig, Rot mit Kreuz = sicher falsch, Gelb mit Symbol = teilweise, unklar oder Hilfe. Noch nicht geprüfte Felder bleiben neutral. Das gilt für kleine Rückmeldetexte, Eingaberänder, Zuordnungsfelder, ausgewählte Radios und Sortierpositionen. Änderungen setzen veraltete Farben und Rückmeldungen zurück. Der Browser prüft die tatsächlich berechneten Farben und mindestens 4,5:1 Kontrast der drei Feedbackpaletten.

## Niveau und Eingabeformen

Förder bleibt vollständig ohne Textfeld. Die einfache Zweckfrage zur Pupillenerweiterung ergänzt T18. ESA hat genau eine sehr kurze Texteingabe (`T18_ESA_5`): Was tun die ausdrücklich gemeinten Muskeln zur Pupillenerweiterung? Alle anderen ESA-Aufgaben bleiben geschlossen.

MSA und AHR beginnen T03/T07 weiter mit sieben anatomischen Einzelwörtern je Organ. T09, T13, T17 und T19 verwenden nun ebenfalls selbst geschriebene, eng begrenzte Begriffe. Der gemeinsame Aufgabentyp `term_fill` prüft jedes Feld mit der zum Ziel passenden Regel. T19 unterscheidet Hörnerv, Gehirn, motorische Nerven und Beinmuskeln; Reiz und bewusste Reaktion bleiben vorgegeben.

MSA erhält kurze Inhaltsantworten anstelle vorhandener Auswahlfragen in T11, T14, T18, T22 und T23. In T18 werden Zweck und regulierende Struktur getrennt gefragt. AHR behält Farbensehen und Nah-/Fern-Erklärung und verbindet in T18 Zweck und Iris-Beteiligung. Es werden keine langen Aufsätze verlangt. Die Abdeckungsmatrix weist die neue Zahl und die ausdrücklich geschätzten Zeiten aus.

Die Wortbank lässt sich in allen sechs Begriffsaufgaben für MSA/AHR beliebig oft öffnen und schließen. Ein- und ausgeblendete Oberflächen verwenden dasselbe Antwortobjekt; selbst geschriebene Texte gehen dabei nicht verloren. Gewählte Bankbegriffe erscheinen nach dem Schließen im Textfeld. Unterstützung wird intern festgehalten und nicht als Fehler gezählt.

## Aufgabenspezifische Textkorrektur

Spiel und Tests verwenden dieselben Module `evaluate.js` und `scoped-rules.js`. Der Browser enthält keine Golden-Testantworten. Das anatomische Gesamtlexikon wird vor begrenzter Tippfehlerzuordnung geprüft; ein korrekt geschriebener falscher Begriff bleibt falsch. Keine unscharfe Korrektur von Negations- oder Gegensatzwörtern.

`FOCUS_REASON` bindet die Form zunächst an ihre jeweilige Entfernung. „nah nicht rund fern flach“ und „nah rund fern nicht flach“ sind nicht mehr richtig. Korrekt verneinte Distraktoren und die verneinte Gleichzeitigkeit bleiben möglich. Die geforderten üblichen Verbformen und Schreibvarianten sind kontrolliert ergänzt. Eine unterschiedliche Reaktion auf „Lichtstärke“ allein ist beim Farbensehen nur ein unvollständiger Ansatz.

Neue Kurzantworten besitzen eigene Regeln für Zapfen, Gleichgewicht, fehlende Lichtsinneszellen, Augenschutz, Pupillenzweck, Iris-Steuerung, Erweiterungsmuskel-Tätigkeit sowie die Stationen der Reiz-Reaktionskette. „Mehr Licht“, „Zapfn“ oder „zihen sich zusamen“ können in ihrem passenden Kontext vollständig reichen. Die gleichen Wörter im falschen fachlichen Zusammenhang sind kein automatischer Richtigkeitsnachweis.

Beim blinden Fleck wird verneinte Anwesenheit von verneintem Fehlen unterschieden: „Dort sind keine Sinneszellen“ passt; „Es fehlen keine Sinneszellen“ passt nicht. Das verkürzte „Keine Sinneszellen“ wird wegen möglicher unterschiedlicher Bedeutung geklärt. Allgemein führen unbekannte Bezüge oder Formulierungen weiter zur bedienbaren Auswahl statt zu einer voreiligen Rot-Bewertung. Die Regeln verstehen keine beliebigen Schülertexte.

Die Pupille ist eine Öffnung. Erweiterungsmuskeln der Iris ziehen sich zur Erweiterung zusammen; der ringförmige Schließmuskel verhält sich anders. Der Ziliarmuskel verändert über die Linsenbänder die Linsenform und ist nicht der Muskel zur Pupillenerweiterung. Die Regeln weisen ausdrückliche Verwechslungen zurück. Die allmähliche Empfindlichkeitsanpassung der Netzhaut bleibt als eigener Vorgang in T18 erhalten.

## Abbildung und Frage

In T04 und den situationsabhängigen Fragen von T08 verwendet die Antwortprüfung eine aus dem aktuellen Modellzustand abgeleitete Frage mit passenden stabilen Antwort-IDs und Hinweisen. Eine Zustandsänderung entfernt die vorherige Antwort und Erfolgsmeldung, wenn sich die Frage ändert. In T15 ist die Abbildung bei fest vorgegebenem Nah-/Fern-Fokus an die Frage gebunden; Vergleiche bleiben erkundbar. T18 zeigt in beiden Zeitstufen einen dunklen Raum und eine große Pupille; der Wechsel erklärt die zusätzliche Anpassung der Netzhaut.

Auf Tablets stehen Modell und Eingaben nebeneinander. Die Abbildung bleibt beim Bearbeiten langer Begriffsfelder sichtbar. Kleine Details können zusätzlich vergrößert werden. Alle Ziehhandlungen besitzen weiterhin eine Tippalternative und Tastaturbedienung. Der kurze Schüler-Infotext beschreibt nur Bedienung und Farben; technische und didaktische Grenzen stehen in dieser Dokumentation.

## Fortschritt ohne stillen Verlust

Der Speicher-Key bleibt `mission-sinneslabor.progress.v1`. `state.js` migriert die exakt bekannte vorherige Inhaltsversion `sinneslabor-2.0-2026-10-21-1` in die neue Version. Unveränderte Schritt-IDs behalten ihre Unterstützungsart und Fehlerzahlen. Früher vollständig bearbeitete Aufgaben werden zusätzlich als `legacyCompleted` übernommen. Für neue Teilfragen werden keine Antwortdatensätze erfunden: Ein alter ESA-Abschluss von T18 bleibt sichtbar, während die neue Iris-Frage beim freiwilligen Öffnen erreichbar ist.

Ein altes „bearbeitet“ ist keine Aussage, dass neue Inhalte bereits selbstständig beherrscht werden. Die Übernahme wird kurz und sichtbar mitgeteilt. Unbekannte Versionen oder beschädigte Daten werden mit Meldung abgewiesen; eine zuverlässige Migration beliebiger unbekannter Formate wird nicht behauptet. Fremde Browserdaten werden nicht gelöscht. Nach wie vor werden keine Namen, Rohtexte oder Zeitmessungen dauerhaft gespeichert oder übertragen.

Die ursprünglichen Quellen-/Prüfdokumente beschreiben die bereitgestellte didaktische Basis. Original-Klassenarbeiten und Schulbuchbilder wurden nicht veröffentlicht. Aktuelle Anwendungstests und offene Geräte-/Lerngruppenprüfungen stehen getrennt im Testbericht und in der Restliste.
