# Vorgaben und Inhaltsstand

Der aktuelle Auftrag ist `auftrag-runde-2.md`. Er ersetzt ausdrücklich Teile des ursprünglichen `auftrag-kern.md`, insbesondere die Vierer-Navigation, ESA ohne jede Texteingabe und den bisherigen MSA/AHR-Antwortumfang.

`aufgabenbank.json` und `korrekturregeln.json` enthalten die umgesetzten Änderungen. Alle 24 Aufgaben-IDs und die bisherigen Schritt-IDs sind erhalten. Zwei neue Schritt-IDs ergänzen T18 (Förder-Zweckauswahl und ESA-Irisfrage). `legacyStepIds` dokumentiert die vorherigen IDs für die Fortschrittsmigration, nicht eine zusätzliche Schüleraufgabe.

Die 176 ursprünglichen Fälle in `golden-tests.json` bleiben unverändert und werden weiter gegen die echte Laufzeitlogik ausgeführt. Weitere unabhängige Fälle stehen in `tests/round2.test.js`. Die ursprüngliche Statusformulierung der Golden-Datei ist historisch; den aktuellen Ausführungsnachweis gibt es unter `docs/testbericht.md`.

`validate_spec.py` prüft die aktualisierten Daten, Themen, Niveau-Ausnahme und deklarierte Mengen-/Zeitplanung. Dieser Strukturtest allein prüft weiterhin kein laufendes Spiel.
