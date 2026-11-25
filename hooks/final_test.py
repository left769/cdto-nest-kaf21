"""Тести за всім курсом: підсумковий (docs/final_test.md → /final_test/)
і вхідний контроль (docs/start.md → /start/).

Хук обробляє кожну сторінку, у метаданих якої є розділ final_test. Обидві
сторінки беруть питання з одного банку й відрізняються лише налаштуваннями.

Банк питань — тести «Перевірте себе» з quizzes/, згруповані за модулями так,
як заняття стоять у навігації mkdocs.yml: модуль — це розділ навігації, у якому
лежать сторінки занять із тестами. Тому після перестановки модулів у навігації
тест сам підхопить новий порядок і назви.

Хук вбудовує банк у сторінку як JSON. Добір питань (рівномірно з модулів і
занять), перевірка й PDF-сертифікат — у docs/javascripts/final-test.js,
у браузері слухача; сервер нічого не отримує.

Правильні відповіді в банку не лежать відкритим текстом: замість них —
відбиток SHA-256 від «ідентифікатор питання|номери правильних варіантів».
Це захист від підглядання в код сторінки, а не від свідомого злому:
перевірку в браузері без сервера обійти можна завжди.

Кількість питань, бали за питання й прохідний бал (у балах) задаються
в метаданих сторінки:

    final_test:
      kind: final     # final — підсумковий тест, entry — вхідний контроль
      questions: 50
      points: 2
      pass: 70        # без pass прохідного бала немає: результат у PDF
                      # можна завантажити за будь-якого рахунку

Від kind залежать тексти сторінки й PDF (сертифікат чи результат вхідного
контролю) і ключ, під яким спроба зберігається в браузері.
"""

from __future__ import annotations

import hashlib
import json
import logging
from pathlib import Path

# Під час завантаження хука каталог hooks/ є в sys.path (так завантажує MkDocs).
from cache_bust import fingerprint
from quiz import QUIZ_DIR, parse_quiz

log = logging.getLogger("mkdocs.hooks.final_test")

KINDS = ("final", "entry")
DEFAULT_KIND = "final"
DEFAULT_QUESTIONS = 50
DEFAULT_POINTS = 2

# Попередження про тести поза навігацією — один раз на збирання,
# а не для кожної сторінки з тестом.
_warned_unused = False

# Файли, які потрібні лише сторінці тесту: адреси з відбитком вмісту
# потрапляють у config.extra.final_test і звідти — у шаблон final_test.html.
ASSETS = {
    "css": "stylesheets/final-test.css",
    "js": "javascripts/final-test.js",
    "jspdf": "assets/vendor/jspdf-4.2.1.umd.min.js",
    "logo": "assets/final-test/logo.jpg",
    "font_light": "assets/fonts/pdf/e-Ukraine-Light.ttf",
    "font_regular": "assets/fonts/pdf/e-Ukraine-Regular.ttf",
    "font_medium": "assets/fonts/pdf/e-Ukraine-Medium.ttf",
}


def on_config(config):
    global _warned_unused
    _warned_unused = False
    docs_dir = Path(config.docs_dir)
    config.extra["final_test"] = {
        key: fingerprint(docs_dir, path) for key, path in ASSETS.items()
    }
    return config


def answer_key(question_id: str, correct: list[int]) -> str:
    """Відбиток правильної відповіді; той самий рахує final-test.js."""
    payload = f"{question_id}|{','.join(map(str, sorted(correct)))}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def lesson_stem(entry) -> str | None:
    """Ім’я файлу заняття (без .md) з пункту навігації або None."""
    if isinstance(entry, dict) and len(entry) == 1:
        entry = next(iter(entry.values()))
    if isinstance(entry, str) and entry.endswith(".md"):
        return Path(entry).stem
    return None


def find_modules(nav) -> list[tuple[str, list[str]]]:
    """Розділи навігації, у яких безпосередньо лежать заняття з тестами."""
    modules: list[tuple[str, list[str]]] = []
    for item in nav or []:
        if not isinstance(item, dict):
            continue
        for title, children in item.items():
            if not isinstance(children, list):
                continue
            stems = [
                stem for stem in map(lesson_stem, children)
                if stem and (QUIZ_DIR / f"{stem}.md").exists()
            ]
            if stems:
                modules.append((title, stems))
            else:
                modules.extend(find_modules(children))
    return modules


def build_bank(page_name: str, config, count: int, points: int,
               pass_score: int | None) -> dict:
    global _warned_unused
    modules = []
    used: set[str] = set()
    for title, stems in find_modules(config.nav):
        lessons = []
        for stem in stems:
            source = QUIZ_DIR / f"{stem}.md"
            _, questions = parse_quiz(source.read_text(encoding="utf-8"), source.name)
            items = []
            for number, question in enumerate(questions, 1):
                options = question["options"]
                correct = [i for i, (_, ok) in enumerate(options) if ok]
                if len(options) < 2 or not correct:
                    continue  # quiz.py уже попередив про це питання
                question_id = f"{stem}#{number}"
                items.append({
                    "id": question_id,
                    "text": question["text"],
                    "options": [text for text, _ in options],
                    "multi": len(correct) > 1,
                    "key": answer_key(question_id, correct),
                })
            if items:
                lessons.append({"id": stem, "questions": items})
                used.add(stem)
        if lessons:
            modules.append({"title": title, "lessons": lessons})

    if not _warned_unused:
        _warned_unused = True
        for source in sorted(QUIZ_DIR.glob("*.md")):
            if source.stem not in used:
                log.warning(
                    "%s: тест не потрапить у тести за курсом — заняття немає "
                    "в жодному модулі навігації mkdocs.yml", source.name,
                )

    available = sum(len(l["questions"]) for m in modules for l in m["lessons"])
    if count > available:
        log.warning("%s: просять %d питань, а в банку лише %d", page_name, count, available)
        count = available
    if pass_score is not None and pass_score > count * points:
        log.warning("%s: прохідний бал %d більший за максимум %d", page_name, pass_score, count * points)
        pass_score = count * points

    # Версія банку: змінилися питання — незавершену спробу в браузері почнуть заново.
    version = hashlib.sha256(
        json.dumps(modules, ensure_ascii=False, sort_keys=True).encode("utf-8")
    ).hexdigest()[:12]
    return {
        "version": version,
        "questions": count,
        "points": points,
        "pass": pass_score,
        "modules": modules,
    }


def settings(page) -> tuple[str, int, int, int | None]:
    name = page.file.src_uri
    meta = page.meta.get("final_test") or {}
    kind = meta.get("kind", DEFAULT_KIND)
    if kind not in KINDS:
        log.warning("%s: kind у final_test — одне з %s", name, ", ".join(KINDS))
        kind = DEFAULT_KIND
    try:
        questions = int(meta.get("questions", DEFAULT_QUESTIONS))
        points = int(meta.get("points", DEFAULT_POINTS))
        pass_score = None if meta.get("pass") is None else int(meta["pass"])
    except (TypeError, ValueError):
        log.warning("%s: questions, points і pass у final_test мають бути цілими числами", name)
        return kind, DEFAULT_QUESTIONS, DEFAULT_POINTS, None
    if min(questions, points, 1 if pass_score is None else pass_score) < 1:
        log.warning("%s: questions, points і pass у final_test мають бути більші за нуль", name)
        return kind, DEFAULT_QUESTIONS, DEFAULT_POINTS, None
    return kind, questions, points, pass_score


def on_page_content(html: str, page, config, files) -> str:
    if "final_test" not in page.meta:
        return html

    kind, *values = settings(page)
    bank = build_bank(page.file.src_uri, config, *values)
    # Підсумки для шаблону (перший екран).
    page.meta["final_test"] = {
        "kind": kind,
        "questions": bank["questions"],
        "points": bank["points"],
        "max": bank["questions"] * bank["points"],
        "pass": bank["pass"],
        "modules": len(bank["modules"]),
    }

    data = (
        json.dumps(bank, ensure_ascii=False, separators=(",", ":"))
        .replace("<", "\\u003c")
        .replace(">", "\\u003e")
        .replace("&", "\\u0026")
    )
    return html + f'<script type="application/json" id="final-test-data">{data}</script>'
