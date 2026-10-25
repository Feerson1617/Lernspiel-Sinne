// Test-only HTTPS player. The game is served from the extracted, validated ZIP.
import { createServer } from 'node:https';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
mkdirSync('test-results/scorm-tls', { recursive: true });
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '2', '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1', '-keyout', 'test-results/scorm-tls/key.pem', '-out', 'test-results/scorm-tls/cert.pem'], { stdio: 'ignore' });
execFileSync('python3', ['scripts/validate_scorm.py', '--extract', 'artifacts/scorm/served'], { stdio: 'inherit' });
const tls = { key: readFileSync('test-results/scorm-tls/key.pem'), cert: readFileSync('test-results/scorm-tls/cert.pem') };
const prefix = '/lms/course/content/';
function respond(req, res) {
  try {
    const path = decodeURIComponent(new URL(req.url, 'https://localhost').pathname);
    const inPackage = path.startsWith(prefix);
    const root = resolve(inPackage ? 'artifacts/scorm/served' : 'tests/scorm-player');
    const file = resolve(root, inPackage ? path.slice(prefix.length) : '.' + path);
    if (!file.startsWith(root + '/')) throw new Error('Invalid path');
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.xml': 'application/xml' })[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(readFileSync(file));
  } catch { res.writeHead(404); res.end('Not found'); }
}
for (const port of [4175, 4176]) createServer(tls, respond).listen(port, '127.0.0.1', () => console.log(`HTTPS SCORM test player ready on ${port}`));
