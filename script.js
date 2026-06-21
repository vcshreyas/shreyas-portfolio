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
      context.rotate(Math.PI / 2);
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
