# Prüfbericht: universelle SCORM-Vorlage

Stand: 25.10.2026. Referenzspiel: `b4a49c2`; unveränderte SCORM-Sitzungslogik: `53edcec`.

## Bereits lokal geprüft

| Prüfung | Ergebnis |
| --- | --- |
| Vollständige SCORM-Spielregression gegen neue ZIP, Chromium | 29/29 bestanden, keine Skips; darin alle 24 Aufgaben in vier Niveaus plus AHR im Popup, 149 Korrekturfälle, Hilfen, Wortbank, Speicherung, Touch und API-Fehler |
| Eigenständiges 3D-Beispiel, Chromium | 11/11 bestanden, keine Skips; HTTP/HTTPS, iframe/Popup, echte GLB-/GLTF-Ladung und Texturrendering, Modulbaum/dynamischer Import/JSON, Unterrichtsmodus, Touch |
| Sitzungslogik der Vorlage | 16/16 bestanden; unverändert aus bestehender Implementierung |
| Originale Anwendungsdateien im neuen Paket | Hashprüfung bestanden; Start-HTML nach Entfernen der zwei Zusatzblöcke bytegleich |
| Screenshots | Chromium: texturierte Modelle sichtbar; Hochformat und Querformat ohne horizontales Überlaufen; Sitzungsleiste bedienbar |

Weitere Prüfungen, der isolierte Quellen-ZIP-Test und die Remote-WebKit-Läufe werden vor Abschluss ergänzt. Maßgeblich sind die protokollierten Workflow-Ergebnisse des endgültigen Commits.

## Prüfverfahren

Die Quellen-ZIP wird in ein separates Verzeichnis entpackt und dort mit eigenem npm ci gebaut. Das enthaltene allgemeine Workflowskript prüft zunächst das 3D-Referenzbeispiel, baut dann die ausgewählte Konfiguration und startet deren tatsächliche ZIP über HTTP/HTTPS in Chromium und WebKit. Lokale Schemata erlauben XSD-Prüfung ohne Netzwerk. JS-AST, HTML-/CSS- und GLTF-Referenzen werden überprüft; dynamisch berechnete URLs verbleiben ausdrücklich im Bericht als Prüfstellen.

Die alte Golden-Testbank bleibt unverändert. Das neue Sinneslabor-Paket durchläuft dieselben SCORM-Tests wie das alte; nur der Testserver erhält eine andere ZIP. Der CI-Workflow prüft zusätzlich Original-Spieltests und unveränderte Dateien. Das fertige GitHub-Artefakt wird zurückgeladen, nach Dateiinventar verglichen und neu validiert.

## Probleme und Behandlung

- **Separat korrigierte Referenz-ZIP fehlt:** Nutzerbestätigung von Import/iPad-Start dokumentiert, kein unbelegter Bytevergleich. Keine Aussage, dass der damalige Verpackungsfehler genau im ZIP-Generator lag.
- **Bisheriger Export war spielspezifisch:** Dateibaum, konfigurierbarer Startpfad und Ressourcenaudit ergänzt; vorhandene Sitzungslogik wiederverwendet.
- **Lokale Python-/npm-Verzeichnisse schreibgeschützt:** Projektunabhängige virtuelle Umgebung bzw. freigegebenen Cache verwendet. Das ist kein Export-/LMS-Fehler.
- **Statisch berechnete URLs:** Können nicht universell bewiesen werden. Bericht weist sie aus; Browserprüfungen prüfen tatsächliche Anfragen. Künftige Anwendungen brauchen eigene Szenarien.
- **Artefakt-Verpackung:** In diesem Repository direkte Einzelartefakte mit geprüftem Root-Inventar; im eigenständigen Workflow ausdrücklich dokumentierte Transport-ZIP mit bytegeprüfter innerer Importdatei.

## Offene manuelle Abnahme

Kein echter Import dieser neuen ZIP, kein physisches iPad/Safari in dieser Entwicklungsrunde. Der bestätigte ältere Import/Start ist eine Referenz, keine Abnahme der neuen Verpackung. [Manuelle Checkliste](../scorm-template/docs/ABNAHME.md): Import, iframe/Popup, echte Touch-/Tastaturbedienung, Hintergrund/Rückkehr, Sitzungsende und LMS-Noten-/Abschlussansicht prüfen und mit ZIP-Hash dokumentieren.
