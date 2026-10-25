import { build } from 'esbuild';
import { mkdir, rm, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = 'artifacts/scorm/package';
await rm(root, { recursive: true, force: true });
await mkdir(root, { recursive: true });
const source = await readFile('spiel/Mission-Sinneslabor-offline.html', 'utf8');
const { outputFiles } = await build({ entryPoints: ['scorm/entry.js'], bundle: true, format: 'iife', target: ['es2020'], minify: true, write: false });
const tools = await readFile('scorm/session.html', 'utf8');
const wrapper = `<!-- SCORM-WRAPPER-START -->\n${tools}<script>${outputFiles[0].text.replace(/<\/script/gi, '<\\/script')}</script>\n<!-- SCORM-WRAPPER-END -->`;
if (source.split('<body>').length !== 2) throw new Error('Expected one body in the original single-file export');
await writeFile(`${root}/index.html`, source.replace('<body>', `<body>${wrapper}`));
await copyFile('spiel/Mission-Sinneslabor-offline.html', `${root}/Mission-Sinneslabor-offline.html`);
for (const file of ['imsmanifest.xml', 'SCORM-HINWEISE.txt', 'THIRD-PARTY-NOTICES.txt']) await copyFile(`scorm/${file}`, `${root}/${file}`);
for (const file of ['imscp_rootv1p1p2.xsd', 'adlcp_rootv1p2.xsd', 'ims_xml.xsd', 'XMLSchema.dtd', 'datatypes.dtd']) await copyFile(`scorm/schemas/${file}`, `${root}/${file}`);
await writeFile(`${root}/package-info.json`, JSON.stringify({
  format: 'SCORM 1.2', launch: 'index.html',
  game_source_sha256: createHash('sha256').update(source).digest('hex'),
  git_commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  lms_writes: { 'cmi.core.lesson_status': 'incomplete (only for a new attempt)' },
  grades: false, learner_answers: false, completion_reporting: false
}, null, 2) + '\n');
execFileSync('python3', ['scripts/package_scorm.py', root], { stdio: 'inherit' });
