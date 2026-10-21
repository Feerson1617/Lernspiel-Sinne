// Deliberately small, question-specific rules for round 2. Unknown wording is clarified.
const negation = /\b(nicht|kein[a-z]*|nie|ohne)\b/;
const clauses = text => text.split(/\b(?:sondern|aber|und)\b|[.,;!?:]/);
function evidence(text, pattern) {
  const matches = clauses(text).filter(clause => pattern.test(clause));
  return { positive: matches.some(clause => !negation.test(clause)), negative: matches.some(clause => negation.test(clause)) };
}
function contrast(text, goodPattern, badPattern, partialPattern) {
  if (/\boder\b/.test(text)) return 'clarify';
  const good = evidence(text, goodPattern), bad = evidence(text, badPattern);
  if (good.negative && bad.negative) return 'clarify';
  if (good.positive && (good.negative || bad.positive)) return 'clarify';
  if (good.negative || bad.positive) return 'incorrect';
  if (good.positive) return 'correct';
  return partialPattern?.test(text) ? 'partial' : 'clarify';
}
const common = new Set('die der das den dem des ein eine einer eines einen einem sie es er ihre ihr sich ist sind sein wird werden kann koennen auf im in ins zum zur mit fuer durch von vom nach als am an ueber wegen und nicht sondern oder aber genau dabei nur auch selbst damit so weil dann mehr mer weniger groesser kleiner macht machen kommt kommen hinein rein reinkommt reinkomt bekommt bekommen laesst lassen hilft helfen haelt halten haelt ab vor beim zu aus um etwas besonders sorgt sorgen dafuer'.split(' '));
const subjectWords = /^(iris|muskeln|muskel|irismuskeln|pupille|pupillen[a-z]*|auge|auges|licht|liht|groesse|dunkeln|dunkelheit|erweiter[a-z]*|radial[a-z]*|angeordnet[a-z]*|zusammen|zusammenzieh[a-z]*|zusamen|zieh[a-z]*|zih[a-z]*|spann[a-z]*|anspann[a-z]*|angespannt|kontrahier[a-z]*|entspann[a-z]*|schliessmuskeln?|ringfoermig[a-z]*|ziliarmuskel|ziliarmuskulatur|linsenapparat|veraender[a-z]*|erweitert|vergroessert|oeffnung|kontraktion|entspannt)$/;
const vocabularies = {
  COLOR_CELLS: /^(zapfen|zapfn|zapfe|farbzapfen|staebchen|staebchn|zellen|sinneszellen|farbensehen|sehen|farb[a-z]*|helfen)$/,
  BALANCE_FUNCTION: /^(gleichgewicht|gleichgewich|balance|aufrecht|stehen|dreh[a-z]*|kopf[a-z]*|bewegung[a-z]*|erkenn[a-z]*|haelt|linse|scharfstellen|farb[a-z]*)$/,
  BLIND_SPOT_CELLS: /^(lichtsinneszellen|sinneszellen|sineszellen|sinneszeln|sehzellen|staebchen|zapfen|fehlen|fehlt|dort|gibt|gar|vorhanden|weder|noch|blind[a-z]*|fleck|sehnerv|nerv|iris|hornhaut)$/,
  DUST_PROTECTION: /^(wimpern|wimpen|wimprn|augenlid(?:er)?|lid(?:er)?|auge|lidschluss|staub|schuetz[a-z]*|schutz|sehnerv|zapfen|linse)$/,
  PUPIL_PURPOSE: /^(hineinlassen|reinlassen)$/,
  IRIS_CONTROL: subjectWords,
  IRIS_DILATOR_ACTION: subjectWords,
  PUPIL_DARK_MECHANISM: subjectWords
};
function knownWords(rule, text) {
  return (text.match(/[a-z]+/g) || []).every(word => common.has(word) || /^kein[a-z]*$/.test(word) || vocabularies[rule]?.test(word) || rule === 'PUPIL_PURPOSE' && subjectWords.test(word));
}
const contraction = /\b(zieh[a-z]*|zih[a-z]*)\b[^.!?]*\b(zusammen|zusamen)\b|\bzusammenzieh[a-z]*\b|\b(spann[a-z]*)\b[^.!?]*\ban\b|\b(anspann[a-z]*|angespannt|kontrahier[a-z]*|kontraktion)\b/;
const relax = /\b(entspann[a-z]*|schlaff)\b/;
function wrongPupilMechanism(text) {
  return clauses(text).some(clause => {
    if (negation.test(clause)) return false;
    if (/\b(ziliarmuskel|ziliarmuskulatur|linsenmuskel)\b/.test(clause)) return true;
    return /\bschliessmuskeln?\b|\bringfoermig[a-z]*\b.*\bmuskeln?\b/.test(clause) && contraction.test(clause);
  });
}
function pupilPurpose(text) {
  if (/\b(licht|mehr)\b/.test(text) && /\baus (?:dem )?auge\b|\b(erzeugt|produziert)\b.*\blicht\b/.test(text)) return 'incorrect';
  if (/\bmacht\s+(?:mehr |eigenes )?licht\b|\blicht\b.*\b(gehirn|sehnerv)\b/.test(text)) return 'incorrect';
  return contrast(text, /\b(?:mehr|mer)\s+(?:vom\s+)?(?:licht|liht)\b/, /\bweniger\s+(?:licht|liht)\b/, /\b(pupille|groesser|licht)\b/);
}
function irisControl(text) {
  if (/\biris ist (?:ein |der )?muskel\b/.test(text)) return 'incorrect';
  return contrast(text, /\b(iris|muskel|muskeln|irismuskeln|erweiter[a-z]*)\b/, /\b(ziliarmuskel|linsenmuskel|linsenbaender|linse|netzhaut|sehnerv)\b/, /\bringmuskel\b/);
}
function pupilDarkMechanism(text) {
  if (wrongPupilMechanism(text)) return 'incorrect';
  if (clauses(text).some(c => !/\bhell\b/.test(c) && !negation.test(c) && /\bpupille\b.*\b(kleiner|verengt|verkleinert)\b/.test(c))) return 'incorrect';
  const purpose = pupilPurpose(text);
  if (purpose === 'incorrect' || purpose === 'clarify' && /\boder\b/.test(text)) return purpose;
  const structure = contrast(text, /\b(iris|irismuskeln|erweiterungsmuskel[a-z]*|schliessmuskeln?)\b/, /\b(ziliarmuskel|linse|sehnerv|netzhaut)\b/);
  if (structure === 'incorrect') return 'incorrect';
  if (structure === 'clarify' && evidence(text, /\biris\b/).negative) return 'clarify';
  if (purpose === 'correct' && structure === 'correct') return 'correct';
  return purpose === 'correct' || structure === 'correct' || purpose === 'partial' ? 'partial' : 'clarify';
}
function blindSpotMissing(text) {
  if (/\boder\b|\bnicht\s+keine\b/.test(text)) return 'clarify';
  const cells = /\b(lichtsinneszellen|sinneszellen|sineszellen|sinneszeln|sehzellen)\b/;
  const predicate = /\b(fehl[a-z]*|sind|ist|gibt|vorhanden|existier[a-z]*)\b/;
  function assertions(clause) {
    // Keep the noun coordination "Stäbchen und Zapfen" intact, but separate
    // "keine Sinneszellen und Stäbchen sind vorhanden" into its two assertions.
    const boundary = [...clause.matchAll(/\bund\b/g)].find(match => predicate.test(clause.slice(0, match.index)) && predicate.test(clause.slice(match.index + 3)));
    return boundary ? [...assertions(clause.slice(0, boundary.index)), ...assertions(clause.slice(boundary.index + 3))] : [clause];
  }
  const contrastive = /\b(aber|sondern)\b/.test(text);
  const states = text.split(/\b(?:aber|sondern)\b|[.,;!?:]/).flatMap(assertions).flatMap(clause => {
    const general = cells.test(clause), rods = /\bstaebchen\b/.test(clause), cones = /\bzapfen\b/.test(clause);
    if (!general && !rods && !cones) return [];
    const missing = /\bfehl[a-z]*\b/.test(clause);
    const present = /\b(sind|ist|gibt|vorhanden|existier[a-z]*)\b/.test(clause);
    const no = negation.test(clause) || /\bweder\b/.test(clause);
    // Evaluate the assertion before the nouns: naming cells answers "what is missing?",
    // asserting their presence does not. Negating "missing" reverses that meaning.
    if (missing && present) return ['clarify'];
    if ((clause.match(/\b(nicht|kein[a-z]*|nie|ohne)\b/g) || []).length > 1) return ['clarify'];
    if (/\bnicht (?:nur|alle)\b/.test(clause)) return [present ? 'incorrect' : 'clarify'];
    if (contrastive && no && !missing && !present) return ['clarify'];
    if (missing ? no : present && !no) return ['incorrect'];
    if (!missing && !present && /\bnicht\b/.test(clause)) return ['clarify'];
    return [general || rods && cones ? 'correct' : 'partial'];
  });
  const wrong = evidence(text, /\b(sehnerv|iris|hornhaut)\b/);
  if (states.includes('clarify') || states.includes('correct') && (states.includes('incorrect') || wrong.positive)) return 'clarify';
  if (states.includes('incorrect') || wrong.positive) return 'incorrect';
  return states.includes('correct') ? 'correct' : states.includes('partial') ? 'partial' : 'clarify';
}
function irisDilatorAction(text) {
  if (wrongPupilMechanism(text)) return 'incorrect';
  // The prompt names the dilator, so a claimed constriction contradicts this action.
  const shrinking = /\b(kleiner|vereng[a-z]*|verkleiner[a-z]*)\b/;
  const growing = /\b(groesser|erweiter[a-z]*|vergroesser[a-z]*)\b/;
  if (clauses(text).some(clause => (/\bpupille\b/.test(clause) || /\bpupille\b/.test(text) && shrinking.test(clause)) &&
    (shrinking.test(clause) && !negation.test(clause) || growing.test(clause) && negation.test(clause)))) return 'incorrect';
  // A separately named sphincter has the opposite action; its negated contraction
  // or relaxation must not negate the answer about the dilator.
  const dilatorClaims = clauses(text).filter(clause => !/\bschliessmuskeln?\b/.test(clause)).join('.');
  return contrast(dilatorClaims, contraction, relax);
}
const simpleRules = {
  COLOR_CELLS: text => contrast(text, /\b(zapfen|zapfn|zapfe|farbzapfen)\b/, /\b(staebchen|staebchn)\b/, /\b(sinneszellen|zellen)\b/),
  BALANCE_FUNCTION: text => contrast(text, /\b(gleichgewicht|gleichgewich|balance|aufrecht|dreh[a-z]*)\b/, /\b(linse|scharfstellen|farb[a-z]*)\b/),
  BLIND_SPOT_CELLS: blindSpotMissing,
  DUST_PROTECTION: text => contrast(text, /\b(wimpern|wimpen|wimprn|augenlid(?:er)?|lid(?:er)?|lidschluss)\b/, /\b(sehnerv|zapfen|linse)\b/),
  PUPIL_PURPOSE: pupilPurpose,
  IRIS_CONTROL: irisControl,
  IRIS_DILATOR_ACTION: irisDilatorAction,
  PUPIL_DARK_MECHANISM: pupilDarkMechanism
};
const chainAliases = {
  CHAIN_EAR: ['ohr', 'ohren'],
  CHAIN_MOTOR_NERVES: ['nerven zu den beinmuskeln', 'nerven zu den muskeln', 'nerven zu den beinen', 'motorische nerven', 'motorischen nerven', 'beinnerven'],
  CHAIN_LEG_MUSCLES: ['beinmuskeln', 'beinmuskel', 'beinmusklen', 'muskeln in den beinen', 'muskeln', 'muskel']
};
export function additionalRule(rule, text) {
  if (chainAliases[rule]) {
    if (negation.test(text) || /\b(oder|und)\b/.test(text)) return 'clarify';
    const term = text.replace(/[.!]+$/, '').replace(/^(die |der |das )/, '');
    if (chainAliases[rule].includes(term)) return 'correct';
    if (Object.values(chainAliases).flat().includes(term) || /^(gehirn|hirn|hoernerv|sehnerv|auge|linse)$/.test(term)) return 'incorrect';
    return /^(beine|nerven)$/.test(term) ? 'partial' : 'clarify';
  }
  const evaluate = simpleRules[rule];
  if (!evaluate) return null;
  const outcome = evaluate(text);
  return outcome === 'correct' && !knownWords(rule, text) ? 'clarify' : outcome;
}
