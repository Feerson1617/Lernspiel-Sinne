"""Prepare direct-download artifact roots, then verify the downloaded inventories."""
import hashlib
import json
from pathlib import Path
import shutil
import sys
import zipfile
sys.path.insert(0, str(Path('scorm-template/scripts').resolve()))
from build import write_zip
from validate import validate_package

names = ['SCORM-Universalvorlage', 'Sinneslabor-SCORM-Vorlagentest']
root = Path('artifacts/universal')
if '--check-download' in sys.argv:
    results = []
    for name in names:
        directory = root / 'download' / name
        files = {p.relative_to(directory).as_posix(): p.read_bytes() for p in directory.rglob('*') if p.is_file()}
        with zipfile.ZipFile(f'scorm-template/dist/{name}.zip') as archive:
            expected = {n: archive.read(n) for n in archive.namelist()}
        if files != expected: raise ValueError(f'Download inventory mismatch: {name}')
        repacked = root / f'{name}-roundtrip.zip'
        write_zip(files, repacked)
        if name.startswith('Sinneslabor'): validate_package(repacked)
        results.append({'artifact': name, 'files': len(files), 'inventory_identical': True, 'repacked_sha256': hashlib.sha256(repacked.read_bytes()).hexdigest()})
    Path('test-results/universal-download.json').write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps(results, indent=2))
else:
    for name in names:
        directory = root / 'publish' / name
        shutil.rmtree(directory, ignore_errors=True); directory.mkdir(parents=True)
        path = Path(f'scorm-template/dist/{name}.zip')
        if name.startswith('Sinneslabor'): validate_package(path)
        with zipfile.ZipFile(path) as archive: archive.extractall(directory)
    print('Artifact directories contain archive CONTENTS, no ZIP-in-ZIP.')
