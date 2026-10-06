(() => {
  const ICON_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
  const ICON_BAD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

  // Результат зберігається лише в браузері слухача — для позначок прогресу.
  const store = {
    key: (id) => `cdto-quiz:${id}`,
    read(id) {
      try {
        return JSON.parse(localStorage.getItem(this.key(id)));
      } catch {
        return null;
      }
    },
    write(id, value) {
      try {
        localStorage.setItem(this.key(id), JSON.stringify(value));
      } catch {
        /* приватний режим або заблоковане сховище — просто не запам'ятовуємо */
      }
    },
  };
  window.cdtoQuizStore = store;

  const esc = (text) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const shuffle = (fieldset) => {
    const options = [...fieldset.querySelectorAll(".lesson-quiz__opt")];
    const feedback = fieldset.querySelector(".lesson-quiz__feedback");
    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    options.forEach((option) => fieldset.insertBefore(option, feedback));
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("uk-UA");

  const init = (quiz) => {
    const id = quiz.dataset.quiz;
    const passMark = Number(quiz.dataset.pass) || 75;
    const form = quiz.querySelector("form");
    const questions = [...form.querySelectorAll(".lesson-quiz__q")];
    const summary = form.querySelector(".lesson-quiz__summary");
    const submit = form.querySelector('[type="submit"]');
    const reset = form.querySelector(".lesson-quiz__reset");
    const intro = quiz.querySelector(".lesson-quiz__intro");

    const showPrevious = () => {
      intro.querySelector(".lesson-quiz__previous")?.remove();
      const last = store.read(id);
      if (!last) return;
      const note = document.createElement("span");
      note.className = "lesson-quiz__previous";
      note.textContent = ` Ваш попередній результат: ${last.score} з ${last.total} (${last.percent}%) · ${formatDate(last.date)}.`;
      intro.append(note);
    };

    const start = () => {
      form.reset();
      summary.innerHTML = "";
      summary.className = "lesson-quiz__summary";
      questions.forEach((fieldset) => {
        fieldset.classList.remove("is-correct", "is-wrong", "is-missing");
        fieldset.querySelectorAll("input").forEach((input) => {
          input.disabled = false;
          input.closest("label").classList.remove("is-answer", "is-picked-wrong");
        });
        const feedback = fieldset.querySelector(".lesson-quiz__feedback");
        feedback.hidden = true;
        feedback.innerHTML = "";
        shuffle(fieldset);
      });
      submit.hidden = false;
      reset.hidden = true;
      showPrevious();
    };

    form.addEventListener("change", (event) => {
      event.target.closest(".lesson-quiz__q")?.classList.remove("is-missing");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const missing = questions.filter((q) => !q.querySelector("input:checked"));
      if (missing.length) {
        missing.forEach((q) => q.classList.add("is-missing"));
        const links = missing
          .map((q) => `<a href="#${q.id}">${q.querySelector(".lesson-quiz__num").textContent}</a>`)
          .join(", ");
        summary.className = "lesson-quiz__summary is-warning";
        summary.innerHTML = `<p><strong>Ще не всі відповіді.</strong> Залишилось відповісти на питання ${links}.</p>`;
        summary.focus();
        return;
      }

      let score = 0;
      questions.forEach((fieldset) => {
        const inputs = [...fieldset.querySelectorAll("input")];
        const right = inputs.every((input) => input.checked === input.hasAttribute("data-correct"));
        if (right) score += 1;

        inputs.forEach((input) => {
          input.disabled = true;
          const label = input.closest("label");
          if (input.hasAttribute("data-correct")) label.classList.add("is-answer");
          else if (input.checked) label.classList.add("is-picked-wrong");
        });

        fieldset.classList.add(right ? "is-correct" : "is-wrong");
        const answers = inputs
          .filter((input) => input.hasAttribute("data-correct"))
          .map((input) => `«${esc(input.nextElementSibling.textContent)}»`)
          .join(", ");
        const feedback = fieldset.querySelector(".lesson-quiz__feedback");
        feedback.innerHTML = right
          ? `<p class="lesson-quiz__verdict">${ICON_OK}<strong>Правильно.</strong></p>`
          : `<p class="lesson-quiz__verdict">${ICON_BAD}<strong>Неправильно.</strong> Правильна відповідь: ${answers}.</p>`;
        if (fieldset.dataset.explain) {
          feedback.innerHTML += `<p>${esc(fieldset.dataset.explain)}</p>`;
        }
        feedback.hidden = false;
      });

      const total = questions.length;
      const percent = Math.round((score / total) * 100);
      const passed = percent >= passMark;
      summary.className = `lesson-quiz__summary ${passed ? "is-passed" : "is-failed"}`;
      summary.innerHTML =
        `<p class="lesson-quiz__score">${passed ? ICON_OK : ICON_BAD}<strong>${score} з ${total}</strong> · ${percent}%</p>` +
        `<p>${passed
          ? "Тест складено. Можна переходити до наступного заняття."
          : `Для складання потрібно щонайменше ${passMark}%. Перегляньте пояснення до помилок і пройдіть тест ще раз.`}</p>`;

      store.write(id, { score, total, percent, passed, date: new Date().toISOString() });
      submit.hidden = true;
      reset.hidden = false;
      summary.focus();
    });

    reset.addEventListener("click", () => {
      start();
      questions[0].scrollIntoView({ block: "start" });
      questions[0].querySelector("input").focus({ preventScroll: true });
    });

    start();
  };

  const run = () => document.querySelectorAll(".lesson-quiz").forEach(init);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
