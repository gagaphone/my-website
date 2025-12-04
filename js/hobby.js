// Hobby Section Filter JS
document.addEventListener("DOMContentLoaded", () => {
  const hobbyTabs = document.querySelectorAll("#hobby-section .tab-button");
  const hobbyItems = document.querySelectorAll("#hobby-section .hobby-grid .exhibition");

  hobbyTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      hobbyTabs.forEach(t => t.classList.remove("active"));
      // Add active class to clicked tab
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      hobbyItems.forEach(item => {
        const categories = item.getAttribute("data-category").split(" ");
        if (filter === "all" || categories.includes(filter)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});

// extract data for overlay
document.querySelectorAll('.exhibition').forEach(exhibition => {
  const place = exhibition.dataset.place; // read data-place
  const date = exhibition.dataset.date;   // read data-date
  const overlay = exhibition.querySelector('.overlay');

  if ((place || date) && overlay) {
    // Create a paragraph for "place · date"
    const infoEl = document.createElement('p');
    infoEl.classList.add('overlay-info');

    // Combine place and date with middle dot
    infoEl.textContent = [place, date].filter(Boolean).join(' · ');

    // Insert before the "View" button
    const btn = overlay.querySelector('a.btn');
    overlay.insertBefore(infoEl, btn);
  }
});