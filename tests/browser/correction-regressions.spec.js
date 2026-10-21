import { test, expect } from '@playwright/test';
import bank from '../../spec/aufgabenbank.json' with { type: 'json' };
import cases from '../fixtures/correction-regressions.json' with { type: 'json' };
import { TOPICS } from '../../src/topics.js';

const action = (page, name) => page.locator(`[data-action="${name}"]`).first();
// Use the shipped UI and bundled evaluator, including input reset and visible feedback.
for (const stepId of new Set(cases.map(fixture => fixture.stepId))) {
  test(`Correction regression through actual UI: ${stepId}`, async ({ page }) => {
    const [taskId, level] = stepId.split('_');
    const task = bank.tasks.find(task => task.id === taskId);
    const targetIndex = task.variants[level].steps.findIndex(step => step.id === stepId);
    await page.goto('./');
    await page.locator(`[data-level="${level}"]`).click();
    await action(page, 'start').click();
    const menu = page.locator(`.topic-menu[data-topic="${TOPICS.find(topic => topic.tasks.includes(taskId)).id}"]`);
    await menu.locator('summary').click();
    await menu.locator(`[data-action="mission"][data-index="${bank.tasks.indexOf(task)}"]`).click();
    // Earlier steps are navigation prerequisites, not the answers under test.
    for (let i = 0; i < targetIndex; i++) {
      await action(page, 'solution').click();
      await action(page, 'next').click();
    }
    for (const fixture of cases.filter(fixture => fixture.stepId === stepId)) {
      await test.step(`${fixture.id}: ${fixture.answer} => ${fixture.expected}`, async () => {
        await page.locator('[data-text]').fill(fixture.answer);
        await expect(page.locator('.feedback')).toHaveCount(0);
        await action(page, 'check').click();
        await expect(page.locator(`.feedback.${fixture.expected}`)).toBeVisible();
        if (fixture.expected === 'correct') await expect(action(page, 'next')).toBeEnabled();
        else await expect(action(page, 'next')).toBeDisabled();
      });
    }
  });
}
