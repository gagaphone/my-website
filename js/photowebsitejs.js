// ===================== VARIABLES =====================
const overlay = document.getElementById("projectOverlay");
const closeBtn = document.getElementById("closeOverlay");
const mainImg = document.getElementById("overlayMain");
const secondaryImg = document.getElementById("overlaySecondary");
const titleEl = document.getElementById("overlayTitle");
const metaEl = document.getElementById("overlayMeta");
const descEl = document.getElementById("overlayDescription");
const galleryGrid = document.getElementById("overlayGallery");

const filterTabs = document.getElementById("filterTabs");
const activeTags = document.getElementById("activeTags");
const resultsCount = document.getElementById("resultsCount");

const masonryItems = Array.from(document.querySelectorAll(".masonry-item"));

let activeFilters = [];

// ===================== OVERLAY =====================
function openOverlay(item) {
  if (!item) return;

  const d = item.dataset;

  // Reset scroll
  overlay.scrollTop = 0;

  titleEl.textContent = d.title || "";

  let metaHTML = `
    <span><strong>Category:</strong> ${d.category || ""}</span>
    <span><strong>Place:</strong> ${d.place || ""}</span>
    <span><strong>Year:</strong> ${d.year || ""}</span>
  `;

  // Use description first from any source
  let descriptionText =
    d.description ||
    d.exhibitionDescription ||
    d.magazineDescription ||
    "";

  // ---------- EXHIBITION ----------
  if (d.exhibition) {
    metaHTML += `
      <span><strong>Exhibition:</strong>
        ${d.exhibitionLink
          ? `<a href="${d.exhibitionLink}" target="_blank">${d.exhibition}</a>`
          : d.exhibition}
      </span>
    `;

    if (d.exhibitionPlace) {
      metaHTML += `<span><strong>Venue:</strong> ${d.exhibitionPlace}</span>`;
    }

    if (d.exhibitionYear) {
      metaHTML += `<span><strong>Exhibition Year:</strong> ${d.exhibitionYear}</span>`;
    }
  }

  // ---------- MAGAZINE ----------
  if (d.magazine) {
    metaHTML += `
      <span><strong>Magazine:</strong>
        ${d.magazineLink
          ? `<a href="${d.magazineLink}" target="_blank">${d.magazine}</a>`
          : d.magazine}
      </span>
    `;

    if (d.magazineYear) {
      metaHTML += `<span><strong>Publication Year:</strong> ${d.magazineYear}</span>`;
    }
  }

  metaEl.innerHTML = metaHTML;

  // ---------- DESCRIPTION ----------
  if (descEl) {
    descEl.textContent = descriptionText;
    descEl.style.display = descriptionText ? "block" : "none";
  }

  // ---------- MAIN IMAGE ----------
  mainImg.onload = null;
  mainImg.style.opacity = 0;
  mainImg.src = d.img || "";
  mainImg.onload = () => {
    mainImg.style.opacity = 1;
  };

  // ---------- SECONDARY IMAGE (ONLY IF HTML HAS IT) ----------
  if (secondaryImg) {
    secondaryImg.onload = null;
    secondaryImg.src = "";
    secondaryImg.style.display = "none";
    secondaryImg.style.opacity = 0;

    if (item.hasAttribute("data-secondary-img")) {
      const secondarySrc = item.getAttribute("data-secondary-img");

      if (secondarySrc) {
        secondaryImg.src = secondarySrc;
        secondaryImg.style.display = "block";

        secondaryImg.onload = () => {
          secondaryImg.style.opacity = 1;
        };
      }
    }
  }

  buildCategoryGrid(d.category || "");

  // ✅ Call share update
  updateShareLinks(item);

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeOverlay() {
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeOverlay);
document.addEventListener("keydown", e => e.key === "Escape" && closeOverlay());
overlay.addEventListener("click", e => e.target === overlay && closeOverlay());

// ===================== CATEGORY GRID =====================
function buildCategoryGrid(category) {
  galleryGrid.innerHTML = "";
  if (!category) return;

  masonryItems
    .filter(item => item.dataset.category?.includes(category))
    .forEach(item => {
      const img = document.createElement("img");
      img.src = item.querySelector("img")?.src || "";
      img.onload = () => img.classList.add("fade-in");
      img.onclick = () => openOverlay(item);
      galleryGrid.appendChild(img);
    });
}

// ===================== FILTERS =====================
function toggleFilter(filter) {
  if (filter === "all") {
    activeFilters = [];
  } else {
    activeFilters.includes(filter)
      ? activeFilters.splice(activeFilters.indexOf(filter), 1)
      : activeFilters.push(filter);
  }

  renderFilters();
  filterItems();
}

function renderFilters() {
  activeTags.innerHTML = "";

  activeFilters.forEach(filter => {
    const tag = document.createElement("span");
    tag.className = "active-filter";
    tag.innerHTML = `${filter} <button>×</button>`;
    tag.querySelector("button").onclick = () => toggleFilter(filter);
    activeTags.appendChild(tag);
  });

  filterTabs.querySelectorAll(".tab-button").forEach(btn => {
    const f = btn.dataset.filter;
    btn.classList.toggle(
      "active",
      f === "all" ? activeFilters.length === 0 : activeFilters.includes(f)
    );
  });
}

function filterItems() {
  let visibleIndex = 0;

  masonryItems.forEach(item => {
    const categories = item.dataset.category?.split(",").map(c => c.trim()) || [];
    const visible =
      activeFilters.length === 0 ||
      categories.some(c => activeFilters.includes(c));

    item.style.display = visible ? "" : "none";

    if (visible) {
      visibleIndex++;
      updateH5Number(item, visibleIndex);
    }
  });

  resultsCount.textContent = visibleIndex;
}

// ===================== FIXED NUMBERING =====================
function updateH5Number(item, number) {
  const h5 = item.querySelector(".exhibition-info h5");
  if (!h5) return;

  const icon = h5.querySelector("ion-icon");
  h5.innerHTML = "";
  if (icon) h5.appendChild(icon);

  h5.appendChild(document.createTextNode(` Photo ${number}`));
}

// ===================== INIT FILTER TABS =====================
const categories = [...new Set(
  masonryItems.flatMap(i =>
    i.dataset.category?.split(",").map(c => c.trim()) || []
  )
)];

const allBtn = document.createElement("button");
allBtn.textContent = "All";
allBtn.dataset.filter = "all";
allBtn.className = "tab-button";
allBtn.onclick = () => toggleFilter("all");
filterTabs.appendChild(allBtn);

categories.forEach(cat => {
  const btn = document.createElement("button");
  btn.textContent = cat;
  btn.dataset.filter = cat;
  btn.className = "tab-button";
  btn.onclick = () => toggleFilter(cat);
  filterTabs.appendChild(btn);
});

// ===================== INIT =====================
masonryItems.forEach(item =>
  item.addEventListener("click", () => openOverlay(item))
);

renderFilters();
filterItems();

// ===================== ALT TEXT =====================
document.querySelectorAll(".masonry-item img").forEach(img => {
  const item = img.closest(".masonry-item");
  if (!item) return;

  img.alt = [
    item.dataset.title,
    item.dataset.place,
    item.dataset.year
  ].filter(Boolean).join(", ");
});

// ===================== SHARE IMG =====================
const shareNative = document.getElementById("shareNative");
const shareCopy = document.getElementById("shareCopy");
const shareFacebook = document.getElementById("shareFacebook");
const shareTwitter = document.getElementById("shareTwitter");
const shareLinkedIn = document.getElementById("shareLinkedIn"); // new button

function updateShareLinks(item) {
  if (!shareNative || !shareCopy || !shareFacebook || !shareTwitter || !shareLinkedIn) return;

  const title = item.dataset.title || "Photography";
  const img = item.dataset.img || "";
  const url = `${location.origin}${location.pathname}#${encodeURIComponent(img)}`;

  // Native share
  shareNative.onclick = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: title,
        url
      });
    }
  };

  // Copy link
  shareCopy.onclick = async () => {
    await navigator.clipboard.writeText(url);
    shareCopy.classList.add("copied");
    setTimeout(() => shareCopy.classList.remove("copied"), 1000);
  };

  // Social links
  shareFacebook.href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  shareTwitter.href =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  // ✅ LinkedIn share
  shareLinkedIn.href =
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}
