"use strict";

/* =========================================================
   GLOBAL SAFE DOM HELPERS
========================================================= */

const $ = (selector, scope = document) =>
  scope.querySelector(selector);

const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));


/* =========================================================
   DOM READY
   Everything runs safely after the HTML exists.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     SECTION 01 — MOBILE MENU
  ======================================================= */

  (() => {

    const burger = $("#hamburger");
    const menu = $("#mobile-menu");
    const closeBtn = $("#mobile-menu-close");

    if (!burger || !menu) return;

    const openMenu = () => {

      menu.classList.add("active");
      menu.setAttribute("aria-hidden", "false");

      burger.classList.add("open");
      burger.setAttribute("aria-expanded", "true");

      document.body.classList.add("mobile-menu-open");
    };


    const closeMenu = () => {

      menu.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");

      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");

      document.body.classList.remove("mobile-menu-open");
    };


    burger.addEventListener("click", () => {

      const isOpen =
        menu.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    });


    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu);
    }


    $$(".mobile-nav a", menu).forEach(link => {

      link.addEventListener("click", closeMenu);

    });


    document.addEventListener("keydown", event => {

      if (event.key === "Escape") {

        if (menu.classList.contains("active")) {
          closeMenu();
        }

      }

    });

  })();


  /* =======================================================
     HEADER AUTO HIDE
  ======================================================= */

  (() => {

    const header =
      $(".header");

    if (!header) return;

    let lastScroll =
      window.pageYOffset || 0;

    let ticking = false;


    const updateHeader = () => {

      const currentScroll =
        window.pageYOffset || 0;


      /*
       * Always show header near the top.
       */

      if (currentScroll <= 80) {

        header.classList.remove("hide");

        lastScroll = currentScroll;
        ticking = false;

        return;
      }


      /*
       * Scrolling down = hide
       * Scrolling up   = show
       */

      if (currentScroll > lastScroll) {

        header.classList.add("hide");

      } else if (currentScroll < lastScroll) {

        header.classList.remove("hide");

      }


      lastScroll =
        currentScroll;

      ticking = false;
    };


    window.addEventListener(
      "scroll",
      () => {

        if (!ticking) {

          window.requestAnimationFrame(
            updateHeader
          );

          ticking = true;
        }

      },
      { passive: true }
    );

  })();


  /* =======================================================
     SECTION 0 — PORTFOLIO / EVIDENCE SLIDER
     
     Expected HTML:
     
     #about-slider-section
       .slider-wrapper
         .slide
           .company-item
             .company-card-inner
             .company-card-front
             .company-card-back
     
     Buttons:
       #prevBtn
       #nextBtn
       #counter
  ======================================================= */

  (() => {

    const section =
      $("#about-slider-section");

    if (!section) return;


    const wrapper =
      $(".slider-wrapper", section);

    const slides =
      $$(".slider-wrapper > .slide", section);

    const prevBtn =
      $("#prevBtn", section);

    const nextBtn =
      $("#nextBtn", section);

    const counter =
      $("#counter", section);


    /*
     * Do not allow this section to break
     * the rest of the website.
     */

    if (
      !wrapper ||
      !slides.length ||
      !prevBtn ||
      !nextBtn ||
      !counter
    ) {

      console.warn(
        "Portfolio slider: required elements are missing."
      );

      return;
    }


    /* -------------------------------------------------------
       DATA PARSER
    ------------------------------------------------------- */

    const parseData = value => {

      if (!value) return [];

      try {

        const parsed =
          JSON.parse(value);

        return Array.isArray(parsed)
          ? parsed
          : [];

      } catch (error) {

        console.warn(
          "Portfolio slider: invalid JSON data.",
          error
        );

        return [];
      }

    };


    /* -------------------------------------------------------
       HTML ESCAPE
       Prevents data attributes from injecting HTML.
    ------------------------------------------------------- */

    const escapeHTML = value => {

      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    };


    /* -------------------------------------------------------
       CREATE LIST
    ------------------------------------------------------- */

    const createList = items => {

      if (!items.length) {

        return "<li>No details available.</li>";

      }

      return items
        .map(item => {

          return `<li>${escapeHTML(item)}</li>`;

        })
        .join("");

    };


    /* -------------------------------------------------------
       POPULATE BACK SIDES
    ------------------------------------------------------- */

    slides.forEach(slide => {

      const card =
        $(".company-item", slide);

      if (!card) return;


      const back =
        $(".company-card-back", card);

      if (!back) return;


      const challenges =
        parseData(
          card.dataset.challenges
        );

      const actions =
        parseData(
          card.dataset.actions
        );

      const results =
        parseData(
          card.dataset.results
        );


      const detailBlocks =
        $$(".detail-block ul", back);


      if (detailBlocks.length >= 3) {

        detailBlocks[0].innerHTML =
          createList(challenges);

        detailBlocks[1].innerHTML =
          createList(actions);

        detailBlocks[2].innerHTML =
          createList(results);

      }

    });


    /* -------------------------------------------------------
       CURRENT SLIDE
    ------------------------------------------------------- */

    let currentIndex =
      slides.findIndex(slide =>
        slide.classList.contains("active")
      );


    if (currentIndex < 0) {
      currentIndex = 0;
    }


    /* -------------------------------------------------------
       RESET CARD
    ------------------------------------------------------- */

    const resetCard = card => {

      if (!card) return;

      card.classList.remove(
        "is-flipped"
      );


      const frontTrigger =
        $(".company-card-front .flip-trigger", card);

      if (frontTrigger) {

        frontTrigger.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    };


    /* -------------------------------------------------------
       RENDER SLIDER
    ------------------------------------------------------- */

    const render = () => {

      slides.forEach((slide, index) => {

        const isActive =
          index === currentIndex;


        slide.classList.toggle(
          "active",
          isActive
        );


        slide.setAttribute(
          "aria-hidden",
          String(!isActive)
        );


        const card =
          $(".company-item", slide);


        /*
         * Every time we change slide,
         * reset the previous card to front.
         */

        if (!isActive) {

          resetCard(card);

        }

      });


      counter.textContent =
        `${currentIndex + 1} / ${slides.length}`;


      const disabled =
        slides.length <= 1;


      prevBtn.disabled =
        disabled;

      nextBtn.disabled =
        disabled;


      /*
       * Accessibility state.
       */

      prevBtn.setAttribute(
        "aria-label",
        "Previous evidence"
      );

      nextBtn.setAttribute(
        "aria-label",
        "Next evidence"
      );

    };


    /* -------------------------------------------------------
       GO TO SLIDE
    ------------------------------------------------------- */

    const goTo = index => {

      if (!slides.length) return;

      currentIndex =
        (index + slides.length) %
        slides.length;

      render();

    };


    const nextSlide = () => {

      goTo(
        currentIndex + 1
      );

    };


    const previousSlide = () => {

      goTo(
        currentIndex - 1
      );

    };


    /* -------------------------------------------------------
       NAVIGATION
    ------------------------------------------------------- */

    nextBtn.addEventListener(
      "click",
      nextSlide
    );


    prevBtn.addEventListener(
      "click",
      previousSlide
    );


    /* -------------------------------------------------------
       FLIP CARD EVENT DELEGATION
       
       IMPORTANT:
       There is ONE flip handler only.
       This replaces the duplicate card logic.
    ------------------------------------------------------- */

    wrapper.addEventListener(
      "click",
      event => {

        const trigger =
          event.target.closest(
            ".flip-trigger"
          );


        if (!trigger) return;


        event.preventDefault();
        event.stopPropagation();


        const card =
          trigger.closest(
            ".company-item"
          );


        if (!card) return;


        /*
         * Back button
         */

        if (
          trigger.classList.contains(
            "flip-back"
          )
        ) {

          resetCard(card);

          const frontTrigger =
            $(".company-card-front .flip-trigger", card);

          if (frontTrigger) {

            frontTrigger.focus();

          }

          return;
        }


        /*
         * Front button
         */

        const isFlipped =
          card.classList.toggle(
            "is-flipped"
          );


        const frontTrigger =
          $(".company-card-front .flip-trigger", card);


        if (frontTrigger) {

          frontTrigger.setAttribute(
            "aria-expanded",
            String(isFlipped)
          );

        }

      }
    );


    /* -------------------------------------------------------
       KEYBOARD NAVIGATION
    ------------------------------------------------------- */

    section.addEventListener(
      "keydown",
      event => {

        const activeElement =
          document.activeElement;


        const tagName =
          activeElement
            ? activeElement.tagName
            : "";


        /*
         * Do not hijack keyboard input.
         */

        if (
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT"
        ) {

          return;
        }


        if (
          event.key === "ArrowRight"
        ) {

          event.preventDefault();

          nextSlide();

          return;
        }


        if (
          event.key === "ArrowLeft"
        ) {

          event.preventDefault();

          previousSlide();

          return;
        }


        if (
          event.key === "Escape"
        ) {

          const activeSlide =
            slides[currentIndex];


          if (!activeSlide) return;


          const card =
            $(".company-item", activeSlide);


          if (
            card &&
            card.classList.contains(
              "is-flipped"
            )
          ) {

            resetCard(card);

          }

        }

      }
    );


    /* -------------------------------------------------------
       TOUCH / SWIPE SUPPORT
    ------------------------------------------------------- */

    let touchStartX = 0;
    let touchEndX = 0;


    wrapper.addEventListener(
      "touchstart",
      event => {

        if (!event.touches.length) return;

        touchStartX =
          event.touches[0].clientX;

      },
      { passive: true }
    );


    wrapper.addEventListener(
      "touchend",
      event => {

        if (!event.changedTouches.length) return;

        touchEndX =
          event.changedTouches[0].clientX;


        const difference =
          touchStartX - touchEndX;


        /*
         * Minimum swipe distance.
         */

        if (
          Math.abs(difference) < 50
        ) {

          return;
        }


        if (difference > 0) {

          nextSlide();

        } else {

          previousSlide();

        }

      },
      { passive: true }
    );


    /*
     * Initial state.
     */

    render();


    console.log(
      `Portfolio slider initialized: ${slides.length} slides`
    );

  })();


  /* =======================================================
     SECTION 01 — OLG NUMBER COUNTERS
  ======================================================= */

  (() => {

    const elementsToCount =
      $$(".olg-number");


    if (!elementsToCount.length) return;


    const animateCounter =
      element => {

        const target =
          parseInt(
            element.dataset.target,
            10
          );


        if (
          Number.isNaN(target)
        ) {

          return;
        }


        const duration =
          1100;


        const startTime =
          performance.now();


        const animate =
          currentTime => {

            const elapsed =
              currentTime - startTime;


            const progress =
              Math.min(
                elapsed / duration,
                1
              );


            /*
             * Ease-out cubic.
             */

            const eased =
              1 -
              Math.pow(
                1 - progress,
                3
              );


            element.textContent =
              Math.floor(
                eased * target
              );


            if (progress < 1) {

              requestAnimationFrame(
                animate
              );

            } else {

              element.textContent =
                target;

            }

          };


        requestAnimationFrame(
          animate
        );

      };


    /*
     * IntersectionObserver
     */

    if (
      "IntersectionObserver"
      in window
    ) {

      const observer =
        new IntersectionObserver(
          (entries, observerInstance) => {

            entries.forEach(entry => {

              if (
                !entry.isIntersecting
              ) {

                return;
              }


              animateCounter(
                entry.target
              );


              observerInstance.unobserve(
                entry.target
              );

            });

          },
          {
            threshold: 0.2
          }
        );


      elementsToCount.forEach(
        element => observer.observe(element)
      );

    } else {

      /*
       * Fallback for older browsers.
       */

      elementsToCount.forEach(
        animateCounter
      );

    }

  })();


  /* =======================================================
     SECTION 02 — SERVICES SLIDER
  ======================================================= */

  (() => {

    const servicesSlides =
      $$(".services-slide");


    const servicesCounter =
      $("#serviceCounter");


    const servicesNextBtn =
      $("#serviceNextBtn");


    const servicesPrevBtn =
      $("#servicePrevBtn");


    if (
      !servicesSlides.length ||
      !servicesCounter ||
      !servicesNextBtn ||
      !servicesPrevBtn
    ) {

      return;
    }


    let servicesCurrent = 0;


    /*
     * Respect an existing active slide.
     */

    const existingActive =
      servicesSlides.findIndex(
        slide =>
          slide.classList.contains(
            "active"
          )
      );


    if (existingActive >= 0) {

      servicesCurrent =
        existingActive;

    }


    const updateServicesSlider =
      () => {

        servicesSlides.forEach(
          (slide, index) => {

            const isActive =
              index === servicesCurrent;


            slide.classList.toggle(
              "active",
              isActive
            );


            slide.setAttribute(
              "aria-hidden",
              String(!isActive)
            );

          }
        );


        servicesCounter.textContent =
          `${servicesCurrent + 1} / ${servicesSlides.length}`;


        servicesPrevBtn.disabled =
          servicesSlides.length <= 1;


        servicesNextBtn.disabled =
          servicesSlides.length <= 1;

      };


    const nextService =
      () => {

        servicesCurrent =
          (
            servicesCurrent + 1
          ) %
          servicesSlides.length;


        updateServicesSlider();

      };


    const previousService =
      () => {

        servicesCurrent =
          (
            servicesCurrent - 1 +
            servicesSlides.length
          ) %
          servicesSlides.length;


        updateServicesSlider();

      };


    servicesNextBtn.addEventListener(
      "click",
      nextService
    );


    servicesPrevBtn.addEventListener(
      "click",
      previousService
    );


    updateServicesSlider();

  })();


  /* =======================================================
     SECTION 02 — TRANSFORMATION CARD FLIP
  ======================================================= */

  (() => {

    const cards =
      $$(".transformation-card");


    if (!cards.length) return;


    cards.forEach(card => {

      card.addEventListener(
        "click",
        event => {

          /*
           * Do not interfere with buttons,
           * links or form controls inside the card.
           */

          if (
            event.target.closest(
              "a, button, input, textarea, select"
            )
          ) {

            return;
          }


          card.classList.toggle(
            "is-flipped"
          );

        }
      );


      /*
       * Keyboard accessibility.
       */

      if (
        !card.hasAttribute("tabindex")
      ) {

        card.setAttribute(
          "tabindex",
          "0"
        );

      }


      card.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            card.classList.toggle(
              "is-flipped"
            );

          }

        }
      );

    });

  })();


  /* =======================================================
     SCOPE DOMAIN INTERACTION
  ======================================================= */

  (() => {

    const scopeDomainData = {

      technology: {

        number: "01",

        type: "TECHNOLOGY",

        title:
          "Technology & digital platforms",

        description:
          "Program and project environments involving telecom infrastructure, European Data Spaces, certification platforms, software delivery, QA operations, release workflows and digital products.",

        tags: [
          "Telecom",
          "Data Spaces",
          "Software Delivery",
          "Digital Platforms"
        ]

      },


      finance: {

        number: "02",

        type: "BANKING & FINTECH",

        title:
          "Banking, FinTech & sensitive environments",

        description:
          "Experience across digital banking, CRM and financial-service environments where customer-sensitive information, operational processes and regulatory constraints shaped delivery.",

        tags: [
          "Digital Banking",
          "FinTech",
          "CRM",
          "Customer Data"
        ]

      },


      commerce: {

        number: "03",

        type: "COMMERCE",

        title:
          "B2C, B2B & procurement ecosystems",

        description:
          "Built and managed digital commerce environments spanning customer-facing experiences, B2B procurement processes, vendor coordination and platform delivery.",

        tags: [
          "B2C",
          "B2B",
          "E-commerce",
          "Procurement"
        ]

      },


      industry: {

        number: "04",

        type: "INDUSTRY & OPERATIONS",

        title:
          "Industry, ERP & operational systems",

        description:
          "Managed projects involving aviation workflows, ERP implementation, infrastructure environments, release operations and business-process automation.",

        tags: [
          "Aviation",
          "ERP",
          "Infrastructure",
          "Operations"
        ]

      },


      marketing: {

        number: "05",

        type: "MARKETING & GROWTH",

        title:
          "Marketing, growth & digital communication",

        description:
          "Earlier experience across regional marketing, branding, merchandising, digital content, website development and performance-oriented campaigns.",

        tags: [
          "Marketing",
          "Branding",
          "Digital",
          "Campaigns"
        ]

      }

    };


    const buttons =
      $$(".scope-domain");


    const number =
      $("#scopeDomainNumber");


    const type =
      $("#scopeDomainType");


    const title =
      $("#scopeDomainTitle");


    const description =
      $("#scopeDomainDescription");


    const tags =
      $("#scopeDomainTags");


    if (
      !buttons.length ||
      !number ||
      !type ||
      !title ||
      !description ||
      !tags
    ) {

      return;
    }


    const updateDomain =
      domain => {

        const data =
          scopeDomainData[domain];


        if (!data) return;


        buttons.forEach(button => {

          const isActive =
            button.dataset.domain === domain;


          button.classList.toggle(
            "is-active",
            isActive
          );


          button.setAttribute(
            "aria-selected",
            String(isActive)
          );

        });


        number.textContent =
          data.number;


        type.textContent =
          data.type;


        title.textContent =
          data.title;


        description.textContent =
          data.description;


        tags.innerHTML =
          data.tags
            .map(tag =>
              `<span>${escapeHTML(tag)}</span>`
            )
            .join("");

      };


    buttons.forEach(button => {

      button.addEventListener(
        "click",
        () => {

          updateDomain(
            button.dataset.domain
          );

        }
      );


      button.addEventListener(
        "keydown",
        event => {

          let nextIndex = -1;


          if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown"
          ) {

            nextIndex =
              (
                buttons.indexOf(button) + 1
              ) %
              buttons.length;

          }


          if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
          ) {

            nextIndex =
              (
                buttons.indexOf(button) - 1 +
                buttons.length
              ) %
              buttons.length;

          }


          if (nextIndex >= 0) {

            event.preventDefault();

            buttons[nextIndex].focus();

            updateDomain(
              buttons[nextIndex].dataset.domain
            );

          }

        }
      );

    });


    /*
     * Use existing active domain.
     * Otherwise use technology.
     */

    const activeButton =
      buttons.find(button =>
        button.classList.contains(
          "is-active"
        )
      );


    updateDomain(
      activeButton
        ? activeButton.dataset.domain
        : "technology"
    );

  })();


  /* =======================================================
     KORE SECTION
  ======================================================= */

  (() => {

    const stages =
      $$(".kore-stage");


    const numberElement =
      $("#koreStageNumber");


    const typeElement =
      $("#koreStageType");


    const titleElement =
      $("#koreStageTitle");


    const descriptionElement =
      $("#koreStageDescription");


    const tagsElement =
      $("#koreStageTags");


    const toolsElement =
      $("#koreStageTools");


    const panel =
      $("#kore-panel");


    if (
      !stages.length ||
      !numberElement ||
      !typeElement ||
      !titleElement ||
      !descriptionElement ||
      !tagsElement ||
      !toolsElement
    ) {

      return;
    }


    const koreData = {

      align: {

        number: "01",

        type: "DISCOVERY",

        title:
          "Align & Define",

        description:
          "Establish a shared vision, align stakeholders, and define measurable success before execution begins.",

        tags: [
          "Vision & business goals",
          "Stakeholder alignment",
          "Success metrics & KPIs",
          "Business case & scope"
        ],

        tools: [

          {
            icon: "fa-solid fa-shapes",
            name: "Miro"
          },

          {
            icon: "fa-brands fa-microsoft",
            name: "MS 365"
          },

          {
            icon: "fa-brands fa-confluence",
            name: "Confluence"
          },

          {
            icon: "fa-solid fa-note-sticky",
            name: "Notion"
          },

          {
            icon: "fa-solid fa-robot",
            name: "Gemini"
          },

          {
            icon: "fa-solid fa-robot",
            name: "Copilot"
          }

        ]

      },


      plan: {

        number: "02",

        type: "STRUCTURE",

        title:
          "Plan & Structure",

        description:
          "Translate strategic intent into a practical transformation roadmap with clear governance, priorities, ownership and delivery structure.",

        tags: [
          "Transformation roadmap",
          "Governance model",
          "Priorities & milestones",
          "Roles & responsibilities"
        ],

        tools: [

          {
            icon: "fa-solid fa-diagram-project",
            name: "Jira"
          },

          {
            icon: "fa-solid fa-list-check",
            name: "ClickUp"
          },

          {
            icon: "fa-solid fa-chart-gantt",
            name: "MS Project"
          },

          {
            icon: "fa-brands fa-microsoft",
            name: "Microsoft 365"
          },

          {
            icon: "fa-solid fa-note-sticky",
            name: "Notion"
          }

        ]

      },


      build: {

        number: "03",

        type: "EXECUTION",

        title:
          "Build & Deliver",

        description:
          "Turn the transformation plan into coordinated execution while enabling teams, managing dependencies and driving adoption.",

        tags: [
          "Delivery management",
          "Change enablement",
          "Team coordination",
          "Adoption & implementation"
        ],

        tools: [

          {
            icon: "fa-solid fa-diagram-project",
            name: "Jira"
          },

          {
            icon: "fa-solid fa-list-check",
            name: "ClickUp"
          },

          {
            icon: "fa-brands fa-github",
            name: "GitHub"
          },

          {
            icon: "fa-brands fa-slack",
            name: "Slack"
          },

          {
            icon: "fa-solid fa-shapes",
            name: "Miro"
          }

        ]

      },


      control: {

        number: "04",

        type: "PERFORMANCE",

        title:
          "Monitor & Control",

        description:
          "Track progress, performance, quality, risks and dependencies so decisions are based on evidence rather than assumptions.",

        tags: [
          "KPIs & dashboards",
          "Risk management",
          "Quality control",
          "Performance tracking"
        ],

        tools: [

          {
            icon: "fa-solid fa-chart-line",
            name: "Power BI"
          },

          {
            icon: "fa-solid fa-table",
            name: "Excel / Sheets"
          },

          {
            icon: "fa-solid fa-diagram-project",
            name: "Jira"
          },

          {
            icon: "fa-solid fa-chart-gantt",
            name: "MS Project"
          }

        ]

      },


      improve: {

        number: "05",

        type: "OPTIMIZATION",

        title:
          "Improve & Scale",

        description:
          "Use performance insights, automation and continuous improvement to strengthen the operating model and scale what works.",

        tags: [
          "Continuous improvement",
          "Process optimization",
          "Automation",
          "Scaling successful practices"
        ],

        tools: [

          {
            icon: "fa-solid fa-robot",
            name: "Google Gemini"
          },

          {
            icon: "fa-solid fa-robot",
            name: "Copilot"
          },

          {
            icon: "fa-solid fa-brain",
            name: "AI Agents"
          },

          {
            icon: "fa-solid fa-chart-line",
            name: "Power BI"
          },

          {
            icon: "fa-solid fa-code",
            name: "VS Code"
          }

        ]

      }

    };


    const createTags =
      data => {

        return data
          .map(tag =>
            `<span>${escapeHTML(tag)}</span>`
          )
          .join("");

      };


    const createTools =
      data => {

        return data
          .map(tool => {

            return `
              <span>
                <i class="${escapeHTML(tool.icon)}"></i>
                ${escapeHTML(tool.name)}
              </span>
            `;

          })
          .join("");

      };


    let changeTimer =
      null;


    const activateStage =
      stageButton => {

        const stageKey =
          stageButton.dataset.kore;


        const data =
          koreData[stageKey];


        if (!data) return;


        /*
         * Active navigation state
         */

        stages.forEach(stage => {

          const active =
            stage === stageButton;


          stage.classList.toggle(
            "is-active",
            active
          );


          stage.setAttribute(
            "aria-selected",
            String(active)
          );

        });


        /*
         * Panel animation
         */

        if (panel) {

          panel.classList.add(
            "is-changing"
          );

        }


        if (changeTimer) {

          clearTimeout(
            changeTimer
          );

        }


        changeTimer =
          setTimeout(() => {

            numberElement.textContent =
              data.number;


            typeElement.textContent =
              data.type;


            titleElement.textContent =
              data.title;


            descriptionElement.textContent =
              data.description;


            tagsElement.innerHTML =
              createTags(data.tags);


            toolsElement.innerHTML =
              createTools(data.tools);


            if (panel) {

              panel.classList.remove(
                "is-changing"
              );

            }

          }, 120);

      };


    /*
     * Click
     */

    stages.forEach(stage => {

      stage.addEventListener(
        "click",
        () => {

          activateStage(stage);

        }
      );


      /*
       * Keyboard
       */

      stage.addEventListener(
        "keydown",
        event => {

          const currentIndex =
            stages.indexOf(stage);


          let nextIndex =
            currentIndex;


          if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown"
          ) {

            nextIndex =
              (
                currentIndex + 1
              ) %
              stages.length;

          }


          if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
          ) {

            nextIndex =
              (
                currentIndex - 1 +
                stages.length
              ) %
              stages.length;

          }


          if (
            event.key === "Home"
          ) {

            nextIndex = 0;

          }


          if (
            event.key === "End"
          ) {

            nextIndex =
              stages.length - 1;

          }


          if (
            nextIndex !== currentIndex
          ) {

            event.preventDefault();

            stages[nextIndex].focus();

            activateStage(
              stages[nextIndex]
            );

          }


          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            activateStage(stage);

          }

        }
      );

    });


    /*
     * Initial state
     */

    const initialStage =
      stages.find(stage =>
        stage.classList.contains(
          "is-active"
        )
      );


    activateStage(
      initialStage || stages[0]
    );

  })();


  /* =======================================================
     TOOLBOX
  ======================================================= */

  (() => {

    const toolboxData = {

      alignment: {

        number: "01",

        discipline: "ALIGN",

        coreTitle: "ALIGN",

        coreSubtitle:
          "Create shared direction",

        intro:
          "Create a shared understanding of the transformation, align stakeholders and establish the communication environment.",

        explanationTitle:
          "Alignment before execution.",

        explanation:
          "When transformation crosses teams, functions and leadership groups, the first requirement is a shared view of the problem, priorities and desired outcome. Collaboration and communication tools create the environment for that alignment.",

        tools: [

          {
            name: "Miro",
            type: "Visual collaboration",
            icon: "fa-solid fa-shapes"
          },

          {
            name: "Microsoft Teams",
            type: "Communication",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "Microsoft 365",
            type: "Productivity ecosystem",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "Slack",
            type: "Team collaboration",
            icon: "fa-brands fa-slack"
          },

          {
            name: "PowerPoint",
            type: "Executive storytelling",
            icon: "fa-solid fa-presentation-screen"
          },

          {
            name: "Microsoft Forms",
            type: "Feedback & discovery",
            icon: "fa-solid fa-list-check"
          }

        ]

      },


      strategy: {

        number: "02",

        discipline: "DEFINE",

        coreTitle: "DEFINE",

        coreSubtitle:
          "Turn ambiguity into direction",

        intro:
          "Structure the problem, clarify the desired outcome and turn strategic intent into an actionable transformation direction.",

        explanationTitle:
          "Define the problem before defining the solution.",

        explanation:
          "Transformation becomes easier to execute when the problem, scope, stakeholders, business outcomes and decision criteria are explicit. These tools help create the artefacts needed for strategic alignment.",

        tools: [

          {
            name: "Miro",
            type: "Discovery & mapping",
            icon: "fa-solid fa-shapes"
          },

          {
            name: "Microsoft 365",
            type: "Business documentation",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "PowerPoint",
            type: "Strategy communication",
            icon: "fa-solid fa-display"
          },

          {
            name: "Excel",
            type: "Business analysis",
            icon: "fa-solid fa-table"
          },

          {
            name: "Notion",
            type: "Structured knowledge",
            icon: "fa-solid fa-note-sticky"
          },

          {
            name: "Confluence",
            type: "Transformation documentation",
            icon: "fa-brands fa-confluence"
          }

        ]

      },


      delivery: {

        number: "03",

        discipline: "DELIVER",

        coreTitle: "DELIVER",

        coreSubtitle:
          "Turn plans into execution",

        intro:
          "Create delivery visibility, coordinate dependencies and provide teams with a transparent execution environment.",

        explanationTitle:
          "Make execution visible.",

        explanation:
          "Complex transformation requires a delivery system that makes ownership, dependencies, priorities, risks and progress visible. The right delivery platform becomes the operational backbone.",

        tools: [

          {
            name: "Jira",
            type: "Agile delivery",
            icon: "fa-solid fa-diagram-project"
          },

          {
            name: "ClickUp",
            type: "Work management",
            icon: "fa-solid fa-list-check"
          },

          {
            name: "MS Project",
            type: "Programme planning",
            icon: "fa-solid fa-chart-gantt"
          },

          {
            name: "Azure DevOps",
            type: "Software delivery",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "GitHub",
            type: "Engineering collaboration",
            icon: "fa-brands fa-github"
          },

          {
            name: "VS Code",
            type: "Development environment",
            icon: "fa-solid fa-code"
          }

        ]

      },


      knowledge: {

        number: "04",

        discipline: "ENABLE",

        coreTitle: "ENABLE",

        coreSubtitle:
          "Make knowledge reusable",

        intro:
          "Create a reliable knowledge layer so teams can find information, reuse assets and operate with greater consistency.",

        explanationTitle:
          "Transformation knowledge should not disappear into inboxes.",

        explanation:
          "A transformation creates decisions, documentation, processes, lessons learned and reusable assets. A structured knowledge environment makes those assets accessible and keeps the organisation from repeatedly solving the same problem.",

        tools: [

          {
            name: "Confluence",
            type: "Team knowledge",
            icon: "fa-brands fa-confluence"
          },

          {
            name: "Notion",
            type: "Knowledge workspace",
            icon: "fa-solid fa-note-sticky"
          },

          {
            name: "SharePoint",
            type: "Enterprise content",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "Microsoft 365",
            type: "Document ecosystem",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "Gamma",
            type: "Content creation",
            icon: "fa-solid fa-pen-nib"
          },

          {
            name: "Canva",
            type: "Visual communication",
            icon: "fa-solid fa-palette"
          }

        ]

      },


      automation: {

        number: "05",

        discipline: "AUTOMATE",

        coreTitle: "AUTOMATE",

        coreSubtitle:
          "Remove repetitive work",

        intro:
          "Use automation and AI to reduce administrative effort, connect workflows and improve decision support.",

        explanationTitle:
          "Automate the friction, not the thinking.",

        explanation:
          "The strongest automation opportunities usually sit around repetitive coordination, information movement, reporting and workflow administration. AI then extends the operating model into research, synthesis and decision support.",

        tools: [

          {
            name: "Microsoft Power Automate",
            type: "Workflow automation",
            icon: "fa-solid fa-bolt"
          },

          {
            name: "Copilot",
            type: "AI productivity",
            icon: "fa-solid fa-robot"
          },

          {
            name: "Google Gemini",
            type: "AI productivity",
            icon: "fa-solid fa-robot"
          },

          {
            name: "AI Agents",
            type: "Intelligent workflows",
            icon: "fa-solid fa-brain"
          },

          {
            name: "Microsoft 365",
            type: "Connected productivity",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "Jira Automation",
            type: "Delivery automation",
            icon: "fa-solid fa-gears"
          }

        ]

      },


      insight: {

        number: "06",

        discipline: "CONTROL",

        coreTitle: "CONTROL",

        coreSubtitle:
          "Turn data into decisions",

        intro:
          "Create visibility across transformation performance, risks, delivery progress and business outcomes.",

        explanationTitle:
          "Visibility turns activity into management.",

        explanation:
          "Transformation leaders need evidence to understand whether execution is working. Reporting, dashboards, analysis and KPI structures create the feedback loop between delivery activity and business decisions.",

        tools: [

          {
            name: "Power BI",
            type: "Executive dashboards",
            icon: "fa-solid fa-chart-line"
          },

          {
            name: "Excel",
            type: "Analysis & modelling",
            icon: "fa-solid fa-table"
          },

          {
            name: "Microsoft 365",
            type: "Reporting ecosystem",
            icon: "fa-brands fa-microsoft"
          },

          {
            name: "Jira",
            type: "Delivery metrics",
            icon: "fa-solid fa-diagram-project"
          },

          {
            name: "MS Project",
            type: "Programme performance",
            icon: "fa-solid fa-chart-gantt"
          },

          {
            name: "PowerPoint",
            type: "Executive reporting",
            icon: "fa-solid fa-display"
          }

        ]

      }

    };


    const problemButtons =
      $$(".toolbox-problem");


    const toolGrid =
      $("#toolboxToolGrid");


    const coreNode =
      $(".toolbox-core-node");


    const coreTitle =
      $("#toolboxCoreTitle");


    const coreSubtitle =
      $("#toolboxCoreSubtitle");


    const resultIntro =
      $("#toolboxResultIntro");


    const toolCount =
      $("#toolboxToolCount");


    const explanationNumber =
      $("#toolboxExplanationNumber");


    const explanationTitle =
      $("#toolboxExplanationTitle");


    const explanationText =
      $("#toolboxExplanationText");


    const discipline =
      $("#toolboxDiscipline");


    if (
      !problemButtons.length ||
      !toolGrid ||
      !coreNode ||
      !coreTitle ||
      !coreSubtitle ||
      !resultIntro ||
      !toolCount ||
      !explanationNumber ||
      !explanationTitle ||
      !explanationText ||
      !discipline
    ) {

      return;
    }


    const renderTools =
      tools => {

        toolGrid.innerHTML = "";


        tools.forEach(tool => {

          const element =
            document.createElement(
              "div"
            );


          element.className =
            "toolbox-tool";


          element.innerHTML = `

            <span class="toolbox-tool-icon">

              <i class="${escapeHTML(tool.icon)}"></i>

            </span>

            <span class="toolbox-tool-copy">

              <strong>
                ${escapeHTML(tool.name)}
              </strong>

              <small>
                ${escapeHTML(tool.type)}
              </small>

            </span>

          `;


          toolGrid.appendChild(
            element
          );

        });

      };


    let toolboxTimer = null;


    const updateToolbox =
      problemKey => {

        const data =
          toolboxData[problemKey];


        if (!data) return;


        /*
         * Active buttons
         */

        problemButtons.forEach(
          button => {

            const active =
              button.dataset.problem ===
              problemKey;


            button.classList.toggle(
              "is-active",
              active
            );


            button.setAttribute(
              "aria-pressed",
              String(active)
            );

          }
        );


        /*
         * Core animation
         */

        coreNode.classList.add(
          "is-changing"
        );


        if (toolboxTimer) {

          clearTimeout(
            toolboxTimer
          );

        }


        toolboxTimer =
          setTimeout(() => {

            coreTitle.textContent =
              data.coreTitle;


            coreSubtitle.textContent =
              data.coreSubtitle;


            coreNode.classList.remove(
              "is-changing"
            );

          }, 120);


        /*
         * Result area
         */

        resultIntro.textContent =
          data.intro;


        toolCount.textContent =
          `${data.tools.length} tools`;


        /*
         * Explanation
         */

        explanationNumber.textContent =
          data.number;


        explanationTitle.textContent =
          data.explanationTitle;


        explanationText.textContent =
          data.explanation;


        discipline.textContent =
          data.discipline;


        /*
         * Tools
         */

        renderTools(
          data.tools
        );

      };


    problemButtons.forEach(
      (button, index) => {

        button.addEventListener(
          "click",
          () => {

            updateToolbox(
              button.dataset.problem
            );

          }
        );


        button.addEventListener(
          "keydown",
          event => {

            let nextIndex =
              index;


            if (
              event.key === "ArrowRight" ||
              event.key === "ArrowDown"
            ) {

              nextIndex =
                (
                  index + 1
                ) %
                problemButtons.length;

            }


            if (
              event.key === "ArrowLeft" ||
              event.key === "ArrowUp"
            ) {

              nextIndex =
                (
                  index - 1 +
                  problemButtons.length
                ) %
                problemButtons.length;

            }


            if (
              event.key === "Home"
            ) {

              nextIndex = 0;

            }


            if (
              event.key === "End"
            ) {

              nextIndex =
                problemButtons.length - 1;

            }


            if (
              nextIndex !== index
            ) {

              event.preventDefault();

              problemButtons[
                nextIndex
              ].focus();


              updateToolbox(
                problemButtons[
                  nextIndex
                ].dataset.problem
              );

            }

          }
        );

      }
    );


    /*
     * Initial toolbox state.
     */

    const activeButton =
      problemButtons.find(button =>
        button.classList.contains(
          "is-active"
        )
      );


    updateToolbox(
      activeButton
        ? activeButton.dataset.problem
        : "alignment"
    );

  })();


  /* =======================================================
     GLOBAL ESCAPE HANDLER
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Escape"
      ) {

        return;
      }


      /*
       * Close any flipped transformation cards.
       */

      $$(".transformation-card.is-flipped")
        .forEach(card => {

          card.classList.remove(
            "is-flipped"
          );

        });


      /*
       * Close any flipped evidence cards.
       */

      $$(".company-item.is-flipped")
        .forEach(card => {

          card.classList.remove(
            "is-flipped"
          );


          const trigger =
            $(".company-card-front .flip-trigger", card);


          if (trigger) {

            trigger.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        });

    }
  );


  /* =======================================================
     UTILITY — ESCAPE HTML
     
     Defined here because several sections use it.
  ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  console.log(
    "KORE portfolio JavaScript initialized successfully."
  );

});
