// ============================
// script.js
// ============================

// Intersection Observer for reveal animations
function setupReveal() {
  const items = document.querySelectorAll('.timeline-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target); // reveal once
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  items.forEach(i => io.observe(i));
}

// Theme switching
function applyTheme(themeClass) {
  document.body.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-minimal');
  document.body.classList.add(themeClass);
  const sel = document.getElementById('theme-select');
  if (sel) sel.value = themeClass;
}

// Dark mode toggle
function toggleDark() {
  const btn = document.getElementById('dark-toggle');
  const isDark = document.body.classList.toggle('dark');
  btn.setAttribute('aria-pressed', String(isDark));
  btn.textContent = isDark ? 'Light' : 'Dark';
}

// ============================
// PDF Export
// ============================
function exportPDF() {
  const element = document.querySelector(".panel-content");

  const opt = {
    margin: 10,
    filename: 'Professional_Timeline.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, logging: false, scrollX: 0, scrollY: 0, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

// ============================
// Init
// ============================
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();

  // Theme select
  const sel = document.getElementById('theme-select');
  if (sel) {
    sel.addEventListener('change', e => applyTheme(e.target.value));
    sel.value = Array.from(document.body.classList).find(c => c.startsWith('theme-')) || 'theme-blue';
  }

  // Dark toggle
  const dbtn = document.getElementById('dark-toggle');
  if (dbtn) dbtn.addEventListener('click', toggleDark);

  // PDF export
  const pdfBtn = document.getElementById('export-pdf');
  if (pdfBtn) pdfBtn.addEventListener('click', exportPDF);
});
