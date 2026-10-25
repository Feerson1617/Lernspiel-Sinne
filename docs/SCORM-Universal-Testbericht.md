# Prüfbericht: universelle SCORM-Vorlage

Stand: 25.10.2026. Referenzspiel: `b4a49c2`; unveränderte SCORM-Sitzungslogik: `53edcec`.

## Lokal tatsächlich geprüft

| Prüfung | Ergebnis |
| --- | --- |
| Vollständige SCORM-Spielregression gegen neue ZIP, Chromium | 29/29 bestanden, keine Skips; darin alle 24 Aufgaben in vier Niveaus plus AHR im Popup, 149 Korrekturfälle, Hilfen, Wortbank, Speicherung, Touch und API-Fehler |
| Eigenständiges 3D-Beispiel, Chromium | 11/11 bestanden, keine Skips; HTTP/HTTPS, iframe/Popup, echte GLB-/GLTF-Ladung und Texturrendering, Modulbaum/dynamischer Import/JSON, Unterrichtsmodus, Touch |
| Spezifikation | Bestanden: 24 Aufgaben, 96 Niveauvarianten, 242 Schritte, 176 unveränderte Golden-Fälle |
| Bisherige Logiktests | 583/583 bestanden, keine Skips; darin alle 176 ursprünglichen Golden Tests |
| Sitzungslogik der Vorlage | 16/16 bestanden; unverändert aus bestehender Implementierung |
| Negative und positive Paket-/Buildprüfungen | 26/26 bestanden, darunter beide falschen Verpackungsformen, XSD, Pfade, lokale Imports, fehlende/externe Ressourcen, GLTF, Unterrichtsmodus-Vertrag und reproduzierbare ZIP-Bytes |
| Quellen-ZIP isoliert unter /tmp entpackt | npm ci, Build, 16 Sitzungs-/26 Pakettests, 11 Beispieltests und 4 generische HTTP-/HTTPS-Starttests bestanden; kein Zugriff auf Spielrepository nötig |
| Zweite HTML-Modulanwendung, unabhängig konfiguriert | 4/4 allgemeine Starttests bestanden; keine Three.js-/Sinneslabor-Abhängigkeit |
| Bisherige Spielbrowserprüfung, Chromium | 40 bestanden, 1 vorhandener file://-Skip wegen Cloud-Policy; vollständige HTTP-/HTTPS-Prüfungen bestanden |
| Originale Anwendungsdateien im neuen Paket | Hashprüfung bestanden; Start-HTML nach Entfernen der zwei Zusatzblöcke bytegleich |
| Screenshots | Chromium: texturierte Modelle sichtbar; Hochformat und Querformat ohne horizontales Überlaufen; Sitzungsleiste bedienbar |

Lokale Rohprotokolle und maschinenlesbare Ergebnisse: [nachweise/scorm-universal/ergebnisse-lokal.json](nachweise/scorm-universal/ergebnisse-lokal.json).

## GitHub Actions / WebKit

Im [Vorlagen-Workflow](https://github.com/Feerson1617/Lernspiel-Sinne/actions/workflows/scorm-universal.yml) werden sämtliche Prüfungen für den Branch `feat/scorm-universal` ausgeführt. Der isolierte Quellen-ZIP-Build einschließlich **22 Beispiel-Browsertests** und **8 allgemeinen Starttests** (jeweils Chromium + WebKit, keine Skips) ist im ersten Lauf bereits erfolgreich. Die abschließenden Spielregressionen und Artefaktrückdownloads sind im jeweiligen erfolgreichen Lauf und seinem Artefakt `Universal-Testnachweise` nachvollziehbar. Der PR verlinkt die geprüften Downloads nach Erfolg.

Der mitgelieferte eigenständige Workflow wird über sein gemeinsames Skript `scripts/workflow-build.mjs` geprüft. Ein zusätzliches GitHub-Repository wurde nicht angelegt; deshalb wurde dessen manuelles Formular dort noch nicht separat ausgeführt. Der Transport-ZIP-Prüfer wird mit dem erzeugten inneren Export ausgeführt. Die beiden tatsächlichen Artefaktrückdownloads dieses Repositories werden zusätzlich direkt in Actions geprüft.

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
