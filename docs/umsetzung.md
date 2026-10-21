# Umsetzung und prüfbare Grenzen

Alle 24 gelieferten Missionen sind für Förder, ESA, MSA und AHR angebunden. Die 96 Varianten bestehen aus 240 Lernschritten. Die Original-JSON-Dateien sind unverändert übernommen. Ihre historischen Statusangaben beschreiben die Spezifikation vor der Programmierung; der Laufzeittestbericht steht separat in `testbericht.md`.

Die vier Bereiche enthalten jeweils sechs Missionen. Die interne P/Z-Klassifikation und Teilantwortbilanz werden nicht auf Schülerbildschirmen angezeigt. Die bereitgestellte Abdeckungsmatrix gilt weiterhin. Der Validator berechnet die tatsächlichen Mengen; es wurden keine zusätzlichen Klicks als Fachleistungen gezählt.

## Antwortprüfung

Geschlossene Antworten prüfen stabile IDs. Reihenfolgen müssen alle Karten genau einmal enthalten. Die Karten beginnen ohne vorbelegte Reihenfolge. Zuordnungen lassen sich tauschen und entfernen; richtige Teilzuordnungen bleiben stehen. Förder zeigt anatomische Markierungen in Gruppen von höchstens drei Feldern. MSA/AHR starten mit Einzelwortfeldern und können sofort zur Wortbank wechseln.

Der Fachwortkorrektor vergleicht zuerst das gesamte Lernlexikon. Ein richtig geschriebenes falsches Fachwort wird nicht in die gesuchte Lösung umgedeutet. Danach gelten begrenzte Edit-Distanzen mit Eindeutigkeitsabstand. „Papille“ bleibt ein Klärungsfall; „Bogengänge“ ist beim Ziel Gleichgewichtsorgan nur ein erkannter Teil.

Inhaltsantworten verwenden eigene Regeln für Frage und Kontext. Satzteilgrenzen und Negation bleiben erhalten. Es gibt keine allgemeine Sprachinterpretation: unbekannte Grammatik, mehrdeutige Bezüge und nicht abgesicherte Ausdrucksweisen werden geklärt. Die Regeln erkennen begrenzte Begriffe und Beziehungen, keine beliebigen fachlichen Erklärungen. Die 176 synthetischen Vorgaben sind ausschließlich Testdaten und werden nicht in den Browser gebündelt.

Die Zustände `empty`, `help_requested`, `too_long` und `clarify` zählen nicht als fachlicher Fehlversuch. Überlange Texte werden nicht abgeschnitten. Eine automatische Auswahlklärung wird höchstens einmal eingeblendet; Hilfe und vollständige Lösung bleiben jederzeit erreichbar. Die manuell gewünschte Auswahl ist ebenfalls jederzeit verfügbar. Nach erfolgreicher Auswahl erscheint „Mit Auswahl geklärt“. Bei Anatomie kann direkt mit der Wortbank geklärt werden. Bekannte Gegenbehauptungen verhindern „richtig“; unbekannte Fälle werden nicht rot als fehlendes Wissen ausgegeben.

## Bedienung und Fortschritt

Jede Ziehhandlung hat eine Tippalternative. Native Radios, Textfelder und Buttons sind per Tastatur erreichbar; Reihenfolgen haben Pfeiltasten und große Auf-/Ab-Schaltflächen. Die Optionen werden pro Aufgabe deterministisch gemischt. Ein Ändern der Antwort entfernt veraltetes Feedback. Es gibt kein automatisches Weiterblättern.

Ein Lernschritt wird erst mit „Weiter“ bzw. „Mission abschließen“ eingetragen und höchstens einmal gezählt. Die Zustände ohne Hilfe / mit Hilfe / mit Auswahl geklärt / Lösung angesehen bleiben getrennt. Fehlerzähler beruhen auf tatsächlich erkannten falschen Antworten. Empfehlungen entstehen aus bestätigten Fehlern oder ausdrücklich genutzter Hilfe, nicht allein aus Softwareunsicherheit. Es gibt höchstens zwei freiwillige Hinweise.

Gespeichert werden nur Inhaltsversion, Niveau, Missionsposition, abgeschlossene Schritt-IDs, Unterstützungsart und Fehlerzähler. Keine Namen, Texte, Zeitmessungen oder anderen personenbezogenen Daten. Die Textantworten im Hör-Protokoll bleiben nur im Arbeitsspeicher dieser Sitzung. Defekter oder fremder Speicher wird nicht als gültiger Fortschritt übernommen. Andere Anwendungen und Speicher-Keys bleiben unverändert.

Bei fachlich relevanten Inhalts- oder Bewertungsänderungen `CONTENT_VERSION` in `src/state.js` erhöhen, damit früherer Fortschritt nicht versehentlich zum neuen Inhalt passt.

## Abbildungen

Eigene SVG-Schemata, keine kopierten Bilder. Das Mittelohr ist vergrößert: Hammer am Trommelfell, Amboss dazwischen, Steigbügel vor dem Innenohr. Hörschnecke und Bogengänge sind getrennt; der eingezeichnete Hörnerv geht nur von der Hörschnecke aus. Das Modell beansprucht keine Maßstabstreue.

Im Augenschnitt liegen Hornhaut, freie Pupillenöffnung und Linse vorne. Glaskörper, innere Netzhaut und Sehnerv liegen dahinter. Die Netzhaut-Markierung endet exakt auf der gezeichneten inneren Kurve. Ringmuskel und Linsenbänder werden als eigener Hilfeausschnitt gezeigt und nicht mit der Iris gleichgesetzt. Der blinde Fleck hat eine vergrößerte schematische Darstellung.

Beide Sehtricks verwenden dasselbe SVG-Koordinatensystem: zwei Linien von jeweils 160 Einheiten und mittlere Kreise mit jeweils Radius 18. Der Messmodus zeigt gleiche Maßstäbe und die deckungsgleiche Überlagerung. Subjektive Eindrücke bleiben unbewertet. Richtungshören ist eine Draufsicht mit Nase oben und ausgeschriebenen Seiten der dargestellten Person. Bogengänge werden ausschließlich am Modell erkundet.

## Quellen und Abweichungen

Die Datei `spec/quellen-und-abweichungen.md` und der dortige Prüfbericht wurden vom Nutzer bereitgestellt. Die darin beschriebenen Original-PDFs und Unterrichtsbilder lagen diesem Implementierungslauf nicht vor und wurden von uns nicht erneut geprüft oder veröffentlicht. Die fachlichen Präzisierungen des gelieferten Auftrags wurden übernommen. Die JSON-Spezifikation und ihre Soll-Ergebnisse wurden nicht verändert, um Tests passend zu machen.

Das Spiel nutzt klassische gebündelte Skripte, lokale CSS und eingebundene Daten, kein Runtime-fetch und keine externen Laufzeitdienste. HTTPS-Unterpfad und Einzeldatei sind unterschiedliche Bereitstellungsformen. Ein fehlender WebKit-Browser, ein administrativ gesperrtes `file://` oder noch ausstehende echte Gerätetests werden im Testbericht getrennt ausgewiesen.
