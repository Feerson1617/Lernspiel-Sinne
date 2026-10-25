import { resolve } from 'node:path';
import { servePackage } from '../scorm-template/scripts/serve.mjs';
servePackage({
  zip: resolve('scorm-template/dist/Sinneslabor-SCORM-Vorlagentest.zip'),
  port: 4177, httpsPort: 4175, secondHttpsPort: 4176,
  player: resolve('tests/scorm-player')
});
