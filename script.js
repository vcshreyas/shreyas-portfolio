const video = document.querySelector("#story-video");
const hitbox = document.querySelector(".frame-hitbox");
const nextButton = document.querySelector(".next-button");
const totalScenes = 5;
let currentScene = 1;

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
  "Social Media Analyst",
  "Data Analyst",
  "Operations Analyst",
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
