"""Вбудовує тест «Перевірте себе» у сторінки занять.

Тест для заняття docs/<назва>.md лежить у quizzes/<назва>.md (поза docs/,
тож сирі файли з відповідями не публікуються). Формат файлу тесту:

    # Будь-який коментар-заголовок (ігнорується)
    Прохідний бал: 75

    ## Текст питання
    + правильна відповідь
    - хибна відповідь
    - хибна відповідь
    > Пояснення, яке слухач побачить після перевірки.

Кілька рядків «+» в одному питанні — питання з кількома правильними
відповідями. Тест вставляється перед розділом «Контрольні питання»
(або перед «Завдання…» / «Додаток…», якщо його немає).
"""

from __future__ import annotations

import html
import logging
import re
from pathlib import Path

log = logging.getLogger("mkdocs.hooks.quiz")

QUIZ_DIR = Path(__file__).resolve().parent.parent / "quizzes"
DEFAULT_PASS = 75
INSERT_BEFORE = re.compile(r"^## (Контрольні питання|Завдання|Додаток)", re.M)
PASS_LINE = re.compile(r"^прохідний бал:\s*(\d+)\s*%?$", re.I)


def parse_quiz(text: str, source: str) -> tuple[int, list[dict]]:
    pass_mark = DEFAULT_PASS
    questions: list[dict] = []
    current: dict | None = None

    for lineno, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("# "):
            continue
        if match := PASS_LINE.match(line):
            pass_mark = int(match.group(1))
        elif line.startswith("## "):
            current = {"text": line[3:].strip(), "options": [], "explain": []}
            questions.append(current)
        elif current is None:
            log.warning("%s:%d: рядок поза питанням: %s", source, lineno, line)
        elif line[:2] in ("+ ", "- "):
            current["options"].append((line[2:].strip(), line[0] == "+"))
        elif line.startswith(">"):
            current["explain"].append(line[1:].strip())
        else:
            log.warning("%s:%d: незрозумілий рядок: %s", source, lineno, line)

    for number, question in enumerate(questions, 1):
        correct = sum(is_correct for _, is_correct in question["options"])
        if len(question["options"]) < 2 or correct == 0:
            log.warning(
                "%s: у питанні %d має бути щонайменше 2 варіанти, з них 1 правильний (+)",
                source, number,
            )
    return pass_mark, questions


def render_quiz(quiz_id: str, pass_mark: int, questions: list[dict]) -> str:
    esc = html.escape
    count = len(questions)
    parts = [
        f'<section class="lesson-quiz" data-quiz="{esc(quiz_id)}" '
        f'data-pass="{pass_mark}" aria-labelledby="perevirte-sebe">',
        f'<p class="lesson-quiz__intro">{count} {plural(count)} · '
        f"прохідний результат — {pass_mark}%. Відповіді перевіряються одразу "
        "на сторінці й нікуди не надсилаються.</p>",
        '<form class="lesson-quiz__form" novalidate>',
    ]
    for number, question in enumerate(questions, 1):
        multi = sum(is_correct for _, is_correct in question["options"]) > 1
        kind = "checkbox" if multi else "radio"
        explain = " ".join(question["explain"])
        parts.append(
            f'<fieldset class="lesson-quiz__q" id="quiz-q{number}" '
            f'data-explain="{esc(explain)}">'
            f'<legend><span class="lesson-quiz__num">{number}</span>'
            f"<span>{esc(question['text'])}</span></legend>"
        )
        if multi:
            parts.append('<p class="lesson-quiz__hint">Оберіть усі правильні варіанти</p>')
        for index, (text, is_correct) in enumerate(question["options"]):
            flag = " data-correct" if is_correct else ""
            parts.append(
                f'<label class="lesson-quiz__opt"><input type="{kind}" '
                f'name="q{number}" value="{index}"{flag}><span>{esc(text)}</span></label>'
            )
        parts.append('<div class="lesson-quiz__feedback" hidden></div></fieldset>')
    parts += [
        '<div class="lesson-quiz__summary" tabindex="-1" role="status" aria-live="polite"></div>',
        '<div class="lesson-quiz__actions">'
        '<button type="submit" class="md-button md-button--primary">Перевірити відповіді</button>'
        '<button type="button" class="md-button lesson-quiz__reset" hidden>Пройти ще раз</button>'
        "</div>",
        "</form>",
        "</section>",
    ]
    return "".join(parts)


def plural(n: int) -> str:
    if n % 10 == 1 and n % 100 != 11:
        return "питання"
    return "питання" if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14 else "питань"


def on_page_markdown(markdown: str, page, config, files) -> str:
    stem = Path(page.file.src_uri).stem
    source = QUIZ_DIR / f"{stem}.md"
    if not source.exists():
        return markdown

    pass_mark, questions = parse_quiz(source.read_text(encoding="utf-8"), source.name)
    if not questions:
        return markdown

    block = (
        "## Перевірте себе {#perevirte-sebe}\n\n"
        + render_quiz(stem, pass_mark, questions)
        + "\n\n"
    )
    match = INSERT_BEFORE.search(markdown)
    if match:
        return markdown[: match.start()] + block + markdown[match.start():]
    return markdown.rstrip() + "\n\n" + block
