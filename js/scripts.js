/*****************************************
 * SAFE UTILS
 *****************************************/
const qs = (sel, scope=document) => scope.querySelector(sel);
const qsa = (sel, scope=document) => [...scope.querySelectorAll(sel)];

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
 * EXPANDABLE SECTIONS
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
 * SIDE MENU LOADER
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
 * MAIN PORTFOLIO / EDUCATION TABS
 *****************************************/
(function(){
  const mainTabs = qsa(".main-tab");
  const tabContents = qsa(".tab-content");
  if (!mainTabs.length) return;

  mainTabs[0].classList.add("active");
  tabContents.forEach((tc, i) => tc.style.display = i===0 ? "block" : "none");

  mainTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      mainTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      tabContents.forEach(tc => tc.style.display = "none");
      const target = qs(`#${tab.dataset.target}`);
      if (target) target.style.display = "block";
    });
  });
})();

/*****************************************
 * PROJECT CATEGORY FILTER
 *****************************************/
(function(){
  const projectTabContent = qs("#projects-content");
  if (!projectTabContent) return;

  const projectButtons = qsa(".tab-button", projectTabContent);
  const projectCards = qsa(".project-card", projectTabContent);

  if (!projectButtons.length) return;

  projectButtons.forEach(button => {
    button.addEventListener("click", () => {
      projectButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      projectCards.forEach(card => {
        card.style.display = (filter === "all" || card.dataset.category === filter)
          ? "block"
          : "none";
      });
    });
  });

  // Show all projects by default
  projectCards.forEach(card => card.style.display = "block");
})();

/*****************************************
 * EDUCATION FILTER (TAB BUTTONS, like Projects)
 *****************************************/
(function(){
  const eduTabContent = qs("#education-content");
  if (!eduTabContent) return;

  const eduButtons = qsa(".edu-tabs .tab-button", eduTabContent);
  const eduCards = qsa(".edu-card", eduTabContent);

  if (!eduButtons.length) return;

  eduButtons.forEach(button => {
    button.addEventListener("click", () => {
      eduButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      eduCards.forEach(card => {
        card.style.display = (filter === "all" || card.dataset.category === filter)
          ? "block"
          : "none";
      });
    });
  });

  // Show all education cards by default
  eduCards.forEach(card => card.style.display = "block");
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
