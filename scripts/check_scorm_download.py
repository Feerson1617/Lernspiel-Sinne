"""Confirm GitHub's downloadable artifact has the validated SCORM files at root."""
from pathlib import Path
import hashlib
import subprocess
from validate_scorm import validate_package

original = Path('artifacts/scorm/package')
downloaded = Path('artifacts/scorm/download-check')
inventory = lambda root: {str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest()
                          for path in root.rglob('*') if path.is_file()}
if inventory(original) != inventory(downloaded):
    raise SystemExit('Downloaded artifact differs or adds a directory around the manifest')
subprocess.run(['python3', 'scripts/package_scorm.py', str(downloaded)], check=True)
print(validate_package())
