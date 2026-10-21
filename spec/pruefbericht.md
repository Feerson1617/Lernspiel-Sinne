# Prüfbericht – Mission Sinneslabor
## Ergebnis

Der bisherige Auftrag war eine brauchbare Ideensammlung, aber noch keine widerspruchsfreie Implementierungsspezifikation. Die schwerwiegendsten Probleme betrafen die Antwortbewertung: uneinheitliche Mindestanforderungen, eine pauschale Negationsregel und ein zu großer Interpretationsraum bei Hör-Erklärungen. Außerdem war der versprochene 30-Minuten-Umfang nicht durchgerechnet. Die überarbeitete Fassung reduziert diese Risiken, garantiert aber weder eine feste Bearbeitungszeit für jedes Kind noch fehlerfreie Interpretation beliebiger Freitexte.

## 1. Biologische Korrektheit

| Befund | Änderung |
|---|---|
| Ringmuskel-Aussage in ESA/MSA fachlich missverständlich | Indirekte Wirkung über Linsenbänder; Quellenaussage nicht unbemerkt als richtig übernehmen |
| Sehnerv-Aussage ohne Hörkontext kein eindeutiger Distraktor | Sinn und Richtung im Fragetext festlegen |
| Pupille droht als lichtbrechendes Bauteil dargestellt zu werden | Öffnung; Iris als regulierender Ring; Hornhaut und Linse brechen Licht |
| Netzhautbild und Wahrnehmung vermischt | Optisches Bild auf Netzhaut, Verarbeitung im Gehirn unterscheiden |
| Dunkelanpassung im Förderweg nur Pupillengröße | Auch allmähliche Empfindlichkeitsanpassung sehr einfach zeigen |
| Zapfentypen zu exklusiven „RGB-Sensoren“ vereinfacht | Unterschiedliche Empfindlichkeiten, keine ausschließliche Ein-Farben-Zuständigkeit |
| Physische Signale im Nerv unpräzise | Elektrische Nervensignale statt Schall-/Lichtwellen; Alltagssprache nicht vorschnell bestrafen |
| Gleichzeitig nah/fern als grenzenlose absolute Aussage | Konkreter naher Stift/ferner Baum und Kennzeichnung als vereinfachtes Modell |
| Gleichgewichtsorgan auf Bogengänge reduziert | Bogengänge als Teil; nicht Gleichsetzung des Teils mit dem ganzen Organ |
| Gong als Reflex missverstehbar | Bewusstes Aufstehen; zwei verschiedene Nervenwege ausdrücklich benennen |

Keine Ionenkanäle, Wellenlängenzahlen, komplexen Reflexbahnen, Erkrankungsdiagnosen oder Neurophysiologie als Pflichtwissen. Fachliche Präzisierung bedeutet hier nicht fachliche Aufrüstung.

## 2. Sprache und Niveau

Förder/ESA sind komplett ohne Texteingabe, einschließlich Hilfen und Klärungen. Überwiegend zwei einfache Auswahlmöglichkeiten, konkrete Situationen statt abstrakter Definitionen. Die Wortauswahl bei anatomischen Bildern darf mehr Begriffe enthalten, wird aber übersichtlich angeordnet.

MSA/AHR üben das in der Arbeit geforderte freie Benennen mit Einzelwortfeldern. Eine jederzeit zugängliche Wortbank verhindert Sackgassen. Insgesamt 14 anatomische Begriffsfelder plus zwei abschließende Begriffe; daneben MSA vier bzw. AHR sieben kurze Inhaltsfelder. Das sind nicht 20 oder 23 längere Schreibaufgaben.

Hörerklärungen werden in Tätigkeit/Ziel zerlegt. AHR erhält zusätzlich die Umwandlung in Nervensignale. Beim Farbensehen werden Typenunterschied und Verarbeitung getrennt gefragt. Dieses Scaffolding ist absichtlich einfacher als ein freier Erklärungstext; die Grenze wird offengelegt.

## 3. Abdeckung und Mischung

Alle sichtbaren Anforderungen der Klassenarbeit werden in der Matrix abgedeckt. Dabei sind Wiedererkennen, freier Begriffsabruf und Erklären getrennt ausgewiesen. Der blinde Fleck wird nicht als vollständig klassenarbeitsfremd ausgegeben.

Die zwölf Zusatzmissionen behandeln nicht nur wiederholte soziale Hinweise, sondern Gehörschutz, Richtungshören, Gebärdensprache, Pupillenreaktion, zwei Illusionen, räumliches Sehen, Gleichgewicht, Hörbeeinträchtigung, Dunkelanpassung, Reiz-Reaktionskette, zugängliche Kommunikation und Augenschutz. Eine interne Teilantwortbilanz ergänzt die Anzahl der Missionen. Keine bloßen Klicks als „mehr Inhalt“ zählen.

## 4. Feedback und technische Machbarkeit

Die zentrale Änderung lautet: Nicht den Korrektor zu einem vermeintlich allgemeinen Sprachversteher machen, sondern die Aufgaben so eng stellen, dass kurze Antworten auswertbar werden. Offene Fälle erhalten eine echte, geschlossene Nachfrage.

Die Fachwortprüfung ist lexikonbasiert; inhaltliche Felder verwenden aufgabenspezifische Beziehungen. „Nicht flach, sondern rund“ ist richtig, „nicht rund, sondern flach“ falsch, ein echter Widerspruch wird geklärt. „Größer“ und „kleiner“ zur Linsenform werden nicht pauschal als falsch behandelt, weil die gemeinte Dimension offen ist.

Eine Auswahlklärung wird als solche gespeichert, nicht als sichere automatische Bestätigung des ursprünglichen Texts. Softwareunsicherheit ist kein Schülerfehler. „Lösung angesehen“ bedeutet abgeschlossen, nicht selbstständig beherrscht. Für den Entwickler liegt ein Korpus mit 176 erwarteten Ausgaben vor; noch kein ausgeführter Nachweis einer realen Korrektursoftware.

## 5. Zeitrahmen

Die Zeitbilanz ist eine Entwurfsschätzung. Sie enthält Lese- und Eingabezeit als Annahme, nicht als gemessenen Befund. Die vollständige Route soll etwa 21–25 Minuten Aufgabenzeit benötigen; mit Einstieg/Abschluss und Hilfepuffer ungefähr 25–30 Minuten. Ob dies für die konkrete Klasse reicht, muss in einer späteren Erprobung gezeigt werden. Kein Countdown darf diese offene Frage verdecken.

## 6. Technische Widersprüche beseitigt

Eine statische Website kann ohne kostenpflichtige API auskommen. Dennoch ist eine frisch aufgerufene Website nicht automatisch offline verfügbar. Der HTTPS-Unterpfad, lokaler Export und blockierter Speicher werden separat getestet. Die Anwendung muss auch ohne dauerhaftes Speichern nutzbar bleiben.

Bildschirmgrößen- und Touch-Emulation sind sinnvoll, aber kein echter iPad/Safari-Test. Anatomische Unit-Tests prüfen Daten, nicht automatisch die Lage eines Linienendpunkts. Deshalb visuelle Prüfung ergänzen. Kein „fertig und zuverlässig“ allein wegen grüner automatischer Tests.

## 7. Was tatsächlich in dieser Überarbeitung geprüft wurde

Gelesen wurden alle acht Seiten der Klassenarbeit und alle vier hochgeladenen Buch-Doppelseiten. Abweichungen von den Materialien sind in `quellen-und-abweichungen.md` erläutert. Die konkrete Aufgabenbank, Korrekturregeln und Soll-Testfälle wurden erstellt und strukturell geprüft. Der Validierungsbericht dokumentiert die tatsächlich ausgeführten Prüfungen der Spezifikation.

**Nicht durchgeführt:** Programmierung und Ausführung des Spiels, Tests eines tatsächlich implementierten Korrektors, Messung mit Schülerinnen und Schülern, echter iPad-Test. Es liegt auch kein prüfbares bestehendes Modell oder die frühere Stationsarbeit als Original vor. Das Repository wurde mit diesem Auftrag nicht verändert.

## 8. Zusätzlicher Hinweis zur Klassenarbeit selbst

Die vorgeschlagenen Ersatzformulierungen für Ringmuskel und den Hörnerv-Kontext stehen in der Quellen-/Abweichungsdatei. In mehreren Auswahlblöcken sind zwei Teilentscheidungen sichtbar, während drei Punkte ausgewiesen sind. Das kann absichtlich 1,5 Punkte je Teil sein, sollte dann aber im Erwartungshorizont transparent werden; es ist nicht automatisch ein Fehler. Die wiederholten Aufgabennummern verdienen ebenfalls eine redaktionelle Prüfung. Die PDF wurde nicht verändert.
