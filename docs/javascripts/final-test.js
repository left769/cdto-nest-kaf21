/*
 * Підсумковий тест — сторінка /final_test/ (шаблон overrides/final_test.html).
 *
 * Банк питань вбудовує hooks/final_test.py у <script id="final-test-data">.
 * Тут — добір питань (порівну з модулів, у модулі — порівну із занять),
 * перевірка, екран результату й PDF-сертифікат (jsPDF + шрифт e-Ukraine +
 * емблема кафедри). Усе відбувається в браузері слухача, на сервер нічого
 * не надсилається.
 *
 * Спроба й результат зберігаються в sessionStorage: оновлення сторінки їх
 * не скидає, закриття вкладки — скидає (на спільному комп’ютері наступний
 * слухач починає з чистого аркуша).
 */
(() => {
  const root = document.querySelector(".final-test");
  const dataEl = document.getElementById("final-test-data");
  if (!root || !dataEl) return;

  const bank = JSON.parse(dataEl.textContent);
  const STORE_KEY = "cdto-final-test";

  const $ = (selector, scope = root) => scope.querySelector(selector);
  const screens = {
    intro: $('[data-screen="intro"]'),
    test: $('[data-screen="test"]'),
    result: $('[data-screen="result"]'),
  };

  // ---------- Сховище ----------

  const store = {
    read() {
      try {
        return JSON.parse(sessionStorage.getItem(STORE_KEY));
      } catch {
        return null;
      }
    },
    write(value) {
      try {
        sessionStorage.setItem(STORE_KEY, JSON.stringify(value));
      } catch {
        /* приватний режим — тест працює, але оновлення сторінки його скине */
      }
    },
    clear() {
      try {
        sessionStorage.removeItem(STORE_KEY);
      } catch {
        /* нічого */
      }
    },
  };

  // ---------- Банк і добір питань ----------

  const byId = new Map();
  bank.modules.forEach((module, m) => {
    module.lessons.forEach((lesson) => {
      lesson.questions.forEach((question) => byId.set(question.id, { ...question, module: m }));
    });
  });

  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Ділить total між кошиками якомога рівніше, не більше за місткість кожного;
  // те, що не ділиться порівну, дістається випадковим кошикам.
  const spread = (total, caps) => {
    const alloc = caps.map(() => 0);
    let left = Math.min(total, caps.reduce((sum, cap) => sum + cap, 0));
    while (left > 0) {
      const open = caps.map((_, i) => i).filter((i) => alloc[i] < caps[i]);
      const share = Math.floor(left / open.length);
      const take = share > 0 ? open : shuffle(open).slice(0, left);
      take.forEach((i) => {
        const add = Math.min(Math.max(share, 1), caps[i] - alloc[i]);
        alloc[i] += add;
        left -= add;
      });
    }
    return alloc;
  };

  // Порядок модулів — як у курсі; всередині модуля питання перемішані.
  const pickQuestions = () => {
    const sizes = bank.modules.map((module) =>
      module.lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0));
    const perModule = spread(bank.questions, sizes);
    return bank.modules.flatMap((module, m) => {
      const perLesson = spread(perModule[m], module.lessons.map((lesson) => lesson.questions.length));
      const picked = module.lessons.flatMap((lesson, i) => shuffle(lesson.questions).slice(0, perLesson[i]));
      return shuffle(picked).map((question) => ({
        id: question.id,
        order: shuffle(question.options.map((_, index) => index)),
      }));
    });
  };

  // ---------- Ім’я та прізвище ----------

  const UK = "А-ЩЬЮЯҐЄІЇа-щьюяґєії";
  const NAME = new RegExp(`^[${UK}]+(?:[’\\- ][${UK}]+)*$`);

  const normalizeName = (value) => value
    .normalize("NFC")
    .replace(/['`ʼ‘′´]/g, "’")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/ ?- ?/g, "-")
    .trim()
    .toLocaleLowerCase("uk")
    .replace(/(^|[ -])(\S)/g, (_, gap, letter) => gap + letter.toLocaleUpperCase("uk"));

  const nameError = (value, what) => {
    if (!value) return `Вкажіть ${what}.`;
    if (/[A-Za-z]/.test(value)) return "Пишіть українськими літерами, а не латиницею.";
    if (/[ЁёЪъЫыЭэ]/.test(value)) return "Літер ё, ъ, ы, э немає в українській абетці.";
    if (!NAME.test(value)) return "Лише українські літери, апостроф і дефіс.";
    if (value.replace(/[’\- ]/g, "").length < 2) return "Занадто коротко.";
    return "";
  };

  const fullName = (s) => `${s.first} ${s.last.toLocaleUpperCase("uk")}`;

  // ---------- Допоміжне ----------

  const plural = (n, one, few, many) => {
    if (n % 10 === 1 && n % 100 !== 11) return one;
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return few;
    return many;
  };

  // «з» чи «зі» перед числом: «зі» — коли число вимовляється на с-/ш- («зі ста»).
  const from = (n) => (/^(1\d\d|4\d|6\d?|7\d?|1[67])$/.test(String(n)) ? "зі" : "з");

  const formatDate = (iso) => new Date(iso).toLocaleDateString("uk-UA", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // initial — перший показ після завантаження: не чіпаємо прокрутку, щоб після
  // оновлення сторінки браузер повернув слухача до того ж питання.
  const show = (name, focusTarget, initial = false) => {
    Object.entries(screens).forEach(([key, screen]) => { screen.hidden = key !== name; });
    if (initial) return;
    window.scrollTo(0, 0);
    focusTarget?.focus({ preventScroll: true });
  };

  // ---------- Стан ----------
  // { version, first, last, items: [{ id, order }], answers: { id: [індекси] }, result }

  let state = null;

  const save = () => store.write(state);

  window.addEventListener("beforeunload", (event) => {
    if (state && !state.result) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  // ---------- Екран 1: дані слухача ----------

  const startForm = $(".final-test__start");
  const fields = {
    first: { input: $("#final-test-first"), error: $("#final-test-first-error"), what: "ім’я" },
    last: { input: $("#final-test-last"), error: $("#final-test-last-error"), what: "прізвище" },
  };

  const checkField = (field) => {
    const value = normalizeName(field.input.value);
    const error = nameError(value, field.what);
    field.error.textContent = error;
    field.input.setAttribute("aria-invalid", error ? "true" : "false");
    return { value, error };
  };

  Object.values(fields).forEach((field) => {
    field.input.addEventListener("blur", () => {
      if (!field.input.value.trim()) return;
      const { value, error } = checkField(field);
      if (!error) field.input.value = value;
    });
    field.input.addEventListener("input", () => {
      if (field.error.textContent) checkField(field);
    });
  });

  startForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const first = checkField(fields.first);
    const last = checkField(fields.last);
    if (first.error || last.error) {
      (first.error ? fields.first : fields.last).input.focus();
      return;
    }
    fields.first.input.value = first.value;
    fields.last.input.value = last.value;
    state = {
      version: bank.version,
      first: first.value,
      last: last.value,
      items: pickQuestions(),
      answers: {},
      result: null,
    };
    save();
    showTest();
  });

  // ---------- Екран 2: питання ----------

  const testForm = $(".final-test__questions");
  const list = $(".final-test__list");
  const summary = $(".lesson-quiz__summary", testForm);
  const finish = $('[type="submit"]', testForm);
  const counter = $(".final-test__count strong");
  const progress = $(".final-test__progress > span");
  let confirming = false;

  const answered = () => state.items.filter((item) => state.answers[item.id]?.length).length;

  const updateProgress = () => {
    const done = answered();
    counter.textContent = done;
    progress.style.width = `${(done / state.items.length) * 100}%`;
  };

  const resetConfirm = () => {
    if (!confirming) return;
    confirming = false;
    finish.textContent = "Завершити тест";
    summary.innerHTML = "";
    summary.className = "lesson-quiz__summary";
  };

  const renderQuestions = () => {
    list.replaceChildren();
    let module = -1;
    state.items.forEach((item, n) => {
      const question = byId.get(item.id);
      if (question.module !== module) {
        module = question.module;
        list.append(el("h2", "final-test__module", bank.modules[module].title));
      }
      const fieldset = el("fieldset", "lesson-quiz__q");
      fieldset.id = `final-test-q${n + 1}`;
      fieldset.dataset.id = item.id;
      const legend = el("legend");
      legend.append(el("span", "lesson-quiz__num", String(n + 1)), el("span", "", question.text));
      fieldset.append(legend);
      if (question.multi) fieldset.append(el("p", "lesson-quiz__hint", "Оберіть усі правильні варіанти"));
      const picked = state.answers[item.id] || [];
      item.order.forEach((index) => {
        const label = el("label", "lesson-quiz__opt");
        const input = el("input");
        input.type = question.multi ? "checkbox" : "radio";
        input.name = `q${n + 1}`;
        input.value = String(index);
        input.checked = picked.includes(index);
        label.append(input, el("span", "", question.options[index]));
        fieldset.append(label);
      });
      list.append(fieldset);
    });
  };

  testForm.addEventListener("change", (event) => {
    const fieldset = event.target.closest(".lesson-quiz__q");
    if (!fieldset) return;
    fieldset.classList.remove("is-missing");
    state.answers[fieldset.dataset.id] = [...fieldset.querySelectorAll("input:checked")]
      .map((input) => Number(input.value));
    save();
    updateProgress();
    resetConfirm();
  });

  const showTest = (initial = false) => {
    $(".final-test__who").textContent = fullName(state);
    renderQuestions();
    updateProgress();
    resetConfirm();
    show("test", $('[data-screen="test"] h1'), initial);
  };

  // ---------- Перевірка ----------
  // Правильна відповідь у банку — відбиток SHA-256 (див. hooks/final_test.py).

  const answerKey = async (id, picked) => {
    const payload = `${id}|${[...picked].sort((a, b) => a - b).join(",")}`;
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
    return [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 16);
  };

  const grade = async () => {
    const modules = bank.modules.map((module) => ({ title: module.title, correct: 0, total: 0 }));
    let correct = 0;
    for (const item of state.items) {
      const question = byId.get(item.id);
      const picked = state.answers[item.id] || [];
      const right = picked.length > 0 && (await answerKey(item.id, picked)) === question.key;
      modules[question.module].total += 1;
      if (right) {
        modules[question.module].correct += 1;
        correct += 1;
      }
    }
    const total = state.items.length;
    const score = correct * bank.points;
    return {
      correct,
      total,
      score,
      max: total * bank.points,
      points: bank.points,
      pass: bank.pass,
      passed: score >= bank.pass,
      modules: modules.filter((module) => module.total > 0),
      date: new Date().toISOString(),
    };
  };

  testForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const missing = [...list.querySelectorAll(".lesson-quiz__q")]
      .filter((fieldset) => !state.answers[fieldset.dataset.id]?.length);
    if (missing.length) {
      resetConfirm();
      missing.forEach((fieldset) => fieldset.classList.add("is-missing"));
      const links = missing
        .map((fieldset) => `<a href="#${fieldset.id}">${fieldset.querySelector(".lesson-quiz__num").textContent}</a>`)
        .join(", ");
      summary.className = "lesson-quiz__summary is-warning";
      summary.innerHTML = `<p><strong>Ще не всі відповіді.</strong> Залишилось відповісти на питання ${links}.</p>`;
      summary.focus();
      return;
    }

    if (!confirming) {
      confirming = true;
      summary.className = "lesson-quiz__summary is-warning";
      summary.innerHTML = "<p><strong>Усі відповіді дано.</strong> Після завершення змінити їх буде неможливо. Завершити тест?</p>";
      finish.textContent = "Так, завершити тест";
      summary.focus();
      return;
    }

    if (!window.crypto?.subtle) {
      summary.className = "lesson-quiz__summary is-warning";
      summary.innerHTML = "<p><strong>Не вдалося перевірити відповіді.</strong> Відкрийте тест через захищене з’єднання (адреса починається з https://).</p>";
      summary.focus();
      return;
    }

    finish.disabled = true;
    try {
      state.result = await grade();
      save();
      showResult();
    } finally {
      finish.disabled = false;
    }
  });

  // ---------- Екран 3: результат ----------

  const stat = (value, label) => {
    const box = el("div");
    box.append(el("strong", "", value), el("span", "", label));
    return box;
  };

  const showResult = (initial = false) => {
    const { result } = state;
    $(".final-test__name").textContent = fullName(state);
    $(".final-test__verdict").textContent = result.passed
      ? "Тест складено. Завантажте сертифікат із результатом."
      : `Тест не складено: потрібно щонайменше ${result.pass} ${plural(result.pass, "бал", "бали", "балів")}. `
        + "Сертифікат видається після складання тесту.";
    $(".final-test__download").hidden = !result.passed;
    $(".final-test__retake").hidden = result.passed;
    root.querySelectorAll(".final-test__note").forEach((note) => {
      note.hidden = result.passed ? !note.hasAttribute("data-passed") : !note.hasAttribute("data-failed");
    });
    $(".final-test__download-status").textContent = "";
    $(".final-test__stats").replaceChildren(
      stat(String(result.score), `${plural(result.score, "бал", "бали", "балів")} ${from(result.max)} ${result.max}`),
      stat(`${result.correct} ${from(result.total)} ${result.total}`, plural(result.total, "правильна відповідь", "правильних відповіді", "правильних відповідей")),
      stat(String(result.pass), "прохідний бал"),
      stat(formatDate(result.date), "дата складання тесту"),
    );
    $(".final-test__modules").replaceChildren(...result.modules.map((module) => {
      const item = el("li");
      const meter = el("span", "final-test__meter");
      const fill = el("span");
      fill.style.width = `${(module.correct / module.total) * 100}%`;
      meter.append(fill);
      item.append(
        el("span", "final-test__module-title", module.title),
        el("span", "final-test__module-score", `${module.correct} з ${module.total}`),
        meter,
      );
      return item;
    }));
    show("result", $(".final-test__name"), initial);
  };

  // Тест не складено — нова спроба з новим набором питань; ім’я лишається.
  $(".final-test__retake").addEventListener("click", () => {
    state = {
      version: bank.version,
      first: state.first,
      last: state.last,
      items: pickQuestions(),
      answers: {},
      result: null,
    };
    save();
    showTest();
  });

  // ---------- PDF-сертифікат ----------

  const download = $(".final-test__download");
  const downloadStatus = $(".final-test__download-status");
  const data = root.dataset;

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Не завантажився ${src}`));
    document.head.append(script);
  });

  const fetchBytes = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    return new Uint8Array(await response.arrayBuffer());
  };

  const binaryString = (bytes) => {
    let text = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      text += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return text;
  };

  let assetsPromise = null;
  const loadAssets = () => {
    assetsPromise ??= Promise.all([
      window.jspdf ? null : loadScript(data.jspdf),
      fetchBytes(data.logo),
      fetchBytes(data.fontLight),
      fetchBytes(data.fontRegular),
      fetchBytes(data.fontMedium),
    ]).then(([, logo, light, regular, medium]) => ({
      logo,
      fonts: { light: binaryString(light), regular: binaryString(regular), medium: binaryString(medium) },
    }));
    assetsPromise.catch(() => { assetsPromise = null; });
    return assetsPromise;
  };

  // Адреса порталу внизу сертифіката — текстом, без посилання.
  const PORTAL_HOST = "cdto.ist.pp.ua";

  // Кольори порталу (stylesheets/mod-theme.css).
  const C = {
    black: "#141414",
    graphite: "#2c2c2c",
    ink: "#11181c",
    muted: "#555555",
    line: "#dcd9d1",
    warm: "#f5f5f2",
    gold: "#f39200",
    onDark: "#ffffff",
    onDarkMuted: "#b9b9b9",
  };

  const certificate = (assets) => {
    const { jsPDF } = window.jspdf;
    const { result } = state;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
    const W = 297;
    const M = 18;

    const fonts = { light: "eUkraineLight", regular: "eUkraine", medium: "eUkraineMedium" };
    Object.entries(fonts).forEach(([weight, family]) => {
      doc.addFileToVFS(`${family}.ttf`, assets.fonts[weight]);
      doc.addFont(`${family}.ttf`, family, "normal");
    });
    const type = (weight, size, color) => {
      doc.setFont(fonts[weight], "normal");
      doc.setFontSize(size);
      doc.setTextColor(color);
    };
    // Вирівнювання праворуч із розрядкою: jsPDF рахує ширину без charSpace,
    // і текст вилазить за поле — рахуємо самі.
    const textRight = (text, y, charSpace) => {
      const width = doc.getTextWidth(text) + charSpace * (text.length - 1);
      doc.text(text, W - M - width, y, { charSpace });
    };

    const name = fullName(state);
    doc.setProperties({
      title: `Сертифікат — ${name}`,
      subject: `Результат підсумкового тестування: ${result.score} з ${result.max}`,
      author: data.department,
      creator: data.portal,
    });

    // Шапка — чорна, із золотою лінією, як шапка порталу.
    doc.setFillColor(C.black);
    doc.rect(0, 0, W, 30, "F");
    doc.setFillColor(C.gold);
    doc.rect(0, 30, W, 1.4, "F");
    type("medium", 13, C.onDark);
    doc.text(data.courseTitle, M, 13.5);
    type("regular", 9, C.onDarkMuted);
    doc.text(data.courseSubtitle, M, 20.5);
    type("medium", 7.5, C.onDarkMuted);
    textRight(data.portal.toLocaleUpperCase("uk"), 17, 0.35);

    // Ліва колонка: емблема та назва кафедри.
    const logoSize = 62;
    const logoX = M + 4;
    const centerX = logoX + logoSize / 2;
    doc.addImage(assets.logo, "JPEG", logoX, 60, logoSize, logoSize);
    type("medium", 10, C.ink);
    doc.text(doc.splitTextToSize(data.department, 68), centerX, 134, { align: "center", lineHeightFactor: 1.35 });

    doc.setDrawColor(C.line);
    doc.setLineWidth(0.3);
    doc.line(102, 48, 102, 176);

    // Права колонка.
    const x = 116;
    const width = W - M - x;

    type("medium", 8.5, C.muted);
    doc.text("ПІДСУМКОВЕ ТЕСТУВАННЯ", x, 56, { charSpace: 0.5 });
    type("light", 40, C.ink);
    doc.text("Сертифікат", x, 73);

    // Ім’я — найбільшим кеглем, що вміщується в колонку; задовге — у два рядки.
    const fit = (lines, from, to) => {
      let size = from;
      doc.setFontSize(size);
      while (size > to && Math.max(...lines.map((line) => doc.getTextWidth(line))) > width) {
        size -= 0.5;
        doc.setFontSize(size);
      }
      return size;
    };
    type("medium", 26, C.ink);
    let nameBottom = 96;
    fit([name], 26, 18);
    if (doc.getTextWidth(name) <= width) {
      doc.text(name, x, nameBottom);
    } else {
      const lines = [state.first, state.last.toLocaleUpperCase("uk")];
      const size = fit(lines, 26, 12);
      doc.text(lines, x, 89, { lineHeightFactor: 1.15 });
      nameBottom = 89 + size * 0.3528 * 1.15;
    }
    doc.setFillColor(C.gold);
    doc.rect(x, nameBottom + 5, 24, 1.2, "F");

    type("regular", 10, C.muted);
    const about = `Підсумковий тест курсу складено: ${result.total} ${plural(result.total, "питання", "питання", "питань")} `
      + `за всіма модулями, ${result.points} ${plural(result.points, "бал", "бали", "балів")} за кожну правильну відповідь, `
      + `прохідний бал — ${result.pass}.`;
    doc.text(doc.splitTextToSize(about, width), x, nameBottom + 16, { lineHeightFactor: 1.45 });

    // Підсумки — як цифри в геройблоці порталу: золоті на графітовому.
    const top = 130;
    const height = 34;
    const gap = 5;
    const box = (width - gap * 2) / 3;
    const boxes = [
      { value: String(result.score), unit: ` / ${result.max}`, label: plural(result.score, "бал", "бали", "балів"), dark: true },
      { value: `${result.correct} ${from(result.total)} ${result.total}`, label: plural(result.total, "правильна відповідь", "правильних відповіді", "правильних відповідей") },
      { value: formatDate(result.date), label: "дата складання тесту" },
    ];
    boxes.forEach((item, i) => {
      const bx = x + i * (box + gap);
      doc.setFillColor(item.dark ? C.graphite : C.warm);
      doc.rect(bx, top, box, height, "F");
      if (item.dark) {
        type("light", 30, C.gold);
        doc.text(item.value, bx + 6, top + 19);
        const valueWidth = doc.getTextWidth(item.value);
        type("regular", 11, C.onDarkMuted);
        doc.text(item.unit, bx + 6 + valueWidth + 1, top + 19);
      } else {
        type("light", 19, C.ink);
        doc.text(item.value, bx + 6, top + 18);
      }
      type("regular", 8.5, item.dark ? C.onDarkMuted : C.muted);
      doc.text(item.label, bx + 6, top + 27.5);
    });

    // Підвал.
    doc.setDrawColor(C.line);
    doc.line(M, 186, W - M, 186);
    type("regular", 7.5, C.muted);
    doc.text("Сертифікат сформовано автоматично за результатами підсумкового тестування на навчальному порталі.", M, 193);
    type("medium", 7.5, C.muted);
    textRight(PORTAL_HOST, 193, 0.15);

    return doc;
  };

  download.addEventListener("click", async () => {
    if (!state?.result?.passed) return;
    download.disabled = true;
    downloadStatus.textContent = "Готуємо сертифікат…";
    try {
      const doc = certificate(await loadAssets());
      doc.save(`Сертифікат_CDTO_${state.last}_${state.first}.pdf`);
      downloadStatus.textContent = "Сертифікат завантажено.";
    } catch (error) {
      console.error(error);
      downloadStatus.textContent = "Не вдалося сформувати сертифікат. Перевірте з’єднання з інтернетом і спробуйте ще раз.";
    } finally {
      download.disabled = false;
    }
  });

  // ---------- Старт ----------

  const saved = store.read();
  if (saved?.result) {
    state = saved;
    showResult(true);
  } else if (saved?.items && saved.version === bank.version && saved.items.every((item) => byId.has(item.id))) {
    state = saved;
    showTest(true);
  } else {
    if (saved) {
      // Питання змінилися (оновили тести) — незавершену спробу не відновити.
      store.clear();
      fields.first.input.value = saved.first || "";
      fields.last.input.value = saved.last || "";
      const notice = $(".final-test__notice");
      notice.textContent = "Питання тесту оновилися — почніть, будь ласка, заново.";
      notice.hidden = false;
    }
    show("intro", null, true);
  }
})();
