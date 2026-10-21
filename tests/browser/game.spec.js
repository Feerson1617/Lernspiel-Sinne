import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import bank from '../../spec/aufgabenbank.json' with { type: 'json' };
import { STORAGE_KEY, CONTENT_VERSION } from '../../src/state.js';

const action = (page, name) => page.locator(`[data-action="${name}"]`);
async function start(page, level = 'Foerder') {
  await page.goto('./');
  await page.locator(`[data-level="${level}"]`).click();
  await action(page, 'start').click();
}
async function openMission(page, index) {
  await action(page, 'map').click();
  await page.locator(`[data-action="mission"][data-index="${index}"]`).click();
}
async function fillPairs(page, s, pairs) {
  for (const p of pairs) {
    if (s.type === 'anatomy_recall') await page.locator(`[data-term="${p.targetId}"]`).fill(p.answerText);
    else {
      await page.locator(`[data-action="token"][data-id="${p.answerId}"]`).click();
      await page.locator(`[data-action="assign"][data-target="${p.targetId}"]`).click();
    }
  }
}
async function solve(page, s) {
  if (s.pairs) {
    const size = s.pageSize || s.pairs.length;
    for (let i = 0; i < s.pairs.length; i += size) {
      await fillPairs(page, s, s.pairs.slice(i, i + size));
      await action(page, 'check').click();
      await expect(page.locator('.feedback.correct')).toBeVisible();
      if (i + size < s.pairs.length) await action(page, 'next').click();
    }
  } else if (s.cards) {
    for (const [i, id] of s.correctOrder.entries()) {
      await page.locator(`[data-action="token"][data-id="${id}"]`).click();
      await page.locator(`[data-action="order-assign"][data-target="${i}"]`).click();
    }
    await action(page, 'check').click();
  } else if (s.options) {
    await page.locator(`input[name="answer"][value="${s.correctOptionId}"]`).check();
    await action(page, 'check').click();
  } else {
    await page.locator('[data-text]').fill(s.modelAnswer);
    await action(page, 'check').click();
  }
  await expect(page.locator('.feedback.correct')).toBeVisible();
  await action(page, 'next').click();
}

for (const level of bank.levels) test(`Full correct tour: ${level} / 24 missions`, async ({ page }) => {
  test.setTimeout(240_000);
  const errors = [], requests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4173/') && !r.url().startsWith('data:')) requests.push(r.url()); });
  await start(page, level);
  for (const t of bank.tasks) {
    await expect(page.locator('.mission-title')).toHaveText(t.title);
    if (['Foerder', 'ESA'].includes(level)) await expect(page.locator('textarea,input[type="text"]')).toHaveCount(0);
    for (const s of t.variants[level].steps) await solve(page, s);
    if (t.id === 'T20') { await expect(page.locator('.protocol li')).toHaveCount(t.variants[level].steps.length); await action(page, 'after-protocol').click(); }
    if (t.number % 6 === 0) { await expect(page.locator('.badge-large')).toBeVisible(); await action(page, 'after-badge').click(); }
  }
  await expect(page.locator('h1')).toHaveText('Mission geschafft.');
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(Object.keys(saved.levels[level].records)).toHaveLength(bank.tasks.flatMap(t => t.variants[level].steps).length);
  expect(errors).toEqual([]); expect(requests).toEqual([]);
});

for (const level of bank.levels) test(`Error, help and solution path for each of 24 missions: ${level}`, async ({ page }) => {
  test.setTimeout(180_000);
  await start(page, level);
  for (const [index, t] of bank.tasks.entries()) {
    if (index) await openMission(page, index);
    const s = t.variants[level].steps[0];
    await action(page, 'check').click(); await expect(page.locator('.feedback.empty')).toBeVisible();
    if (s.options) {
      await page.locator(`input[name="answer"][value="${s.options.find(o => o.id !== s.correctOptionId).id}"]`).check();
    } else if (s.cards) {
      for (const [i, id] of [...s.correctOrder].reverse().entries()) { await page.locator(`[data-action="token"][data-id="${id}"]`).click(); await page.locator(`[data-action="order-assign"][data-target="${i}"]`).click(); }
    } else if (s.pairs) {
      const pairs = s.pairs.slice(0, s.pageSize || s.pairs.length);
      for (const [i, p] of pairs.entries()) {
        const wrong = s.pairs[(i + 1) % s.pairs.length];
        if (s.type === 'anatomy_recall') await page.locator(`[data-term="${p.targetId}"]`).fill(wrong.answerText);
        else { await page.locator(`[data-action="token"][data-id="${wrong.answerId}"]`).click(); await page.locator(`[data-action="assign"][data-target="${p.targetId}"]`).click(); }
      }
    } else {
      const wrong = { CONE_DIFFERENCE: 'alle reagieren gleich', BRAIN: 'zur Linse', NEAR_SHAPE: 'flach', EARDRUM_MOVES: 'bleibt still', OSSICLES_TRANSMIT: 'Licht', COCHLEA_SIGNAL: 'Licht', TERM_LENS: 'Pupille', TERM_RETINA: 'Linse', FOCUS_REASON: 'nah flach fern rund' };
      await page.locator('[data-text]').fill(wrong[s.ruleId]);
    }
    await action(page, 'check').click(); await expect(page.locator('.feedback.incorrect')).toBeVisible();
    await action(page, 'help').click(); await expect(page.locator('.help-note')).toBeVisible();
    if (['Foerder', 'ESA'].includes(level)) await expect(page.locator('textarea,input[type="text"]')).toHaveCount(0);
    await action(page, 'solution').click(); await expect(page.locator('.feedback.solution')).toBeVisible();
    await expect(action(page, 'next')).toBeEnabled(); await action(page, 'next').click();
  }
});

test('Clarification is usable once, preserves uncertainty and does not store raw text', async ({ page }) => {
  await start(page, 'MSA'); await openMission(page, 14);
  await page.locator('[data-text]').fill('größer'); await action(page, 'check').click();
  await expect(page.locator('.feedback.clarify')).toBeVisible();
  await expect(page.locator('.clarification')).toBeVisible();
  await page.locator('input[name="fallback"][value="o1"]').check(); await action(page, 'check-fallback').click();
  await expect(page.locator('.feedback.correct')).toContainText('Mit Auswahl geklärt');
  await action(page, 'next').click();
  const data = await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY);
  expect(data).not.toContain('größer'); expect(JSON.parse(data).levels.MSA.records.T15_MSA_1).toEqual({ provenance: 'clarified', errors: 0 });
});

test('Edited input invalidates success; solution and errors are tracked separately', async ({ page }) => {
  await start(page, 'MSA'); await openMission(page, 14);
  await page.locator('[data-text]').fill('rund'); await action(page, 'check').click();
  await expect(action(page, 'next')).toBeEnabled();
  await page.locator('[data-text]').fill('flach');
  await expect(action(page, 'next')).toBeDisabled(); await expect(page.locator('.feedback')).toHaveCount(0);
  await action(page, 'check').click(); await action(page, 'help').click(); await action(page, 'solution').click();
  await action(page, 'next').click();
  const record = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).levels.MSA.records.T15_MSA_1, STORAGE_KEY);
  expect(record).toEqual({ provenance: 'solution', errors: 1 });
});

test('Reload, level changes, restart and duplicate completion do not inflate progress', async ({ page }) => {
  await start(page, 'ESA'); await solve(page, bank.tasks[0].variants.ESA.steps[0]);
  await page.reload(); await page.locator('[data-level="ESA"]').click(); await action(page, 'continue').click();
  await expect(page.locator('.mission-title')).toHaveText(bank.tasks[1].title);
  await openMission(page, 0); await solve(page, bank.tasks[0].variants.ESA.steps[0]);
  expect(await page.evaluate(key => Object.keys(JSON.parse(localStorage.getItem(key)).levels.ESA.records).length, STORAGE_KEY)).toBe(1);
  await action(page, 'home').click(); await page.locator('[data-level="MSA"]').click(); await expect(action(page, 'start')).toBeVisible();
  await page.locator('[data-level="ESA"]').click(); await action(page, 'restart').click(); await action(page, 'confirm-restart').click();
  expect(await page.evaluate(key => Object.keys(JSON.parse(localStorage.getItem(key)).levels.ESA.records).length, STORAGE_KEY)).toBe(0);
});

test('A physical double click only completes one step', async ({ page }) => {
  await start(page, 'ESA');
  await page.locator('input[name="answer"][value="o1"]').check(); await action(page, 'check').click();
  await action(page, 'next').dblclick();
  await expect(page.locator('.mission-title')).toHaveText(bank.tasks[1].title);
  const records = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).levels.ESA.records, STORAGE_KEY);
  expect(Object.keys(records)).toEqual(['T01_ESA_1']); await expect(action(page, 'next')).toBeDisabled();
});

test('Anatomy word bank can be opened before any failure and counts as support', async ({ page }) => {
  await start(page, 'MSA'); await openMission(page, 6); const s = bank.tasks[6].variants.MSA.steps[0];
  await expect(page.locator('[data-term]')).toHaveCount(7); await action(page, 'wordbank').click();
  await expect(page.locator('[data-term]')).toHaveCount(0);
  for (const p of s.pairs) { await page.locator(`[data-action="token"][data-id="${p.answerId}"]`).click(); await page.locator(`[data-action="assign"][data-target="${p.targetId}"]`).click(); }
  await action(page, 'check').click(); await action(page, 'next').click();
  const record = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).levels.MSA.records.T07_MSA_1, STORAGE_KEY);
  expect(record).toEqual({ provenance: 'supported', errors: 0 });
});

test('Moving a term out of a verified hidden group requires that group again', async ({ page }) => {
  await start(page, 'Foerder'); await openMission(page, 2);
  const s = bank.tasks[2].variants.Foerder.steps[0];
  await fillPairs(page, s, s.pairs.slice(0, 3)); await action(page, 'check').click(); await action(page, 'next').click();
  await page.locator('[data-action="token"][data-id="a1"]').click();
  await page.locator('[data-action="assign"][data-target="ossicles"]').click();
  await fillPairs(page, s, s.pairs.slice(3)); await action(page, 'check').click();
  await expect(action(page, 'next')).toHaveText('Weitere Markierungen'); await action(page, 'next').click();
  await expect(page.locator('.mission-title')).toHaveText(bank.tasks[2].title);
  await expect(page.locator('[data-action="assign"][data-target="pinna"]')).toContainText('Begriff hier einsetzen');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).levels.Foerder.records.T03_Foerder_1, STORAGE_KEY)).toBeUndefined();
});

test('Blocked and corrupt storage still allow play; other application data survives', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }); });
  await start(page); await expect(page.locator('.storage-notice')).toContainText('nicht dauerhaft'); await solve(page, bank.tasks[0].variants.Foerder.steps[0]);
});
test('Corrupt and stale progress are rejected', async ({ page }) => {
  await page.goto('./');
  for (const value of ['{bad', JSON.stringify({ version: 'old', levels: {} }), JSON.stringify({ version: CONTENT_VERSION, levels: { ESA: { cursor: 999, records: {} } } })]) {
    await page.evaluate(([key, value]) => { localStorage.setItem(key, value); localStorage.setItem('other-app', 'preserve'); }, [STORAGE_KEY, value]);
    await page.reload(); await expect(page.locator('.storage-notice')).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('other-app'))).toBe('preserve');
    await action(page, 'start').click(); await expect(page.locator('.mission-title')).toBeVisible();
  }
});

test('Tap, drag, swap, remove, keyboard sorting, cancellation and partial success', async ({ page }) => {
  await start(page, 'ESA'); await openMission(page, 6);
  const s = bank.tasks[6].variants.ESA.steps[0];
  // Real pointer drag rather than a direct application call.
  const token = page.locator('[data-action="token"][data-id="a1"]'), target = page.locator('[data-action="assign"][data-target="cornea"]');
  await token.dragTo(target); await expect(target).toContainText('Hornhaut');
  await page.locator('[data-action="token"][data-id="a2"]').click(); await target.click();
  await page.locator('[data-action="token"][data-id="a1"]').click(); await target.click(); // swaps to free a2
  for (const p of s.pairs.slice(1)) { await page.locator(`[data-action="token"][data-id="${p.answerId}"]`).click(); await page.locator(`[data-action="assign"][data-target="${p.targetId}"]`).click(); }
  // Swap only two, preserving the rest.
  await page.locator('[data-action="token"][data-id="a2"]').click(); await target.click();
  await action(page, 'check').click(); await expect(page.locator('.is-correct')).toHaveCount(5);
  await expect(page.locator('[data-target-row="lens"] .drop-target')).toContainText('Linse');
  await page.locator('[data-action="remove"][data-target="cornea"]').click(); await expect(target).toContainText('Begriff hier');
  const source = page.locator('[data-action="token"][data-id="a1"]');
  await source.hover(); await page.mouse.down(); await page.mouse.move(10, 10, { steps: 10 }); await page.keyboard.press('Escape'); await page.mouse.up();
  await expect(target).toContainText('Begriff hier');
  await openMission(page, 4);
  await page.locator('[data-action="token"][data-id="c1"]').focus(); await page.keyboard.press('Enter');
  const first = page.locator('[data-action="order-assign"][data-target="0"]'); await first.focus(); await page.keyboard.press('Enter');
  await expect(first).toContainText('Ohrmuschel'); await first.press('ArrowDown');
  await expect(page.locator('[data-action="order-assign"][data-target="1"]')).toContainText('Ohrmuschel');
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) test(`Responsive layout and visible feedback ${viewport.width}x${viewport.height}`, async ({ page }) => {
  await page.setViewportSize(viewport); await page.goto('./');
  await page.screenshot({ path: `test-results/screenshots/home-${viewport.width}.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await action(page, 'start').click(); await action(page, 'help').click();
  await expect(page.locator('.help-note')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await openMission(page, 2); await page.screenshot({ path: `test-results/screenshots/ear-${viewport.width}.png`, fullPage: true });
  await action(page, 'model').click(); await expect(page.locator('.model-scroll svg')).toBeVisible();
  await action(page, 'close-modal').click();
  await openMission(page, 6); await page.screenshot({ path: `test-results/screenshots/eye-${viewport.width}.png`, fullPage: true });
  await action(page, 'home').click(); await page.locator('[data-level="MSA"]').click(); await action(page, 'start').click(); await openMission(page, 14);
  // Reduced viewport approximates keyboard occlusion, not a claim of a physical device test.
  await page.setViewportSize({ width: viewport.width, height: Math.min(viewport.height, 450) });
  await page.locator('[data-text]').fill('runder'); await action(page, 'check').click();
  await expect(page.locator('.feedback.correct')).toBeInViewport();
});

test('Local multi-file and single-file exports work without network', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  for (const filename of ['index.html', 'Mission-Sinneslabor-offline.html']) {
    try { await page.goto(pathToFileURL(resolve('dist', filename)).href); }
    catch (error) {
      if (String(error).includes('ERR_BLOCKED_BY_ADMINISTRATOR')) test.skip(true, 'Cloud Chromium policy blocks file:// navigation; HTTP exports are tested separately.');
      throw error;
    }
    await expect(page.locator('h1')).toContainText('Sinneslabor');
    await page.route(/^https?:/, route => route.abort());
    if (await action(page, 'start').count()) await action(page, 'start').click(); else await action(page, 'continue').click();
    await action(page, 'solution').click(); await expect(action(page, 'next')).toBeEnabled();
    await page.unroute(/^https?:/);
  }
  expect(errors).toEqual([]);
});

test('Self-contained offline export plays a complete level after networking is blocked', async ({ page }) => {
  await page.goto('./Mission-Sinneslabor-offline.html');
  await page.route('**/*', route => route.abort());
  await page.locator('[data-level="Foerder"]').click(); await action(page, 'start').click();
  for (const t of bank.tasks) {
    for (const s of t.variants.Foerder.steps) await solve(page, s);
    if (t.id === 'T20') await action(page, 'after-protocol').click();
    if (t.number % 6 === 0) await action(page, 'after-badge').click();
  }
  await expect(page.locator('h1')).toHaveText('Mission geschafft.');
});

test('Touch interaction, reduced motion, keyboard navigation and safe raw text', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/Lernspiel-Sinne/');
  await expect(page.locator('[data-action="motion"]')).toHaveText('Bewegung aus');
  await page.locator('[data-level="MSA"]').tap(); await action(page, 'start').tap(); await openMission(page, 14);
  await page.locator('[data-text]').fill('<img src=x onerror=alert(1)>'); await action(page, 'check').tap();
  await expect(page.locator('.feedback.clarify')).toBeVisible(); await expect(page.locator('#answer-area img')).toHaveCount(0);
  await action(page, 'home').click(); await page.locator('[data-level="MSA"]').focus(); await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-level="AHR"]')).toHaveAttribute('aria-checked', 'true');
  await action(page, 'info').first().click(); await page.keyboard.press('Escape'); await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  await context.close();
});
