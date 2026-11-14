"""Validate local references and JavaScript without external services."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import subprocess

ROOT = Path(__file__).resolve().parents[1]

class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs = path, set(), []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'{self.path.name}: duplicate id {attrs["id"]}'
            self.ids.add(attrs['id'])
        for key in ('src', 'href', 'poster'):
            if attrs.get(key):
                self.refs.append(attrs[key])
        if tag == 'img':
            assert 'alt' in attrs, f'{self.path.name}: image without alt'
        if tag == 'a' and attrs.get('target') == '_blank':
            assert 'noopener' in attrs.get('rel', '').split(), 'External link missing noopener'

docs = {p.resolve(): Document(p) for p in ROOT.glob('*.html')}
checked = 0
for path, doc in docs.items():
    for ref in doc.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        assert target.is_relative_to(ROOT), f'Reference outside site: {ref}'
        assert target.is_file(), f'{path.name}: missing file {ref}'
        if url.fragment and target in docs:
            assert unquote(url.fragment) in docs[target].ids, f'{path.name}: missing anchor {ref}'
        checked += 1
for script in ROOT.glob('*.js'):
    subprocess.run(['node', '--check', str(script)], check=True)
print(f'OK: {len(docs)} HTML pages, {checked} local references and JavaScript syntax.')
