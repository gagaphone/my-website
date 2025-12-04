document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("roadmap");
  if (!root) return;

  const nodes = [...root.querySelectorAll(".rm-node")];
  const pathEl = root.querySelector(".rm-wave-path path");
  const shapes = { a: root.querySelector(".rm-shape-a"), b: root.querySelector(".rm-shape-b") };
  const cursor = document.querySelector(".cursor-trail");

  /* ---------- Layout Nodes Along a Smooth Sine Wave ---------- */
  function layoutNodes() {
    const containerWidth = root.clientWidth;
    const containerHeight = root.clientHeight;
    const margin = 100;
    const amplitude = 80; // wave height
    const spacing = containerWidth / (nodes.length + 1);

    const points = [];

    nodes.forEach((node, i) => {
      const x = spacing * (i + 1);
      const y = containerHeight / 2 + Math.sin((i / (nodes.length - 1)) * Math.PI * 2) * amplitude;

      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.transform = "translate(-50%, -50%)"; // center node

      points.push([x, y]);
    });

    drawPath(points);
  }

  /* ---------- Draw a Smooth SVG Path Connecting Nodes ---------- */
  function drawPath(points) {
    if (!points.length) return;
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const midX = (points[i-1][0] + points[i][0]) / 2;
      const midY = (points[i-1][1] + points[i][1]) / 2;
      d += ` Q${points[i-1][0]},${points[i-1][1]} ${midX},${midY}`;
    }
    const last = points[points.length-1];
    d += ` T${last[0]},${last[1]}`;
    pathEl.setAttribute("d", d);
  }

  layoutNodes();
  window.addEventListener("resize", layoutNodes);

  /* ---------- Reveal Nodes on Scroll ---------- */
  nodes.forEach(node => {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("rm-inview");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(node);
    } else node.classList.add("rm-inview");
  });

  /* ---------- 3D Tilt & Shadow on Nodes ---------- */
  nodes.forEach(node => {
    node.addEventListener("mousemove", e => {
      const r = node.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -15;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 15;
      const sx = ((e.clientX - r.left) / r.width - 0.5) * 20;
      const sy = ((e.clientY - r.top) / r.height - 0.5) * 20;

      gsap.to(node, {
        rotateX: rx,
        rotateY: ry,
        scale: 1.05,
        boxShadow: `${-sx}px ${-sy}px 40px rgba(0,0,0,0.25)`,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    node.addEventListener("mouseleave", () => {
      gsap.to(node, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
        duration: 0.5,
        ease: "power3.out"
      });
    });
  });

  /* ---------- Mouse Parallax for Blobs ---------- */
  root.addEventListener("mousemove", e => {
    const rect = root.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    gsap.to(shapes.a, { x: nx, y: ny, rotate: nx * 0.02, duration: 0.2 });
    gsap.to(shapes.b, { x: -nx, y: -ny, rotate: -nx * 0.02, duration: 0.2 });
  });

  /* ---------- Cursor Glow Trail ---------- */
  window.addEventListener("mousemove", e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
  });

  /* ---------- Floating Particles ---------- */
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "rm-particle";
    root.appendChild(p);
    gsap.to(p, {
      x: `random(-40,40)`,
      y: `random(-40,40)`,
      opacity: `random(0.2,0.7)`,
      duration: `random(3,6)`,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  /* ---------- Blob Morphing ---------- */
  gsap.to(shapes.a, {
    attr: { d: "M220,80 C350,10 540,30 690,120 C860,230 880,380 720,450 C560,520 340,480 200,390 C80,310 100,160 220,80Z" },
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
});
