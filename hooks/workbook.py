"""Додає на сторінку заняття посилання на крок робочого зошита.

Крок зошита — це сторінка docs/workbook/*.md з метаданими:

    ---
    lesson: CDTO_Meth_T2_Z2_Practical   # файл заняття без .md
    step: 2
    summary: Один рядок про те, що робить команда.
    ---

Блок вставляється перед тестом «Перевірте себе» (або перед «Контрольними
питаннями», якщо тесту немає). Хук має бути підключений після quiz.py.
"""

from __future__ import annotations

import logging
import re
from pathlib import Path

from mkdocs.utils.meta import get_data

log = logging.getLogger("mkdocs.hooks.workbook")

STEPS: dict[str, dict] = {}
TITLE = re.compile(r"^#\s+(?:Крок\s+\d+\.\s*)?(.+)$", re.M)
INSERT_BEFORE = re.compile(r"^## (Перевірте себе|Контрольні питання|Завдання|Додаток)", re.M)


def on_files(files, config):
    STEPS.clear()
    for file in files.documentation_pages():
        if not file.src_uri.startswith("workbook/"):
            continue
        text = Path(file.abs_src_path).read_text(encoding="utf-8")
        body, meta = get_data(text)
        lesson = meta.get("lesson")
        if not lesson:
            continue
        if lesson in STEPS:
            log.warning("Заняття %s має кілька кроків зошита: %s і %s",
                        lesson, STEPS[lesson]["src"], file.src_uri)
        title = TITLE.search(body)
        STEPS[lesson] = {
            "src": file.src_uri,
            "step": meta.get("step", "?"),
            "title": title.group(1).strip() if title else file.src_uri,
            "summary": meta.get("summary", ""),
        }
    return files


def on_page_markdown(markdown: str, page, config, files) -> str:
    step = STEPS.get(Path(page.file.src_uri).stem)
    if not step:
        return markdown

    block = (
        f"## Наскрізний проєкт: крок {step['step']} {{#robochyi-zoshyt}}\n\n"
        '<div class="lesson-workbook" markdown>\n\n'
        f'<p class="lesson-workbook__kicker">Робочий зошит · Крок {step["step"]}</p>\n\n'
        f'<p class="lesson-workbook__title">{step["title"]}</p>\n\n'
        + (f"{step['summary']}\n\n" if step["summary"] else "")
        + f"[Відкрити крок робочого зошита →]({step['src']}){{ .md-button .md-button--primary }}\n\n"
        "</div>\n\n"
    )
    match = INSERT_BEFORE.search(markdown)
    if match:
        return markdown[: match.start()] + block + markdown[match.start():]
    return markdown.rstrip() + "\n\n" + block
