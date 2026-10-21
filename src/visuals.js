const svg = (content, label, cls = '') => `<svg class="lab-svg ${cls}" viewBox="0 0 660 430" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
const text = (x, y, value, size = 18) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="currentColor">${value}</text>`;
const line = (x1, y1, x2, y2, color = '#46695e', width = 3) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const dot = (x, y, r, fill, stroke = 'none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
export const earTargets = {
  pinna: [35, 90, 87, 215], canal: [135, 385, 174, 248], eardrum: [215, 385, 237, 252],
  ossicles: [330, 385, 285, 237], malleus: [270, 30, 303, 105], incus: [360, 30, 350, 94],
  stapes: [455, 30, 403, 111], cochlea: [520, 385, 475, 276], auditory: [617, 345, 568, 291], vestibular: [606, 135, 520, 165]
};
export const eyeTargets = {
  cornea: [45, 90, 100, 225], pupil: [90, 375, 155, 225], lens: [235, 375, 212, 225],
  vitreous: [350, 45, 365, 225], retina: [510, 60, 503.317, 153.058], iris: [170, 45, 155, 182], optic: [600, 375, 600, 261]
};
function markers(pairs, targets) {
  return pairs.map((pair, i) => {
    const [x, y, endX, endY] = targets[pair.targetId];
    return `<g data-marker="${pair.targetId}">${line(x, y, endX, endY, '#183c35', 2)}${dot(endX, endY, 4, '#183c35')}${dot(x, y, 17, '#183c35')}${text(x, y + 6, i + 1).replace('currentColor', '#fff')}</g>`;
  }).join('');
}
export function ear(pairs = [], inset = true) {
  return svg(`
    <path d="M123 124 C38 99 33 187 49 247 C63 295 59 331 93 338 C133 344 140 299 121 283 C103 267 126 245 140 224 C165 184 154 142 123 124Z" fill="#edc8aa" stroke="#936b57" stroke-width="5"/>
    <path d="M108 158 C71 147 66 188 81 216 C92 231 102 205 112 217 C128 234 93 259 90 284" fill="none" stroke="#a77b64" stroke-width="7"/>
    <path d="M121 226 L231 226 L246 269 L120 268 Q100 249 121 226Z" fill="#f5dfc7" stroke="#a77b64" stroke-width="4"/>
    ${line(230, 222, 245, 274, '#a85561', 9)}
    <path d="M240 239 L265 218 L279 231 L305 221 L327 237 L345 240" fill="none" stroke="#a68b56" stroke-width="9" stroke-linejoin="round"/>
    <path d="M343 232 L360 232 L360 249 L343 249Z" fill="#ecd59c" stroke="#a68b56" stroke-width="4"/>
    <path d="M360 240 C411 221 442 232 455 256" fill="none" stroke="#bd9d7e" stroke-width="13"/>
    <path d="M457 251 C493 228 528 256 514 288 C503 319 454 324 439 297 C423 269 449 245 472 257 C494 268 480 296 462 284 C452 275 465 267 471 276" fill="none" stroke="#c78675" stroke-width="12" stroke-linecap="round"/>
    <path d="M451 226 C420 202 414 130 447 131 C487 132 476 201 451 219 M453 220 C471 187 500 144 520 165 C541 190 497 220 453 220 M449 216 C404 190 399 156 421 149" fill="none" stroke="#6b9b9a" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="452" cy="224" rx="19" ry="15" fill="#8fb4ac"/>
    <path d="M509 288 C540 286 570 288 604 305" fill="none" stroke="#bc9b38" stroke-width="17"/>
    ${inset ? `<rect x="255" y="55" width="195" height="100" rx="12" fill="#fffaf0" stroke="#c6b692" stroke-width="2"/>
      ${line(281, 82, 288, 136, '#a85561', 6)}
      <path d="M290 116 L303 105 L309 84 L323 88" fill="none" stroke="#987b43" stroke-width="9" stroke-linecap="round"/>
      <path d="M323 88 Q347 78 355 96 L371 110" fill="none" stroke="#af9455" stroke-width="10" stroke-linecap="round"/>
      <path d="M372 111 L407 99 L407 124 L372 111Z" fill="#f3dfac" stroke="#987b43" stroke-width="4"/>
      ${text(352, 177, 'Mittelohr · vergrößert', 14)}
      <path d="M261 155 L263 214 M425 155 L354 225" fill="none" stroke="#b8b6a2" stroke-width="2" stroke-dasharray="5 5"/>` : ''}
    ${markers(pairs, earTargets)}
    ${text(330, 421, 'Schematischer Schnitt durch das Ohr · nicht maßstabsgetreu', 14)}
  `, 'Ohrmodell mit nummerierten Markierungen. Kleine Knochen sind vergrößert dargestellt.');
}
export function eye(pairs = [], rays = false) {
  return svg(`
    <path d="M139 121 C241 46 474 70 538 173 C600 270 516 356 380 360 C255 370 167 328 139 310" fill="#f1f4e3" stroke="#839c8a" stroke-width="13"/>
    <path d="M145 130 C240 57 466 83 526 180 C580 267 506 344 377 348" fill="none" stroke="#d49077" stroke-width="8"/>
    <path d="M140 122 Q58 214 140 310" fill="#d5edf0" fill-opacity=".65" stroke="#639caa" stroke-width="7"/>
    <path d="M154 146 L154 200 M154 250 L154 295" stroke="#538b77" stroke-width="13"/>
    <ellipse cx="212" cy="225" rx="30" ry="68" fill="#c2dfe0" stroke="#5b98a4" stroke-width="4"/>
    <path d="M545 241 L628 254 L623 282 L540 262" fill="#d6bb64" stroke="#ad9248" stroke-width="4"/>
    ${rays ? `<path d="M30 210 L100 210 L155 219 L212 219 L546 244 M30 245 L100 245 L155 232 L212 232 L546 244" fill="none" stroke="#c78822" stroke-width="3" stroke-dasharray="8 5"/>` : ''}
    ${markers(pairs, eyeTargets)}
    ${text(330, 421, 'Schematischer Schnitt durch das Auge · vorne links', 14)}
  `, 'Augenmodell mit nummerierten Markierungen. Die Pupille ist die freie Öffnung vor der Linse.');
}
export function focusDetail(near = true) {
  return svg(`
    ${text(330, 40, near ? 'Nah: Stift' : 'Fern: Baum', 23)}
    <rect x="120" y="70" width="420" height="280" rx="36" fill="#ecf0df"/>
    <ellipse cx="330" cy="211" rx="${near ? 52 : 24}" ry="85" fill="#bfdcdd" stroke="#5b98a4" stroke-width="5"/>
    <path d="M180 128 L270 139 L${near ? 309 : 320} 140 M180 294 L270 283 L${near ? 309 : 320} 283 M480 128 L390 139 L${near ? 352 : 339} 140 M480 294 L390 283 L${near ? 352 : 339} 283" fill="none" stroke="#b19a62" stroke-width="4" ${near ? 'stroke-dasharray="6 5"' : ''}/>
    <path d="M171 120 L171 300 M489 120 L489 300" stroke="#bd7a6c" stroke-width="${near ? 22 : 12}" stroke-linecap="round"/>
    ${text(330, 382, near ? 'Ringmuskel zusammengezogen · Bänder entlastet · Linse runder' : 'Ringmuskel entspannter · Bänder gespannt · Linse flacher', 16)}
    ${text(330, 412, 'Eigenes Hilfemodell · Ringmuskel ist nicht die Iris', 14)}
  `, 'Vergrößerung: Ringmuskel wirkt über Linsenbänder auf die Linse.');
}
export const illusionGeometry = { lineLength: 160, centralRadius: 18 };
export function illusions(measured = false) {
  const surround = (cx, cy, radius, distance) => Array.from({ length: 6 }, (_, i) => { const angle = i * Math.PI / 3; return dot(cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance, radius, '#b8c9b3'); }).join('');
  return svg(`
    ${text(330, 30, 'Wie wirkt es auf dich? Dein Eindruck ist unbewertet.', 16)}
    <g stroke="#355e53" stroke-width="4" fill="none">
      <line data-measure="line" x1="120" y1="92" x2="280" y2="92"/>
      <path d="M140 70 L120 92 L140 114 M260 70 L280 92 L260 114"/>
      <line data-measure="line" x1="380" y1="92" x2="540" y2="92"/>
      <path d="M360 70 L380 92 L360 114 M560 70 L540 92 L560 114"/>
    </g>
    ${surround(200, 290, 10, 38)}${surround(460, 290, 32, 75)}
    <circle data-measure="circle" cx="200" cy="290" r="18" fill="#db9473"/>
    <circle data-measure="circle" cx="460" cy="290" r="18" fill="#db9473"/>
    ${measured ? `<g stroke="#bc713d" stroke-width="2">${line(120, 136, 280, 136, '#bc713d')}${line(380, 136, 540, 136, '#bc713d')}</g>${text(200, 163, '160 Einheiten', 16)}${text(460, 163, '160 Einheiten', 16)}
      <circle cx="200" cy="290" r="18" fill="none" stroke="#183c35" stroke-width="3" stroke-dasharray="4 3"/>
      <circle cx="460" cy="290" r="18" fill="none" stroke="#183c35" stroke-width="3" stroke-dasharray="4 3"/>
      <path d="M218 290 L312 290 M442 290 L348 290" stroke="#6a826a" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="330" cy="290" r="18" fill="#db9473" stroke="#183c35" stroke-width="3"/>
      <circle cx="330" cy="290" r="18" fill="none" stroke="#fff9e9" stroke-width="3" stroke-dasharray="4 4"/>
      ${text(330, 344, 'übereinander', 14)}
      ${text(330, 406, 'Beide mittleren Kreise: Radius 18. Sie passen genau übereinander.', 15)}` : text(330, 408, 'Miss die Linien. Vergleiche die beiden mittleren Kreise.', 16)}
  `, 'Zwei selbst gezeichnete Sehtricks mit Linien und Kreisen in einem gemeinsamen Maßstab.');
}
export function scene(taskId, mode = false) {
  if (['T01', 'T03', 'T05', 'T13', 'T20'].includes(taskId)) return ear();
  if (['T07', 'T09', 'T22', 'T24'].includes(taskId)) return eye([], taskId === 'T09');
  if (taskId === 'T10') return illusions(mode);
  if (taskId === 'T15') return svg(`${text(330, 50, mode ? 'Scharfgestellt: ferner Baum' : 'Scharfgestellt: naher Stift', 22)}
    <path d="M102 290 L113 165 L128 165 L134 290Z" fill="#cc9470" stroke="#805c43" stroke-width="3"/>
    ${text(117, 335, 'Naher Stift', 19)}
    <path d="M520 290 L520 220" stroke="#896f50" stroke-width="13"/>
    ${dot(520, 171, 55, '#7eaa83')}${dot(482, 208, 38, '#7eaa83')}${dot(550, 208, 38, '#7eaa83')}
    ${text(520, 335, 'Ferner Baum', 19)}
    <ellipse cx="330" cy="220" rx="${mode ? 21 : 42}" ry="73" fill="#bfdddd" stroke="#588f9c" stroke-width="4"/>
    ${text(330, 400, 'Vereinfachtes Modell · keine Aussage über jede Entfernungsdifferenz', 14)}`, 'Naher Stift und ferner Baum bei konstantem Licht.');
  if (taskId === 'T04') return svg(`${text(330, 38, 'Draufsicht · Nase oben', 22)}
    <ellipse cx="322" cy="230" rx="100" ry="119" fill="#edcdb3" stroke="#9b7d65" stroke-width="4"/>
    <path d="M309 114 L322 84 L335 114" fill="#edcdb3" stroke="#9b7d65" stroke-width="3"/>
    ${dot(215, 232, 16, '#c58f76')}${dot(429, 232, 16, '#c58f76')}
    ${text(170, 380, 'links der Person', 18)}${text(485, 380, 'rechts der Person', 18)}
    ${dot(mode ? 65 : 590, 233, 23, '#e0bd5b')}${text(mode ? 65 : 590, 282, 'Hund', 17)}
    <path d="M${mode ? 90 : 565} 230 L${mode ? 195 : 450} 230" stroke="#ba9237" stroke-width="4" stroke-dasharray="8 7"/>
    ${text(330, 417, 'Modell: kürzerer Weg → meist früher; oft auch lauter', 15)}`, 'Draufsicht auf einen Kopf, Nase oben. Links und rechts sind die Seiten der Person.');
  if (taskId === 'T08' || taskId === 'T18') return svg(`${text(330, 50, taskId === 'T18' ? mode ? 'Nach einer Weile im Dunkeln' : 'Sofort im Dunkeln' : mode ? 'Wenig Licht' : 'Viel Licht', 24)}
    <path d="M85 221 Q330 42 575 221 Q330 400 85 221Z" fill="#fffdf4" stroke="#6c8878" stroke-width="5"/>
    ${dot(330, 221, 83, '#6d9a7d')}${dot(330, 221, taskId === 'T18' || mode ? 54 : 24, '#213c34')}
    ${text(330, 366, taskId === 'T18' ? 'Wenig Licht: Die Pupille wird größer.' : 'Die Iris verändert die Pupillenöffnung.', 18)}
    ${taskId === 'T18' ? text(330, 402, mode ? 'Mit der Zeit reagiert auch die Netzhaut empfindlicher.' : 'Muskeln in der Iris verändern die Öffnung.', 17) : ''}`, taskId === 'T18' ? 'Dunkler Raum: große Pupille. Auch die Netzhaut passt sich mit der Zeit an.' : 'Modell der Pupillenöffnung bei unterschiedlicher Beleuchtung.');
  if (taskId === 'T14') return svg(`${text(330, 45, 'Nur das Modell bewegt sich.', 22)}
    <path d="M294 300 C184 224 219 88 302 134 C389 184 409 298 294 300 M296 300 C358 196 466 122 473 205 C479 275 353 318 296 300" fill="none" stroke="#6f9d9b" stroke-width="23"/>
    ${dot(mode ? 272 : 235, mode ? 166 : 215, 11, '#e1bb60')}
    ${text(330, 374, 'Bogengänge: ein Teil des Gleichgewichtsorgans', 18)}${text(330, 412, 'Flüssigkeit hilft, Drehbewegungen wahrzunehmen.', 16)}`, 'Schematisches Modell von flüssigkeitsgefüllten Bogengängen.');
  if (taskId === 'T12') return svg(`${text(330, 45, 'Zwei leicht verschiedene Blickrichtungen', 22)}
    ${dot(180, 130, 32, '#94b2a0')}${dot(480, 130, 32, '#94b2a0')}
    ${line(180, 163, mode ? 343 : 320, 294)}${line(480, 163, mode ? 343 : 320, 294)}
    <path d="M316 325 L320 244 L333 244 L337 325Z" fill="#cb9676"/>
    ${text(180, 205, 'Linkes Auge', 18)}${text(480, 205, 'Rechtes Auge', 18)}
    ${text(330, 392, 'Das Gehirn verarbeitet beide Ansichten.', 18)}`, 'Linkes und rechtes Auge blicken aus verschiedenen Richtungen auf einen Stift.');
  if (taskId === 'T11') return svg(`${text(330, 45, 'Sinneszellen in der Netzhaut', 22)}
    <rect x="120" y="117" width="32" height="150" rx="15" fill="#8ba1a4"/>
    <path d="M240 270 L251 120 Q259 95 267 120 L279 270 M358 270 L369 120 Q377 95 385 120 L397 270 M476 270 L487 120 Q495 95 503 120 L515 270" fill="#c99074" stroke="#8f684e" stroke-width="3"/>
    ${text(140, 320, 'Stäbchen', 19)}${text(370, 320, 'Drei Zapfentypen', 19)}
    ${text(330, 391, 'Die Empfindlichkeiten der Zapfentypen überlappen.', 18)}`, 'Schema: Stäbchen und drei Zapfentypen. Ihre Empfindlichkeiten überlappen.');
  if (taskId === 'T23') return svg(`
    <path d="M140 152 Q330 80 520 152" fill="none" stroke="#806f50" stroke-width="20"/>
    <path d="M115 245 Q330 90 545 245 Q330 400 115 245Z" fill="#fffdf4" stroke="#b58e73" stroke-width="10"/>
    ${dot(330, 245, 65, '#759f85')}${dot(330, 245, 28, '#203e35')}
    ${[170, 230, 290, 370, 430, 490].map(x => line(x, 190 - Math.sin(x / 660 * Math.PI) * 20, x - 5, 155 - Math.sin(x / 660 * Math.PI) * 20, '#5e5641', 5)).join('')}
    <path d="M551 248 Q581 296 551 312 Q522 296 551 248" fill="#9ac6d0"/>
    ${text(330, 410, 'Augenbrauen · Wimpern · Augenlid · Tränenflüssigkeit', 17)}`, 'Äußeres Auge mit Augenbrauen, Wimpern, Augenlid und Tränenflüssigkeit.');
  if (taskId === 'T17' || taskId === 'T19') return svg(`${text(330, 45, taskId === 'T19' ? 'Gong → bewusstes Aufstehen' : 'Nachrichten zum Gehirn', 23)}
    ${[125, 330, 535].map((x, i) => `${dot(x, 215, 48, ['#c9d9ba', '#e8c891', '#b8d6ce'][i])}${text(x, 221, ['Reiz', 'Gehirn', 'Reaktion'][i], 18)}`).join('')}
    ${line(180, 215, 273, 215)}${line(385, 215, 477, 215)}
    ${text(330, 370, taskId === 'T19' ? 'Vereinfachter Weg · bewusstes Handeln, kein Reflexbogen' : 'Hören und Sehen nutzen unterschiedliche Nervenwege.', 17)}`, 'Vereinfachtes Signalweg-Modell.');
  if (taskId === 'T02') return svg(`${text(330, 45, 'Ein Konzert. Viele gute Schutzentscheidungen.', 21)}
    <rect x="110" y="110" width="115" height="210" rx="18" fill="#355a50"/>
    ${dot(168, 177, 32, '#9fb4a0')}${dot(168, 267, 42, '#9fb4a0')}
    ${dot(475, 160, 40, '#edcdb3')}
    <path d="M431 155 Q430 96 474 96 Q519 96 519 155" fill="none" stroke="#d1a748" stroke-width="17"/>
    <path d="M440 213 L510 213 L529 323 L421 323Z" fill="#8aaa8f"/>
    ${text(330, 398, 'Kein Ton wird abgespielt. Du entscheidest in Ruhe.', 17)}`, 'Konzertlautsprecher und Person mit Gehörschutz.');
  return svg(`${text(330, 50, 'Verstehen hat viele Wege.', 25)}
    ${dot(180, 182, 41, '#e8c6a8')}${dot(480, 182, 41, '#d5b08e')}
    <path d="M129 242 L231 242 L247 348 L113 348" fill="#86a995"/>
    <path d="M429 242 L531 242 L547 348 L413 348" fill="#c4ae72"/>
    <rect x="267" y="115" width="127" height="97" rx="23" fill="#fffef6" stroke="#9bb29a" stroke-width="3"/>
    ${text(330, 154, 'Text', 19)}${text(330, 183, 'Bild · Sprache', 16)}
    ${text(330, 409, 'Frage nach der bevorzugten Art der Verständigung.', 17)}`, 'Zwei Menschen kommunizieren. Texte, Bilder und Sprachen sind mögliche Wege.');
}
