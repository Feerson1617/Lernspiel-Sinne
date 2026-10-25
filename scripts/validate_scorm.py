"""Validate the actual ZIP offline: XSD, SCORM profile, paths and contained resources."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path, PurePosixPath
import re
import tempfile
from urllib.parse import unquote, urlsplit
import zipfile
from lxml import etree

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ZIP = ROOT / 'artifacts/scorm/Mission-Sinneslabor-SCORM-1.2.zip'
CP = 'http://www.imsproject.org/xsd/imscp_rootv1p1p2'
ADL = 'http://www.adlnet.org/xsd/adlcp_rootv1p2'
XSI = 'http://www.w3.org/2001/XMLSchema-instance'
NS = {'cp': CP, 'adlcp': ADL}


def local_path(value):
    parts = urlsplit(value)
    decoded = unquote(parts.path)
    path = PurePosixPath(decoded)
    if parts.scheme or parts.netloc or parts.query or not decoded or path.is_absolute() or '\\' in decoded or '..' in path.parts:
        raise ValueError(f'Non-local or unsafe resource path: {value}')
    return str(path)


class Resources(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []
        self.in_style = self.in_script = False
        self.styles, self.scripts = [], []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'base':
            raise ValueError('A base element can redirect package resources')
        for key in ['src', 'href', 'poster', 'data', 'action']:
            if attrs.get(key):
                self.paths.append(attrs[key])
        if 'srcset' in attrs:
            self.paths += [item.strip().split()[0] for item in attrs['srcset'].split(',')]
        if attrs.get('style'):
            self.styles.append(attrs['style'])
        self.in_style = tag == 'style'
        self.in_script = tag == 'script'

    def handle_endtag(self, tag):
        if tag == 'style': self.in_style = False
        if tag == 'script': self.in_script = False

    def handle_data(self, data):
        if self.in_style: self.styles.append(data)
        if self.in_script: self.scripts.append(data)


def validate_package(filename=DEFAULT_ZIP, extract=None):
    with zipfile.ZipFile(filename) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)) or len(names) != len({name.lower() for name in names}):
            raise ValueError('Duplicate or case-colliding ZIP entries')
        if 'imsmanifest.xml' not in names:
            raise ValueError('imsmanifest.xml must be at ZIP root')
        if any(local_path(name) != name for name in names):
            raise ValueError('Non-canonical ZIP path')
        if any((info.external_attr >> 16) & 0o170000 == 0o120000 for info in archive.infolist()):
            raise ValueError('ZIP contains a symlink')
        if sum(info.file_size for info in archive.infolist()) > 2048 * 1024 * 1024:
            raise ValueError('Package exceeds 2048 MB')
        if archive.testzip():
            raise ValueError('Corrupt ZIP entry')
        files = {name: archive.read(name) for name in names}
    with tempfile.TemporaryDirectory() as temporary:
        directory = Path(temporary)
        for name, data in files.items():
            target = directory / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        parser = etree.XMLParser(resolve_entities=False, load_dtd=False, no_network=True)
        manifest = etree.parse(str(directory / 'imsmanifest.xml'), parser)
        if manifest.docinfo.doctype:
            raise ValueError('DTD is not part of this package profile')
        # The schema set is trusted, pinned and independent of potentially modified ZIP schemas.
        schema = etree.XMLSchema(etree.parse(str(ROOT / 'scorm/schemas/validate.xsd'), parser))
        schema.assertValid(manifest)
        root = manifest.getroot()
        if root.tag != f'{{{CP}}}manifest': raise ValueError('Not an IMS CP 1.1.2 manifest')
        if root.findtext('cp:metadata/cp:schema', namespaces=NS) != 'ADL SCORM': raise ValueError('Missing ADL SCORM metadata')
        if root.findtext('cp:metadata/cp:schemaversion', namespaces=NS) != '1.2': raise ValueError('Not SCORM 1.2')
        organizations = root.find('cp:organizations', NS)
        default = organizations.get('default')
        if default not in [org.get('identifier') for org in organizations]: raise ValueError('Unresolved default organization')
        if any(not (org.findtext('cp:title', namespaces=NS) or '').strip() for org in organizations): raise ValueError('Missing organization title')
        resources = root.findall('cp:resources/cp:resource', NS)
        if len(resources) != 1: raise ValueError('Expected one SCO')
        resource = resources[0]
        if resource.get(f'{{{ADL}}}scormtype') != 'sco' or resource.get('type') != 'webcontent': raise ValueError('Not a SCORM 1.2 SCO')
        if local_path(resource.get('href', '')) != 'index.html': raise ValueError('Unexpected launch file')
        items = root.findall('.//cp:item', NS)
        if len(items) != 1 or items[0].get('identifierref') != resource.get('identifier'): raise ValueError('Unresolved SCO reference')
        if not (items[0].findtext('cp:title', namespaces=NS) or '').strip(): raise ValueError('Missing item title')
        references = [resource.get('href')] + [item.get('href') for item in resource.findall('cp:file', NS)]
        schema_locations = root.get(f'{{{XSI}}}schemaLocation', '').split()
        if len(schema_locations) % 2: raise ValueError('Invalid schemaLocation pairs')
        references += schema_locations[1::2]
        for reference in references:
            if local_path(reference) not in files: raise ValueError(f'Missing package resource: {reference}')
        for record in json.loads((ROOT / 'scorm/schemas/sources.json').read_text()):
            if hashlib.sha256(files[record['file']]).hexdigest() != record['sha256']:
                raise ValueError(f'Modified standard schema: {record["file"]}')
        for name in ['index.html', 'Mission-Sinneslabor-offline.html']:
            html = Resources()
            html.feed(files[name].decode('utf-8'))
            for style in html.styles:
                if re.search(r'@import\b', style, re.I): raise ValueError('External CSS import')
                html.paths += re.findall(r'url\(\s*[\'\"]?([^\)\'\"]+)', style, re.I)
            for reference in html.paths:
                if reference.startswith(('#', 'data:')): continue
                if local_path(reference) not in files: raise ValueError(f'Missing HTML resource: {reference}')
            if re.search(r'\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\s*\(|\bimport\s*\(', '\n'.join(html.scripts)):
                raise ValueError('Unexpected runtime network API')
        original = (ROOT / 'spiel/Mission-Sinneslabor-offline.html').read_bytes()
        if files['Mission-Sinneslabor-offline.html'] != original: raise ValueError('Original single-file export changed')
        unwrapped = re.sub(rb'<!-- SCORM-WRAPPER-START -->.*?<!-- SCORM-WRAPPER-END -->', b'', files['index.html'], flags=re.S)
        if unwrapped != original: raise ValueError('SCORM launch changed the underlying game')
        info = json.loads(files['package-info.json'])
        if info['game_source_sha256'] != hashlib.sha256(original).hexdigest(): raise ValueError('Incorrect source fingerprint')
        if extract:
            output = Path(extract)
            output.mkdir(parents=True, exist_ok=True)
            for name, data in files.items():
                target = output / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
    return {'status': 'passed', 'zip': Path(filename).name, 'bytes': Path(filename).stat().st_size,
            'files': sorted(files), 'xsd_validation': True, 'game_unchanged': True,
            'sha256': hashlib.sha256(Path(filename).read_bytes()).hexdigest()}


if __name__ == '__main__':
    cli = argparse.ArgumentParser()
    cli.add_argument('zip', nargs='?', default=str(DEFAULT_ZIP))
    cli.add_argument('--extract')
    cli.add_argument('--report')
    args = cli.parse_args()
    report = json.dumps(validate_package(args.zip, args.extract), indent=2) + '\n'
    if args.report: Path(args.report).write_text(report)
    print(report, end='')
