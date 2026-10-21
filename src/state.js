import bank from '../spec/aufgabenbank.json' with { type: 'json' };
export const CONTENT_VERSION = 'sinneslabor-2.0-2026-10-21-1';
export const STORAGE_KEY = 'mission-sinneslabor.progress.v1';
export const provenanceLabels = { independent: 'Ohne Hilfe beantwortet', supported: 'Mit Hilfe beantwortet', clarified: 'Mit Auswahl geklärt', solution: 'Lösung angesehen' };
export function freshProgress() { return { version: CONTENT_VERSION, levels: {} }; }
export function levelProgress(progress, level) {
  return progress.levels[level] ||= { cursor: 0, records: {} };
}
const provenances = Object.keys(provenanceLabels);
export function validateProgress(data) {
  if (!data || data.version !== CONTENT_VERSION || !data.levels || typeof data.levels !== 'object' || Array.isArray(data.levels)) return null;
  const safe = freshProgress();
  for (const [level, state] of Object.entries(data.levels)) {
    if (!bank.levels.includes(level) || !state || !Number.isInteger(state.cursor) || state.cursor < 0 || state.cursor > 23 || !state.records || typeof state.records !== 'object') return null;
    const ids = new Set(bank.tasks.flatMap(t => t.variants[level].steps.map(s => s.id)));
    const records = {};
    for (const [id, r] of Object.entries(state.records)) {
      if (!ids.has(id) || !r || !provenances.includes(r.provenance) || !Number.isInteger(r.errors) || r.errors < 0 || r.errors > 1000) return null;
      records[id] = { provenance: r.provenance, errors: r.errors };
    }
    safe.levels[level] = { cursor: state.cursor, records };
  }
  return safe;
}
export function createStorage(getStorage = () => globalThis.localStorage) {
  let available = true;
  let message = '';
  return {
    get available() { return available; },
    get message() { return message; },
    load() {
      try {
        const storage = getStorage();
        const value = storage.getItem(STORAGE_KEY);
        if (!value) return freshProgress();
        const valid = validateProgress(JSON.parse(value));
        if (valid) return valid;
        message = 'Alter oder beschädigter Fortschritt wurde nicht übernommen. Du kannst neu starten.';
      } catch { available = false; message = 'Fortschritt wird in dieser Sitzung nicht dauerhaft gespeichert. Du kannst trotzdem spielen.'; }
      return freshProgress();
    },
    save(data) {
      try {
        const safe = validateProgress(data);
        if (!safe) throw new Error('Ungültiger Fortschritt');
        getStorage().setItem(STORAGE_KEY, JSON.stringify(safe));
        return true;
      } catch { available = false; message = 'Fortschritt wird in dieser Sitzung nicht dauerhaft gespeichert. Du kannst trotzdem spielen.'; return false; }
    }
  };
}
export function completeStep(progress, level, stepId, record) {
  const state = levelProgress(progress, level);
  if (!state.records[stepId]) state.records[stepId] = { provenance: record.provenance, errors: record.errors };
}
export function completedMissions(progress, level) {
  const records = levelProgress(progress, level).records;
  return bank.tasks.filter(t => t.variants[level].steps.every(s => records[s.id])).map(t => t.id);
}
export function recommendations(progress, level) {
  const records = levelProgress(progress, level).records;
  return bank.tasks.filter(t => t.variants[level].steps.some(s => records[s.id] && (records[s.id].errors > 0 || ['supported', 'solution'].includes(records[s.id].provenance)))).slice(0, 2);
}
export function assignUnique(assignments, targetId, answerId) {
  const next = { ...assignments };
  const previous = next[targetId];
  const other = Object.keys(next).find(id => next[id] === answerId && id !== targetId);
  if (other) { if (previous) next[other] = previous; else delete next[other]; }
  next[targetId] = answerId;
  return next;
}
export function shuffled(items, seed) {
  const result = [...items];
  let state = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 2166136261);
  for (let i = result.length - 1; i > 0; i--) { state = (Math.imul(1664525, state) + 1013904223) >>> 0; const j = state % (i + 1); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
