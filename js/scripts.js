/*****************************************
 * SAFE UTILS
 *****************************************/
const qs = (sel, scope=document) => scope.querySelector(sel);
const qsa = (sel, scope=document) => [...scope.querySelectorAll(sel)];

/*****************************************
 * TABS (only if elements exist)
 *****************************************/
function openCity(evt, cityName) {
  const tabcontent = qsa(".tabcontent");
  const tablinks = qsa(".tablinks");

  tabcontent.forEach(el => el.style.display = "none");
  tablinks.forEach(el => el.classList.remove("active"));

  const target = qs(`#${cityName}`);
  if (target) target.style.display = "block";

  if (evt?.currentTarget) evt.currentTarget.classList.add("active");
}


/*****************************************
 * TIMELINE FADE-IN
 *****************************************/
document.addEventListener("DOMContentLoaded", () => {
  const items = qsa(".timeline-item");
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(i => observer.observe(i));
});


/*****************************************
 * EXPANDABLE SECTIONS (merged & fixed)
 *****************************************/
qsa('.toggle-link').forEach(link => {
  link.addEventListener('click', function(){
    const expandable = this.previousElementSibling; 
    if (!expandable) return;
    expandable.classList.toggle("expanded");
    this.textContent = expandable.classList.contains("expanded") ? "Less" : "More";
  });
});

/*****************************************
 * SKILLS PANEL
 *****************************************/
qsa('.skills-handle').forEach(handle => {
  handle.addEventListener('click', () => {
    const panel = qs('.col-right');
    if (!panel) return;

    if (panel.classList.contains("active")) {
      panel.classList.remove("active");
      setTimeout(()=> panel.style.display="none", 400);
    } else {
      panel.style.display="block";
      setTimeout(()=> panel.classList.add("active"), 10);
    }
  });
});


/*****************************************
 * SIDE MENU LOADER (safe)
 *****************************************/
document.addEventListener("DOMContentLoaded", () => {
  const sideMenu = qs("#sideMenu");
  const backdrop = qs("#backdrop");
  const content = qs("#dynamic-content");

  if (!sideMenu || !backdrop || !content) return;

  window.toggleMenu = function(){
    const isOpen = sideMenu.classList.toggle("open");
    backdrop.classList.toggle("visible", isOpen);
  };

  window.loadPage = async function(page, btn){
    sideMenu.classList.remove("open");
    backdrop.classList.remove("visible");

    qsa(".menu-content button").forEach(b=>b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    content.style.opacity = "0";

    try {
      const res = await fetch(page);
      content.innerHTML = await res.text();
    } catch {
      content.innerHTML = "<p style='color:red'>Error loading content.</p>";
    }

    setTimeout(()=> content.style.opacity="1", 100);
  };

  const defaultBtn = qs(".menu-content button.active");
  if (defaultBtn) loadPage("home.html", defaultBtn);
});

/*****************************************
 * PROJECT FILTER
 *****************************************/
(function(){
  const buttons = qsa('.tab-button');
  const cards = qsa('.project-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', ()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card=>{
        card.style.display =
          filter === "all" || card.dataset.category === filter
            ? "block"
            : "none";
      });
    });
  });
})();

/*****************************************
 * EDUCATION FILTER
 *****************************************/
(function(){
  const select = qs("#edu-filter");
  const cards = qsa(".edu-card");
  if (!select) return;

  select.addEventListener("change", ()=>{
    const filter = select.value;
    cards.forEach(card=>{
      const cat = card.dataset.category;
      card.style.display =
        filter === "all" || cat === filter ? "block" : "none";
    });
  });
})();

/*****************************************
 * BLOG FADE-IN
 *****************************************/
document.addEventListener("DOMContentLoaded", ()=>{
  const cards = qsa("#blog-section .blog-card");
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.style.animationDelay = `${Math.random()*0.3}s`;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(c=>observer.observe(c));
});



/*****************************************
 * PROJECT CARD FLIP (mobile only)
 *****************************************/
document.addEventListener('DOMContentLoaded', () => {
  const cards = qsa('.project-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 767px)').matches) {
        card.classList.toggle('flipped');
      }
    });
  });

  window.addEventListener('resize', ()=>{
    if (window.matchMedia('(min-width: 768px)').matches){
      cards.forEach(c=>c.classList.remove('flipped'));
    }
  });
});
