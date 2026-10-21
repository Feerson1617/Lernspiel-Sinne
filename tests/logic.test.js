import test from 'node:test';
import assert from 'node:assert/strict';
import bank from '../spec/aufgabenbank.json' with { type: 'json' };
import { evaluateStep, evaluateText, evaluateTerm } from '../src/evaluate.js';
import { freshProgress, completeStep, completedMissions, createStorage, STORAGE_KEY, validateProgress, assignUnique, recommendations, shuffled } from '../src/state.js';
import { ear, eye, earTargets, eyeTargets, illusions } from '../src/visuals.js';

// Independent biology fixtures: these are deliberately not derived from correctOrder/pairs.
const fixtures = {
  earFoerder: { pinna: 'Ohrmuschel', canal: 'Gehörgang', eardrum: 'Trommelfell', ossicles: 'Gehörknöchelchen', auditory: 'Hörnerv' },
  earOther: { eardrum: 'Trommelfell', malleus: 'Hammer', incus: 'Amboss', stapes: 'Steigbügel', cochlea: 'Hörschnecke', auditory: 'Hörnerv', vestibular: 'Gleichgewichtsorgan' },
  eye: { cornea: 'Hornhaut', pupil: 'Pupille', lens: 'Linse', vitreous: 'Glaskörper', retina: 'Netzhaut', iris: 'Iris', optic: 'Sehnerv' },
  T09: { first: 'Hornhaut', opening: 'Pupille', focusing: 'Linse', middle: 'Glaskörper', image: 'Netzhaut' },
  T15: { near: 'Linse runder', far: 'Linse flacher' },
  T17: { ear: 'Hörnerv', eye: 'Sehnerv' },
  orders: { T05: ['c1', 'c2', 'c3', 'c4', 'c5'], T13: ['c1', 'c2', 'c3'], T19: ['c1', 'c2', 'c3', 'c4', 'c5'] }
};
for (const t of bank.tasks) for (const [level, variant] of Object.entries(t.variants)) {
  test(`${t.id}/${level}: solution, error/help and partial assignment paths`, () => {
    for (const s of variant.steps) {
      assert.equal(evaluateStep(s, s.pairs ? {} : s.cards ? [] : '').state, 'empty');
      assert.ok(s.hints.length >= 2);
      if (s.options) {
        assert.equal(evaluateStep(s, s.correctOptionId).state, 'correct');
        assert.equal(evaluateStep(s, s.options.find(o => o.id !== s.correctOptionId).id).state, 'incorrect');
      } else if (s.cards) {
        const expected = fixtures.orders[t.id];
        assert.equal(evaluateStep(s, expected).state, 'correct');
        const bad = [...expected]; [bad[0], bad[1]] = [bad[1], bad[0]];
        assert.equal(evaluateStep(s, bad).state, 'incorrect');
        assert.equal(evaluateStep(s, expected.map(() => expected[0])).state, 'empty');
      } else if (s.pairs) {
        const fixture = t.id === 'T03' ? fixtures[level === 'Foerder' ? 'earFoerder' : 'earOther'] : t.id === 'T07' ? fixtures.eye : fixtures[t.id];
        const answer = Object.fromEntries(s.pairs.map(p => { const text = fixture[p.targetId]; assert.equal(p.answerText, text); return [p.targetId, s.type === 'anatomy_recall' ? text : s.pairs.find(x => x.answerText === text).answerId]; }));
        assert.equal(evaluateStep(s, answer).state, 'correct');
        const keys = Object.keys(answer), bad = { ...answer }; [bad[keys[0]], bad[keys[1]]] = [bad[keys[1]], bad[keys[0]]];
        const result = evaluateStep(s, bad); assert.equal(result.state, 'incorrect');
        if (keys.length > 2) assert.equal(result.parts[keys[2]], 'correct');
      } else {
        assert.equal(evaluateStep(s, s.modelAnswer).state, 'correct', s.modelAnswer);
        assert.equal(evaluateStep(s, 'etwas bisher Unbekanntes').state, 'clarify');
        assert.equal(evaluateStep(s.fallback, s.fallback.correctOptionId).state, 'correct');
      }
    }
  });
}
const extra = [
  ['NEAR_SHAPE', 'Die Linse ist nicht flacher, sondern dicker.', 'correct'],
  ['NEAR_SHAPE', 'Die Linse ist nicht dicker, sondern dünner.', 'incorrect'],
  ['NEAR_SHAPE', 'rund und nicht rund', 'clarify'],
  ['EARDRUM_MOVES', 'Es zittert durch den Schall.', 'correct'],
  ['EARDRUM_MOVES', 'Das Trommelfell bleibt nicht still.', 'clarify'],
  ['BRAIN', 'Nicht zur Linse. Ins Gehirn.', 'correct'],
  ['BRAIN', 'Er leitet die Signale nicht ins Hirn.', 'incorrect'],
  ['COCHLEA_SIGNAL', 'elektrische Nachrichten', 'partial'],
  ['OSSICLES_TRANSMIT', 'Nervensignale', 'incorrect'],
  ['CONE_DIFFERENCE', 'verschiedene Lichtbereiche', 'correct'],
  ['FOCUS_REASON', 'Nah rund, fern flach.', 'correct'],
  ['FOCUS_REASON', 'Nah flach, fern rund.', 'incorrect'],
  ['TERM_LENS', 'Retina', 'incorrect'],
  ['TERM_RETINA', 'Iris', 'incorrect'],
  ['NEAR_SHAPE', 'Lichtbereiche', 'clarify'],
  ['CONE_DIFFERENCE', 'Sie reagieren nicht unterschiedlich auf Licht.', 'incorrect'],
  ['CONE_DIFFERENCE', 'Die Typen reagieren verschieden und nicht verschieden.', 'clarify'],
  ['CONE_DIFFERENCE', 'Stäbchen reagieren auf verschiedene Lichtbereiche.', 'incorrect'],
  ['CONE_DIFFERENCE', 'Jeder Typ reagiert ausschließlich auf eine Farbe.', 'incorrect'],
  ['EARDRUM_MOVES', 'Die Linse schwingt.', 'clarify'],
  ['OSSICLES_TRANSMIT', 'Der Hörnerv leitet Schwingungen weiter.', 'incorrect'],
  ['COCHLEA_SIGNAL', 'Das Trommelfell erzeugt Nervensignale.', 'incorrect'],
  ['FOCUS_REASON', 'Fern rund, nah flach.', 'incorrect'],
  ['FOCUS_REASON', 'Die Linse kann beide Formen gleichzeitig haben. Sie kann nicht beide Formen gleichzeitig haben.', 'clarify'],
  ['FOCUS_REASON', 'Die Linse kann nur eine Form gleichzeitig haben.', 'correct'],
  ['BRAIN', 'Das Gehirn sendet die Signale zum Ohr.', 'incorrect'],
  ['BRAIN', 'Das Gehirn steht im Kühlschrank.', 'clarify'],
  ['NEAR_SHAPE', 'Die Linse ist rund. Die Erde ist flach.', 'clarify'],
  ['EARDRUM_MOVES', 'Die Banane schwingt.', 'clarify'],
  ['CONE_DIFFERENCE', 'Die Bananen reagieren auf unterschiedliche Farben.', 'clarify']
];
for (const [rule, text, state] of extra) test(`Additional context: ${rule} / ${text}`, () => assert.equal(evaluateText(rule, text), state));
test('The same BRAIN rule retains its actual question context', () => {
  const hearing = bank.tasks[19].variants.MSA.steps[2];
  assert.equal(evaluateStep(hearing, 'Der Sehnerv leitet die Signale zum Gehirn.').state, 'incorrect');
  assert.equal(evaluateStep(hearing, 'Der Hörnerv leitet die Signale zum Gehirn.').state, 'correct');
});
test('Anatomy checks all valid terms before typo correction', () => {
  assert.equal(evaluateTerm('Hörnerv', 'Sehnerv'), 'incorrect');
  assert.equal(evaluateTerm('Papille', 'Pupille'), 'clarify');
  assert.equal(evaluateTerm('Iris', 'Linse'), 'incorrect');
  assert.equal(evaluateTerm('iri', 'Iris'), 'clarify');
});
test('Persistence is versioned, idempotent and excludes raw answers', () => {
  const p = freshProgress(); const state = { provenance: 'clarified', errors: 0, rawText: 'private' };
  const s = bank.tasks[0].variants.MSA.steps[0];
  completeStep(p, 'MSA', s.id, state); completeStep(p, 'MSA', s.id, state);
  assert.deepEqual(completedMissions(p, 'MSA'), ['T01']);
  assert.deepEqual(completedMissions(p, 'ESA'), []);
  assert.equal(JSON.stringify(p).includes('private'), false);
  assert.equal(recommendations(p, 'MSA').length, 0);
  assert.equal(validateProgress({ ...p, version: 'old' }), null);
  const memory = new Map([['other-app', 'untouched']]);
  const storage = createStorage(() => ({ getItem: k => memory.get(k), setItem: (k, v) => memory.set(k, v) }));
  storage.save(p); assert.deepEqual(storage.load(), p); assert.equal(memory.get('other-app'), 'untouched');
  memory.set(STORAGE_KEY, '{broken'); assert.deepEqual(storage.load(), freshProgress());
});
test('Blocked storage never prevents a session', () => {
  const storage = createStorage(() => { throw new Error('blocked'); });
  assert.deepEqual(storage.load(), freshProgress()); assert.equal(storage.save(freshProgress()), false);
});
test('Assignments can be swapped without duplicates', () => {
  assert.deepEqual(assignUnique({ x: 'a', y: 'b' }, 'x', 'b'), { x: 'b', y: 'a' });
  assert.deepEqual(assignUnique({ x: 'a' }, 'y', 'a'), { y: 'a' });
});
test('Option order is stable per item and varies across questions', () => {
  const s = bank.tasks[0].variants.ESA.steps[0];
  assert.deepEqual(shuffled(s.options, s.id), shuffled(s.options, s.id));
  assert.ok(bank.tasks.flatMap(t => t.variants.ESA.steps).filter(s => s.options).some(s => shuffled(s.options, s.id)[0].id !== s.correctOptionId));
});
test('SVG geometry shares scale, has exact comparison lengths and valid target definitions', () => {
  assert.equal((illusions().match(/data-measure="line"/g) || []).length, 2);
  assert.ok(illusions().includes('x1="120" y1="92" x2="280" y2="92"'));
  assert.ok(illusions().includes('x1="380" y1="92" x2="540" y2="92"'));
  assert.equal((illusions().match(/r="18" fill="#db9473"/g) || []).length, 2);
  for (const t of [bank.tasks[2], bank.tasks[6]]) for (const v of Object.values(t.variants)) {
    const s = v.steps[0], targets = s.asset === 'ear' ? earTargets : eyeTargets;
    const output = s.asset === 'ear' ? ear(s.pairs) : eye(s.pairs);
    for (const pair of s.pairs) { assert.ok(targets[pair.targetId]); assert.ok(output.includes(`data-marker="${pair.targetId}"`)); assert.ok(!output.includes(pair.targetLabel)); }
  }
});
