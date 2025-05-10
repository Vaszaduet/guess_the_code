"use strict";

const buttons = document.querySelectorAll(".general_buttons");
const screenText = document.querySelector(".text");
const video = document.getElementById("video");

loadSound("click_sound", "click");
loadSound("oof_sound", "oof");
loadSound("correct_sound", "correct");

const code_amount = 4;
const app_status = { is_sleeping: false };
let code = getRandomCode(code_amount);

const animateFalseText = screenText.animate(
  [{ color: "#ec3d0e", transform: "scale(110%)" }],
  {
    duration: 100,
    iterations: 2,
    easing: "ease-in-out",
  }
);

const animatePassText = screenText.animate(
  [{ color: "#11ebb0", transform: "scale(110%)" }],
  {
    duration: 100,
    iterations: 2,
    easing: "ease-in-out",
  }
);

for (let index = 0; index < buttons.length; index++) {
  buttons[index].addEventListener("click", () => {
    if (!app_status.is_sleeping) screenAddNumber(index + 1);
  });
  buttons[index].addEventListener("mousedown", () => {
    playSound("click");
  });
}

function screenAddNumber(number) {
  screenText.textContent += number;
  screenCheck();
}

function screenCheck() {
  if (screenText.textContent.length >= code_amount) {
    if (screenText.textContent == code) {
      codePass();
    } else {
      codeFalse();
    }
  }
}

async function codePass() {
  playSound("correct", 0.3);
  animatePassText.play();
  app_status.is_sleeping = true;
  await sleep(1000);
  screenText.textContent = "";
  video.hidden = false;
  video.volume = 0.5;
  video.play();
  await sleep(30000);
  video.hidden = true;
  video.pause();
  video.currentTime = 0;
  app_status.is_sleeping = false;
  code = getRandomCode(code_amount);
}

async function codeFalse() {
  playSound("oof", 0.5);
  animateFalseText.play();
  screenText.textContent = codeCompare(code, screenText.textContent);
  app_status.is_sleeping = true;
  await sleep(1000);
  app_status.is_sleeping = false;
  screenText.textContent = "";
}

function codeCompare(true_code, code_to_compare) {
  let compared_code = "";

  for (let index = 0; index < true_code.length; index++) {
    if (true_code[index] == code_to_compare[index]) {
      compared_code += true_code[index];
    } else compared_code += "*";
  }

  return compared_code;
}

function getRandomCode(count) {
  let number;
  let code = "";

  for (let index = 0; index < count; index++) {
    number = Math.floor(Math.random() * 9 + 1);
    code += number;
  }

  return code;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sounds = new window.AudioContext();
function loadSound(elementId, soundName) {
  const audioElement = document.getElementById(elementId);

  fetch(audioElement.src)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => sounds.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      sounds[soundName] = audioBuffer;
    })
    .catch((error) => console.error("Error sound playing:", error));
}

function playSound(soundName, offset = 0) {
  if (sounds[soundName] && sounds) {
    const source = sounds.createBufferSource();
    source.buffer = sounds[soundName];
    source.connect(sounds.destination);
    source.start(0, offset);
  }
}
