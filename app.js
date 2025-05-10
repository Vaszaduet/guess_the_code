"use strict";

const buttons = document.querySelectorAll(".general_buttons");
const sounds = {};
const screenText = document.querySelector(".text");
const video = document.getElementById("video");

sounds.click = document.getElementById("click_sound");
sounds.oof = document.getElementById("oof_sound");
sounds.correct = document.getElementById("correct_sound");

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
    sounds.click.currentTime = 0;
    sounds.click.play();
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
  sounds.correct.currentTime = 0.3;
  sounds.correct.play();
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
  sounds.oof.currentTime = 0.55;
  sounds.oof.play();
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
