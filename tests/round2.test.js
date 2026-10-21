import test from 'node:test';
import assert from 'node:assert/strict';
import bank from '../spec/aufgabenbank.json' with { type: 'json' };
import { evaluateText, evaluateStep } from '../src/evaluate.js';
import { LEGACY_VERSION, CONTENT_VERSION, validateProgress, completedMissions, createStorage } from '../src/state.js';
import { TOPICS, isRecall, contextualStep, initialVisual, fixedFocus } from '../src/topics.js';

const cases = [
  ['FOCUS_REASON', 'nah nicht rund fern flach', 'incorrect'],
  ['FOCUS_REASON', 'nah rund fern nicht flach', 'incorrect'],
  ['FOCUS_REASON', 'nah nicht rund fern nicht flach', 'incorrect'],
  ['FOCUS_REASON', 'nah nicht flach sondern rund fern flach', 'correct'],
  ['FOCUS_REASON', 'nah rund fern nicht rund sondern flach', 'correct'],
  ['FOCUS_REASON', 'fern flach nah rund', 'correct'],
  ['FOCUS_REASON', 'nah rund und nicht rund fern flach', 'clarify'],
  ['NEAR_SHAPE', 'Linse wird gewölbter', 'correct'],
  ['NEAR_SHAPE', 'In der Nähe wird die Linse runder', 'correct'],
  ['NEAR_SHAPE', 'Sie wirt dicker', 'correct'],
  ['EARDRUM_MOVES', 'Der Schall bringt das Trommelfell zum Schwingen', 'correct'],
  ['EARDRUM_MOVES', 'Das Tromelfel wakelt', 'correct'],
  ['OSSICLES_TRANSMIT', 'Die Gehörknöchelchen übertragen die Schwingungen', 'correct'],
  ['OSSICLES_TRANSMIT', 'Sie leiten die Schwingungen weiter', 'correct'],
  ['COCHLEA_SIGNAL', 'Die Hörschnecke wandelt die Schwingungen in Nervensignale um', 'correct'],
  ['BRAIN', 'Die Signale werden zum Gehirn geleitet', 'correct'],
  ['CONE_DIFFERENCE', 'Die Zapfentypen reagieren unterschiedlich auf die Lichtstärke.', 'partial'],
  ['CONE_DIFFERENCE', 'Die Zapfentypen reagieren unterschiedlich auf Wellenlängen.', 'correct'],
  ['CONE_DIFFERENCE', 'Sie reagieren nicht auf verschiedene Lichtfarben.', 'incorrect'],
  ['COLOR_CELLS', 'Zapfen', 'correct'],
  ['COLOR_CELLS', 'Zapfn', 'correct'],
  ['COLOR_CELLS', 'Stäbchen', 'incorrect'],
  ['COLOR_CELLS', 'Nicht Stäbchen, sondern Zapfen.', 'correct'],
  ['COLOR_CELLS', 'Keine Zapfen', 'incorrect'],
  ['COLOR_CELLS', 'Zapfen und keine Zapfen', 'clarify'],
  ['COLOR_CELLS', 'Zellen', 'partial'],
  ['COLOR_CELLS', 'Banane', 'clarify'],
  ['BALANCE_FUNCTION', 'Gleichgewicht', 'correct'],
  ['BALANCE_FUNCTION', 'Gleichgewich', 'correct'],
  ['BALANCE_FUNCTION', 'Drehungen erkennen', 'correct'],
  ['BALANCE_FUNCTION', 'Aufrecht stehen', 'correct'],
  ['BALANCE_FUNCTION', 'Das Scharfstellen der Linse', 'incorrect'],
  ['BALANCE_FUNCTION', 'Kein Gleichgewicht', 'incorrect'],
  ['BALANCE_FUNCTION', 'Gleichgewicht oder Farben', 'clarify'],
  ['BLIND_SPOT_CELLS', 'Sinneszellen', 'correct'],
  ['BLIND_SPOT_CELLS', 'Lichtsinneszellen', 'correct'],
  ['BLIND_SPOT_CELLS', 'Sineszellen', 'correct'],
  ['BLIND_SPOT_CELLS', 'Stäbchen und Zapfen', 'correct'],
  ['BLIND_SPOT_CELLS', 'Sehnerv', 'incorrect'],
  ['BLIND_SPOT_CELLS', 'Zapfen', 'partial'],
  ['BLIND_SPOT_CELLS', 'Keine Sinneszellen', 'clarify'],
  ['BLIND_SPOT_CELLS', 'Dort sind keine Sinneszellen.', 'correct'],
  ['BLIND_SPOT_CELLS', 'Es fehlen keine Sinneszellen.', 'incorrect'],
  ['BLIND_SPOT_CELLS', 'Lichtsinneszellen fehlen nicht.', 'incorrect'],
  ['BLIND_SPOT_CELLS', 'Lichtsinneszellen fehlen.', 'correct'],
  ['BLIND_SPOT_CELLS', 'Lichtsinneszellen sind vorhanden.', 'incorrect'],
  ['COLOR_CELLS', 'Zapfen nicht Stäbchen', 'clarify'],
  ['DUST_PROTECTION', 'Wimpern', 'correct'],
  ['DUST_PROTECTION', 'Wimpen', 'correct'],
  ['DUST_PROTECTION', 'Das Augenlid', 'correct'],
  ['DUST_PROTECTION', 'Sehnerv', 'incorrect'],
  ['DUST_PROTECTION', 'Nicht Wimpern', 'incorrect'],
  ['PUPIL_PURPOSE', 'Mehr Licht', 'correct'],
  ['PUPIL_PURPOSE', 'Damit mehr Licht reinkommt', 'correct'],
  ['PUPIL_PURPOSE', 'Damit das Auge mehr Licht bekommt', 'correct'],
  ['PUPIL_PURPOSE', 'mer liht', 'correct'],
  ['PUPIL_PURPOSE', 'mehr Licht reinkomt', 'correct'],
  ['PUPIL_PURPOSE', 'Weniger Licht', 'incorrect'],
  ['PUPIL_PURPOSE', 'Nicht mehr Licht', 'incorrect'],
  ['PUPIL_PURPOSE', 'mehr Licht und weniger Licht', 'clarify'],
  ['PUPIL_PURPOSE', 'mehr Licht oder weniger Licht', 'clarify'],
  ['PUPIL_PURPOSE', 'Mehr Licht aus dem Auge', 'incorrect'],
  ['PUPIL_PURPOSE', 'Die Iris macht mehr Licht', 'incorrect'],
  ['PUPIL_PURPOSE', 'Die Pupille wird größer', 'partial'],
  ['IRIS_CONTROL', 'Muskeln', 'correct'],
  ['IRIS_CONTROL', 'Muskeln in der Iris', 'correct'],
  ['IRIS_CONTROL', 'Iris', 'correct'],
  ['IRIS_CONTROL', 'Der Ziliarmuskel', 'incorrect'],
  ['IRIS_CONTROL', 'Die Linse', 'incorrect'],
  ['IRIS_CONTROL', 'Ringmuskel', 'partial'],
  ['IRIS_CONTROL', 'Nicht die Iris', 'incorrect'],
  ['IRIS_CONTROL', 'Iris oder Linse', 'clarify'],
  ['IRIS_DILATOR_ACTION', 'ziehen sich zusammen', 'correct'],
  ['IRIS_DILATOR_ACTION', 'zusammenziehen', 'correct'],
  ['IRIS_DILATOR_ACTION', 'sie spannen sich an', 'correct'],
  ['IRIS_DILATOR_ACTION', 'Muskeln ziehen sich zusammen', 'correct'],
  ['IRIS_DILATOR_ACTION', 'zihen sich zusamen', 'correct'],
  ['IRIS_DILATOR_ACTION', 'entspannen sich', 'incorrect'],
  ['IRIS_DILATOR_ACTION', 'Sie ziehen sich nicht zusammen', 'incorrect'],
  ['IRIS_DILATOR_ACTION', 'Der Ziliarmuskel macht die Pupille größer', 'incorrect'],
  ['IRIS_DILATOR_ACTION', 'Der ringförmige Schließmuskel zieht sich zusammen und macht die Pupille größer', 'incorrect'],
  ['IRIS_DILATOR_ACTION', 'Sie ziehen sich zusammen und entspannen sich', 'clarify'],
  ['IRIS_DILATOR_ACTION', 'Iris', 'clarify'],
  ['PUPIL_DARK_MECHANISM', 'Damit mehr Licht ins Auge kommt. Muskeln in der Iris machen die Pupille größer.', 'correct'],
  ['PUPIL_DARK_MECHANISM', 'Mehr Licht. Iris.', 'correct'],
  ['PUPIL_DARK_MECHANISM', 'Damit mehr Licht ins Auge kommt. Der Erweiterungsmuskel zieht sich zusammen.', 'correct'],
  ['PUPIL_DARK_MECHANISM', 'Der Schließmuskel entspannt sich. Der Erweiterungsmuskel zieht sich zusammen. Mehr Licht kommt ins Auge.', 'correct'],
  ['PUPIL_DARK_MECHANISM', 'Mehr Licht', 'partial'],
  ['PUPIL_DARK_MECHANISM', 'Muskeln in der Iris', 'partial'],
  ['PUPIL_DARK_MECHANISM', 'Mehr Licht. Der Ziliarmuskel macht die Pupille größer.', 'incorrect'],
  ['PUPIL_DARK_MECHANISM', 'Mehr Licht. Die Iris macht die Pupille kleiner.', 'incorrect'],
  ['PUPIL_DARK_MECHANISM', 'Weniger Licht. Muskeln in der Iris.', 'incorrect'],
  ['PUPIL_DARK_MECHANISM', 'Mehr Licht. Iris oder Linse.', 'clarify'],
  ['CHAIN_EAR', 'Ohr', 'correct'],
  ['CHAIN_EAR', 'Auge', 'incorrect'],
  ['CHAIN_MOTOR_NERVES', 'Nerven zu den Beinmuskeln', 'correct'],
  ['CHAIN_MOTOR_NERVES', 'motorische Nerven', 'correct'],
  ['CHAIN_MOTOR_NERVES', 'Hörnerv', 'incorrect'],
  ['CHAIN_MOTOR_NERVES', 'Nerven', 'partial'],
  ['CHAIN_LEG_MUSCLES', 'Beinmusklen', 'correct'],
  ['CHAIN_LEG_MUSCLES', 'Muskeln', 'correct'],
  ['CHAIN_LEG_MUSCLES', 'Gehirn', 'incorrect'],
  ['CHAIN_LEG_MUSCLES', 'nicht Beinmuskeln', 'clarify']
];
for (const [rule, text, expected] of cases) test(`R2 ${rule}: ${text}`, () => assert.equal(evaluateText(rule, text), expected));

test('Exactly two complete themes partition all task IDs', () => {
  assert.deepEqual(TOPICS.map(t => t.tasks.length), [12, 12]);
  assert.equal(new Set(TOPICS.flatMap(t => t.tasks)).size, 24);
  assert.deepEqual(TOPICS.map(t => t.title), ['Hören mit den Ohren', 'Sehen mit den Augen']);
});
test('Level requirements: zero Förder fields, one ESA field, additional typed MSA/AHR recall', () => {
  const fields = level => bank.tasks.flatMap(t => t.variants[level].steps).filter(s => s.type === 'bounded_text' || isRecall(s));
  assert.equal(fields('Foerder').length, 0);
  assert.deepEqual(fields('ESA').map(s => s.id), ['T18_ESA_5']);
  for (const level of ['MSA','AHR']) for (const id of ['T03','T07','T09','T13','T17','T19']) assert.ok(isRecall(bank.tasks.find(t => t.id === id).variants[level].steps[0]));
});
test('Legacy completion survives the two themes without fabricating new answers', () => {
  const records = Object.fromEntries(bank.tasks.flatMap(t => t.variants.ESA.legacyStepIds).map(id => [id, { provenance: 'independent', errors: 0 }]));
  const legacy = { version: LEGACY_VERSION, levels: { ESA: { cursor: 17, records } } };
  const migrated = validateProgress(legacy);
  assert.equal(migrated.version, CONTENT_VERSION);
  assert.equal(completedMissions(migrated, 'ESA').length, 24);
  assert.equal(migrated.levels.ESA.records.T18_ESA_5, undefined);
  assert.deepEqual(migrated.levels.ESA.records, records);
  assert.equal(validateProgress(migrated).levels.ESA.legacyCompleted.length, 24);
  const storage = createStorage(() => ({getItem: () => JSON.stringify(legacy)}));
  assert.deepEqual(storage.load(), migrated); assert.match(storage.message, /bisheriger Fortschritt/);
});
test('A partial legacy task stays partial and cannot acquire a fabricated completion flag', () => {
  const legacy = { version: LEGACY_VERSION, levels: { MSA: { cursor: 2, records: { T01_MSA_1: { provenance:'supported', errors:1 } } } } };
  const migrated = validateProgress(legacy);
  assert.deepEqual(completedMissions(migrated,'MSA'), ['T01']);
  assert.equal(validateProgress({ ...migrated, levels: { MSA: { ...migrated.levels.MSA, legacyCompleted:['T03'] } } }), null);
});
test('The selected level is validated and retained without affecting progress', () => {
  const data={version:CONTENT_VERSION,selectedLevel:'MSA',levels:{}};
  assert.deepEqual(validateProgress(data),data);
  assert.equal(validateProgress({...data,selectedLevel:'unknown'}),null);
});
test('Side and brightness changes update the actual question and stable answer IDs', () => {
  const hearing = bank.tasks[3].variants.MSA.steps[0];
  assert.equal(evaluateStep(contextualStep(hearing,'T04',false),'o1').state,'correct');
  const left = contextualStep(hearing,'T04',true);
  assert.match(left.prompt,/links/); assert.equal(evaluateStep(left,'o2').state,'correct'); assert.equal(evaluateStep(left,'o1').state,'incorrect');
  const light=bank.tasks[7].variants.ESA.steps[0];
  assert.equal(contextualStep(light,'T08',true).correctOptionId,'o2');
  assert.equal(initialVisual(bank.tasks[7].variants.ESA.steps[1],'T08'),true);
  assert.equal(fixedFocus(bank.tasks[14].variants.MSA.steps[0],'T15'),false);
  assert.equal(fixedFocus(bank.tasks[14].variants.MSA.steps[1],'T15'),true);
});
