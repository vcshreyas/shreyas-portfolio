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

typeRole();
