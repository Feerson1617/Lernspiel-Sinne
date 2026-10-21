import test from 'node:test';
import assert from 'node:assert/strict';
import bank from '../spec/aufgabenbank.json' with { type: 'json' };
import cases from './fixtures/correction-regressions.json' with { type: 'json' };
import { evaluateStep } from '../src/evaluate.js';

// Authored expectations, independent of the implementation and the original golden corpus.
const steps = bank.tasks.flatMap(task => Object.values(task.variants).flatMap(variant => variant.steps));
for (const fixture of cases) test(`${fixture.id}: ${fixture.answer} => ${fixture.expected}`, () => {
  const step = steps.find(step => step.id === fixture.stepId);
  assert.ok(step, `Actual task ${fixture.stepId} exists`);
  assert.equal(step.type, 'bounded_text');
  assert.equal(evaluateStep(step, fixture.answer).state, fixture.expected);
});
