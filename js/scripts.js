/*****************************************
 * SAFE DOM HELPERS
 *****************************************/
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

/*****************************************
 * MOBILE MENU (SAFE FIXED)
 *****************************************/
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
  };

  const closeMenu = () => {
    menu.classList.remove("active");
    menu.setAttribute("aria-hidden", "true");

    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };

  // Open / toggle menu
  burger.addEventListener("click", () => {
    const isOpen = menu.classList.contains("active");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close with X button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  // Close when clicking a navigation link
  $$(".mobile-nav a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

})();


/*****************************************
 * COMPANY MODAL (DELEGATION & DATA FIX)
 *****************************************/
(() => {
  const items = $$(".company-item");
  const modal = $("#detailsModal");
  if (!items.length || !modal) return;

  const modalContent = $(".details-modal-content", modal);

  const parseJSON = str => {
    try { return JSON.parse(str); } catch { return []; }
  };

  const generateListHTML = (arr, isBadge = false) => {
    return arr.map(i =>
      isBadge ? `<li><span class="result-badge">${i}</span></li>` : `<li>${i}</li>`
    ).join("");
  };

  // Setup the event engine directly on the parent layout container
  items.forEach(item => {
    item.addEventListener("click", (e) => {

      // 1. Check if the user is clicking the Case Study link directly
      if (e.target.closest(".service-link.learn-more")) {
        // Let the link behave perfectly normal without triggering the modal markup wrapper
        return;
      }

      // 2. Otherwise, run the safe dynamic modal injection
      const key = item.dataset.key || "";
      const role = item.dataset.role || "";
      const overview = item.dataset.overview || "";
      const challenges = parseJSON(item.dataset.challenges);
      const actions = parseJSON(item.dataset.actions);
      const results = parseJSON(item.dataset.results);

      modalContent.innerHTML = `
        <button class="details-modal-close">&times;</button>
        <h2 class="modal-company">${key}</h2>
        <div class="modal-role">${role}</div>
        <p class="modal-overview">${overview}</p>
        
        <div class="detail-block">
          <h4>Challenges</h4>
          <ul>${generateListHTML(challenges)}</ul>
        </div>
        <div class="detail-block">
          <h4>Actions Taken</h4>
          <ul>${generateListHTML(actions)}</ul>
        </div>
        <div class="detail-block">
          <h4>Key Results</h4>
          <ul>${generateListHTML(results, true)}</ul>
        </div>
      `;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Close control workflows
  modal.addEventListener("click", e => {
    if (e.target.classList.contains("details-modal-close") || e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
})();

/*****************************************
 * HEADER AUTO HIDE (SAFE)
 *****************************************/
(() => {
  const header = $(".header");
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.pageYOffset;

    if (current > lastScroll && current > 80) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }

    lastScroll = current;
  }, { passive: true });
})();

/* ========================================
   SECTION 0 — Portfolio
======================================== */

const slides = document.querySelectorAll(".slide");
const counter = document.getElementById("counter");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let current = 0;

function updateSlider() {

  slides.forEach(slide =>
    slide.classList.remove("active")
  );

  slides[current].classList.add("active");

  counter.textContent =
    `${current + 1} / ${slides.length}`;
}

nextBtn.addEventListener("click", () => {

  current++;

  if (current >= slides.length) {
    current = 0;
  }

  updateSlider();
});

prevBtn.addEventListener("click", () => {

  current--;

  if (current < 0) {
    current = slides.length - 1;
  }

  updateSlider();
});

updateSlider();



/* ========================================
   SECTION 01 — left side bar
======================================== */


document.addEventListener("DOMContentLoaded", () => {
  const elementsToCount = document.querySelectorAll(".olg-number");

  const executeCounterAnimation = (domElement) => {
    const targetInteger = parseInt(domElement.getAttribute("data-target"), 10);
    const runDuration = 1100; // Animation lifecycle time window inside window loop
    const initializationTimestamp = performance.now();

    const progressFrame = (currentTimestamp) => {
      const elapsedWindow = currentTimestamp - initializationTimestamp;
      const calculatedProgress = Math.min(elapsedWindow / runDuration, 1);

      // Applies an easing formula out for a smooth visual deceleration drop-off
      const easedProgress = 1 - Math.pow(1 - calculatedProgress, 3);

      domElement.innerText = Math.floor(easedProgress * targetInteger);

      if (calculatedProgress < 1) {
        requestAnimationFrame(progressFrame);
      } else {
        domElement.innerText = targetInteger; // Fallback locking precisely to target values
      }
    };

    requestAnimationFrame(progressFrame);
  };

  const viewportScrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        executeCounterAnimation(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elementsToCount.forEach(metricItem => viewportScrollObserver.observe(metricItem));
});

/* ========================================
   SECTION 02 — Slider
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const servicesSlides = document.querySelectorAll(".services-slide");
  const servicesCounter = document.getElementById("serviceCounter");
  const servicesNextBtn = document.getElementById("serviceNextBtn");
  const servicesPrevBtn = document.getElementById("servicePrevBtn");

  // Defensive handling logic to prevent errors if elements don't exist on the page
  if (!servicesSlides.length || !servicesCounter || !servicesNextBtn || !servicesPrevBtn) return;

  let servicesCurrent = 0;

  function updateServicesSlider() {
    // Toggle engine states visibility classes safely
    servicesSlides.forEach(slide => slide.classList.remove("active"));
    servicesSlides[servicesCurrent].classList.add("active");

    // Repopulate counter indicator dynamically
    servicesCounter.textContent = `${servicesCurrent + 1} / ${servicesSlides.length}`;
  }

  servicesNextBtn.addEventListener("click", () => {
    servicesCurrent++;
    if (servicesCurrent >= servicesSlides.length) {
      servicesCurrent = 0; // Loops back to start
    }
    updateServicesSlider();
  });

  servicesPrevBtn.addEventListener("click", () => {
    servicesCurrent--;
    if (servicesCurrent < 0) {
      servicesCurrent = servicesSlides.length - 1; // Loops back to end
    }
    updateServicesSlider();
  });

  // Fire state configuration layout initialization instantly
  updateServicesSlider();
});

/* ========================================
   SECTION 02 — click card
======================================== */

document.querySelectorAll('.transformation-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});



/* ==================================================
   SCOPE DOMAIN INTERACTION
================================================== */

const scopeDomainData = {

  technology: {
    number: "01",
    type: "TECHNOLOGY",
    title: "Technology & digital platforms",
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
    title: "Banking, FinTech & sensitive environments",
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
    title: "B2C, B2B & procurement ecosystems",
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
    title: "Industry, ERP & operational systems",
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
    title: "Marketing, growth & digital communication",
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


const scopeDomainButtons =
  document.querySelectorAll(".scope-domain");

const scopeDomainNumber =
  document.getElementById("scopeDomainNumber");

const scopeDomainType =
  document.getElementById("scopeDomainType");

const scopeDomainTitle =
  document.getElementById("scopeDomainTitle");

const scopeDomainDescription =
  document.getElementById("scopeDomainDescription");

const scopeDomainTags =
  document.getElementById("scopeDomainTags");


scopeDomainButtons.forEach(button => {

  button.addEventListener("click", () => {

    const domain =
      button.dataset.domain;

    const data =
      scopeDomainData[domain];

    if (!data) return;


    scopeDomainButtons.forEach(item => {
      item.classList.remove("is-active");
    });

    button.classList.add("is-active");


    scopeDomainNumber.textContent =
      data.number;

    scopeDomainType.textContent =
      data.type;

    scopeDomainTitle.textContent =
      data.title;

    scopeDomainDescription.textContent =
      data.description;


    scopeDomainTags.innerHTML =
      data.tags
        .map(tag => `<span>${tag}</span>`)
        .join("");

  });

});



/* ==================================================
   KORE SECTION
================================================== */
document.addEventListener("DOMContentLoaded", function () {

  const stages = document.querySelectorAll(".kore-stage");

  const numberElement = document.getElementById("koreStageNumber");
  const typeElement = document.getElementById("koreStageType");
  const titleElement = document.getElementById("koreStageTitle");
  const descriptionElement = document.getElementById("koreStageDescription");
  const tagsElement = document.getElementById("koreStageTags");
  const toolsElement = document.getElementById("koreStageTools");
  const panel = document.getElementById("kore-panel");


  const koreData = {

    align: {
      number: "01",
      type: "DISCOVERY",
      title: "Align & Define",
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
      title: "Plan & Structure",
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
      title: "Build & Deliver",
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
      title: "Monitor & Control",
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
      title: "Improve & Scale",
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


  function createTools(tools) {

    return tools.map(function (tool) {

      return `
        <span>
          <i class="${tool.icon}"></i>
          ${tool.name}
        </span>
      `;

    }).join("");

  }


  function createTags(tags) {

    return tags.map(function (tag) {

      return `<span>${tag}</span>`;

    }).join("");

  }


  function activateStage(stageButton) {

    const stageKey = stageButton.dataset.kore;
    const data = koreData[stageKey];

    if (!data) return;


    /* Remove active state */

    stages.forEach(function (stage) {

      stage.classList.remove("is-active");

      stage.setAttribute("aria-selected", "false");

    });


    /* Activate selected stage */

    stageButton.classList.add("is-active");

    stageButton.setAttribute("aria-selected", "true");


    /* Small panel animation */

    panel.classList.add("is-changing");


    setTimeout(function () {

      numberElement.textContent = data.number;

      typeElement.textContent = data.type;

      titleElement.textContent = data.title;

      descriptionElement.textContent = data.description;

      tagsElement.innerHTML = createTags(data.tags);

      toolsElement.innerHTML = createTools(data.tools);

      panel.classList.remove("is-changing");

    }, 120);

  }


  /* Click */

  stages.forEach(function (stage) {

    stage.addEventListener("click", function () {

      activateStage(stage);

    });

  });


  /* Keyboard navigation */

  stages.forEach(function (stage, index) {

    stage.addEventListener("keydown", function (event) {

      let nextIndex = index;


      if (event.key === "ArrowRight" || event.key === "ArrowDown") {

        nextIndex = (index + 1) % stages.length;

      }


      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {

        nextIndex =
          (index - 1 + stages.length) % stages.length;

      }


      if (nextIndex !== index) {

        event.preventDefault();

        stages[nextIndex].focus();

        activateStage(stages[nextIndex]);

      }

    });

  });


  /* Initialize */

  const initialStage =
    document.querySelector(".kore-stage.is-active");

  if (initialStage) {

    activateStage(initialStage);

  }

});



/* =========================================================
   TOOLBOX
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     TRANSFORMATION TOOLBOX DATA
     ========================================================= */

  const toolboxData = {

    alignment: {

      number: "01",

      discipline: "ALIGN",

      coreTitle: "ALIGN",

      coreSubtitle: "Create shared direction",

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

      coreSubtitle: "Turn ambiguity into direction",

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

      coreSubtitle: "Turn plans into execution",

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

      coreSubtitle: "Make knowledge reusable",

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

      coreSubtitle: "Remove repetitive work",

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

      coreSubtitle: "Turn data into decisions",

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


  /* =========================================================
     DOM ELEMENTS
     ========================================================= */

  const problemButtons =
    document.querySelectorAll(".toolbox-problem");

  const toolGrid =
    document.getElementById("toolboxToolGrid");

  const coreNode =
    document.querySelector(".toolbox-core-node");

  const coreTitle =
    document.getElementById("toolboxCoreTitle");

  const coreSubtitle =
    document.getElementById("toolboxCoreSubtitle");

  const resultIntro =
    document.getElementById("toolboxResultIntro");

  const toolCount =
    document.getElementById("toolboxToolCount");

  const explanationNumber =
    document.getElementById("toolboxExplanationNumber");

  const explanationTitle =
    document.getElementById("toolboxExplanationTitle");

  const explanationText =
    document.getElementById("toolboxExplanationText");

  const discipline =
    document.getElementById("toolboxDiscipline");


  /* =========================================================
     RENDER TOOLS
     ========================================================= */

  function renderTools(data) {

    toolGrid.innerHTML = "";

    data.tools.forEach((tool) => {

      const toolElement =
        document.createElement("div");

      toolElement.className =
        "toolbox-tool";

      toolElement.innerHTML = `

        <span class="toolbox-tool-icon">

          <i class="${tool.icon}"></i>

        </span>

        <span class="toolbox-tool-copy">

          <strong>
            ${tool.name}
          </strong>

          <small>
            ${tool.type}
          </small>

        </span>

      `;

      toolGrid.appendChild(toolElement);

    });

  }


  /* =========================================================
     UPDATE ACTIVE STATE
     ========================================================= */

  function updateToolbox(problemKey) {

    const data =
      toolboxData[problemKey];

    if (!data) return;


    /* ---------------------------------------------
       Active button
    --------------------------------------------- */

    problemButtons.forEach((button) => {

      const isActive =
        button.dataset.problem === problemKey;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        isActive ? "true" : "false"
      );

    });


    /* ---------------------------------------------
       Core animation
    --------------------------------------------- */

    coreNode.classList.add("is-changing");


    setTimeout(() => {

      coreTitle.textContent =
        data.coreTitle;

      coreSubtitle.textContent =
        data.coreSubtitle;

      coreNode.classList.remove(
        "is-changing"
      );

    }, 120);


    /* ---------------------------------------------
       Result area
    --------------------------------------------- */

    resultIntro.textContent =
      data.intro;

    toolCount.textContent =
      `${data.tools.length} tools`;


    /* ---------------------------------------------
       Explanation
    --------------------------------------------- */

    explanationNumber.textContent =
      data.number;

    explanationTitle.textContent =
      data.explanationTitle;

    explanationText.textContent =
      data.explanation;

    discipline.textContent =
      data.discipline;


    /* ---------------------------------------------
       Render tools
    --------------------------------------------- */

    renderTools(data);

  }


  /* =========================================================
     EVENT LISTENERS
     ========================================================= */

  problemButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const problem =
        button.dataset.problem;

      updateToolbox(problem);

    });

  });


  /* =========================================================
     INITIAL STATE
     ========================================================= */

  updateToolbox("alignment");

});

