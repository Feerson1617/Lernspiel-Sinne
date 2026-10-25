# Wiederverwendbare SCORM-1.2-Infrastruktur

## Ergebnis und Trennung

`scorm-template/` ist ein eigenständiges Projekt mit eigener Konfiguration, Sperrdateien, Beispielen, Tests, README, AGENTS und manuellem GitHub-Workflow. Der ursprüngliche Spielcode, alle 24 Aufgaben/vier Niveaus, Abbildungen, Hilfen, Korrekturregeln und der vorhandene Export bleiben unverändert. Auch die alte SCORM-Implementierung und der Pages-Workflow bleiben erhalten.

Die ausschließlich spielbezogene Integration befindet sich außerhalb der Vorlage:

- `integration/scorm-universal/sinneslabor.config.json`
- `scripts/build-universal.mjs`: übernimmt den vorhandenen HTML-Einzeldatei-Export bytegleich als `index.html`.
- `playwright.universal.config.js` und `scripts/serve-universal-sinneslabor.mjs`: führen die unveränderten vorhandenen SCORM-Spieltests gegen die neu erzeugte ZIP aus.
- `.github/workflows/scorm-universal.yml`: prüft Vorlage und Spiel und veröffentlicht beide Downloads.

Grundlage ist der gemergte Stand `b4a49c2` (PR #3, SCORM-Code `53edcec`). `scorm-template/runtime/session.js` ist bytegleich mit `scorm/runtime.js`. Die allgemeine Sitzungsleiste benötigt keinen `#app`-Selektor mehr. Der Verpacker und die Ressourcenprüfung wurden auf Dateibäume erweitert; die Spielauswertung wurde nicht verändert.

## Referenz und bekannte Verpackungsfrage

Der Auftraggeber bestätigt den erfolgreichen Import des korrigierten früheren Pakets in itslearning Schleswig-Holstein und dessen Start auf einem iPad. Die konkret korrigierte ZIP liegt weder als Repositorydatei noch als neuer Anhang vor; daher ist kein Bytevergleich mit ihr möglich. Der bereits vorhandene ZIP-Generator erzeugt ein Wurzelmanifest. Wo genau die berichtete zusätzliche Verpackung entstand, lässt sich ohne jene Datei nicht rekonstruieren.

Die neue Prüfung lehnt beide Fehlerformen explizit ab: `ordner/imsmanifest.xml` und eine ZIP, die nur eine weitere ZIP enthält. Das echte Upload-Artefakt wird zurückgeladen, vollständig mit dem gebauten Dateiinventar verglichen und erneut als Paket geprüft.

## Download ohne Terminal

In GitHub **Actions → SCORM Universal – Vorlage und Sinneslabor → erfolgreicher Lauf → Artifacts** öffnen. Die zwei Artefakte **einzeln** anklicken:

| Einzelner Download | Verwendung |
| --- | --- |
| `SCORM-Universalvorlage.zip` | Entpacken. Vollständiges eigenes Quellprojekt einschließlich verstecktem `.github`-Verzeichnis. Kein LMS-Paket. |
| `Sinneslabor-SCORM-Vorlagentest.zip` | Direkt und unverändert in itslearning importieren. `imsmanifest.xml` liegt im ZIP-Hauptverzeichnis. Keine weitere innere ZIP. |

Nicht „Download all artifacts“ verwenden: Ein Sammeldownload kann weitere Verpackungsebenen hinzufügen. Der Workflow lädt hier die **Inhalte** der vorab geprüften ZIPs hoch; deshalb ist die einzelne GitHub-Artefakt-ZIP bereits die jeweils gewünschte Datei. GitHub-Anmeldung erforderlich, Aufbewahrung 90 Tage. Einen vorhandenen Lauf über **Re-run all jobs** wiederholen; **Run workflow** ist nach Bereitstellung der Workflowdatei auf dem Standardbranch verfügbar. Dieser Auftrag führt keinen Merge durch.

**Unterschied zum mitgelieferten eigenständigen Workflow:** Der spätere Workflow `SCORM exportieren` verwendet bewusst ein klar benanntes Transportartefakt `SCORM-Exportdatei`. Dieses **einmal entpacken**, anschließend nur die darin enthaltene konfigurierte ZIP importieren. Das steht auch direkt in seiner Laufzusammenfassung. Der Rückdownload prüft die exakten Bytes der inneren Importdatei.

## Bauen

```sh
npm ci
npm ci --prefix scorm-template
python3 -m pip install -r scorm-template/requirements.txt
npm run build
node scripts/build-universal.mjs
cd scorm-template
npm run prepare:example
python3 scripts/release.py
```

Ergebnisse: `scorm-template/dist/SCORM-Universalvorlage.zip` und `scorm-template/dist/Sinneslabor-SCORM-Vorlagentest.zip`. Erstere wird aus einer expliziten Auswahl der Vorlagendateien erzeugt, ohne Repository-, Cache-, Zugangsdaten- oder Testserverdateien. CI entpackt sie separat, installiert ausschließlich ihre eigenen Abhängigkeiten und führt ihr Build-/Prüfsystem aus.

Für ein neues Repository: [deutsche Vorlagenanleitung](../scorm-template/README.md) und [Codex-Schritte](../scorm-template/docs/CODEX.md). Der optionale Unterrichtsmodus ist für das Sinneslabor **ausgeschaltet**, damit dessen Fortschrittsverhalten unverändert bleibt. Er wurde am eigenständigen Beispiel mit explizitem Speicheradapter getestet.

## Abnahmegrenze

Das neue Sinneslabor-Paket benötigt trotz der bestätigten älteren Referenz einen neuen echten itslearning-Import und einen physischen iPad-Test. Die automatisierte Spielregression deckt sämtliche 24 Aufgaben in vier Niveaus, Wortbank, Korrekturfeedback, Navigation, Hilfe, Speichern, Touch-Viewports und SCORM-Fehlerfälle ab. Linux-WebKit, Touchsimulation, selbstsigniertes HTTPS und Mock-LMS ersetzen die reale Abnahme nicht. Für zukünftige 3D-Projekte gelten zusätzlich deren Geräte-/GPU- und Decodergrenzen.

Prüfergebnisse: [SCORM-Universal-Testbericht.md](SCORM-Universal-Testbericht.md).
