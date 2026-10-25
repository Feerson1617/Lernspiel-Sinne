"""Validate the downloaded direct SCORM ZIP byte-for-byte, including root manifest."""
from pathlib import Path
import hashlib
from validate_scorm import validate_package

source = Path('artifacts/scorm/Mission-Sinneslabor-SCORM-1.2.zip')
folder = Path('artifacts/scorm/download-check')
received = folder / source.name
if not received.is_file() or sorted(p.name for p in folder.iterdir()) != [source.name]:
    raise SystemExit('Expected exactly one directly downloaded SCORM ZIP, without wrapper')
if received.read_bytes() != source.read_bytes():
    raise SystemExit('Downloaded SCORM ZIP differs from the previously validated build')
report = validate_package(received)
if report['status'] != 'passed':
    raise SystemExit('Downloaded SCORM ZIP failed validation')
print(f'Direct SCORM ZIP verified: {received.name}, SHA256={hashlib.sha256(received.read_bytes()).hexdigest()}')
print('Import directly into itslearning without extraction or recompression.')
