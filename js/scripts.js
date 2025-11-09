// --- Tabs (если нужны, иначе убрать) ---
function openCity(evt, cityName) {
  const tabcontent = document.querySelectorAll(".tabcontent");
  tabcontent.forEach(el => el.style.display = "none");

  const tablinks = document.querySelectorAll(".tablinks");
  tablinks.forEach(el => el.classList.remove("active"));

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.classList.add("active");
}

// --- Circular Progress Bars ---
(function(){
  const CIRC = 2 * Math.PI * 45; // окружность для r=45

  document.querySelectorAll('.c-progress').forEach(el => {
    el.innerHTML = `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="c-track" cx="50" cy="50" r="45"></circle>
        <circle class="c-bar" cx="50" cy="50" r="45"></circle>
      </svg>
      <div class="c-progress__value"><span>0</span>%</div>
      <div class="c-progress__label">${el.dataset.label || ''}</div>
    `;

    const bar = el.querySelector('.c-bar');
    bar.style.strokeDasharray = `${CIRC} ${CIRC}`;
    bar.style.strokeDashoffset = CIRC;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const value = Math.min(100, Math.max(0, parseFloat(el.dataset.value || '0')));
      const bar = el.querySelector('.c-bar');
      const num = el.querySelector('.c-progress__value span');

      // плавная анимация stroke
      bar.animate([
        { strokeDashoffset: CIRC },
        { strokeDashoffset: CIRC * (1 - value/100) }
      ], {
        duration: 1500,
        easing: 'ease-out',
        fill: 'forwards'
      });

      // плавный счетчик
      let start = null;
      function countUp(ts){
        if(!start) start = ts;
        const progress = Math.min((ts - start) / 1500, 1);
        num.textContent = Math.round(value * progress);
        if(progress < 1) requestAnimationFrame(countUp);
      }
      requestAnimationFrame(countUp);

      io.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.c-progress').forEach(el => io.observe(el));
})();

// --- Fade-in анимация для timeline ---
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach(item => observer.observe(item));
});


//counter js 
function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  let current = 0;
  const step = target / (duration / 50);

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 50);
}

window.addEventListener('DOMContentLoaded', () => {
  animateCounter('counter-experience', 20, 1000);
  animateCounter('counter-projects', 100, 1500);
});

//expandable section
// Expand/Collapse Responsibilities
document.querySelectorAll('.toggle-link').forEach(link => {
  link.addEventListener('click', function () {
    const expandable = this.previousElementSibling; 
    expandable.classList.toggle('expanded');
    this.textContent = expandable.classList.contains('expanded') ? 'Less' : 'More';
  });
});

// Toggle Skills Panel by clicking handle
document.querySelectorAll('.skills-handle').forEach(handle => {
  handle.addEventListener('click', function () {
    const skillsPanel = this.parentElement.nextElementSibling;
    skillsPanel.classList.toggle('active');
  });
});


// Expand/Collapse Responsibilities
document.querySelectorAll('.toggle-link').forEach(link => {
  link.addEventListener('click', function () {
    const expandable = this.previousElementSibling.previousElementSibling; 
    expandable.classList.toggle('expanded');
    this.textContent = expandable.classList.contains('expanded') ? 'Less' : 'More';
  });
});

// Toggle Skills Panel by clicking handle
document.querySelectorAll('.skills-handle').forEach(handle => {
  handle.addEventListener('click', function () {
    const skillsPanel = document.querySelector('.col-right');

    if (skillsPanel.classList.contains('active')) {
      skillsPanel.classList.remove('active');
      setTimeout(() => { skillsPanel.style.display = "none"; }, 400); // wait for transition
    } else {
      skillsPanel.style.display = "block";
      setTimeout(() => skillsPanel.classList.add('active'), 10); // slide in
    }
  });
});


   // Animate progress bars
      window.addEventListener("load", () => {
        document.querySelectorAll(".progress-bar").forEach(bar => {
          bar.style.width = bar.getAttribute("data-progress");
        });
      });

      // Menu
document.addEventListener("DOMContentLoaded", () => {
  // --- Side menu + dynamic page loader ---
  const sideMenu = document.getElementById("sideMenu");
  const backdrop = document.getElementById("backdrop");
  const content = document.getElementById("dynamic-content");

  // Guard clause: if menu isn't on this page, skip setup
  if (!sideMenu || !backdrop || !content) return;

  window.toggleMenu = function () {
    const isOpen = sideMenu.classList.toggle("open");
    backdrop.classList.toggle("visible", isOpen);
  };

  window.loadPage = async function (page, btn) {
    // Close side menu
    sideMenu.classList.remove("open");
    backdrop.classList.remove("visible");

    // Highlight active button
    document.querySelectorAll(".menu-content button").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    // Fade out content
    content.style.opacity = "0";

    try {
      const res = await fetch(page);
      const html = await res.text();
      content.innerHTML = html;
    } catch (err) {
      content.innerHTML = "<p style='color:red'>Error loading content.</p>";
    }

    // Fade in
    setTimeout(() => {
      content.style.opacity = "1";
    }, 100);
  };

  // Load default content
  const defaultBtn = document.querySelector(".menu-content button.active");
  if (defaultBtn) loadPage("home.html", defaultBtn);
});

// Projects
  const buttons = document.querySelectorAll('.tab-button');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

// Education

  const filterSelect = document.getElementById('edu-filter');
  const eduCards = document.querySelectorAll('.edu-card');

  filterSelect.addEventListener('change', () => {
    const selectedCategory = filterSelect.value;

    eduCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');

      if (selectedCategory === 'all' || cardCategory === selectedCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

// blog
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("#blog-section .blog-card");

  // Fade-in observer for scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
});


// Scroll left column to section when clicking right column list
document.querySelectorAll('.exhibition-list li').forEach(item => {
  item.addEventListener('click', () => {
    const targetId = item.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// country counter
const counter = document.querySelector(".counter-number");
let started = false;

function startCounter() {
  const target = +counter.getAttribute("data-target");
  let num = 0;
  const step = target / 100;

  const interval = setInterval(() => {
    num += step;
    if (num >= target) {
      counter.textContent = target;
      clearInterval(interval);
    } else {
      counter.textContent = Math.floor(num);
    }
  }, 20);
}

window.addEventListener("scroll", () => {
  const pos = counter.getBoundingClientRect().top;
  if (!started && pos < window.innerHeight) {
    started = true;
    startCounter();
  }
});



// Smooth scroll from right menu
document.querySelectorAll('.exhibition-list li').forEach(li=>{
  li.addEventListener('click',()=>{
    document.getElementById(li.dataset.target).scrollIntoView({behavior:'smooth'});
  });
});



//worksidepanel
function togglePanel(panel) {
  const el = document.getElementById(`panel-${panel}`);
  el.classList.toggle("open");
}

 const exhibitions = document.querySelectorAll('.exhibition img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxPlace = document.getElementById('lightbox-place');
  const lightboxClose = document.querySelector('.lightbox-close');
  let currentIndex = 0;

  const openLightbox = index => {
    const parent = exhibitions[index].closest('.exhibition');
    lightboxImg.src = parent.dataset.img;
    lightboxTitle.textContent = parent.dataset.title;
    lightboxDate.textContent = parent.dataset.date;
    lightboxPlace.textContent = parent.dataset.place;
    lightbox.classList.add('active');
    currentIndex = index;
  };

  exhibitions.forEach((img, index) => img.addEventListener('click', () => openLightbox(index)));
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % exhibitions.length);
    if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + exhibitions.length) % exhibitions.length);
  });


  //lighbox
document.addEventListener("DOMContentLoaded", () => {
  // Select all exhibition images
  const exhibitions = document.querySelectorAll(".exhibition img");

  // Create lightbox elements
  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox-overlay");

  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-img" src="" alt="">
    <div class="lightbox-caption">
      <h4></h4>
      <p class="lightbox-date"></p>
      <p class="lightbox-place"></p>
    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxTitle = lightbox.querySelector(".lightbox-caption h4");
  const lightboxDate = lightbox.querySelector(".lightbox-date");
  const lightboxPlace = lightbox.querySelector(".lightbox-place");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  // Open lightbox
  exhibitions.forEach((img) => {
    img.addEventListener("click", (e) => {
      const exhibition = e.target.closest(".exhibition");

      // Get data from exhibition attributes
      const title = exhibition.dataset.title || "Untitled";
      const date = exhibition.dataset.date || "";
      const place = exhibition.dataset.place || "";
      const src = exhibition.dataset.img || img.src;

      // Update lightbox content
      lightboxImg.src = src;
      lightboxTitle.textContent = title;
      lightboxDate.textContent = date ? `📅 ${date}` : "";
      lightboxPlace.textContent = place ? `📍 ${place}` : "";

      // Show lightbox
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden"; // prevent background scroll
    });
  });

  // Close lightbox when clicking X or background
  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = ""; // re-enable scrolling
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close with ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
});


