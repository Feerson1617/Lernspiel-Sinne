import test from 'node:test';
import assert from 'node:assert/strict';
import bank from '../spec/aufgabenbank.json' with { type: 'json' };
import golden from '../spec/golden-tests.json' with { type: 'json' };
import { evaluateText } from '../src/evaluate.js';
const steps = bank.tasks.flatMap(t => Object.values(t.variants).flatMap(v => v.steps));
for (const c of golden.cases) {
  test(`${c.id} ${c.ruleId}: ${c.expected}`, () => {
    const step = steps.find(s => s.id === c.itemRef);
    const target = step.pairs?.find(p => p.targetId === c.targetId)?.answerText;
    assert.equal(evaluateText(c.ruleId, c.answer, target, step), c.expected, `${c.id}: ${c.answer.slice(0, 160)}`);
  });
}
