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

     
  // Get all section elements
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".sidebar-nav a");

  // Intersection Observer to detect active section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // remove active class from all links
          navLinks.forEach((link) => link.classList.remove("active"));

          // add active class to the current section's link
          const activeLink = document.querySelector(
            `.sidebar-nav a[href="#${entry.target.id}"]`
          );
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    { threshold: 0.1 } // section is "active" when 60% in view
  );

  // Observe each section
  sections.forEach((section) => observer.observe(section));

