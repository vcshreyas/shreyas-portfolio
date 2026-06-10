const roles = [
  "Logistics Data Specialist",
  "Marketing Analyst",
  "Operations Analyst",
  "Reporting Specialist",
  "Dashboard Builder"
];

const typedRole = document.querySelector("#typed-role");
const year = document.querySelector("#year");
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const socialMenu = document.querySelector(".social-menu");
const socialMenuButton = document.querySelector(".social-menu button");
const miscVideoToggles = document.querySelectorAll(".misc-video-toggle");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

year.textContent = new Date().getFullYear();

function typeRole() {
  const current = roles[roleIndex];
  typedRole.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeRole, 80);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeRole, 1300);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeRole, 42);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 250);
}

const savedTheme = localStorage.getItem("shreyas-portfolio-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("shreyas-portfolio-theme", isDark ? "dark" : "light");
});

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

socialMenuButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  socialMenu?.classList.toggle("open");
});

socialMenu?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    socialMenu.classList.remove("open");
  }
});

document.addEventListener("click", (event) => {
  if (socialMenu && !socialMenu.contains(event.target)) {
    socialMenu.classList.remove("open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    socialMenu?.classList.remove("open");
  }
});

miscVideoToggles.forEach((button) => {
  const frame = button.closest(".misc-video-frame");
  const video = frame?.querySelector(".misc-audio-video");
  const canvas = frame?.querySelector(".misc-video-canvas");
  const context = canvas?.getContext("2d");

  function drawVideoFrame() {
    if (!(video instanceof HTMLVideoElement) || !(canvas instanceof HTMLCanvasElement) || !context) {
      return;
    }

    const width = frame.clientWidth;
    const height = frame.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * pixelRatio) || canvas.height !== Math.round(height * pixelRatio)) {
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
    }

    context.save();
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.translate(width / 2, height / 2);
    context.rotate(-Math.PI / 2);
    try {
      context.drawImage(video, -height / 2, -width / 2, height, width);
    } catch {
      context.restore();
      return;
    }
    context.restore();

    if (!video.paused && !video.ended) {
      requestAnimationFrame(drawVideoFrame);
    }
  }

  video?.addEventListener("loadeddata", drawVideoFrame);
  video?.addEventListener("seeked", drawVideoFrame);
  video?.load();

  button.addEventListener("click", async () => {
    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    if (video.paused) {
      video.muted = false;
      try {
        await video.play();
        drawVideoFrame();
        button.textContent = "Pause";
        button.setAttribute("aria-label", "Pause video");
      } catch {
        button.textContent = "Play";
        button.setAttribute("aria-label", "Play video with audio");
      }
    } else {
      video.pause();
      button.textContent = "Play";
      button.setAttribute("aria-label", "Play video with audio");
    }
  });

  video?.addEventListener("pause", () => {
    button.textContent = "Play";
    button.setAttribute("aria-label", "Play video with audio");
  });

  video?.addEventListener("play", () => {
    drawVideoFrame();
    button.textContent = "Pause";
    button.setAttribute("aria-label", "Pause video");
  });
});

typeRole();
