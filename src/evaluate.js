import specification from '../spec/korrekturregeln.json' with { type: 'json' };

// This module is shared by the browser and tests. It never imports the golden corpus.
export function normalize(value) {
  return String(value ?? '').normalize('NFKC').toLocaleLowerCase('de')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/\bnich\b/g, 'nicht').replace(/\s+/g, ' ').trim();
}
const words = value => normalize(value).match(/[a-z]+/g) || [];
const negative = /\b(nicht|kein[a-z]*|nie|ohne)\b/;
export function editDistance(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++) next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] !== b[j - 1]));
    row = next;
  }
  return row[b.length];
}
function inputEvent(raw) {
  const text = normalize(raw);
  if (!text) return 'empty';
  if (String(raw).length > 800) return 'too_long';
  if (/^(ich )?(weiss( ich)? nicht|keine ahnung|weiss nicht|hilfe)[.!?]*$/.test(text)) return 'help_requested';
  return null;
}
const lexicon = Object.entries(specification.anatomyLexicon).map(([term, aliases]) => ({ term, aliases: [...new Set([term, ...aliases].map(normalize))] }));
const unwrapTerm = text => text.replace(/[.!]+$/, '').replace(/^(?:(?:das ist|es ist|der gesuchte teil ist|das optische bild entsteht|es entsteht|auf der|an der|in der|die|der|das|im) )+/, '').trim();

export function evaluateTerm(raw, target) {
  const event = inputEvent(raw);
  if (event) return event;
  const text = unwrapTerm(normalize(raw));
  if (negative.test(text) || /\b(oder|und|vielleicht)\b/.test(text)) return 'clarify';
  const exact = lexicon.find(entry => entry.aliases.includes(text));
  if (exact) return exact.term === target ? 'correct' : 'incorrect';
  if (target === 'Gleichgewichtsorgan' && /^(die )?bogengaenge$/.test(text)) return 'partial';
  // Papille is an existing medical term. Never infer Pupille from spelling proximity.
  if (/\b(papille|nerv|haut|knochen)\b/.test(text)) return 'clarify';
  if (target === 'Netzhaut' && /^(im auge|auge)$/.test(text)) return 'partial';
  if (!/^[a-z]+$/.test(text) || text.length < 5) return 'clarify';
  const ranked = lexicon.map(entry => ({ term: entry.term, distance: Math.min(...entry.aliases.map(alias => editDistance(text, alias))) })).sort((a, b) => a.distance - b.distance);
  const limit = text.length <= 8 ? 1 : 2;
  if (ranked[0].distance <= limit && ranked[1].distance - ranked[0].distance >= 2) return ranked[0].term === target ? 'correct' : 'incorrect';
  return 'clarify';
}

// Polarity is local to a clause, never a global "contains nicht" decision.
function evidence(text, pattern) {
  const result = { positive: false, negative: false };
  for (const clause of text.split(/\b(?:sondern|aber|und)\b|[.,;!?:]/)) {
    if (pattern.test(clause)) result[negative.test(clause) ? 'negative' : 'positive'] = true;
  }
  return result;
}
function polarityResult(good, bad = { positive: false, negative: false }) {
  if ((good.positive && good.negative) || (good.positive && bad.positive)) return 'clarify';
  if (bad.positive || good.negative) return 'incorrect';
  if (good.positive) return 'correct';
  return null;
}
const round = /\b(rund(?:er)?|dick(?:er)?|konvex(?:er)?|(?:staerker )?gewoelbt)\b/;
const flat = /\b(flach(?:er)?|duenn(?:er)?)\b/;
const brain = /\b(gehirn|gehirrn|hirn)\b/;
const motion = /\b(schwing[a-z]*|schwinkt|wackel[a-z]*|vibrier[a-z]*|zitter[a-z]*|bewegt|bewegung[a-z]*)\b/;
const mechanical = /\b(schwingung[a-z]*|schwingugen|bewegung[a-z]*|schall)\b/;
const signal = /\b((?:nerven)?signal[a-z]*|nervensignahle|impuls[a-z]*)\b/;

function nearShape(text) {
  if (/\boder\b/.test(text)) return 'clarify';
  if (/\b(pupille|iris|hornhaut|netzhaut)\b/.test(text) && (round.test(text) || flat.test(text))) return 'incorrect';
  const good = evidence(text, round), bad = evidence(text, flat);
  const result = polarityResult(good, bad);
  if (result) return result;
  if (bad.negative || /\b(form|veraender[a-z]*|aender[a-z]*)\b/.test(text)) return 'partial';
  return 'clarify';
}
function coneDifference(text) {
  if (/\boder\b/.test(text)) return 'clarify';
  const difference = evidence(text, /\b(verschieden[a-z]*|unterschiedlich[a-z]*)\b/);
  const different = difference.positive;
  if (difference.positive && difference.negative) return 'clarify';
  if (difference.negative) return 'incorrect';
  if (/\b(jeder|jeden|typ[a-z]*)\b.*\b(nur|ausschliesslich)\b.*\beine(?: einzige)? farbe\b/.test(text)) return 'incorrect';
  if (evidence(text, /\bstaebchen\b/).positive && /\b(farb[a-z]*|drei|licht[a-z]*|typen)\b/.test(text) && !/\bzapfen[a-z]*\b/.test(text)) return 'incorrect';
  const same = evidence(text, /\b(gleich[a-z]*|ein(?:en)? zapfentyp)\b/);
  if (different && same.positive) return 'clarify';
  if (same.positive || /\bstaebchen\b.*\b(farb[a-z]*|drei)\b|\bdrei\b.*\bstaebchen\b/.test(text)) return 'incorrect';
  const color = evidence(text, /\b(farb[a-z]*|licht[a-z]*)\b/);
  if (color.negative && !different) return 'incorrect';
  if ((different && /\b(licht[a-z]*|farb[a-z]*)\b/.test(text)) || (/\brot\b/.test(text) && /\bgruen\b/.test(text) && /\bblau\b/.test(text))) return 'correct';
  if (/\b(zapfen|zapfn|drei|typ[a-z]*|reagier[a-z]*)\b/.test(text) || same.negative) return 'partial';
  return 'clarify';
}
function brainTarget(text) {
  if (/\boder\b/.test(text)) return 'clarify';
  // Explicit physical waves in a nerve are different from everyday "Ton".
  if (evidence(text, /\b(schallwellen|lichtstrahlen|lichtwellen)\b/).positive && /\bnerv[a-z]*\b|\bhoernerv\b|\bsehnerv\b/.test(text)) return 'incorrect';
  if (/\bvom? (?:dem )?(gehirn|hirn)\b.*\b(zum|zur|ins)\b.*\b(ohr|auge)\b/.test(text)) return 'incorrect';
  const good = evidence(text, brain);
  const bad = evidence(text, /\b(linse|glaskoerper|auge|ohr)\b/);
  // A subject such as Hörnerv isn't an alternative destination.
  const result = polarityResult(good, bad);
  if (result) return result;
  if (/\b(weiter|leit[a-z]*)\b/.test(text)) return 'partial';
  return 'clarify';
}
function eardrumMoves(text) {
  if (/\boder\b/.test(text)) return 'clarify';
  if (/\b(gehoerknoechelchen|hammer|amboss|steigbuegel|hoerschnecke|linse|pupille|sehnerv|hoernerv)\b/.test(text) && !/\btrom+[a-z]*fel+l?\b/.test(text)) return 'clarify';
  const good = evidence(text, motion), bad = evidence(text, /\b(still|unbewegt|licht)\b/);
  const result = polarityResult(good, bad);
  if (result) return result;
  if (/\b(weiter|gibt|geben)\b/.test(text)) return 'partial';
  return 'clarify';
}
function ossiclesTransmit(text) {
  if (/\boder\b/.test(text)) return 'clarify';
  if (/\b(hoernerv|sehnerv|linse)\b.*\b(leitet|gibt|geben|sendet)\b/.test(text) && !/\bgehoerknoechelchen\b/.test(text)) return 'incorrect';
  if (/\bvom? (?:dem )?hoernerv\b.*\btrommelfell\b/.test(text)) return 'incorrect';
  const result = polarityResult(evidence(text, mechanical), evidence(text, /\b(licht|nervensignal[a-z]*|elektrisch[a-z]*|nichts)\b/));
  if (result) return result;
  if (/\b(weiter|wackel[a-z]*|geben|gibt)\b/.test(text)) return 'partial';
  return 'clarify';
}
function cochleaSignal(text) {
  if (/\boder\b/.test(text)) return 'clarify';
  if (evidence(text, /\bschallwellen\b/).positive && /\bhoernerv\b/.test(text)) return 'incorrect';
  if (/\b(trommelfell|linse|pupille|gehoerknoechelchen)\b.*\b(erzeug[a-z]*|mach[a-z]*|entsteh[a-z]*|wandel[a-z]*)\b/.test(text) && signal.test(text) && !/\bhoerschnecke\b/.test(text)) return 'incorrect';
  const result = polarityResult(evidence(text, signal), evidence(text, /\b(licht[a-z]*|knochen)\b/));
  if (result) return result;
  if (/\b(nachricht[a-z]*|weitergeleitet)\b/.test(text)) return 'partial';
  return 'clarify';
}
function focusReason(text) {
  if (/\boder\b/.test(text)) return 'clarify';
  if (/\bpupille\b.*\blinse\b/.test(text)) return 'incorrect';
  const simultaneous = /\b(gleichzeitig|zugleich|zusammen)\b/.test(text);
  const no = negative.test(text);
  const both = /\b(beide[a-z]*|beides)\b/.test(text);
  const shapes = round.test(text) && flat.test(text);
  const differing = /\b(verschieden[a-z]*|unterschiedlich[a-z]*|andere[a-z]*)\b.*\b(form[a-z]*|gewoelbt|einstellung[a-z]*)\b/.test(text);
  // "... zugleich und nicht zugleich" makes two opposing assertions.
  if (/\b(gleichzeitig|zugleich)\b[^.!?]*\bund\b[^.!?]*\bnicht\b/.test(text)) return 'clarify';
  const simultaneousClaims = text.split(/[.,;!?:]/).filter(clause => /\b(gleichzeitig|zugleich|zusammen)\b/.test(clause) && (/\b(beide[a-z]*|beides|form[a-z]*|gewoelbt)\b/.test(clause) || (round.test(clause) && flat.test(clause))));
  if (simultaneousClaims.some(c => negative.test(c)) && simultaneousClaims.some(c => !negative.test(c))) return 'clarify';
  if (/\bnah\b[^.!?]*\bflach(?:er)?\b[^.!?]*\bfern\b[^.!?]*\brund(?:er)?\b/.test(text)) return 'incorrect';
  if (/\bfern\b[^.!?]*\brund(?:er)?\b[^.!?]*\bnah\b[^.!?]*\bflach(?:er)?\b/.test(text)) return 'incorrect';
  if (/\bnah\b[^.!?]*\b(rund(?:er)?|dick(?:er)?)\b[^.!?]*\bfern\b[^.!?]*\bflach(?:er)?\b/.test(text)) return 'correct';
  if (simultaneous && (shapes || (both && /\b(linse|form[a-z]*)\b/.test(text)) || differing)) return no ? 'correct' : 'incorrect';
  if (/\bnur\b.*\beine\b.*\b(entfernung|einstellung|form)\b/.test(text) && !no) return 'correct';
  if (/\bnah\b/.test(text) && /\bfern\b/.test(text) && differing) return 'correct';
  if (/\blinse\b|\bform\b/.test(text) || shapes || (simultaneous && no)) return 'partial';
  return 'clarify';
}

const rules = { NEAR_SHAPE: nearShape, CONE_DIFFERENCE: coneDifference, BRAIN: brainTarget, EARDRUM_MOVES: eardrumMoves, OSSICLES_TRANSMIT: ossiclesTransmit, COCHLEA_SIGNAL: cochleaSignal, FOCUS_REASON: focusReason };
// Known concepts alone must not turn unrelated prose into a correct answer.
// This small vocabulary is a conservative gate, not a language model or a word score.
const grammar = new Set('die der das den dem des ein eine einer eines einen einem sie es er ihre ihr sich beide beiden beides alle jeder ist sind sein wird werden wurde kann koennen geht gehen passt hat haben auf im in ins zum zur mit fuer durch von vom nach als am an ueber wegen und nicht sondern oder aber nein genau voellig dabei nur zugleich gleichzeitig zusammen noch auch selbst anders braucht brauchen aus zu beim vor hinter staerker stark etwas es'.split(' '));
const answerVocabulary = {
  NEAR_SHAPE: /^(linse|augenlinse|nahsehen|nah|form[a-z]*|aender[a-z]*|veraender[a-z]*|rund[a-z]*|flach[a-z]*|dick[a-z]*|duenn[a-z]*|gewoelbt|konvex[a-z]*|wuert)$/,
  CONE_DIFFERENCE: /^(zapfen[a-z]*|typen|typ|arten|art|reagier[a-z]*|unterschied[a-z]*|verschieden[a-z]*|gleich[a-z]*|drei|licht[a-z]*|farb[a-z]*|rot|gruen|blau|empfindlich|besonders|sehen|gehirn|macht)$/,
  BRAIN: /^(gehirn|gehirrn|hirn|hoernerv|sehnerv|ton|signal[a-z]*|nervensignal[a-z]*|farbeindruck|verarbeit[a-z]*|leit[a-z]*|bring[a-z]*|send[a-z]*|macht|auge|linse)$/,
  EARDRUM_MOVES: /^(trommelfell|tromelfel|schwing[a-z]*|schwinkt|wackel[a-z]*|vibrier[a-z]*|zitter[a-z]*|bewegt|bewegung[a-z]*|schall|leit[a-z]*|weiter|still|steht)$/,
  OSSICLES_TRANSMIT: /^(gehoerknoechelchen|schwingung[a-z]*|schwingugen|bewegung[a-z]*|schall|geb[a-z]*|gibt|weiter|licht|knochen)$/,
  COCHLEA_SIGNAL: /^(hoerschnecke|schwingung[a-z]*|signal[a-z]*|nervensignal[a-z]*|nervensignahle|elektrisch[a-z]*|impuls[a-z]*|entsteh[a-z]*|lichtstrahl[a-z]*|keine)$/,
  FOCUS_REASON: /^(linse|linsenform[a-z]*|form[a-z]*|einstellung[a-z]*|entfernung[a-z]*|gewoelbt|rund[a-z]*|flach[a-z]*|dick[a-z]*|duenn[a-z]*|nah[a-z]*|fern[a-z]*|stift|baum|unterschiedlich[a-z]*|verschieden[a-z]*|andere[a-z]*|eingestellt|scharf|passend|weil|dafuer)$/
};
function knownAnswerVocabulary(ruleId, text) {
  return words(text).every(token => grammar.has(token) || /^kein[a-z]*$/.test(token) || answerVocabulary[ruleId]?.test(token));
}
export function evaluateText(ruleId, raw, targetTerm, context) {
  const event = inputEvent(raw);
  if (event) return event;
  const text = normalize(raw);
  // Untrusted or instruction-like prose is not an answer to a biological question.
  if (/[<>]|\b(ignoriere|anweisung|regeln|javascript|alert)\b/.test(text)) return 'clarify';
  if (ruleId === 'ANATOMY') return evaluateTerm(raw, targetTerm);
  if (ruleId === 'TERM_LENS') return evaluateTerm(raw, 'Linse');
  if (ruleId === 'TERM_RETINA') return /^(?:das |im |auf dem )?(?:gehirn|hirn)[.!]*$/.test(text) ? 'incorrect' : evaluateTerm(raw, 'Netzhaut');
  if (ruleId === 'BRAIN') {
    const prompt = normalize(context?.prompt || '');
    if (/\bhoernerv\b/.test(prompt) && /^der sehnerv\b.*\b(leit[a-z]*|bring[a-z]*|send[a-z]*)\b/.test(text)) return 'incorrect';
    if (/\bfarbeindruck\b/.test(prompt) && /^der hoernerv\b.*\b(verarbeit[a-z]*|mach[a-z]*|erzeug[a-z]*)\b/.test(text)) return 'incorrect';
    if (/\b(gehirn|hirn)\b.*\b(send[a-z]*|leit[a-z]*)\b.*\b(zum|zur|ins|an das)\b.*\b(ohr|auge)\b/.test(text) && !negative.test(text)) return 'incorrect';
  }
  const outcome = rules[ruleId]?.(text) || 'clarify';
  return outcome === 'correct' && !knownAnswerVocabulary(ruleId, text) ? 'clarify' : outcome;
}

export function evaluateStep(step, answer) {
  if (step.type === 'bounded_text') return { state: evaluateText(step.ruleId, answer, undefined, step) };
  if (step.type === 'single_choice') return { state: !answer ? 'empty' : answer === step.correctOptionId ? 'correct' : 'incorrect' };
  if (step.type === 'ordering') {
    if (!Array.isArray(answer) || answer.length !== step.cards.length || new Set(answer).size !== step.cards.length || answer.some(id => !step.cards.some(c => c.id === id))) return { state: 'empty', parts: {} };
    const parts = Object.fromEntries(step.correctOrder.map((id, i) => [String(i), answer[i] === id ? 'correct' : 'incorrect']));
    return { state: Object.values(parts).every(s => s === 'correct') ? 'correct' : 'incorrect', parts };
  }
  const parts = Object.fromEntries(step.pairs.map(pair => [pair.targetId, step.type === 'anatomy_recall' ? evaluateText('ANATOMY', answer?.[pair.targetId], pair.answerText) : !answer?.[pair.targetId] ? 'empty' : answer[pair.targetId] === pair.answerId ? 'correct' : 'incorrect']));
  const values = Object.values(parts);
  // A bank term can only be used once; duplicate correct words can't bypass IDs.
  const assigned = Object.values(answer || {});
  const duplicate = step.type !== 'anatomy_recall' && new Set(assigned).size !== assigned.length;
  const state = values.includes('empty') ? 'empty' : values.includes('too_long') ? 'too_long' : values.includes('help_requested') ? 'help_requested' : values.every(s => s === 'correct') && !duplicate ? 'correct' : values.includes('incorrect') || duplicate ? 'incorrect' : values.includes('clarify') ? 'clarify' : 'partial';
  return { state, parts };
}

export function feedbackFor(step, result, failures = 0) {
  if (result.state === 'correct') return step.feedbackCorrect;
  const rule = specification.rules[step.ruleId || 'ANATOMY'];
  if (result.state === 'clarify') return 'Ich bin nicht sicher, was du meinst. Wähle die passende Antwort.';
  if (result.state === 'partial') return rule?.feedbackPartial || 'Ein Teil passt schon. Schau dir die übrigen Felder an.';
  if (result.state === 'empty') return 'Ergänze deine Antwort. Du kannst jederzeit Hilfe nutzen.';
  if (result.state === 'help_requested') return rule.feedbackHelpRequested;
  if (result.state === 'too_long') return rule.feedbackTooLong;
  return step.hints?.[Math.min(Math.max(0, failures - 1), 1)] || step.feedbackIncorrect;
}
