import { test, expect } from '@playwright/test';
import bank from '../../spec/aufgabenbank.json' with { type: 'json' };
import { TOPICS } from '../../src/topics.js';
import { LEGACY_VERSION, CONTENT_VERSION, STORAGE_KEY } from '../../src/state.js';

const action = (page, name) => page.locator(`[data-action="${name}"]`).first();
async function enter(page, level = 'MSA') {
  await page.goto('./'); await page.locator(`[data-level="${level}"]`).click(); await action(page, 'start').click();
}
async function openTask(page, id) {
  await action(page, 'map').click();
  const topic = TOPICS.find(t => t.tasks.includes(id)), menu = page.locator(`.topic-menu[data-topic="${topic.id}"]`);
  if (!await menu.evaluate(el => el.open)) await menu.locator('summary').click();
  await menu.locator(`[data-action="mission"][data-index="${bank.tasks.findIndex(t => t.id === id)}"]`).click();
}
async function fillTerms(page, step, changed = {}) {
  for (const pair of step.pairs) await page.locator(`[data-term="${pair.targetId}"]`).fill(changed[pair.targetId] ?? pair.answerText);
}

test('Two dropdowns expose all tasks, close again and remain reachable inside an activity', async ({ page }) => {
  await enter(page);
  await expect(page.locator('.topic-menu')).toHaveCount(2);
  await expect(page.locator('.topic-menu[open]')).toHaveCount(0);
  await expect(page.locator('.topic-menu [data-action="mission"]')).toHaveCount(24);
  await expect(page.locator('body')).not.toContainText(/Hörstudio|Augenlabor|Wahrnehmungslabor|Große Sinnes-Mission|Labor 04/);
  const hearing=page.locator('[data-topic="hearing"]');
  await hearing.locator('summary').click(); await expect(hearing.locator('li button:visible')).toHaveCount(12);
  await hearing.locator('summary').click(); await expect(hearing.locator('li button:visible')).toHaveCount(0);
  await openTask(page,'T07'); await expect(page.locator('.level-chip')).toHaveText('MSA');
  const inside = page.locator('[data-topic="hearing"]'); await inside.locator('summary').click();
  await inside.locator('[data-index="0"]').click(); await expect(page.locator('.mission-title')).toHaveText(bank.tasks[0].title);
  await page.locator('input[name="answer"][value="o1"]').check(); await action(page,'check').click(); await action(page,'next').click();
  await expect(page.locator('.mission-title')).toHaveText(bank.tasks[1].title);
  await action(page,'map').click(); await expect(page.locator('[data-topic="hearing"] summary')).toContainText('1 von 12');
  await expect(page.locator('[data-topic="seeing"] summary')).toContainText('0 von 12');
  await page.reload();await expect(page.locator('[data-level="MSA"]')).toHaveAttribute('aria-checked','true');
  await action(page,'continue').click();await expect(page.locator('[data-topic="hearing"] summary')).toContainText('1 von 12');
});

for (const level of ['MSA','AHR']) test(`Word bank can open/close repeatedly in all six recall activities: ${level}`, async ({ page }) => {
  await enter(page,level);
  for (const id of ['T03','T07','T09','T13','T17','T19']) {
    await openTask(page,id); const step=bank.tasks.find(t=>t.id===id).variants[level].steps[0], first=step.pairs[0];
    const input=page.locator(`[data-term="${first.targetId}"]`);
    await input.fill('Mein eigener Begriff');
    for(let i=0;i<2;i++) {
      await expect(action(page,'wordbank')).toHaveText('Wortbank öffnen'); await action(page,'wordbank').click();
      await expect(action(page,'wordbank')).toHaveText('Wortbank schließen'); await expect(page.locator('[data-term]')).toHaveCount(0);
      await action(page,'wordbank').click(); await expect(input).toHaveValue('Mein eigener Begriff');
    }
    await action(page,'wordbank').click(); await page.locator(`[data-action="token"][data-id="${first.answerId}"]`).click();
    await page.locator(`[data-action="assign"][data-target="${first.targetId}"]`).click(); await action(page,'wordbank').click();
    await expect(input).toHaveValue(first.answerText); await fillTerms(page,step);
    await action(page,'check').click(); await expect(page.locator('.feedback.correct')).toBeVisible(); await action(page,'next').click();
    const record=await page.evaluate(([key,level,id])=>JSON.parse(localStorage.getItem(key)).levels[level].records[id],[STORAGE_KEY,level,step.id]);
    expect(record).toEqual({provenance:'supported',errors:0});
  }
});

test('Correct/incorrect/partial/unclear and neutral part feedback use the same semantic colours', async ({ page }) => {
  await enter(page); await openTask(page,'T03'); const step=bank.tasks[2].variants.MSA.steps[0];
  await expect(page.locator('.target-row.is-incorrect')).toHaveCount(0); await expect(page.locator('.part-feedback')).toHaveText(step.pairs.map(()=>''));
  await fillTerms(page,step,{eardrum:'Linse'}); await action(page,'check').click();
  await expect(page.locator('.feedback.incorrect')).toHaveCSS('color','rgb(180, 35, 24)');
  await expect(page.locator('[data-target-row="eardrum"] .part-feedback')).toHaveCSS('color','rgb(180, 35, 24)');
  await expect(page.locator('[data-term="eardrum"]')).toHaveCSS('border-top-color','rgb(180, 35, 24)');
  await expect(page.locator('[data-target-row="auditory"] .part-feedback')).toHaveCSS('color','rgb(23, 101, 54)');
  await expect(page.locator('[data-target-row="eardrum"] .part-feedback')).toContainText('✕');
  await fillTerms(page,step,{vestibular:'Bogengänge'}); await action(page,'check').click();
  await expect(page.locator('.feedback.partial')).toHaveCSS('color','rgb(118, 82, 0)');
  await expect(page.locator('[data-target-row="vestibular"] .part-feedback')).toHaveCSS('color','rgb(118, 82, 0)');
  await page.locator('[data-term="vestibular"]').fill('unbekannt'); await action(page,'check').click();
  await expect(page.locator('.feedback.clarify')).toHaveCSS('color','rgb(118, 82, 0)');
  await expect(page.locator('[data-target-row="vestibular"] .part-feedback')).toHaveCSS('color','rgb(118, 82, 0)');
  await action(page,'wordbank').click(); await page.locator('[data-term="vestibular"]').fill('Gleichgewichtsorgan');
  await expect(page.locator('.feedback')).toHaveCount(0); await expect(page.locator('[data-term="vestibular"]')).toHaveAttribute('aria-invalid','false');
  await action(page,'check').click(); await expect(page.locator('.feedback.correct')).toHaveCSS('color','rgb(23, 101, 54)');
  await action(page,'help').click(); await expect(page.locator('.help-note')).toHaveCSS('color','rgb(118, 82, 0)');
  const contrast=await page.evaluate(()=>{
    const css=getComputedStyle(document.documentElement);
    const luminance=hex=>{const values=hex.trim().slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return values[0]*.2126+values[1]*.7152+values[2]*.0722;};
    return ['success','error','attention'].map(name=>{const a=luminance(css.getPropertyValue('--'+name)),b=luminance(css.getPropertyValue('--'+name+'-bg'));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);});
  });
  expect(contrast.every(ratio=>ratio>=4.5)).toBe(true);
});

test('Single-choice and ordering errors are red with symbols and clear on edit', async ({ page }) => {
  await enter(page,'ESA'); await openTask(page,'T01');
  await page.locator('input[value="o2"]').check(); await action(page,'check').click();
  await expect(page.locator('.choice.is-incorrect')).toHaveCSS('border-top-color','rgb(180, 35, 24)');
  await expect(page.locator('.choice-status')).toContainText('✕');
  await page.locator('input[value="o1"]').check(); await expect(page.locator('.choice.is-incorrect')).toHaveCount(0);
  await expect(page.locator('.choice-status')).toHaveCount(0);
  await openTask(page,'T13');
  for(const [i,id]of ['c2','c1','c3'].entries()) {await page.locator(`[data-action="token"][data-id="${id}"]`).click();await page.locator(`[data-action="order-assign"][data-target="${i}"]`).click();}
  await action(page,'check').click(); await expect(page.locator('.order-row.is-incorrect')).toHaveCount(2);
  await expect(page.locator('.order-row.is-incorrect .order-status').first()).toHaveCSS('color','rgb(180, 35, 24)');
});

test('Dog and brightness controls keep prompts, model and grading synchronized', async ({ page }) => {
  await enter(page); await openTask(page,'T04');
  await page.locator('input[value="o1"]').check();await action(page,'check').click();await expect(action(page,'next')).toBeEnabled();
  await action(page,'visual').click();await expect(page.locator('#question-heading')).toContainText('links');
  await expect(action(page,'next')).toBeDisabled();await expect(page.locator('.feedback')).toHaveCount(0);
  await page.locator('input[value="o2"]').check();await action(page,'check').click();await expect(page.locator('.feedback.correct')).toContainText('linken Ohr');
  await openTask(page,'T08');await expect(page.locator('#question-heading')).toContainText('hell');
  await action(page,'visual').click();await expect(page.locator('#question-heading')).toContainText('dunkler');
  await expect(page.locator('.visual-stage')).toContainText('Wenig Licht');
  await page.locator('input[value="o2"]').check();await action(page,'check').click();await expect(page.locator('.feedback.correct')).toBeVisible();
  await openTask(page,'T15');await expect(action(page,'visual')).toBeDisabled();await expect(page.locator('.visual-stage')).toContainText('naher Stift');
  await page.locator('[data-text]').fill('rund');await action(page,'check').click();await action(page,'next').click();
  await expect(action(page,'visual')).toBeDisabled();await expect(page.locator('.visual-stage')).toContainText('ferner Baum');
  await openTask(page,'T18');await expect(page.locator('.visual-stage')).toContainText('Sofort im Dunkeln');
  await action(page,'visual').click();await expect(page.locator('.visual-stage')).toContainText('Nach einer Weile im Dunkeln');
  await expect(page.locator('.visual-stage')).not.toContainText('Viel Licht');
  await page.locator('[data-text]').fill('Mehr Licht');await action(page,'check').click();await expect(page.locator('.feedback.correct')).toBeVisible();
});

test('The one ESA text field is usable with typo tolerance and real clarification', async ({ page }) => {
  await enter(page,'ESA');await openTask(page,'T18');
  for(let i=0;i<4;i++){await expect(page.locator('[data-text]')).toHaveCount(0);await action(page,'solution').click();await action(page,'next').click();}
  await expect(page.locator('[data-text]')).toHaveCount(1);await expect(page.locator('#question-heading')).toContainText('In der Iris');
  await page.locator('[data-text]').fill('Der Ziliarmuskel macht die Pupille größer');await action(page,'check').click();await expect(page.locator('.feedback.incorrect')).toBeVisible();
  await page.locator('[data-text]').fill('zihen sich zusamen');await action(page,'check').click();await expect(page.locator('.feedback.correct')).toBeVisible();
  await page.locator('[data-text]').fill('irgendwie');await action(page,'check').click();await expect(page.locator('.clarification')).toBeVisible();
  await page.locator('input[name="fallback"][value="o2"]').check();await action(page,'check-fallback').click();
  await expect(page.locator('.clarification .choice.is-incorrect')).toHaveCSS('border-top-color','rgb(180, 35, 24)');
  await page.locator('input[name="fallback"][value="o1"]').check();await expect(page.locator('.clarification .choice-status')).toHaveCount(0);
  await page.locator('input[name="fallback"][value="o1"]').check();await action(page,'check-fallback').click();await expect(page.locator('.feedback.correct')).toContainText('Mit Auswahl geklärt');
  await action(page,'next').click();
  const record=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).levels.ESA.records.T18_ESA_5,STORAGE_KEY);
  expect(record).toEqual({provenance:'clarified',errors:2});
});

test('Legacy progress retains 24 completions; new ESA question is available without a fake old answer', async ({ page }) => {
  const records=Object.fromEntries(bank.tasks.flatMap(t=>t.variants.ESA.legacyStepIds).map(id=>[id,{provenance:'independent',errors:0}]));
  const legacy={version:LEGACY_VERSION,levels:{ESA:{cursor:17,records}}};
  await page.addInitScript(({key,legacy})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(legacy));},{key:STORAGE_KEY,legacy});
  await page.goto('./');await expect(page.locator('.storage-notice')).toContainText('bisheriger Fortschritt');
  await page.locator('[data-level="ESA"]').click();await action(page,'continue').click();
  await expect(page.locator('h1')).toHaveText('Alles bearbeitet!');await expect(page.locator('.summary-badges>div')).toHaveCount(2);
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),STORAGE_KEY);
  expect(saved.version).toBe(CONTENT_VERSION);expect(saved.levels.ESA.legacyCompleted).toHaveLength(24);expect(saved.levels.ESA.records.T18_ESA_5).toBeUndefined();
  await openTask(page,'T18');await expect(page.locator('#question-heading')).toContainText('In der Iris');await expect(page.locator('[data-text]')).toHaveCount(1);
  await page.reload();await page.locator('[data-level="ESA"]').click();await action(page,'continue').click();await expect(page.locator('h1')).toHaveText('Alles bearbeitet!');
});

test('Student Info is short, explains the colours and contains no developer notice', async ({ page }) => {
  await page.goto('./');await action(page,'info').click();const modal=page.locator('[role="dialog"]');
  await expect(modal).toContainText('So funktioniert das Spiel');await expect(modal).toContainText('Grün bedeutet richtig');
  await expect(modal).not.toContainText(/diagnostisch|Speicher|JavaScript|Testumgebung|WebKit|API|Entwicklungsstand/);
  expect((await modal.innerText()).split(/\s+/).length).toBeLessThan(100);
  await page.keyboard.press('Escape');await expect(action(page,'info')).toBeFocused();
});

test('Tablet portrait and landscape keep anatomy beside long input lists', async ({ page }) => {
  for(const viewport of [{width:768,height:1024},{width:1024,height:768}]) {
    await page.setViewportSize(viewport);await enter(page);await openTask(page,'T07');
    const model=page.locator('.exploration'), panel=page.locator('.question-panel');
    const beforeModel=await model.boundingBox(), beforePanel=await panel.boundingBox();
    expect(Math.abs(beforeModel.y-beforePanel.y)).toBeLessThan(4);
    await page.locator('[data-term]').last().focus();
    const after=await model.boundingBox();expect(after.y).toBeGreaterThanOrEqual(0);expect(after.y+after.height).toBeLessThanOrEqual(viewport.height);
    await expect(page.locator('[data-term]').last()).toBeInViewport();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
