from pathlib import Path
import importlib.util
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('validator', ROOT / 'scripts/validate_scorm.py')
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


class PackageValidation(unittest.TestCase):
    def setUp(self):
        with zipfile.ZipFile(validator.DEFAULT_ZIP) as archive:
            self.files = {name: archive.read(name) for name in archive.namelist()}

    def rejects(self, change):
        change(self.files)
        with tempfile.TemporaryDirectory() as folder:
            filename = Path(folder) / 'invalid.zip'
            with zipfile.ZipFile(filename, 'w') as archive:
                for name, data in self.files.items(): archive.writestr(name, data)
            with self.assertRaises(Exception): validator.validate_package(filename)

    def manifest(self, old, new):
        self.rejects(lambda files: files.update({'imsmanifest.xml': files['imsmanifest.xml'].replace(old, new)}))

    def test_real_zip(self): self.assertEqual(validator.validate_package()['status'], 'passed')
    def test_missing_launch(self): self.rejects(lambda files: files.pop('index.html'))
    def test_wrong_root(self): self.rejects(lambda files: files.update({'nested/imsmanifest.xml': files.pop('imsmanifest.xml')}))
    def test_traversal(self): self.rejects(lambda files: files.update({'../escape.txt': b'x'}))
    def test_case_collision(self): self.rejects(lambda files: files.update({'INDEX.HTML': files['index.html']}))
    def test_scorm_2004_is_not_12(self): self.manifest(b'<schemaversion>1.2', b'<schemaversion>2004')
    def test_undefined_organization(self): self.manifest(b'default="ORG-SINNESLABOR"', b'default="MISSING"')
    def test_undefined_resource(self): self.manifest(b'identifierref="RES-SINNESLABOR"', b'identifierref="MISSING"')
    def test_profile_required_title(self): self.manifest(b'<title>Mission Sinneslabor</title>', b'')
    def test_xsd_required_resource_type(self): self.manifest(b'type="webcontent"', b'')
    def test_xsd_adl_enum(self): self.manifest(b'scormtype="sco"', b'scormtype="invalid"')
    def test_wrong_2004_attribute(self): self.manifest(b'scormtype=', b'scormType=')
    def test_remote_launch(self): self.manifest(b'href="index.html"', b'href="https://example.invalid/game.html"')
    def test_remote_xsd(self): self.manifest(b' imscp_rootv1p1p2.xsd', b' https://example.invalid/cp.xsd')
    def test_missing_schema(self): self.rejects(lambda files: files.pop('adlcp_rootv1p2.xsd'))
    def test_changed_schema(self): self.rejects(lambda files: files.update({'adlcp_rootv1p2.xsd': b'<schema/>'}))
    def test_external_font(self): self.rejects(lambda files: files.update({'index.html': files['index.html'].replace(b'</head>', b'<style>@import "https://example.invalid/font.css";</style></head>')}))
    def test_external_image(self): self.rejects(lambda files: files.update({'index.html': files['index.html'].replace(b'</body>', b'<img src="https://example.invalid/pixel"></body>')}))
    def test_missing_internal_resource(self): self.rejects(lambda files: files.update({'index.html': files['index.html'].replace(b'</body>', b'<img src="missing.svg"></body>')}))
    def test_game_modified(self): self.rejects(lambda files: files.update({'index.html': files['index.html'].replace(b'24 Aufgaben', b'23 Aufgaben')}))
    def test_local_export_modified(self): self.rejects(lambda files: files.update({'Mission-Sinneslabor-offline.html': b'<p>changed</p>'}))


if __name__ == '__main__': unittest.main()
