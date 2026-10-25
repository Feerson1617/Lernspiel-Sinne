import json
import os
from pathlib import Path

def counts(filename):
    report = json.loads(Path(filename).read_text())
    stats = report['stats']
    return f"{stats['expected']} bestanden, {stats['unexpected']} fehlgeschlagen, {stats['skipped']} übersprungen"

text = f'''# Mission Sinneslabor – SCORM 1.2

[Direkt hochladbares SCORM-ZIP herunterladen]({os.environ['SCORM_DOWNLOAD']})

Der Download heißt `Mission-Sinneslabor-SCORM-1.2.zip`. Das Manifest liegt direkt
im ZIP-Hauptverzeichnis; kein zusätzliches Paket muss daraus entpackt werden.
Die Dateiinhalte des heruntergeladenen Actions-Artefakts wurden erneut verglichen
und das Paket nach dem Herunterladen erneut validiert.

- Bisherige Browserprüfungen (Chromium/WebKit): {counts('test-results/browser-results.json')}
- HTTPS-SCORM-Player (Chromium/WebKit): {counts('test-results/scorm-results.json')}
- Manifest/XSD, Dateipfade, Paketressourcen und unveränderter Spielinhalt: bestanden
- Keine Noten, Antworten oder personenbezogenen LMS-Daten; kein automatisches completed/passed
- Pages-Workflow und Pages-Veröffentlichung werden durch diesen Workflow nicht verändert

**Offen:** echter Import in die schleswig-holsteinische itslearning-Installation,
physische iPads mit Safari, echte Bildschirmtastatur, Player-Sandbox und Popup-Regeln.
Die technischen Tests belegen keine bereits getestete itslearning-Kompatibilität.
Artefakte werden 90 Tage aufbewahrt; danach den Workflow erneut ausführen.
'''
with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as output: output.write(text)
