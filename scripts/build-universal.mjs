// Repository-specific integration, deliberately outside the reusable template.
import { mkdir, copyFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
await rm('artifacts/universal/sinneslabor-source', { recursive: true, force: true });
await mkdir('artifacts/universal/sinneslabor-source', { recursive: true });
await copyFile('spiel/Mission-Sinneslabor-offline.html', 'artifacts/universal/sinneslabor-source/index.html');
execFileSync('node', ['scorm-template/scripts/build.mjs', 'integration/scorm-universal/sinneslabor.config.json'], { stdio: 'inherit' });
