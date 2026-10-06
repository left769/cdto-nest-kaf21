# Навчальний портал CDTO

Навчальні матеріали курсу цифрової трансформації для офіцерів CDTO. Сайт створюється з Markdown-документів за допомогою MkDocs Material.

- **7 тематичних напрямів**
- **28 навчальних занять**
- [Перейти до програми курсу](docs/program.md)

## Локальний запуск

Потрібен Python 3.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
mkdocs serve
```

Відкрийте [http://127.0.0.1:8000](http://127.0.0.1:8000). Для production-збірки виконайте:

```bash
mkdocs build --strict
```

Зібраний сайт буде у каталозі `site/`.

## Структура

- `mkdocs.yml` — тема, розширення Markdown і навігація.
- `docs/index.md` — головна сторінка порталу.
- `docs/program.md` — текстовий перелік занять (у збірку сайту не входить, каталог — на головній).
- `docs/CDTO_Meth_*.md` — матеріали навчальних занять.
- `docs/stylesheets/extra.css` — стилі порталу.

Щоб оновити матеріали, змініть відповідний Markdown-файл у `docs/`. Під час `mkdocs serve` сайт автоматично оновиться.
