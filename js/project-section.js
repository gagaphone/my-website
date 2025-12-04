

  /* ----------------------------------------------
     TAB FILTERING
  ---------------------------------------------- */
  const tabButtons = document.querySelectorAll(".tab-button");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // Update active tab
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter cards
      cards.forEach(card => {
        const category = card.dataset.category;
        card.style.display =
          filter === "all" || filter === category ? "block" : "none";
      });

      // Close overlays when switching tabs
      closeAllCards();
    });
  });


