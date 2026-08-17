const video = document.querySelector("#story-video");
const hitbox = document.querySelector(".frame-hitbox");
const nextButton = document.querySelector(".next-button");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const totalScenes = 5;
let currentScene = 1;

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const scenePath = (number) => `assets/video-scenes-fixed/scene-${String(number).padStart(3, "0")}.mp4`;

async function playCurrentScene() {
  if (!video) {
    return;
  }

  video.currentTime = 0;
  try {
    await video.play();
  } catch {
    // Browser may wait for the next user tap; the click handler will retry.
  }
}

function showScene(number) {
  currentScene = ((number - 1 + totalScenes) % totalScenes) + 1;
  video.src = scenePath(currentScene);
  video.load();
  playCurrentScene();
}

function nextScene() {
  showScene(currentScene + 1);
}

function previousScene() {
  showScene(currentScene - 1);
}

nextButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  nextScene();
});

video?.addEventListener("ended", () => {
  video.currentTime = Math.max(0, video.duration - 0.08);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
    nextScene();
  }

  if (event.key === "ArrowLeft" || event.key === "Backspace") {
    previousScene();
  }
});

playCurrentScene();

const typedRole = document.querySelector("#typed-role");
const roles = [
  "Digital Marketing Specialist",
  "Data Analyst",
];

let roleIndex = 0;
let characterIndex = roles[0].length;
let deletingRole = true;

function updateTypedRole() {
  if (!typedRole) {
    return;
  }

  const currentRole = roles[roleIndex];
  typedRole.textContent = currentRole.slice(0, characterIndex);

  if (deletingRole) {
    characterIndex -= 1;
    if (characterIndex <= 0) {
      deletingRole = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  } else {
    characterIndex += 1;
    if (characterIndex > roles[roleIndex].length) {
      deletingRole = true;
      setTimeout(updateTypedRole, 1200);
      return;
    }
  }

  setTimeout(updateTypedRole, deletingRole ? 45 : 80);
}

setTimeout(updateTypedRole, 900);

document.querySelectorAll(".misc-video-frame").forEach((frame) => {
  const miscVideo = frame.querySelector(".misc-audio-video");
  const canvas = frame.querySelector(".misc-video-canvas");
  const button = frame.querySelector(".misc-video-toggle");

  if (!miscVideo || !canvas || !button) {
    return;
  }

  const context = canvas.getContext("2d");

  function sizeCanvas() {
    const bounds = frame.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function drawFrame() {
    sizeCanvas();
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    context.clearRect(0, 0, width, height);

    if (miscVideo.videoWidth && miscVideo.videoHeight) {
      const rotatedWidth = miscVideo.videoHeight;
      const rotatedHeight = miscVideo.videoWidth;
      const fit = Math.max(width / rotatedWidth, height / rotatedHeight);
      const drawWidth = miscVideo.videoWidth * fit;
      const drawHeight = miscVideo.videoHeight * fit;

      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(-Math.PI / 2);
      context.drawImage(miscVideo, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      context.restore();
    }

    if (!miscVideo.paused && !miscVideo.ended) {
      requestAnimationFrame(drawFrame);
    }
  }

  miscVideo.addEventListener("loadeddata", drawFrame);
  miscVideo.addEventListener("play", drawFrame);
  miscVideo.addEventListener("pause", drawFrame);
  window.addEventListener("resize", drawFrame);

  button.addEventListener("click", async () => {
    if (miscVideo.paused) {
      try {
        await miscVideo.play();
        button.textContent = "Pause";
      } catch {
        button.textContent = "Play";
      }
    } else {
      miscVideo.pause();
      button.textContent = "Play";
    }
  });
});

const miscCarousel = document.querySelector(".misc-carousel-track");
const miscPrev = document.querySelector(".misc-carousel-prev");
const miscNext = document.querySelector(".misc-carousel-next");

function scrollMiscCarousel(direction) {
  if (!miscCarousel) {
    return;
  }

  miscCarousel.scrollBy({
    left: miscCarousel.clientWidth * direction,
    behavior: "smooth",
  });
}

miscPrev?.addEventListener("click", () => scrollMiscCarousel(-1));
miscNext?.addEventListener("click", () => scrollMiscCarousel(1));

const contentTabs = document.querySelectorAll("[data-content-tab]");
const contentPanels = document.querySelectorAll("[data-content-panel]");

contentTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.contentTab;

    contentTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    contentPanels.forEach((panel) => {
      const isActive = panel.dataset.contentPanel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});

const projectModal = document.querySelector("#project-modal");
const projectModalTitle = document.querySelector("#project-modal-title");
const projectModalDescription = document.querySelector("#project-modal-description");
const projectModalGallery = document.querySelector("#project-modal-gallery");
const projectDetailButtons = document.querySelectorAll(".project-detail-button");
let lastProjectTrigger = null;

const projectGalleries = {
  "sales-performance": [
    {
      src: "assets/projects/sales-performance/sales-overview.jpeg",
      alt: "Sales Overview Power BI dashboard"
    },
    {
      src: "assets/projects/sales-performance/customer-details.jpeg",
      alt: "Customer Details Power BI dashboard"
    },
    {
      src: "assets/projects/sales-performance/data-model.jpeg",
      alt: "Sales Performance Power BI data model",
      wide: true
    }
  ]
};

function closeProjectModal() {
  if (!projectModal) {
    return;
  }

  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastProjectTrigger?.focus();
}

projectDetailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!projectModal || !projectModalTitle || !projectModalDescription) {
      return;
    }

    lastProjectTrigger = button;
    projectModalTitle.textContent = button.dataset.projectTitle || "";
    projectModalDescription.textContent = button.dataset.projectDescription || "";

    if (projectModalGallery) {
      const galleryItems = projectGalleries[button.dataset.projectGallery] || [];
      projectModalGallery.replaceChildren();
      projectModalGallery.hidden = galleryItems.length === 0;

      galleryItems.forEach((item) => {
        const figure = document.createElement("figure");
        figure.className = item.wide ? "project-gallery-item project-gallery-item-wide" : "project-gallery-item";

        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.alt;
        image.loading = "lazy";

        figure.append(image);
        projectModalGallery.append(figure);
      });
    }

    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    projectModal.querySelector(".project-modal-close")?.focus();
  });
});

document.querySelectorAll("[data-project-modal-close]").forEach((button) => {
  button.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("is-open")) {
    closeProjectModal();
  }
});

const revealTargets = [
  ...document.querySelectorAll(".section-panel"),
  ...document.querySelectorAll("#experience .timeline-item"),
  ...document.querySelectorAll(".skills-showcase .primary-logo-row > *, .skills-showcase .creative-logo-row > *, .skills-showcase .skills-card, .skills-grid > div"),
];

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.transitionDelay = `${Math.min(index % 8, 7) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -8% 0px",
  });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
