/*****************************************
 * SAFE DOM HELPERS
 *****************************************/
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

/*****************************************
 * TIMELINE FADE-IN
 *****************************************/
(() => {
  const items = $$(".timeline-item");
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(i => observer.observe(i));
})();

/*****************************************
 * EXPANDABLE SECTIONS
 *****************************************/
(() => {
  $$(".toggle-link").forEach(link => {
    link.addEventListener("click", () => {
      const box = link.previousElementSibling;
      if (!box) return;

      box.classList.toggle("expanded");
      link.textContent = box.classList.contains("expanded") ? "Less" : "More";
    });
  });
})();

/*****************************************
 * SKILLS PANEL
 *****************************************/
(() => {
  const handles = $$(".skills-handle");
  const panel = $(".col-right");
  if (!handles.length || !panel) return;

  handles.forEach(handle => {
    handle.addEventListener("click", () => {
      const isOpen = panel.classList.contains("active");

      if (isOpen) {
        panel.classList.remove("active");
        setTimeout(() => {
          panel.style.display = "none";
        }, 300);
      } else {
        panel.style.display = "block";
        requestAnimationFrame(() => panel.classList.add("active"));
      }
    });
  });
})();

/*****************************************
 * SIDE MENU + DYNAMIC LOADER
 *****************************************/
(() => {
  const sideMenu = $("#sideMenu");
  const backdrop = $("#backdrop");
  const content = $("#dynamic-content");

  if (!sideMenu || !backdrop || !content) return;

  window.toggleMenu = () => {
    const open = sideMenu.classList.toggle("open");
    backdrop.classList.toggle("visible", open);
  };

  window.loadPage = async (page, btn) => {
    sideMenu.classList.remove("open");
    backdrop.classList.remove("visible");

    $$(".menu-content button").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    content.style.opacity = "0";

    try {
      const res = await fetch(page);
      content.innerHTML = await res.text();
    } catch (e) {
      content.innerHTML = "<p style='color:red'>Error loading content.</p>";
    }

    setTimeout(() => (content.style.opacity = "1"), 100);
  };

  const defaultBtn = $(".menu-content button.active");
  if (defaultBtn) loadPage("home.html", defaultBtn);
})();

/*****************************************
 * MAIN TABS
 *****************************************/
(() => {
  const tabs = $$(".main-tab");
  const contents = $$(".tab-content");
  if (!tabs.length || !contents.length) return;

  tabs[0].classList.add("active");
  contents.forEach((c, i) => (c.style.display = i === 0 ? "block" : "none"));

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach(c => (c.style.display = "none"));

      const target = $(`#${tab.dataset.target}`);
      if (target) target.style.display = "block";
    });
  });
})();

/*****************************************
 * PROJECT FILTER
 *****************************************/
(() => {
  const section = $("#projects-content");
  if (!section) return;

  const buttons = $$(".tab-button", section);
  const cards = $$(".project-card", section);
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match =
          filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "block" : "none";
      });
    });
  });
})();

/*****************************************
 * BLOG FADE-IN
 *****************************************/
(() => {
  const cards = $$("#blog-section .blog-card");
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(c => observer.observe(c));
})();

/*****************************************
 * PROJECT FLIP (MOBILE ONLY)
 *****************************************/
(() => {
  const cards = $$(".project-card");
  if (!cards.length) return;

  const mq = window.matchMedia("(max-width: 767px)");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (mq.matches) {
        card.classList.toggle("flipped");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (!mq.matches) {
      cards.forEach(c => c.classList.remove("flipped"));
    }
  });
})();

/*****************************************
 * CERTIFICATES MODAL
 *****************************************/
(() => {
  const items = $$(".certificate-item");
  const modal = $("#certificateModal");
  const img = $("#modalCertificateImg");
  const close = $("#closeCertificateModal");

  if (!items.length || !modal || !img) return;

  items.forEach(item => {
    item.addEventListener("click", () => {
      const src = item.querySelector("img")?.src;
      if (!src) return;

      img.src = src;
      modal.style.display = "flex";
    });
  });

  const closeModal = () => {
    modal.style.display = "none";
    img.src = "";
  };

  close?.addEventListener("click", closeModal);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
})();

/*****************************************
 * MOBILE MENU (SAFE FIXED)
 *****************************************/
(() => {
  const burger = $("#hamburger");
  const menu = $("#mobile-menu");

  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    menu.classList.toggle("active");
    burger.classList.toggle("open");

    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
  });

  $$(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
})();

/*****************************************
 * SERVICE BLOCK OVERLAY
 *****************************************/
(() => {
  const blocks = $$(".service-block");
  if (!blocks.length) return;

  const closeAll = () => blocks.forEach(b => b.classList.remove("active"));

  blocks.forEach(block => {
    block.addEventListener("click", e => {
      e.stopPropagation();
      const active = block.classList.contains("active");
      closeAll();
      if (!active) block.classList.add("active");
    });

    block.querySelector(".more-icon")?.addEventListener("click", e => {
      e.stopPropagation();
      const active = block.classList.contains("active");
      closeAll();
      if (!active) block.classList.add("active");
    });
  });

  document.addEventListener("click", closeAll);
})();

/*****************************************
 * ABOUT ME ANIMATION
 *****************************************/
(() => {
  const section = $("#about-me");
  if (!section) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const items = section.querySelectorAll(".story p, .card");
      items.forEach((el, i) => {
        setTimeout(() => el.classList.add("visible"), i * 120);
      });

      obs.unobserve(section);
    });
  }, { threshold: 0.2 });

  observer.observe(section);
})();

/*****************************************
 * PROGRESS BARS
 *****************************************/
(() => {
  const bars = $$(".progress-bar");
  if (!bars.length) return;

  const animate = () => {
    bars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        bar.style.width = bar.dataset.progress + "%";
      }
    });
  };

  window.addEventListener("scroll", animate, { passive: true });
  window.addEventListener("load", animate);
})();

/*****************************************
 * CERT FILTER + PREVIEW
 *****************************************/
(() => {
  const section = $("#certificates-section");
  if (!section) return;

  const cards = $$(".cert-card", section);
  const filters = $$(".filter", section);
  const preview = $("#certPreviewPanel");
  const previewImg = preview?.querySelector("img");

  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.dataset.filter;

      cards.forEach(card => {
        const show =
          type === "all" || card.dataset.category === type;
        card.style.display = show ? "block" : "none";
      });
    });
  });

  cards.forEach(card => {
    const img = card.dataset.img;
    if (!img || !preview || !previewImg) return;

    card.addEventListener("mousemove", e => {
      previewImg.src = img;
      preview.style.opacity = "1";
      preview.style.left = e.clientX + 20 + "px";
      preview.style.top = e.clientY + 20 + "px";
    });

    card.addEventListener("mouseleave", () => {
      preview.style.opacity = "0";
    });
  });
})();

/*****************************************
 * COMPANY MODAL
 *****************************************/
(() => {
  const items = $$(".company-item");
  const modal = $("#companyModal");
  if (!items.length || !modal) return;

  const title = $("#modalTitle");
  const role = $("#modalRole");
  const overview = $("#modalOverview");
  const challenges = $("#modalChallenges");
  const actions = $("#modalActions");
  const results = $("#modalResults");

  const parseJSON = str => {
    try { return JSON.parse(str); } catch { return []; }
  };

  const renderList = (el, arr, badge = false) => {
    if (!el) return;
    el.innerHTML = arr.map(i =>
      badge ? `<li><span class="result-badge">${i}</span></li>` : `<li>${i}</li>`
    ).join("");
  };

  items.forEach(item => {
    item.addEventListener("click", () => {
      title.textContent = item.dataset.key || "";
      role.textContent = item.dataset.role || "";
      overview.textContent = item.dataset.overview || "";

      renderList(challenges, parseJSON(item.dataset.challenges));
      renderList(actions, parseJSON(item.dataset.actions));
      renderList(results, parseJSON(item.dataset.results), true);

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const close = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  $("#closeModal")?.addEventListener("click", close);

  modal.addEventListener("click", e => {
    if (e.target === modal) close();
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
})();



/*****************************************
 * HEADER AUTO HIDE (SAFE)
 *****************************************/
(() => {
  const header = $(".header");
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.pageYOffset;

    if (current > lastScroll && current > 80) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }

    lastScroll = current;
  }, { passive: true });
})();

/* ========================================
   SECTION 02 — MICRO INTERACTIONS
======================================== */

const cards = document.querySelectorAll('.advantage-card');

cards.forEach(card => {

  card.addEventListener('mousemove', (e) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(255,255,255,0.98),
        rgba(255,255,255,0.78) 45%
      )
    `;
  });

  card.addEventListener('mouseleave', () => {

    card.style.background =
      'rgba(255,255,255,0.75)';
  });

});
