(() => {
  // Тип заняття визначається з імені файлу: CDTO_Meth_T2_Z6_Lecture_Practical.md тощо.
  const lessonTypes = [
    [/_Lecture_Practical/, "Лекція + практичне", "mixed"],
    [/_Lecture/, "Лекція", "lecture"],
    [/_Practical/, "Практичне", "practical"],
    [/_Seminar/, "Семінар", "seminar"],
  ];

  const typeOf = (path) => {
    const match = lessonTypes.find(([pattern]) => pattern.test(path));
    return match ? { label: match[1], kind: match[2] } : null;
  };

  const chip = ({ label, kind }) => {
    const el = document.createElement("span");
    el.className = `lesson-chip lesson-chip--${kind}`;
    el.textContent = label;
    return el;
  };

  const onlyEm = (p) =>
    p.childElementCount === 1 && p.firstElementChild.tagName === "EM" &&
    p.textContent.trim() === p.firstElementChild.textContent.trim();

  const enhanceLesson = (article) => {
    const h1 = article.querySelector("h1");
    const meta = h1?.nextElementSibling;
    const type = typeOf(window.location.pathname);
    if (!h1 || !type || article.dataset.lessonEnhanced) return;
    article.dataset.lessonEnhanced = "true";

    // «Тема 2: … · Заняття 7» → надзаголовок над H1.
    const header = document.createElement("header");
    header.className = "lesson-header";
    const eyebrow = document.createElement("div");
    eyebrow.className = "lesson-eyebrow";
    eyebrow.append(chip(type));

    if (meta?.tagName === "P" && onlyEm(meta)) {
      const [topic, lesson] = meta.textContent.split("·").map((part) => part.trim());
      const topicEl = document.createElement("span");
      topicEl.className = "lesson-eyebrow__topic";
      topicEl.textContent = [lesson, topic].filter(Boolean).join(" · ");
      eyebrow.append(topicEl);
      meta.remove();
    }

    const words = article.textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 180));
    const time = document.createElement("span");
    time.className = "lesson-eyebrow__time";
    time.textContent = `≈ ${minutes} хв читання`;
    eyebrow.append(time);

    h1.before(header);
    header.append(eyebrow, h1);

    article.querySelectorAll(":scope > p").forEach((p) => {
      if (onlyEm(p)) {
        const text = p.textContent.trim();
        if (/^(Проміжний висновок|Головне правило|Важливо)/i.test(text)) p.classList.add("lesson-takeaway");
        else if (/^Приклад/i.test(text)) p.classList.add("lesson-example");
        return;
      }

      // «**Типові помилки:**» + наступний список → один блок-попередження.
      const strong = p.firstElementChild;
      const list = p.nextElementSibling;
      if (
        strong?.tagName === "STRONG" && p.childElementCount === 1 &&
        /^Типові помилки/i.test(p.textContent.trim()) && list?.tagName === "UL"
      ) {
        const box = document.createElement("div");
        box.className = "lesson-pitfalls";
        p.before(box);
        box.append(p, list);
      }
    });
  };

  const enhanceCatalog = () => {
    document.querySelectorAll(".portal-catalog li li > a").forEach((link) => {
      const type = typeOf(link.getAttribute("href") || "");
      if (type && !link.parentElement.querySelector(".lesson-chip")) {
        link.after(chip(type));
      }
    });
  };

  const run = () => {
    const article = document.querySelector(".md-content__inner");
    if (article) enhanceLesson(article);
    enhanceCatalog();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
