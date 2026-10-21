# Offene Erprobung und Bereitstellung

- Echte Schülerinnen und Schüler: Verständlichkeit, Arbeitsmenge und Bearbeitungsdauer im Klassenraum erproben. Bisher keine gemessene Lerngruppenzeit, keine Garantie einer Maximaldauer.
- Echte iPads mit Safari und Bildschirmtastatur: hoch-/querformatige Bedienung und längere Antworten prüfen. Chromium-Touch-Emulation und verkleinerte Viewports ersetzen diesen Gerätetest nicht.
- WebKit ist in dieser Cloud-Umgebung nicht installiert. Der CI-Workflow enthält eine WebKit-Prüfung; ein erfolgreicher externer CI-Lauf ist hier nicht belegt.
- Lokale `file://`-Aufrufe sind durch die Cloud-Chromium-Verwaltungsrichtlinie gesperrt. Multi-Datei- und Einzeldatei-Start an einem freigegebenen Desktop prüfen. Der Einzeldatei-Export wurde über HTTP geladen; anschließend wurde ein vollständiges Förder-Niveau mit blockiertem Netzwerk durchgespielt.
- Anatomische SVGs wurden als schematische Modelle visuell gegen den Auftrag kontrolliert. Vor dem Unterricht ist eine zusätzliche fachliche Sichtprüfung durch die Lehrkraft sinnvoll. Kein klinisches oder maßstabsgetreues Modell.
- Freie Formulierungen bleiben absichtlich begrenzt. Neue Schülerformulierungen nur nach fachlicher Prüfung als zusätzliche unabhängige Tests aufnehmen; unbekannte Bedeutungen weiterhin klären. Keine Aussage einer fehlerfreien allgemeinen Textkorrektur.
- Die Entwicklungsrunde wird auf einem eigenen Branch bereitgestellt und soll per Pull Request nach `main` geprüft werden. Kein automatischer Merge. Remote-CI und die Live-Veröffentlichung dieser Revision sind in der Cloud nicht belegt.
