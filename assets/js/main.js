/* ============================================================
   Brandon Haley — Portfolio scripts
   ============================================================ */

/* ---- SITE CONFIG: edit this one line when the Calendly link is ready ---- */
const SITE = {
  calendlyUrl: "", // e.g. "https://calendly.com/bhaleyart/consultation"
};

(function () {
  // Mobile nav
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "Close" : "Menu";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", false);
        toggle.textContent = "Menu";
      })
    );
  }

  // Panel splash follows the cursor entry point
  document.querySelectorAll(".panel").forEach((panel) => {
    const setOrigin = (e) => {
      const r = panel.getBoundingClientRect();
      panel.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
      panel.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    panel.addEventListener("pointerenter", setOrigin);
    panel.addEventListener("pointerleave", setOrigin);
  });

  // Hero name: panel-style color burst that fills the letters. Mouse enter on desktop, fast scroll on touch.
  const intro = document.querySelector(".hero__name");
  if (intro) {
    intro.insertAdjacentHTML("beforeend", `<span class="hero__name-fill" aria-hidden="true">${intro.innerHTML}</span>`);
    const colors = ["--c-art", "--c-photo", "--c-music", "--c-web"];
    let ci = -1, idle = 0;
    const setOrigin = (x, y) => {
      const b = intro.getBoundingClientRect();
      intro.style.setProperty("--x", `${((x - b.left) / b.width) * 100}%`);
      intro.style.setProperty("--y", `${((y - b.top) / b.height) * 100}%`);
    };
    const splash = () => {
      if (intro.classList.contains("is-splash")) return;
      ci = (ci + 1) % colors.length;
      intro.style.setProperty("--splash", `var(${colors[ci]})`);
      intro.classList.add("is-splash");
    };

    intro.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "touch") return;
      setOrigin(e.clientX, e.clientY); splash();
    });
    intro.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "touch") return;
      setOrigin(e.clientX, e.clientY); intro.classList.remove("is-splash");
    });

    // Touch: a quick scroll bursts the color from a random point, then it recedes when scrolling stops
    let lastY = scrollY, lastT = performance.now();
    addEventListener("scroll", () => {
      const now = performance.now(), v = Math.abs(scrollY - lastY) / Math.max(now - lastT, 1);
      lastY = scrollY; lastT = now;
      if (!matchMedia("(hover: none)").matches) return;
      const b = intro.getBoundingClientRect();
      if (b.bottom < 0 || b.top > innerHeight) return;
      if (v > 0.6 && !intro.classList.contains("is-splash")) {
        setOrigin(b.left + Math.random() * b.width, b.top + Math.random() * b.height);
        splash();
      }
      clearTimeout(idle);
      idle = setTimeout(() => intro.classList.remove("is-splash"), 450);
    }, { passive: true });
  }

  // Scroll reveal
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 })
    : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));

  // Gallery filters
  document.querySelectorAll("[data-gallery]").forEach((root) => {
    const items = root.querySelectorAll(".gallery__item");
    root.querySelectorAll(".filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        root.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const f = btn.dataset.filter;
        items.forEach((it) => it.classList.toggle("is-hidden", f !== "all" && it.dataset.cat !== f));
      });
    });
  });

  // Lightbox
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML = `
    <button class="lightbox__btn lightbox__close" aria-label="Close">&times;</button>
    <button class="lightbox__btn lightbox__prev" aria-label="Previous">&larr;</button>
    <button class="lightbox__btn lightbox__next" aria-label="Next">&rarr;</button>
    <div><div class="lightbox__stage"></div><p class="lightbox__cap mono"></p></div>`;
  document.body.appendChild(lb);
  const stage = lb.querySelector(".lightbox__stage");
  const cap = lb.querySelector(".lightbox__cap");
  let current = [], idx = 0;

  function render() {
    const it = current[idx];
    const src = it.dataset.src || (it.querySelector("img") && it.querySelector("img").src);
    const type = it.dataset.type || "image";
    const title = it.dataset.title || "";
    stage.innerHTML = "";
    if (!src) {
      stage.innerHTML = `<div class="ph">${title || "Work coming soon"}</div>`;
    } else if (type === "video") {
      stage.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
    } else if (type === "embed") {
      stage.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen" allowfullscreen title="${title}"></iframe>`;
    } else {
      stage.innerHTML = `<img src="${src}" alt="${title}">`;
    }
    cap.textContent = [title, it.dataset.desc].filter(Boolean).join(" — ");
  }
  function open(item) {
    const root = item.closest("[data-gallery]");
    current = [...root.querySelectorAll(".gallery__item:not(.is-hidden)")];
    idx = current.indexOf(item);
    render();
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("is-open");
    stage.innerHTML = "";
    document.body.style.overflow = "";
  }
  const step = (d) => { idx = (idx + d + current.length) % current.length; render(); };

  document.querySelectorAll(".gallery__item").forEach((it) => {
    it.tabIndex = 0;
    it.addEventListener("click", () => open(it));
    it.addEventListener("keydown", (e) => { if (e.key === "Enter") open(it); });
  });
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__prev").addEventListener("click", () => step(-1));
  lb.querySelector(".lightbox__next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  // Calendly: inline widget + popup buttons, driven by SITE.calendlyUrl
  const slots = document.querySelectorAll(".calendly-slot");
  const popupBtns = document.querySelectorAll("[data-calendly-popup]");
  if (SITE.calendlyUrl) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);

    slots.forEach((slot) => {
      const url = new URL(SITE.calendlyUrl);
      url.searchParams.set("hide_gdpr_banner", "1");
      url.searchParams.set("background_color", "ffffff");
      url.searchParams.set("text_color", "0a0a0a");
      url.searchParams.set("primary_color", "0a0a0a");
      if (slot.dataset.topic) url.searchParams.set("a1", slot.dataset.topic);
      slot.innerHTML = `<div class="calendly-inline-widget" data-url="${url}"></div>`;
    });
    popupBtns.forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.Calendly) window.Calendly.initPopupWidget({ url: SITE.calendlyUrl });
        else window.open(SITE.calendlyUrl, "_blank", "noopener");
      })
    );
  } else {
    // No link yet: buttons scroll to the booking section
    popupBtns.forEach((b) =>
      b.addEventListener("click", (e) => {
        const target = document.getElementById("book");
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
      })
    );
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
