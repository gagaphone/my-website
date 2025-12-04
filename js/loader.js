window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.classList.add("hidden"); // fade out
  setTimeout(() => loader.style.display = "none", 400); // remove from DOM
});
