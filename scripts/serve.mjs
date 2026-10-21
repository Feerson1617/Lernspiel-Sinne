import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve('dist');
const prefix = '/Lernspiel-Sinne';
createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    if (path === prefix) { res.writeHead(302, { Location: prefix + '/' }); return res.end(); }
    if (path.startsWith(prefix + '/')) path = path.slice(prefix.length);
    let file = resolve(root, '.' + path);
    if (!file.startsWith(root + '/') && file !== root) throw new Error('invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' })[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Datei nicht gefunden'); }
}).listen(4173, '0.0.0.0', () => console.log('Sinneslabor-Testserver auf Port 4173, Unterpfad /Lernspiel-Sinne/'));
