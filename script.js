const navbarMarkup = `
<nav class="site-nav" data-nav-root>
  <div class="nav-shell">
    <a class="brand" href="./" aria-label="Safir Al-Azhar Indonesia">
      <!--Ganti Logonya Di Sini-->
      <div class="brand-mark" aria-hidden="true">
        <span></span>
        <span></span>
      </div>
      <div class="brand-copy">
        <!--Nama mediator, font bisa diganti di style.css-->
        <strong>Safir Al-Azhar</strong>
        <span>Indonesia to Cairo</span>
      </div>
    </a>

    <button class="nav-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!--Menu Navbar-->
    <div class="nav-menu" id="nav-menu">
      <ul class="nav-links">
        <li><a data-nav-link href="profil/">Profil</a></li>
        <li><a data-nav-link href="pengajar/">Pengajar</a></li>
        <li><a data-nav-link href="program/">Program</a></li>
        <li><a data-nav-link href="proses/">Proses</a></li>
        <li><a data-nav-link href="persyaratan/">Persyaratan</a></li>
        <li><a data-nav-link href="biaya/">Biaya</a></li>
        <li><a data-nav-link href="artikel/">Artikel</a></li>
        <li><a data-nav-link href="testimoni/">Testimoni</a></li>
        <li><a data-nav-link href="faq/">FAQ</a></li>
        <li><a data-nav-link href="kontak/">Kontak</a></li>
      </ul>

      <!--Tombol Daftar-->
      <a class="nav-cta" href="kontak/#form-kontak">Daftar Sekarang</a>
    </div>
  </div>
</nav>`;

document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  initNavbar();
  initTyping();
  initReveal();
  initParallax();
  initSliders();
  initFaq();
  initForms();
  initSmoothScroll();
  initYear();
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".loading-screen");
  document.body.classList.remove("is-loading");

  if (loader) {
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 560);
  }
});

async function loadNavbar() {
  const targets = document.querySelectorAll("[data-navbar]");

  if (!targets.length) {
    return;
  }

  let markup = navbarMarkup;

  try {
    const response = await fetch("navbar.html", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Gagal memuat navbar.");
    }
    markup = await response.text();
  } catch (error) {
    console.warn("Menggunakan markup navbar dari script.js:", error);
  }

  targets.forEach((target) => {
    target.innerHTML = markup;
  });
}

function initNavbar() {
  const navRoot = document.querySelector("[data-nav-root]");

  if (!navRoot) {
    return;
  }

  const navToggle = navRoot.querySelector(".nav-toggle");
  const navMenu = navRoot.querySelector(".nav-menu");
  const currentPath = normalizePagePath(window.location.pathname);

  // Set active link berdasarkan route folder yang sedang dibuka
  navRoot.querySelectorAll("[data-nav-link]").forEach((link) => {
    const target = link.getAttribute("href");

    if (!target) {
      return;
    }

    const targetPath = normalizePagePath(new URL(target, document.baseURI).pathname);

    if (targetPath === currentPath) {
      link.classList.add("is-active");
    }
  });

  // Toggle mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("is-open");
      navMenu.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      
      // Prevent body scroll when menu is open
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }

  // Close mobile menu when link is clicked
  navRoot.querySelectorAll(".nav-links a, .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980 && navToggle && navMenu) {
        navToggle.classList.remove("is-open");
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  });

  // Handle resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && navToggle && navMenu) {
      navToggle.classList.remove("is-open");
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

function initTyping() {
  const typingElement = document.querySelector("[data-typing]");

  if (!typingElement) {
    return;
  }

  const entries = typingElement.dataset.typing.split("||").map((item) => item.trim()).filter(Boolean);
  if (!entries.length) {
    return;
  }

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const currentText = entries[textIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingElement.textContent = currentText.slice(0, Math.max(0, charIndex));

    let delay = isDeleting ? 34 : 64;

    if (!isDeleting && charIndex === currentText.length) {
      delay = 1700;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % entries.length;
      delay = 420;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

function initReveal() {
  const elements = document.querySelectorAll(".scroll-reveal");

  if (!elements.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach((element) => observer.observe(element));
}

function initParallax() {
  const elements = document.querySelectorAll("[data-parallax]");

  if (!elements.length) {
    return;
  }

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    elements.forEach((element) => {
      const depth = Number(element.dataset.parallax || 0.08);
      element.style.setProperty("--parallax-offset", `${scrollY * depth}px`);
    });
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener("scroll", requestTick, { passive: true });
}

function initSliders() {
  const sliders = document.querySelectorAll("[data-slider]");

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll(".testimonial-slide"));
    const dotsWrap = slider.querySelector(".slider-dots");
    const prevButton = slider.querySelector('[data-direction="prev"]');
    const nextButton = slider.querySelector('[data-direction="next"]');

    if (slides.length < 2) {
      return;
    }

    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (activeIndex < 0) {
      activeIndex = 0;
      slides[0].classList.add("is-active");
    }

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Pindah ke testimoni ${index + 1}`);
      dotsWrap?.appendChild(dot);
      dot.addEventListener("click", () => {
        setActive(index);
        restartAuto();
      });
      return dot;
    });

    const setActive = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    };

    const next = () => setActive(activeIndex + 1);
    const prev = () => setActive(activeIndex - 1);

    prevButton?.addEventListener("click", () => {
      prev();
      restartAuto();
    });

    nextButton?.addEventListener("click", () => {
      next();
      restartAuto();
    });

    let intervalId = window.setInterval(next, 5200);
    const restartAuto = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(next, 5200);
    };

    slider.addEventListener("mouseenter", () => window.clearInterval(intervalId));
    slider.addEventListener("mouseleave", restartAuto);

    setActive(activeIndex);
  });
}

function initFaq() {
  document.querySelectorAll(".faq-accordion").forEach((accordion) => {
    const items = accordion.querySelectorAll(".faq-item");

    items.forEach((item, index) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!question || !answer) {
        return;
      }

      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        items.forEach((otherItem) => {
          otherItem.classList.remove("is-open");
          const otherAnswer = otherItem.querySelector(".faq-answer");
          if (otherAnswer) {
            otherAnswer.style.maxHeight = "0px";
          }
        });

        if (!isOpen) {
          item.classList.add("is-open");
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });

      if (index === 0 && item.dataset.open === "true") {
        item.classList.add("is-open");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

function initForms() {
  document.querySelectorAll(".contact-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector(".button");

      if (!button) {
        return;
      }

      const originalText = button.textContent;
      button.textContent = "Permintaan terkirim. Tim kami akan menghubungi Anda.";
      button.setAttribute("disabled", "true");

      window.setTimeout(() => {
        button.textContent = originalText;
        button.removeAttribute("disabled");
      }, 2800);
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initYear() {
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function normalizePagePath(pathname) {
  let normalized = pathname.replace(/\/index\.html$/i, "/");
  normalized = normalized.replace(/\/{2,}/g, "/");

  if (normalized.length > 1) {
    normalized = normalized.replace(/\/$/, "");
  }

  return normalized || "/";
}