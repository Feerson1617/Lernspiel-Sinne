"""Create a deterministic PIF: the manifest is at the archive root, never in a subfolder."""
from pathlib import Path
import sys
import zipfile

root = Path(sys.argv[1])
output = root.parent / 'Mission-Sinneslabor-SCORM-1.2.zip'
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(root.iterdir()):
        if not path.is_file() or path.is_symlink():
            raise ValueError(f'Unexpected package entry: {path}')
        entry = zipfile.ZipInfo(path.name, date_time=(1980, 1, 1, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        archive.writestr(entry, path.read_bytes(), compresslevel=9)
print(f'{output}: {output.stat().st_size} bytes')
