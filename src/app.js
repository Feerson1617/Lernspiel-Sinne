import bank from '../spec/aufgabenbank.json' with { type: 'json' };
import { evaluateStep, feedbackFor } from './evaluate.js';
import { createStorage, freshProgress, levelProgress, completedMissions, completeStep, recommendations, assignUnique, shuffled, provenanceLabels } from './state.js';
import { scene, ear, eye, focusDetail } from './visuals.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const areaNames = ['Hörstudio', 'Augenlabor', 'Wahrnehmungslabor', 'Große Sinnes-Mission'];
const areaSymbols = ['◖', '◉', '◎', '✧'];
const app = document.querySelector('#app');
const storage = createStorage();
let progress = storage.load();
let level = 'Foerder';
let screen = 'home';
let taskIndex = 0;
let stepIndex = 0;
let session;
let modal = '';
let modalTrigger = 'info';
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let protocol = [];
const task = () => bank.tasks[taskIndex];
const step = () => task().variants[level].steps[stepIndex];
const done = () => completedMissions(progress, level);
function newSession() {
  const s = step();
  session = { answer: s.pairs ? {} : s.cards ? Array(s.cards.length).fill(null) : '', result: null, errors: 0, help: 0, supported: false, clarified: false, solution: false, selected: '', wordBank: s.type === 'anatomy_match', fallback: false, fallbackAnswer: '', clarificationUsed: false, page: 0, verified: new Set(), visual: task().id === 'T04' && /links/.test(s.prompt), measured: false, observation: '' };
}
function save() { storage.save(progress); }
function goTask(index, resume = false) {
  taskIndex = index;
  const records = levelProgress(progress, level).records;
  const first = task().variants[level].steps.findIndex(s => !records[s.id]);
  stepIndex = resume && first >= 0 ? first : 0;
  levelProgress(progress, level).cursor = index;
  protocol = [];
  newSession(); screen = 'play'; save(); render(true);
}
function home() { screen = 'home'; modal = ''; render(true); }
function button(label, action, cls = 'button secondary', extra = '') { return `<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`; }
function header() {
  return `<header class="site-header"><button class="brand" data-action="home" aria-label="Mission Sinneslabor – Startseite"><span class="brand-mark">S<span>✦</span></span><span>SINNESLABOR<small>ENTDECKEN. VERSTEHEN.</small></span></button><div class="header-actions">${screen !== 'home' ? `<span class="level-chip">${bank.levelLabels[level]}</span>${button('Missionen', 'map', 'text-button')}` : ''}${button('Bewegung ' + (reducedMotion ? 'aus' : 'an'), 'motion', 'text-button', `aria-pressed="${!reducedMotion}"`)}${button('Info', 'info', 'text-button')}</div></header>`;
}
function homeView() {
  const has = Object.keys(levelProgress(progress, level).records).length > 0;
  return `<main id="main" class="home">
    <section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> DEIN BIOLOGIE-LABOR · KLASSE 8</p><h1>Mission<br><em>Sinneslabor.</em></h1><p class="hero-description">Entdecke, wie Augen und Ohren arbeiten. Löse kurze Aufgaben. Du kannst Hilfe nutzen. Das Spiel dauert ungefähr 30 Minuten.</p><div class="hero-meta"><span>◷ Ohne Zeitdruck</span><span>✧ 24 Entdeckungen</span><span>♡ Ohne Anmeldung</span></div></div>
    <div class="hero-art" aria-hidden="true"><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span><span class="art-label top">SEHEN &amp; STAUNEN</span><div class="hero-eye"><svg viewBox="0 0 400 260"><path d="M25 130 Q200 -30 375 130 Q200 290 25 130" fill="#f7f3df" stroke="#294f43" stroke-width="6"/><circle cx="200" cy="130" r="75" fill="#9fba89"/><circle cx="200" cy="130" r="39" fill="#183c35"/><circle cx="220" cy="108" r="12" fill="#f7f3df"/></svg></div><span class="art-spark">✳</span><span class="art-label bottom">HÖREN &amp; VERSTEHEN</span><div class="sound-motif"><i></i><i></i><i></i><i></i><i></i></div><span class="art-number">01—24</span></div></section>
    <section class="level-section" aria-labelledby="level-heading"><div class="section-heading"><div><p class="eyebrow">DEIN WEG DURCH DAS LABOR</p><h2 id="level-heading">Wähle dein Niveau.</h2></div><p>Gleiche Missionen.<br>Passende Hilfen für dich.</p></div><div class="level-grid" role="radiogroup" aria-label="Niveau">${bank.levels.map((id, i) => `<button class="level-card ${level === id ? 'selected' : ''}" role="radio" aria-checked="${level === id}" data-action="level" data-level="${id}"><span class="level-top"><span>0${i + 1}</span><span class="radio-dot">${level === id ? '●' : '○'}</span></span><strong>${bank.levelLabels[id]}</strong><span>${['Mit Bildern und Auswahl', 'Mit Begriffen und Auswahl', 'Mit kurzen eigenen Antworten', 'Mit kurzen eigenen Erklärungen'][i]}</span></button>`).join('')}</div><div class="start-row"><p>Du brauchst keinen Namen.<br>Dein Fortschritt bleibt auf diesem Gerät, soweit möglich.</p><div class="start-actions">${has ? `${button('Neu beginnen', 'restart')}${button('Weitermachen <span>↗</span>', 'continue', 'button primary')}` : button('Starten <span>↗</span>', 'start', 'button primary')}</div></div></section>
    <section class="labor-preview" aria-label="Die vier Laborbereiche">${areaNames.map((name, i) => `<div><span class="preview-icon">${areaSymbols[i]}</span><span><small>LABOR 0${i + 1}</small><strong>${name}</strong><small>6 kurze Missionen</small></span></div>`).join('')}</section>
    <footer class="home-footer"><span>Deine Neugier ist die wichtigste Ausrüstung.</span><a href="./Mission-Sinneslabor-offline.html" download>Offline-Datei für den Desktop herunterladen</a>${button('Hinweise für Lehrkräfte', 'info', 'text-button')}</footer>
  </main>`;
}
function mapView() {
  const completed = done();
  return `<main id="main" class="map-page"><p class="eyebrow">DEINE ENTDECKUNGSREISE</p><h1>Vier Labore. Dein Tempo.</h1><p>Du kannst jede Mission öffnen. Ein Abzeichen bedeutet: Bereich bearbeitet.</p><div class="area-grid">${areaNames.map((name, i) => `<section class="area-card"><div class="area-title"><span class="preview-icon">${areaSymbols[i]}</span><div><small>LABOR 0${i + 1}</small><h2>${name}</h2></div><span>${bank.tasks.slice(i * 6, i * 6 + 6).every(t => completed.includes(t.id)) ? '✧' : ''}</span></div><ol>${bank.tasks.slice(i * 6, i * 6 + 6).map(t => `<li><button data-action="mission" data-index="${t.number - 1}"><span class="mission-number">${String(t.number).padStart(2, '0')}</span><span>${escape(t.title)}</span><span aria-label="${completed.includes(t.id) ? 'bearbeitet' : 'offen'}">${completed.includes(t.id) ? '✓' : '↗'}</span></button></li>`).join('')}</ol></section>`).join('')}</div>${button('Zurück', 'back', 'button secondary')}</main>`;
}
function visiblePairs() {
  const s = step(); const size = s.pageSize || s.pairs.length;
  return s.pairs.slice(session.page * size, (session.page + 1) * size);
}
function choiceView(s, fallback = false) {
  const selected = fallback ? session.fallbackAnswer : session.answer;
  return `<fieldset class="choice-list"><legend class="sr-only">${escape(s.prompt)}</legend>${shuffled(s.options, s.id).map(o => `<label class="choice ${selected === o.id ? 'chosen' : ''}"><input type="radio" name="${fallback ? 'fallback' : 'answer'}" value="${escape(o.id)}" ${selected === o.id ? 'checked' : ''} data-choice="${fallback ? 'fallback' : 'main'}"><span class="choice-radio"></span><span>${escape(o.text)}</span></label>`).join('')}</fieldset>`;
}
function tokenView(s) {
  const tokens = s.cards ? s.cards.map((c, i) => ({ id: c.id, text: c.text, icon: ['◖', '↝', '⇄', 'ϟ', '◎'][i % 5] })) : s.pairs.map(p => ({ id: p.answerId, text: p.answerText }));
  const assignments = s.cards ? session.answer : Object.values(session.answer);
  return `<div class="word-bank" aria-label="${s.cards ? 'Karten' : 'Wortbank'}"><p class="control-note">Tippe einen Begriff an. Tippe dann auf das passende Feld. Du kannst auch ziehen.</p><div class="tokens">${shuffled(tokens, s.id + 'bank').map(o => { const value = s.type === 'anatomy_recall' ? o.text : o.id; return `<button type="button" draggable="true" class="token ${session.selected === o.id ? 'active' : ''} ${assignments.includes(value) ? 'used' : ''}" data-action="token" data-id="${o.id}" aria-pressed="${session.selected === o.id}" data-focus="token-${o.id}">${o.icon ? `<span class="token-icon" aria-hidden="true">${o.icon}</span>` : ''}${escape(o.text)}${assignments.includes(value) ? '<span class="sr-only"> (bereits zugeordnet; kann getauscht werden)</span>' : ''}</button>`; }).join('')}</div><p class="selection-note" aria-live="polite">${session.selected ? 'Begriff ausgewählt. Tippe jetzt auf ein Feld.' : 'Du kannst Begriffe tauschen und entfernen.'}</p></div>`;
}
function matchingView(s) {
  const anatomy = s.type.startsWith('anatomy');
  const recall = s.type === 'anatomy_recall' && !session.wordBank;
  const pairs = anatomy ? visiblePairs() : s.pairs;
  return `${s.type === 'anatomy_recall' && !session.wordBank ? button('Wortbank öffnen', 'wordbank', 'button secondary compact') : ''}
    ${!recall ? tokenView(s) : '<p class="control-note">Ein Wort pro Markierung reicht. Die Wortbank ist jederzeit erreichbar.</p>'}
    <div class="target-list">${pairs.map(p => {
      const number = s.pairs.indexOf(p) + 1;
      const value = session.answer[p.targetId] || '';
      const status = session.result?.parts?.[p.targetId];
      const targetLabel = anatomy ? `Markierung ${number}${session.help > 0 ? ' · ' + p.targetLabel : ''}` : p.targetLabel;
      const textValue = s.type === 'anatomy_recall' ? value : s.pairs.find(x => x.answerId === value)?.answerText || '';
      return `<div class="target-row ${status === 'correct' ? 'is-correct' : ''}" data-target-row="${p.targetId}"><span class="target-number">${number}</span><div class="target-content"><label for="term-${p.targetId}" class="target-caption">${escape(targetLabel)}</label>${recall ? `<input id="term-${p.targetId}" type="text" autocomplete="off" spellcheck="false" autocapitalize="none" data-term="${p.targetId}" value="${escape(value)}" placeholder="Begriff" aria-describedby="part-${p.targetId}">` : `<button id="term-${p.targetId}" type="button" class="drop-target" data-action="assign" data-target="${p.targetId}" data-focus="target-${p.targetId}" aria-label="${escape(targetLabel + ': ' + (textValue || 'noch leer'))}">${escape(textValue || 'Begriff hier einsetzen')} <span aria-hidden="true">${value ? '↔' : '+'}</span></button>`}<p class="part-feedback" id="part-${p.targetId}">${status === 'correct' ? '✓ ' + escape(s.perTargetFeedback?.[p.targetId]?.correct || 'Diese Zuordnung passt.') : status === 'incorrect' ? '↻ Diese Zuordnung passt noch nicht.' : status === 'partial' ? 'Ein Teil ist erkannt. Nutze die Hilfe oder Wortbank.' : status === 'clarify' ? 'Bitte mit der Wortbank klären.' : ''}</p></div>${value ? button('×', 'remove', 'remove-button', `data-target="${p.targetId}" aria-label="Markierung ${number} entfernen"`) : ''}</div>`;
    }).join('')}</div>${anatomy && s.pageSize < s.pairs.length ? `<nav class="page-tabs" aria-label="Markierungsgruppen">${Array.from({ length: Math.ceil(s.pairs.length / s.pageSize) }, (_, i) => button(`Gruppe ${i + 1}`, 'group', 'button secondary compact', `data-page="${i}" aria-current="${session.page === i ? 'page' : 'false'}"`)).join('')}</nav>` : ''}`;
}
function orderingView(s) {
  return `${s.fixedStart ? `<p class="path-end"><strong>Reiz:</strong> ${escape(s.fixedStart)}</p>` : ''}${tokenView(s)}<ol class="order-list">${session.answer.map((id, i) => `<li class="order-row"><span class="target-number">${i + 1}</span><button type="button" class="drop-target" data-action="order-assign" data-target="${i}" data-focus="order-${i}">${escape(s.cards.find(c => c.id === id)?.text || 'Schritt hier einsetzen')}</button><div class="order-controls">${button('↑', 'up', 'icon-button', `data-index="${i}" aria-label="Schritt ${i + 1} nach oben" ${i === 0 ? 'disabled' : ''}`)}${button('↓', 'down', 'icon-button', `data-index="${i}" aria-label="Schritt ${i + 1} nach unten" ${i === s.cards.length - 1 ? 'disabled' : ''}`)}${id ? button('×', 'order-remove', 'icon-button', `data-index="${i}" aria-label="Schritt ${i + 1} entfernen"`) : ''}</div><span class="order-status">${session.result?.parts?.[i] === 'correct' ? '✓' : ''}</span></li>`).join('')}</ol>${s.fixedEnd ? `<p class="path-end"><strong>Bewusste Reaktion:</strong> ${escape(s.fixedEnd)}</p>` : ''}<p class="control-note">Tastatur: Felder mit Tab erreichen. Mit ↑ und ↓ einen eingesetzten Schritt verschieben.</p>`;
}
function answerView(s) {
  if (s.type === 'single_choice') return choiceView(s);
  if (s.type === 'bounded_text') return `<label class="sr-only" for="short-answer">${escape(s.prompt)}</label><textarea id="short-answer" data-text rows="${s.ruleId === 'FOCUS_REASON' ? '3' : '2'}" placeholder="${escape(s.placeholder)}" autocomplete="off" spellcheck="false" aria-describedby="input-note">${escape(session.answer)}</textarea><p class="control-note" id="input-note">${s.ruleId === 'FOCUS_REASON' ? 'Ein bis zwei kurze Sätze reichen.' : 'Ein Wort oder ein kurzer Satz reicht.'} Rechtschreibung wird nicht bewertet.</p>${button('Zur Auswahl wechseln', 'fallback', 'button secondary compact')}`;
  if (s.type === 'ordering') return orderingView(s);
  return matchingView(s);
}
function visualView(s, t) {
  let picture = s.asset === 'ear' ? ear(s.pairs) : s.asset === 'eye' ? eye(s.pairs) : scene(t.id, session.visual || session.measured);
  const interactive = ['T04', 'T08', 'T10', 'T12', 'T14', 'T15', 'T18'].includes(t.id);
  const visualText = { T04: 'Schallquelle wechseln', T08: session.visual ? 'Licht an' : 'Licht aus', T10: 'Messen und Kreise vergleichen', T12: 'Blickrichtung wechseln', T14: 'Modell drehen', T15: session.visual ? 'Auf nahen Stift scharfstellen' : 'Auf fernen Baum scharfstellen', T18: session.visual ? 'Sofort ansehen' : 'Nach einer Weile ansehen' };
  if (t.id === 'T22') picture += `<div class="model-detail"><svg class="lab-svg" viewBox="0 0 660 210" role="img" aria-label="Vergrößerter Sehnervaustritt: Lichtsinneszellen fehlen an der Austrittsstelle."><path d="M70 65 L270 65 M390 65 L580 65" stroke="#d49077" stroke-width="12"/><path d="M283 65 L283 133 L385 133 L385 65" fill="#d6bb64" stroke="#ad9248" stroke-width="4"/>${[100,140,180,220,430,470,510,550].map(x => `<path d="M${x} 56 L${x} 26" stroke="#5d8979" stroke-width="10" stroke-linecap="round"/>`).join('')}<text x="330" y="179" text-anchor="middle" font-size="20" fill="currentColor">Hier fehlen Lichtsinneszellen.</text><text x="330" y="205" text-anchor="middle" font-size="16" fill="currentColor">Austritt des Sehnervs · vergrößertes Schema</text></svg></div><p class="visual-caption">Ein Selbstversuch ist freiwillig und wird nicht bewertet.</p>`;
  return `<div class="visual-stage ${session.visual && ['T08', 'T18'].includes(t.id) ? 'dimmed' : ''}">${picture}</div>${t.id === 'T10' ? `<fieldset class="observation"><legend>Wie wirkt es auf dich? <small>Unbewertet.</small></legend>${['Links wirkt größer', 'Gleich', 'Rechts wirkt größer'].map((x, i) => button(x, 'observe', 'button secondary compact', `data-id="${i}" aria-pressed="${session.observation === String(i)}"`)).join('')}</fieldset>` : ''}${interactive ? `<div class="visual-control">${button(visualText[t.id], 'visual', 'button secondary compact')}</div>` : '<p class="visual-caption">Schau dir das Modell an. Nutze Hilfe, wenn du mehr wissen möchtest.</p>'}<div class="visual-control">${button('Abbildung vergrößern', 'model', 'text-button')}</div>`;
}
function playView() {
  const t = task(), s = step(); const completed = done();
  const area = Math.floor(taskIndex / 6); const ready = session.solution || session.result?.state === 'correct';
  const group = s.type.startsWith('anatomy') && s.pageSize < s.pairs.length;
  const allVerified = s.pairs?.every(p => session.verified.has(p.targetId));
  const nextLabel = group && !allVerified && !session.solution ? 'Weitere Markierungen' : stepIndex < t.variants[level].steps.length - 1 ? 'Weiter' : 'Mission abschließen';
  return `<main id="main" class="play-page"><nav class="journey" aria-label="Laborbereiche">${areaNames.map((name, i) => `<span class="${i === area ? 'current' : ''}"><span>${areaSymbols[i]}</span><span>${name}</span></span>`).join('')}</nav><div class="mission-topline"><p class="eyebrow">LABOR 0${area + 1} · MISSION ${String(taskIndex + 1).padStart(2, '0')} / 24</p><span>${completed.length} bearbeitet</span></div><div class="mission-progress"><span style="width:${completed.length / 24 * 100}%"></span></div><h1 class="mission-title">${escape(t.title)}</h1><div class="mission-layout"><section class="exploration" aria-label="Modell erkunden"><div class="panel-kicker"><span>01 / ENTDECKEN</span><span>✧</span></div>${visualView(s, t)}</section><section class="question-panel" aria-label="Aufgabe"><div class="panel-kicker"><span>02 / AUSPROBIEREN</span><span>${stepIndex + 1} / ${t.variants[level].steps.length}</span></div><h2 id="question-heading">${escape(s.prompt)}</h2><div id="answer-area">${answerView(s)}</div><div id="feedback-area" class="feedback-area" aria-live="polite" aria-atomic="true">${feedbackView(s)}</div><div class="question-actions">${button('Antwort prüfen', 'check', 'button primary', session.solution ? 'disabled' : '')}${button('Hilfe', 'help', 'button secondary')}${button(nextLabel, 'next', 'button next', ready ? '' : 'disabled')}</div><div class="low-actions">${button('Lösung ansehen', 'solution', 'text-button')}${taskIndex > 0 ? button('← Vorige Mission', 'previous', 'text-button') : ''}${button('Wörter nachschlagen', 'glossary', 'text-button')}</div></section></div></main>`;
}
function feedbackView(s) {
  const result = session.result;
  let content = '';
  if (session.help > 0) content += `<aside class="help-note"><strong>Deine Hilfe</strong><p>${escape(s.hints[Math.min(session.help - 1, s.hints.length - 1)])}</p>${s.pairs && s.type.startsWith('anatomy') ? '<p>Die Beschreibungen stehen jetzt bei den Markierungen.</p>' : ''}${task().id === 'T15' && level !== 'Foerder' ? focusDetail(!session.visual) : ''}</aside>`;
  if (session.solution) content += `<div class="feedback solution"><strong>◉ Lösung angesehen</strong><p>${solutionText(s)}</p><p>Du kannst jetzt weitergehen. Abschreiben ist nicht nötig.</p></div>`;
  else if (result) content += `<div class="feedback ${result.state}"><strong>${{ correct: session.clarified ? '✓ Mit Auswahl geklärt' : '✓ Das passt!', incorrect: '↻ Schau noch einmal hin', partial: '◐ Ein Teil passt schon', clarify: '◇ Lass uns klären', empty: 'Noch ergänzen', help_requested: 'Hilfe ist für dich da', too_long: 'Bitte kürzer antworten' }[result.state]}</strong><p>${escape(result.state === 'correct' && session.clarified ? 'Die Auswahl passt. Dein ursprünglicher Text bleibt ungeklärt. ' + s.feedbackCorrect : feedbackFor(s, result, session.errors))}</p></div>`;
  if (session.fallback && !session.solution && result?.state !== 'correct') content += s.fallback ? `<section class="clarification"><h3>${escape(s.fallback.prompt)}</h3>${choiceView(s.fallback, true)}${button('Auswahl prüfen', 'check-fallback', 'button secondary')}${session.fallbackMessage ? `<p role="status">${escape(session.fallbackMessage)}</p>` : ''}</section>` : '<p>Nutze die Wortbank bei den Markierungen. Danach kannst du die Antwort prüfen.</p>';
  return content;
}
function solutionText(s) {
  if (s.modelAnswer) return escape(s.modelAnswer);
  if (s.options) return escape(s.options.find(o => o.id === s.correctOptionId).text) + ' · ' + escape(s.feedbackCorrect);
  if (s.cards) return s.correctOrder.map(id => escape(s.cards.find(c => c.id === id).text)).join(' → ');
  return s.pairs.map((p, i) => `<span class="solution-line">${i + 1}. ${escape(p.targetLabel)} → <strong>${escape(p.answerText)}</strong>${s.perTargetFeedback ? '<br>' + escape(s.perTargetFeedback[p.targetId].correct) : ''}</span>`).join('');
}
function badgeView() {
  const area = Math.floor(taskIndex / 6);
  return `<main id="main" class="celebration"><p class="eyebrow">LABOR 0${area + 1} BEARBEITET</p><div class="badge-large">${areaSymbols[area]}</div><h1>${areaNames[area]} entdeckt!</h1><p>Sechs Missionen sind bearbeitet.<br>Du hast dein Abzeichen gesammelt.</p><p class="control-note">Das zeigt deinen Weg durchs Labor. Es ist keine Note.</p>${button(area === 3 ? 'Zum Abschluss' : 'Zum nächsten Labor', 'after-badge', 'button primary')}</main>`;
}
function summaryView() {
  return `<main id="main" class="summary-page"><p class="eyebrow">DEIN WEG DURCH DAS SINNESLABOR</p><h1>Mission geschafft.</h1><p>Du hast alle vier Bereiche bearbeitet. Danke für deine Neugier!</p><div class="summary-badges">${areaNames.map((n, i) => `<div><span>${areaSymbols[i]}</span><strong>${n}</strong><small>Bearbeitet</small></div>`).join('')}</div><section class="summary-support"><h2>So hast du gearbeitet</h2>${Object.entries(provenanceLabels).map(([id, label]) => `<p><span>${label}</span><strong>${Object.values(levelProgress(progress, level).records).filter(r => r.provenance === id).length} Lernschritte</strong></p>`).join('')}</section>${recommendations(progress, level).length ? `<section><h2>Wenn du möchtest, schau noch einmal hin.</h2><p>Freiwillig und ohne Zeitvorgabe.</p>${recommendations(progress, level).map(t => button(escape(t.title) + ' ↗', 'mission', 'button secondary', `data-index="${t.number - 1}"`)).join(' ')}</section>` : '<p>Du kannst jede Mission freiwillig noch einmal erkunden.</p>'}<div class="summary-actions">${button('Alle Missionen', 'map', 'button primary')}${button('Zur Startseite', 'home')}</div></main>`;
}
function protocolView() {
  return `<main id="main" class="summary-page"><p class="eyebrow">DEIN ANTWORTPROTOKOLL · NUR IN DIESER SITZUNG</p><h1>So hast du das Hören erklärt.</h1><ol class="protocol">${protocol.map(p => `<li><strong>${escape(p.prompt)}</strong><p>${escape(p.text)}</p><small>${escape(provenanceLabels[p.provenance])}</small></li>`).join('')}</ol><details><summary>Mustererklärung ansehen</summary><p>Schall bewegt das Trommelfell. Die Gehörknöchelchen übertragen die Schwingungen. In der Hörschnecke entstehen Nervensignale. Der Hörnerv leitet sie zum Gehirn.</p></details>${button('Weiter', 'after-protocol', 'button primary')}</main>`;
}
function modalView() {
  if (!modal) return '';
  const content = modal === 'model' ? `<h2>Das Modell im Detail</h2><p>Bei wenig Platz kannst du das Bild seitlich verschieben.</p><div class="model-scroll" tabindex="0" role="region" aria-label="Vergrößertes Modell">${step().asset === 'ear' ? ear(step().pairs) : step().asset === 'eye' ? eye(step().pairs) : scene(task().id, session.visual || session.measured)}</div>` : modal === 'restart' ? `<h2>Für ${bank.levelLabels[level]} neu beginnen?</h2><p>Damit wird nur der Fortschritt für dieses Niveau zurückgesetzt.</p>${button('Ja, neu beginnen', 'confirm-restart', 'button primary')}` : modal === 'glossary' ? `<h2>Wörter zum Nachschlagen</h2><dl>${Object.entries(bank.optionalGlossary).map(([term, definition]) => `<dt>${escape(term)}</dt><dd>${escape(definition)}</dd>`).join('')}</dl>` : `<p class="eyebrow">FÜR LEHRKRÄFTE &amp; NEUGIERIGE</p><h2>Üben, entdecken, Hilfe nutzen.</h2><p>24 Missionen in vier gleichwertigen Niveaus. Alle bearbeiten dieselben Themen. Die ungefähr 30 Minuten sind eine Schätzung, keine gemessene Garantie.</p><p>Dieses Spiel ist ein Übungsangebot, kein diagnostisch validierter Test. Es gibt keine Note, Konten, Rangliste oder Zeiterfassung.</p><p>Förder und ESA nutzen Bilder und Auswahl. MSA und AHR versuchen Fachbegriffe selbst; eine Wortbank ist jederzeit erreichbar. Geführte Kurzantworten ersetzen keinen selbstständig aufgebauten Aufsatz. Auswahl und freier Begriffsabruf sind unterschiedliche Übungsformen.</p><p>Die automatische Textprüfung erkennt nur begrenzte Aussagen. Unsicherheit führt zu einer Auswahlklärung und zählt nicht als Wissenslücke. Ein Abzeichen bedeutet „Bereich bearbeitet“, nicht „alles sicher beherrscht“.</p><p>Fortschritt wird nach Niveau getrennt lokal gespeichert, wenn dein Browser dies erlaubt. Eingegebene Texte bleiben nur im Arbeitsspeicher; es werden keine Antworten übertragen. Mit „Neu beginnen“ kannst du den Fortschritt eines Niveaus löschen.</p><p>Nach dem Laden braucht das Spiel kein Netzwerk. Für den ersten Website-Aufruf ist Internet erforderlich. Der Einzeldatei-Export ist für den lokalen Desktop-Betrieb vorgesehen. Echte iPad- und Lerngruppentests sind noch offen.</p><p>Eigene schematische SVGs; keine veröffentlichten Schulbuchbilder oder Klassenarbeiten. Quellen und fachliche Grenzen stehen im Repository.</p>`;
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="${modal === 'model' ? 'Vergrößertes Modell' : modal === 'restart' ? 'Neu beginnen' : modal === 'glossary' ? 'Wörter nachschlagen' : 'Hinweise'}">${button('Schließen ×', 'close-modal', 'button secondary compact modal-close')}${content}</section></div>`;
}
function render(focus = false) {
  const oldKey = document.activeElement?.dataset?.focus;
  const oldAttributes = document.activeElement?.dataset?.action ? [...document.activeElement.attributes].filter(a => a.name.startsWith('data-') && a.name !== 'data-focus') : [];
  app.innerHTML = header() + (storage.message ? `<p class="storage-notice" role="status">${escape(storage.message)}</p>` : '') + ({ home: homeView, map: mapView, play: playView, badge: badgeView, summary: summaryView, protocol: protocolView }[screen])() + modalView();
  document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  if (modal) { document.querySelector('.modal button')?.focus(); }
  else if (focus) { const heading = document.querySelector('#main h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  else if (oldKey) [...document.querySelectorAll('[data-focus]')].find(el => el.dataset.focus === oldKey)?.focus({ preventScroll: true });
  else if (oldAttributes.length) { const selector = oldAttributes.map(a => `[${a.name}="${CSS.escape(a.value)}"]`).join(''); document.querySelector(selector)?.focus({ preventScroll: true }); }
}
function closeModal() { modal = ''; render(); document.querySelector(`[data-action="${modalTrigger}"]`)?.focus({ preventScroll: true }); }
function invalidate() {
  session.result = null; session.solution = false; session.fallbackMessage = '';
  // Keep the user's words and focus while hiding outdated feedback immediately.
  document.querySelector('#feedback-area').innerHTML = feedbackView(step());
  document.querySelector('[data-action="next"]').disabled = true;
  document.querySelectorAll('.part-feedback').forEach(el => { el.textContent = ''; });
  document.querySelectorAll('.is-correct').forEach(el => el.classList.remove('is-correct'));
}
function currentEvaluation() {
  const s = step();
  const scoped = s.type.startsWith('anatomy') && s.pageSize < s.pairs.length ? { ...s, pairs: visiblePairs() } : s;
  const scopedAnswer = scoped.pairs ? Object.fromEntries(scoped.pairs.map(p => [p.targetId, session.answer[p.targetId]]).filter(([, v]) => v !== undefined)) : session.answer;
  return evaluateStep(scoped, scopedAnswer);
}
function checkAnswer() {
  const s = step(); const result = currentEvaluation(); session.result = result;
  if (result.state === 'incorrect') session.errors = Math.min(1000, session.errors + 1);
  if (result.parts) for (const [id, state] of Object.entries(result.parts)) { if (state === 'correct') session.verified.add(id); else session.verified.delete(id); }
  if (result.state === 'clarify' && !session.clarificationUsed) {
    session.clarificationUsed = true; session.fallback = true;
    if (s.pairs) { session.wordBank = true; session.clarified = true; }
  }
  if (result.state === 'help_requested') { session.help++; session.supported = true; }
  render();
  document.querySelector('#feedback-area')?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
}
function nextStep() {
  if (!session.solution && session.result?.state !== 'correct') return;
  const s = step();
  if (s.type.startsWith('anatomy') && !session.solution && !s.pairs.every(p => session.verified.has(p.targetId))) {
    const remaining = s.pairs.findIndex(p => !session.verified.has(p.targetId)); session.page = Math.floor(remaining / s.pageSize); session.result = null; render(); return;
  }
  const provenance = session.solution ? 'solution' : session.clarified ? 'clarified' : session.supported || session.help || (s.type === 'anatomy_recall' && session.wordBank) ? 'supported' : 'independent';
  completeStep(progress, level, s.id, { provenance, errors: session.errors });
  if (task().id === 'T20') protocol.push({ prompt: s.prompt, text: session.solution ? (s.modelAnswer || s.options.find(o => o.id === s.correctOptionId)?.text) : session.clarified ? s.fallback?.options.find(o => o.id === session.fallbackAnswer)?.text || 'Mit Wortbank geklärt' : s.options?.find(o => o.id === session.answer)?.text || session.answer, provenance });
  save();
  if (stepIndex < task().variants[level].steps.length - 1) { stepIndex++; newSession(); render(true); return; }
  if (task().id === 'T20') { screen = 'protocol'; render(true); return; }
  advanceMission();
}
function advanceMission(skipBadge = false) {
  if (!skipBadge && (taskIndex + 1) % 6 === 0 && bank.tasks.slice(taskIndex - 5, taskIndex + 1).every(t => done().includes(t.id))) { screen = 'badge'; render(true); return; }
  if (done().length === 24) { screen = 'summary'; render(true); return; }
  goTask(Math.min(23, taskIndex + 1), true);
}
function place(target) {
  if (!session.selected) return;
  const s = step();
  if (s.cards) {
    const next = [...session.answer], index = Number(target); const old = next[index]; const other = next.indexOf(session.selected);
    if (other >= 0) next[other] = old; next[index] = session.selected; session.answer = next;
  } else {
    const pair = s.pairs.find(p => p.answerId === session.selected);
    const value = s.type === 'anatomy_recall' ? pair.answerText : pair.answerId;
    const next = assignUnique(session.answer, target, value);
    for (const id of new Set([...Object.keys(session.answer), ...Object.keys(next)])) if (next[id] !== session.answer[id]) session.verified.delete(id);
    session.answer = next;
  }
  session.selected = ''; session.result = null; session.solution = false; render();
}
function moveOrder(index, delta) {
  const to = index + delta;
  if (to < 0 || to >= session.answer.length) return;
  [session.answer[index], session.answer[to]] = [session.answer[to], session.answer[index]];
  session.result = null; session.solution = false; render(); document.querySelector(`[data-focus="order-${to}"]`)?.focus();
}
app.addEventListener('input', event => {
  const el = event.target;
  if (el.matches('[data-term]')) { session.answer[el.dataset.term] = el.value; session.verified.delete(el.dataset.term); invalidate(); }
  if (el.matches('[data-text]')) { session.answer = el.value; invalidate(); }
  if (el.matches('[data-choice]')) {
    if (el.dataset.choice === 'fallback') { session.fallbackAnswer = el.value; session.fallbackMessage = ''; }
    else { session.answer = el.value; invalidate(); }
    document.querySelectorAll(`input[name="${el.name}"]`).forEach(input => input.closest('.choice').classList.toggle('chosen', input.checked));
  }
});
app.addEventListener('click', event => {
  const el = event.target.closest('[data-action]'); if (!el || el.disabled) return;
  const action = el.dataset.action;
  if (action === 'home') return home();
  if (action === 'level') { level = el.dataset.level; return render(); }
  if (action === 'start') return goTask(0);
  if (action === 'continue') { const first = bank.tasks.findIndex(t => !done().includes(t.id)); return first < 0 ? (screen = 'summary', render(true)) : goTask(levelProgress(progress, level).cursor && !done().includes(bank.tasks[levelProgress(progress, level).cursor].id) ? levelProgress(progress, level).cursor : first, true); }
  if (action === 'restart') { modalTrigger = action; modal = 'restart'; return render(); }
  if (action === 'confirm-restart') { progress.levels[level] = { cursor: 0, records: {} }; modal = ''; save(); return goTask(0); }
  if (action === 'motion') { reducedMotion = !reducedMotion; return render(); }
  if (action === 'info' || action === 'glossary' || action === 'model') { modalTrigger = action; modal = action; if (action === 'glossary' && session && screen === 'play') session.supported = true; return render(); }
  if (action === 'close-modal') return closeModal();
  if (action === 'map') { screen = 'map'; return render(true); }
  if (action === 'back') { screen = session ? 'play' : 'home'; return render(true); }
  if (action === 'mission') return goTask(Number(el.dataset.index), true);
  if (action === 'previous') return goTask(taskIndex - 1);
  if (action === 'after-badge') return advanceMission(true);
  if (action === 'after-protocol') return advanceMission();
  if (action === 'check') return checkAnswer();
  if (action === 'next') return nextStep();
  if (action === 'help') { session.supported = true; session.help++; return render(); }
  if (action === 'solution') { session.supported = true; session.solution = true; session.result = null; session.fallback = false; render(); document.querySelector('#feedback-area').scrollIntoView({ block: 'nearest' }); return; }
  if (action === 'wordbank') { session.wordBank = true; session.supported = true; return render(); }
  if (action === 'fallback') { session.fallback = true; session.supported = true; return render(); }
  if (action === 'check-fallback') {
    const r = evaluateStep(step().fallback, session.fallbackAnswer);
    if (r.state === 'correct') { session.result = r; session.clarified = true; session.fallback = false; }
    else { session.fallbackMessage = r.state === 'empty' ? 'Wähle zuerst eine Antwort.' : step().fallback.hints[0] + ' Du kannst auch die Lösung ansehen.'; if (r.state === 'incorrect') session.errors++; }
    render(); return;
  }
  if (action === 'token') { session.selected = session.selected === el.dataset.id ? '' : el.dataset.id; return render(); }
  if (action === 'assign' || action === 'order-assign') return place(el.dataset.target);
  if (action === 'remove') { delete session.answer[el.dataset.target]; session.verified.delete(el.dataset.target); session.result = null; session.solution = false; return render(); }
  if (action === 'order-remove') { session.answer[Number(el.dataset.index)] = null; session.result = null; session.solution = false; return render(); }
  if (action === 'up' || action === 'down') return moveOrder(Number(el.dataset.index), action === 'up' ? -1 : 1);
  if (action === 'group') { session.page = Number(el.dataset.page); session.result = null; return render(); }
  if (action === 'visual') { session.visual = !session.visual; if (task().id === 'T10') session.measured = true; return render(); }
  if (action === 'observe') { session.observation = el.dataset.id; return render(); }
});
let dragId = '';
app.addEventListener('dragstart', event => { const token = event.target.closest('[data-action="token"]'); if (!token) return; dragId = token.dataset.id; event.dataTransfer.setData('text/plain', dragId); event.dataTransfer.effectAllowed = 'move'; });
app.addEventListener('dragover', event => { if (event.target.closest('.drop-target') && dragId) event.preventDefault(); });
app.addEventListener('drop', event => { const target = event.target.closest('.drop-target'); if (!target || !dragId) return; event.preventDefault(); session.selected = dragId; place(target.dataset.target); dragId = ''; });
app.addEventListener('dragend', () => { dragId = ''; });
app.addEventListener('keydown', event => {
  if (modal) {
    if (event.key === 'Escape') { closeModal(); return; }
    if (event.key === 'Tab') { const focusable = [...document.querySelectorAll('.modal button,.modal summary,.modal [tabindex="0"]')]; const first = focusable[0], last = focusable.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
  }
  if (screen === 'home' && event.target.matches('[data-action="level"]') && ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault(); const delta = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1; level = bank.levels[(bank.levels.indexOf(level) + delta + 4) % 4]; render(); document.querySelector(`[data-level="${level}"]`).focus();
  }
  if (event.target.dataset.action === 'order-assign' && ['ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); moveOrder(Number(event.target.dataset.target), event.key === 'ArrowUp' ? -1 : 1); }
});
try { render(); window.sinneslaborStarted = true; }
catch (error) { app.textContent = 'Das Labor konnte nicht starten. Bitte lade die Seite neu. Deine anderen Browserdaten bleiben erhalten.'; console.error(error); }
