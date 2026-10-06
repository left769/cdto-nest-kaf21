(() => {
  const addHomeLink = () => {
    const header = document.querySelector(".md-header__inner");
    const logo = header?.querySelector("a.md-logo");
    const title = header?.querySelector(".md-header__title");

    if (!header || !logo || !title || header.querySelector(".md-header__home-link")) {
      return;
    }

    if (new URL(logo.href).pathname === window.location.pathname) {
      return;
    }

    const homeLink = document.createElement("a");
    homeLink.className = "md-header__home-link";
    homeLink.href = logo.getAttribute("href") || ".";
    homeLink.innerHTML =
      '<svg class="md-header__home-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' +
      '<span class="md-header__home-label">На головну</span>';
    homeLink.setAttribute("aria-label", "Повернутися на головну сторінку");
    title.before(homeLink);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addHomeLink, { once: true });
  } else {
    addHomeLink();
  }
})();
