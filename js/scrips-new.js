/*****************************************
 * SAFE UTILS
 *****************************************/
const qs = (sel, scope=document) => scope.querySelector(sel);
const qsa = (sel, scope=document) => [...scope.querySelectorAll(sel)];

/*****************************************
 * DOM CONTENT LOADED
 *****************************************/
document.addEventListener("DOMContentLoaded", () => {

  /*****************************************
   * TABS
   *****************************************/
  window.openCity = (evt, cityName) => {
    const tabcontent = qsa(".tabcontent");
    const tablinks = qsa(".tablinks");
    tabcontent.forEach(el => el.style.display = "none");
    tablinks.forEach(el => el.classList.remove("active"));
    const target = qs(`#${cityName}`);
    if (target) target.style.display = "block";
    if (evt?.currentTarget) evt.currentTarget.classList.add("active");
  };

  /*****************************************
   * TIMELINE FADE-IN
   *****************************************/
  const timelineItems = qsa(".timeline-item");
  if (timelineItems.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineItems.forEach(i => observer.observe(i));
  }

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
  const sideMenu = qs("#sideMenu");
  const backdrop = qs("#backdrop");
  const content = qs("#dynamic-content");
  if (sideMenu && backdrop && content) {
    window.toggleMenu = () => {
      const isOpen = sideMenu.classList.toggle("open");
      backdrop.classList.toggle("visible", isOpen);
    };

    window.loadPage = async (page, btn) => {
      sideMenu.classList.remove("open");
      backdrop.classList.remove("visible");
      qsa(".menu-content button").forEach(b => b.classList.remove("active"));
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
  }

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
  const blogCards = qsa("#blog-section .blog-card");
  if (blogCards.length) {
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          entry.target.style.animationDelay = `${Math.random()*0.3}s`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    blogCards.forEach(c=>observer.observe(c));
  }

  /*****************************************
   * PROJECT CARD FLIP
   *****************************************/
  const projectCards = qsa('.project-card');
  if (projectCards.length) {
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 767px)').matches) card.classList.toggle('flipped');
      });
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 768px)').matches) projectCards.forEach(c=>c.classList.remove('flipped'));
    });
  }

  /*****************************************
   * ROADMAP SECTION
   *****************************************/
  const roadmap = qs("#roadmap");
  if (roadmap) {
    const nodes = [...roadmap.querySelectorAll(".rm-node")];
    const pathEl = roadmap.querySelector(".rm-wave-path path");
    const shapes = { a: roadmap.querySelector(".rm-shape-a"), b: roadmap.querySelector(".rm-shape-b") };
    const cursor = qs(".cursor-trail");

    function layoutNodes() {
      const width = roadmap.clientWidth;
      const height = roadmap.clientHeight;
      const amplitude = 80;
      const spacing = width / (nodes.length + 1);
      const points = [];

      nodes.forEach((node, i)=>{
        const x = spacing * (i+1);
        const y = height/2 + Math.sin((i/(nodes.length-1))*Math.PI*2)*amplitude;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.transform = "translate(-50%, -50%)";
        points.push([x,y]);
      });
      drawPath(points);
    }

    function drawPath(points){
      if (!points.length) return;
      let d = `M${points[0][0]},${points[0][1]}`;
      for (let i=1;i<points.length;i++){
        const midX = (points[i-1][0]+points[i][0])/2;
        const midY = (points[i-1][1]+points[i][1])/2;
        d += ` Q${points[i-1][0]},${points[i-1][1]} ${midX},${midY}`;
      }
      const last = points[points.length-1];
      d += ` T${last[0]},${last[1]}`;
      pathEl.setAttribute("d", d);
    }

    layoutNodes();
    window.addEventListener("resize", layoutNodes);

    // Reveal nodes on scroll
    nodes.forEach(node => {
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries, obs)=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              entry.target.classList.add("rm-inview");
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        obs.observe(node);
      } else node.classList.add("rm-inview");
    });

    // 3D tilt & shadow
    nodes.forEach(node=>{
      node.addEventListener("mousemove", e=>{
        const r = node.getBoundingClientRect();
        const rx = ((e.clientY-r.top)/r.height-0.5)*-15;
        const ry = ((e.clientX-r.left)/r.width-0.5)*15;
        const sx = ((e.clientX-r.left)/r.width-0.5)*20;
        const sy = ((e.clientY-r.top)/r.height-0.5)*20;
        gsap.to(node, {
          rotateX: rx,
          rotateY: ry,
          scale: 1.05,
          boxShadow: `${-sx}px ${-sy}px 40px rgba(0,0,0,0.25)`,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      node.addEventListener("mouseleave", ()=>{
        gsap.to(node,{
          rotateX:0,
          rotateY:0,
          scale:1,
          boxShadow:"0 8px 20px rgba(0,0,0,0.04)",
          duration:0.5,
          ease:"power3.out"
        });
      });
    });

    // Mouse parallax for blobs
    roadmap.addEventListener("mousemove", e=>{
      const rect = roadmap.getBoundingClientRect();
      const nx = ((e.clientX-rect.left)/rect.width-0.5)*12;
      const ny = ((e.clientY-rect.top)/rect.height-0.5)*10;
      gsap.to(shapes.a, { x:nx, y:ny, rotate:nx*0.02, duration:0.2 });
      gsap.to(shapes.b, { x:-nx, y:-ny, rotate:-nx*0.02, duration:0.2 });
    });

    // Cursor glow
    if (cursor) window.addEventListener("mousemove", e => gsap.to(cursor, {x:e.clientX, y:e.clientY, duration:0.1, ease:"power2.out"}));

    // Floating particles
    for (let i=0;i<20;i++){
      const p = document.createElement("div");
      p.className="rm-particle";
      roadmap.appendChild(p);
      gsap.to(p,{
        x:`random(-40,40)`,
        y:`random(-40,40)`,
        opacity:`random(0.2,0.7)`,
        duration:`random(3,6)`,
        repeat:-1,
        yoyo:true,
        ease:"sine.inOut"
      });
    }

    // Blob morphing
    gsap.to(shapes.a,{
      attr:{d:"M220,80 C350,10 540,30 690,120 C860,230 880,380 720,450 C560,520 340,480 200,390 C80,310 100,160 220,80Z"},
      duration:12,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    });
  }

  /*****************************************
   * HOBBY FILTER
   *****************************************/
  const hobbyTabs = qsa("#hobby-section .tab-button");
  const hobbyItems = qsa("#hobby-section .hobby-grid .exhibition");
  hobbyTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      hobbyTabs.forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      hobbyItems.forEach(item => {
        const cats = item.dataset.category.split(" ");
        item.style.display = (filter==="all" || cats.includes(filter))?"block":"none";
      });
    });
  });

  /*****************************************
   * FLOATING MENU
   *****************************************/
  const floatingMenu = qs('#floatingMenu');
  const expandedMenu = qs('#expandedMenu');
  if (floatingMenu && expandedMenu) {
    floatingMenu.addEventListener('click', ()=> expandedMenu.classList.toggle('show'));
  }

  /*****************************************
   * SCROLL-TO-TOP BUTTON
   *****************************************/
  const scrollBtn = qs('.scroll-to-top');
  if(scrollBtn){
    scrollBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', ()=> {
      if(window.scrollY>400) scrollBtn.classList.add('visible');
      else scrollBtn.classList.remove('visible');
    });
  }

  /*****************************************
   * LIGHTBOX
   *****************************************/
  const exhibitions = qsa('.exhibition img');
  const lightbox = qs('.lightbox-overlay');
  const lightboxImg = qs('.lightbox-img');
  const lightboxCaption = qs('.lightbox-caption');
  const lightboxClose = qs('.lightbox-close');

  if(lightbox && lightboxImg && lightboxClose){
    exhibitions.forEach(img=>{
      img.addEventListener('click', ()=>{
        lightbox.classList.add('active');
        lightboxImg.src = img.src;
        const caption = img.closest('.exhibition').querySelector('.overlay p');
        lightboxCaption.innerHTML = caption ? caption.innerHTML : '';
      });
    });
    lightboxClose.addEventListener('click', ()=> lightbox.classList.remove('active'));
    lightbox.addEventListener('click', e=>{ if(e.target===lightbox) lightbox.classList.remove('active'); });
  }

  /*****************************************
   * CAROUSEL
   *****************************************/
  const track = qs('.carousel-track');
  if(track){
    const slides = Array.from(track.children);
    const nextBtn = qs('.next-btn');
    const prevBtn = qs('.prev-btn');
    let currentIndex = 0;

    function moveToSlide(idx){
      const slideWidth = slides[0].getBoundingClientRect().width + 20;
      track.style.transform = `translateX(-${slideWidth*idx}px)`;
    }

    if(nextBtn) nextBtn.addEventListener('click', ()=>{ if(currentIndex<slides.length-2.5){ currentIndex++; moveToSlide(currentIndex); } });
    if(prevBtn) prevBtn.addEventListener('click', ()=>{ if(currentIndex>0){ currentIndex--; moveToSlide(currentIndex); } });
    window.addEventListener('resize', ()=> moveToSlide(currentIndex));
  }

}); // DOMContentLoaded end


  // Simple filtering
  const filter = document.getElementById('portfolio-filter');
  const cards = document.querySelectorAll('.portfolio-card');

  filter.addEventListener('change', () => {
    const value = filter.value;
    cards.forEach(card => {
      if (value === 'all' || card.dataset.category === value) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });