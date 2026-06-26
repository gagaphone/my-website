/*****************************************
 * SAFE DOM HELPERS
 *****************************************/
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];



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
 * COMPANY MODAL (DELEGATION & DATA FIX)
 *****************************************/
(() => {
  const items = $$(".company-item");
  const modal = $("#detailsModal"); 
  if (!items.length || !modal) return;

  const modalContent = $(".details-modal-content", modal);

  const parseJSON = str => {
    try { return JSON.parse(str); } catch { return []; }
  };

  const generateListHTML = (arr, isBadge = false) => {
    return arr.map(i => 
      isBadge ? `<li><span class="result-badge">${i}</span></li>` : `<li>${i}</li>`
    ).join("");
  };

  // Setup the event engine directly on the parent layout container
  items.forEach(item => {
    item.addEventListener("click", (e) => {
      
      // 1. Check if the user is clicking the Case Study link directly
      if (e.target.closest(".service-link.learn-more")) {
        // Let the link behave perfectly normal without triggering the modal markup wrapper
        return; 
      }

      // 2. Otherwise, run the safe dynamic modal injection
      const key = item.dataset.key || "";
      const role = item.dataset.role || "";
      const overview = item.dataset.overview || "";
      const challenges = parseJSON(item.dataset.challenges);
      const actions = parseJSON(item.dataset.actions);
      const results = parseJSON(item.dataset.results);

      modalContent.innerHTML = `
        <button class="details-modal-close">&times;</button>
        <h2 class="modal-company">${key}</h2>
        <div class="modal-role">${role}</div>
        <p class="modal-overview">${overview}</p>
        
        <div class="detail-block">
          <h4>Challenges</h4>
          <ul>${generateListHTML(challenges)}</ul>
        </div>
        <div class="detail-block">
          <h4>Actions Taken</h4>
          <ul>${generateListHTML(actions)}</ul>
        </div>
        <div class="detail-block">
          <h4>Key Results</h4>
          <ul>${generateListHTML(results, true)}</ul>
        </div>
      `;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Close control workflows
  modal.addEventListener("click", e => {
    if (e.target.classList.contains("details-modal-close") || e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
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

/* ========================================
   SECTION 0 — Portfolio
======================================== */

const slides = document.querySelectorAll(".slide");
const counter = document.getElementById("counter");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let current = 0;

function updateSlider() {

    slides.forEach(slide =>
        slide.classList.remove("active")
    );

    slides[current].classList.add("active");

    counter.textContent =
        `${current + 1} / ${slides.length}`;
}

nextBtn.addEventListener("click", () => {

    current++;

    if (current >= slides.length) {
        current = 0;
    }

    updateSlider();
});

prevBtn.addEventListener("click", () => {

    current--;

    if (current < 0) {
        current = slides.length - 1;
    }

    updateSlider();
});

updateSlider();



/* ========================================
   SECTION 01 — left side bar
======================================== */


document.addEventListener("DOMContentLoaded", () => {
  const elementsToCount = document.querySelectorAll(".olg-number");

  const executeCounterAnimation = (domElement) => {
    const targetInteger = parseInt(domElement.getAttribute("data-target"), 10);
    const runDuration = 1100; // Animation lifecycle time window inside window loop
    const initializationTimestamp = performance.now();

    const progressFrame = (currentTimestamp) => {
      const elapsedWindow = currentTimestamp - initializationTimestamp;
      const calculatedProgress = Math.min(elapsedWindow / runDuration, 1);
      
      // Applies an easing formula out for a smooth visual deceleration drop-off
      const easedProgress = 1 - Math.pow(1 - calculatedProgress, 3);

      domElement.innerText = Math.floor(easedProgress * targetInteger);

      if (calculatedProgress < 1) {
        requestAnimationFrame(progressFrame);
      } else {
        domElement.innerText = targetInteger; // Fallback locking precisely to target values
      }
    };

    requestAnimationFrame(progressFrame);
  };

  const viewportScrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        executeCounterAnimation(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elementsToCount.forEach(metricItem => viewportScrollObserver.observe(metricItem));
});

/* ========================================
   SECTION 02 — Slider
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    const servicesSlides = document.querySelectorAll(".services-slide");
    const servicesCounter = document.getElementById("serviceCounter");
    const servicesNextBtn = document.getElementById("serviceNextBtn");
    const servicesPrevBtn = document.getElementById("servicePrevBtn");

    // Defensive handling logic to prevent errors if elements don't exist on the page
    if (!servicesSlides.length || !servicesCounter || !servicesNextBtn || !servicesPrevBtn) return;

    let servicesCurrent = 0;

    function updateServicesSlider() {
        // Toggle engine states visibility classes safely
        servicesSlides.forEach(slide => slide.classList.remove("active"));
        servicesSlides[servicesCurrent].classList.add("active");

        // Repopulate counter indicator dynamically
        servicesCounter.textContent = `${servicesCurrent + 1} / ${servicesSlides.length}`;
    }

    servicesNextBtn.addEventListener("click", () => {
        servicesCurrent++;
        if (servicesCurrent >= servicesSlides.length) {
            servicesCurrent = 0; // Loops back to start
        }
        updateServicesSlider();
    });

    servicesPrevBtn.addEventListener("click", () => {
        servicesCurrent--;
        if (servicesCurrent < 0) {
            servicesCurrent = servicesSlides.length - 1; // Loops back to end
        }
        updateServicesSlider();
    });

    // Fire state configuration layout initialization instantly
    updateServicesSlider();
});
