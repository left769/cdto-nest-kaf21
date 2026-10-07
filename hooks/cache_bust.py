"""Додає до посилань на власні CSS і JS відбиток вмісту: `extra.css?v=1a2b3c4d`.

Без цього браузери (особливо Safari) показують стару копію стилів після
оновлення сайту: сторінка нова, а оформлення — від попередньої версії.
Відбиток змінюється разом із вмістом файлу, тож браузер завантажує
нову версію саме тоді, коли файл змінився.
"""

from __future__ import annotations

import hashlib
from pathlib import Path


def _fingerprint(docs_dir: Path, path: str) -> str:
    if "://" in path or path.startswith("//") or "?" in path:
        return path
    file = docs_dir / path
    if not file.is_file():
        return path
    digest = hashlib.sha1(file.read_bytes()).hexdigest()[:8]
    return f"{path}?v={digest}"


def on_config(config):
    docs_dir = Path(config.docs_dir)
    config.extra_css = [_fingerprint(docs_dir, path) for path in config.extra_css]
    scripts = []
    for script in config.extra_javascript:
        # Прості записи — рядки, записи з атрибутами (defer, type) — об’єкти.
        if isinstance(script, str):
            script = _fingerprint(docs_dir, script)
        else:
            script.path = _fingerprint(docs_dir, script.path)
        scripts.append(script)
    config.extra_javascript = scripts
    return config
