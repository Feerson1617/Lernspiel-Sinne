import { test, expect } from '@playwright/test';
import bank from '../../spec/aufgabenbank.json' with { type: 'json' };
import cases from '../fixtures/correction-regressions.json' with { type: 'json' };
import { TOPICS, isRecall } from '../../src/topics.js';
import { STORAGE_KEY } from '../../src/state.js';

const base = 'https://127.0.0.1:4175';
const action = (frame, name) => frame.locator(`[data-action="${name}"]`).first();
async function launch(page, mode = 'embedded', query = '', phase = 'active') {
  await page.goto(`${base}/player.html?mode=${mode}${query}`);
  let content;
  if (mode === 'popup') {
    const popup = page.waitForEvent('popup'); await page.locator('#launch').click(); content = await popup;
  } else {
    await expect.poll(() => page.frames().some(frame => frame.url().includes('/content/index.html'))).toBe(true);
    content = page.frames().find(frame => frame.url().includes('/content/index.html'));
  }
  await expect(content.locator('#scorm-session')).toHaveAttribute('data-state', phase);
  return content;
}
async function trace(page) { return page.evaluate(() => ({ calls, status: lessonStatus, active: activeSession })); }
function privateDataAbsent(calls) {
  expect(calls.filter(c => c[0] === 'LMSSetValue')).toEqual([['LMSSetValue', 'cmi.core.lesson_status', 'incomplete']]);
  expect(calls.filter(c => c[0] === 'LMSGetValue').every(c => c[1] === 'cmi.core.lesson_status')).toBe(true);
  expect(calls.every(c => ['LMSInitialize', 'LMSGetValue', 'LMSSetValue', 'LMSCommit', 'LMSFinish'].includes(c[0]))).toBe(true);
}
async function start(content, level) {
  await content.locator(`[data-level="${level}"]`).click(); await action(content, 'start').click();
}
async function openTask(content, id) {
  await action(content, 'map').click();
  const menu = content.locator(`.topic-menu[data-topic="${TOPICS.find(topic => topic.tasks.includes(id)).id}"]`);
  if (!await menu.evaluate(el => el.open)) await menu.locator('summary').click();
  await menu.locator(`[data-index="${bank.tasks.findIndex(task => task.id === id)}"]`).click();
}
async function solve(content, step) {
  if (step.pairs) {
    const size = step.pageSize || step.pairs.length;
    for (let i = 0; i < step.pairs.length; i += size) {
      for (const pair of step.pairs.slice(i, i + size)) {
        if (isRecall(step)) await content.locator(`[data-term="${pair.targetId}"]`).fill(pair.answerText);
        else {
          await content.locator(`[data-action="token"][data-id="${pair.answerId}"]`).click();
          await content.locator(`[data-action="assign"][data-target="${pair.targetId}"]`).click();
        }
      }
      await action(content, 'check').click(); await expect(content.locator('.feedback.correct')).toBeVisible();
      if (i + size < step.pairs.length) await action(content, 'next').click();
    }
  } else if (step.cards) {
    for (const [i, id] of step.correctOrder.entries()) {
      await content.locator(`[data-action="token"][data-id="${id}"]`).click();
      await content.locator(`[data-action="order-assign"][data-target="${i}"]`).click();
    }
    await action(content, 'check').click();
  } else if (step.options) {
    await content.locator(`input[name="answer"][value="${step.correctOptionId}"]`).check(); await action(content, 'check').click();
  } else {
    await content.locator('[data-text]').fill(step.modelAnswer); await action(content, 'check').click();
  }
  await expect(content.locator('.feedback.correct')).toBeVisible(); await action(content, 'next').click();
}

for (const [mode, level] of [...bank.levels.map(level => ['embedded', level]), ['popup', 'AHR']]) {
  test(`Packaged game complete: ${mode} / ${level} / all 24 tasks`, async ({ page, context }) => {
    test.setTimeout(300_000);
    const errors = [], external = [];
    context.on('page', opened => opened.on('pageerror', error => errors.push(error.message)));
    page.on('pageerror', error => errors.push(error.message));
    context.on('request', request => { if (!request.url().startsWith(base + '/') && !request.url().startsWith('data:')) external.push(request.url()); });
    const content = await launch(page, mode);
    await context.route('**/*', route => route.abort()); // All game resources already loaded from the ZIP.
    await start(content, level); await openTask(content, 'T01');
    for (const task of TOPICS.flatMap(topic => topic.tasks.map(id => bank.tasks.find(task => task.id === id)))) {
      if (!await content.locator('.mission-title').count()) await openTask(content, task.id);
      await expect(content.locator('.mission-title')).toHaveText(task.title);
      for (const step of task.variants[level].steps) await solve(content, step);
    }
    await expect(content.locator('h1')).toHaveText('Alles bearbeitet!');
    const before = await trace(page); expect(before.status).toBe('incomplete'); expect(before.active).toBe(true);
    const stored = await content.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    expect(Object.keys(stored.levels[level].records)).toHaveLength(bank.tasks.flatMap(task => task.variants[level].steps).length);
    await content.locator('#scorm-exit').click(); await expect(content.locator('#scorm-session')).toHaveAttribute('data-state', 'finished');
    await expect(content.locator('#scorm-exit')).toBeDisabled();
    const after = await trace(page); expect(after.status).toBe('incomplete'); expect(after.active).toBe(false); privateDataAbsent(after.calls);
    expect(after.calls.filter(c => c[0] === 'LMSFinish')).toHaveLength(1);
    expect(errors).toEqual([]); expect(external).toEqual([]);
  });
}

for (const stepId of new Set(cases.map(c => c.stepId))) test(`SCORM player keeps all correction regressions: ${stepId}`, async ({ page }) => {
  const [taskId, level] = stepId.split('_');
  const content = await launch(page); await start(content, level); await openTask(content, taskId);
  const steps = bank.tasks.find(task => task.id === taskId).variants[level].steps;
  for (let i = 0; i < steps.findIndex(step => step.id === stepId); i++) { await action(content, 'solution').click(); await action(content, 'next').click(); }
  for (const fixture of cases.filter(c => c.stepId === stepId)) await test.step(fixture.id, async () => {
    await content.locator('[data-text]').fill(fixture.answer); await action(content, 'check').click();
    await expect(content.locator(`.feedback.${fixture.expected}`)).toBeVisible();
    if (fixture.expected === 'correct') await expect(action(content, 'next')).toBeEnabled(); else await expect(action(content, 'next')).toBeDisabled();
  });
  privateDataAbsent((await trace(page)).calls);
});

test('Nested parent API, page navigation and repeated pagehide finish once', async ({ page }) => {
  const content = await launch(page, 'nested');
  await content.evaluate(() => { window.dispatchEvent(new PageTransitionEvent('pagehide')); window.dispatchEvent(new PageTransitionEvent('pagehide')); });
  expect((await trace(page)).calls.filter(c => c[0] === 'LMSFinish')).toHaveLength(1);
  await content.goto(base + '/blank.html'); expect((await trace(page)).active).toBe(false);
});
test('Popup close communicates with opener; iframe navigation closes a live session', async ({ page }) => {
  const popup = await launch(page, 'popup'); await popup.close();
  await expect.poll(async () => (await trace(page)).active).toBe(false);
  expect((await trace(page)).calls.filter(c => c[0] === 'LMSFinish')).toHaveLength(1);
  const frame = await launch(page); await frame.goto(base + '/blank.html');
  expect((await trace(page)).active).toBe(false);
});
test('Background commits without finishing; simulated cached return reinitializes safely', async ({ page }) => {
  const content = await launch(page);
  await content.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  expect((await trace(page)).calls.filter(c => c[0] === 'LMSFinish')).toHaveLength(0);
  await content.evaluate(() => { window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })); window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })); });
  await expect(content.locator('#scorm-session')).toHaveAttribute('data-state', 'active');
  const result = await trace(page); expect(result.calls.filter(c => c[0] === 'LMSInitialize')).toHaveLength(2); expect(result.status).toBe('incomplete');
});
for (const status of ['completed', 'passed', 'incomplete']) test(`Preserves LMS-provided status ${status}`, async ({ page }) => {
  const content = await launch(page, 'embedded', '&status=' + status); await content.locator('#scorm-exit').click();
  const result = await trace(page); expect(result.status).toBe(status); expect(result.calls.filter(c => c[0] === 'LMSSetValue')).toEqual([]);
});
for (const failure of ['init', 'get', 'set', 'commit', 'finish']) test(`API ${failure} errors stay visible and do not break the game`, async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const content = await launch(page, 'embedded', '&fail=' + failure, failure === 'finish' ? 'active' : 'error');
  if (failure === 'finish') await content.locator('#scorm-exit').click();
  await expect(content.locator('#scorm-message')).toContainText('Verbindungsproblem');
  await start(content, 'MSA'); await openTask(content, 'T15');
  await content.locator('[data-text]').fill('rund'); await action(content, 'check').click(); await expect(content.locator('.feedback.correct')).toBeVisible();
  const calls = (await trace(page)).calls;
  expect(calls.every(c => c[0] !== 'LMSSetValue' || c[1] === 'cmi.core.lesson_status' && c[2] === 'incomplete')).toBe(true);
  if (failure === 'init') expect(calls.filter(c => c[0] === 'LMSFinish')).toHaveLength(0);
  expect(errors).toEqual([]);
});
test('Cross-origin API denial is handled without bypassing browser security', async ({ page }) => {
  const content = await launch(page, 'cross-origin', '', 'unavailable');
  await start(content, 'Foerder'); await openTask(content, 'T01'); await action(content, 'solution').click();
  await expect(content.locator('.feedback.solution')).toBeVisible(); expect((await trace(page)).calls).toEqual([]);
});
test('Launch without a player is usable and does not pretend to initialize SCORM', async ({ page }) => {
  await page.goto(base + '/lms/course/content/index.html');
  await expect(page.locator('#scorm-session')).toHaveAttribute('data-state', 'unavailable'); await start(page, 'ESA');
  await expect(page.locator('.topic-menu')).toHaveCount(2);
});
test('Word bank, feedback, private free text and reload preserve only local progress', async ({ page }) => {
  const content = await launch(page); await start(content, 'MSA'); await openTask(content, 'T07');
  await content.locator('[data-term="lens"]').fill('Pupille'); await action(content, 'check').click();
  await expect(content.locator('[data-target-row="lens"]')).toHaveAttribute('data-answer-state', 'incorrect');
  await action(content, 'wordbank').click(); await expect(content.locator('.word-bank')).toBeVisible(); await action(content, 'wordbank').click();
  await openTask(content, 'T15'); await content.locator('[data-text]').fill('PRIVATE-ANSWER-NEVER-SEND-4711'); await action(content, 'check').click();
  await expect(content.locator('.feedback.clarify')).toBeVisible(); await action(content, 'help').click(); await expect(content.locator('.help-note')).toBeVisible();
  await content.locator('input[name="fallback"][value="o1"]').check(); await action(content, 'check-fallback').click(); await action(content, 'next').click();
  await content.goto(base + '/lms/course/content/index.html'); await expect(content.locator('[data-level="MSA"]')).toHaveAttribute('aria-checked', 'true');
  await expect(action(content, 'continue')).toBeVisible();
  const result = await trace(page); privateDataAbsent(result.calls); expect(JSON.stringify(result.calls)).not.toContain('PRIVATE-ANSWER');
});
test('Denied browser storage still allows game play and SCORM termination', async ({ page, context }) => {
  await context.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }));
  const content = await launch(page); await expect(content.locator('.storage-notice')).toBeVisible();
  await start(content, 'ESA'); await openTask(content, 'T01'); await action(content, 'solution').click();
  await content.locator('#scorm-exit').click(); expect((await trace(page)).active).toBe(false);
});
for (const viewport of [{ width: 768, height: 1024 }, { width: 1024, height: 768 }]) test(`HTTPS tablet touch in iframe and popup: ${viewport.width}x${viewport.height}`, async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport, hasTouch: true, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  for (const mode of ['embedded', 'popup']) {
    const content = await launch(page, mode); await content.locator('[data-level="MSA"]').tap(); await action(content, 'start').tap(); await openTask(content, 'T15');
    await content.locator('[data-text]').fill('runder'); await action(content, 'check').tap(); await expect(content.locator('.feedback.correct')).toBeInViewport();
    expect(await content.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(true);
    if (mode === 'embedded') await page.screenshot({ path: testInfo.outputPath('tablet-iframe.png'), fullPage: true });
    await content.locator('#scorm-exit').tap(); expect((await trace(page)).active).toBe(false);
    if (mode === 'popup') await content.close();
  }
  await context.close();
});
