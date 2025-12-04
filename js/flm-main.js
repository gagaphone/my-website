// Toggle menu visibility


const floatingMenu = document.getElementById("floatingMenu");
const expandedMenu = document.getElementById("expandedMenu");

floatingMenu.addEventListener("click", () => {
  expandedMenu.classList.toggle("show");
});
