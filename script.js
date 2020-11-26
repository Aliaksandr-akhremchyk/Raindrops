//Buttons
const PLAY_START_btn = document.querySelector(".play-start");
const OPTIONS_btn = document.querySelector(".options");
const HOW_TO_PLAY_btn = document.querySelector(".how-to-play");
const OPTIONS_DURING_GAME_btn = document.querySelector(".start-button");
const END_btn = document.querySelector(".end-button");
const FULL_SCREEN_btn = document.querySelector(".fullScreenBtn");
const PLAY_AGAIN_btn = document.querySelector(".confirm");

const OVERLAY_start = document.querySelector(".overlay-start");
const MESSAGE_start = document.querySelector(".message-start");

const configuration = document.querySelector(".configuration");
const ARROW_UP = document.querySelector(".arrows_up");
const ARROW_DOWN = document.querySelector(".arrows_down");
const OPERATORS_check = document.querySelectorAll(".operator_check");
const SET_NUMBER = document.querySelector(".arrows_set-number");

const HOW_TO_PLAY_container = document.querySelector(".how-to-play_container");
const ARROW_LEFT = document.querySelector(".arrows_left");
const ARROW_RIGHT = document.querySelector(".arrows_right");
const DESCRIPTION = document.querySelector(".description");
const VIDEO_1 = document.querySelector(".video1");
const VIDEO_2 = document.querySelector(".video2");
const VIDEO_3 = document.querySelector(".video3");

const GAME = document.querySelector("body");
const WAVE = document.querySelector(".wave");

const SCORE = document.querySelector(".score");
const CALC_PANEL = document.querySelector(".calc-panel__battons");
const CALC_SCREEN = document.querySelector(".calc-panel__screen");
const CALC_BTNS = document.querySelectorAll(".calc-panel__battons_batton");

const OVERLAY_end = document.querySelector(".overlay-end");
const MESSAGE_end = document.querySelector(".message_end h2");

const FAIL_sound = new Audio("./assets/sounds/fail.mp3");
const SMALL_FAIL_sound = new Audio("./assets/sounds/smallfail.mp3");
const VICTORY_sound = new Audio("./assets/sounds/pobeda.mp3");
const DROP_sound = new Audio("./assets/sounds/kap.mp3");

const SEA_sound = new Audio("./assets/sounds/sea.mp3");
SEA_sound.onended = () => SEA_sound.play();

let currentVideo = 1;

const START_NUMBER = 1;
let END_NUMBER = 4;
const TIME_FOR_ONE_DRO_PFOLLEN = 10; // in sec
const INTERVAL_FOR_DROP_FOLLEN = 7; // in sec
const INTERVAL_FOR_DROP_OPACITY = 1; // in sec
const NUMBERS_OF_DROPS_FOR_BONUS = 10;
const COMPLEXITY_INDEX = 0.9; // from 0 to 1
const OPERATORS = ["+", "–", "÷", "x"];

let isGamePlayed = false;
let lastDropLean = 0;
let currentDrops = [];
let inxDrop = 0;
let countWinDrop = 0;
let counWrongEnter = 0;
let currentOperators = [];
let myevent = new Event("click", { bubbles: true });
let game = 0;
let numberOfFeils = 0;
let coint = 10;
let startTime;
let endTime;

let currentTIMEForOneDrop;
let currentDROPFollenInterval;

let operator;
let firstNumder;
let secondNumber;
let result;

function startGame() {
  WAVE.style.height = `12%`;
  isGamePlayed = true;
  lastDropLean = 0;
  coint = 10;
  countWinDrop = 0;
  counWrongEnter = 0;
  inxDrop = 0;
  currentTIMEForOneDrop = TIME_FOR_ONE_DRO_PFOLLEN;
  currentDROPFollenInterval = INTERVAL_FOR_DROP_FOLLEN;
  SCORE.textContent = "";
  startTime = new Date();
  createDrop();
  game = setInterval(createDrop, currentDROPFollenInterval * 1000);
  SEA_sound.play();
}
function feiled() {
  if (!isGamePlayed) return;
  if (++numberOfFeils >= 3) {
    isGamePlayed = false;
    setTimeout(endGame, INTERVAL_FOR_DROP_OPACITY * 1000);
  }
  const DROPS = document.querySelectorAll(".drop");
  DROPS.forEach((drop) => dropQuickDown(drop));

  WAVE.style.height = `${12 + 20 * numberOfFeils}%`;

  clearInterval(game);
  game = setInterval(createDrop, currentDROPFollenInterval * 1000);

  SMALL_FAIL_sound.currentTime = 0;
  SMALL_FAIL_sound.play();
  SCORE.textContent =
    +SCORE.textContent - coint < 0 ? "" : +SCORE.textContent - coint;
}
function endGame(e) {
  if (!inxDrop) return;
  clearInterval(game);
  const GOAL = document.querySelectorAll(".drop");
  GOAL.forEach((drop) => drop.remove());
  numberOfFeils = 0;
  SEA_sound.pause();
  endTime = new Date();
  isGamePlayed = false;
  if (e !== "End without message") {
    showMessage();
    FAIL_sound.play();
  }
}
function createDrop() {
  if (!isGamePlayed) return;
  inxDrop++;
  const DROP = document.createElement("div");
  const DROPcontainer = document.createElement("div");
  const SPANcontainer = document.createElement("div");
  const SPAN1 = document.createElement("span");
  const SPAN2 = document.createElement("span");
  const SPAN3 = document.createElement("span");
  const FILD = document.querySelector(".game__container_fild");

  const BOTTOM = FILD.offsetHeight + 30;
  let leans = Math.floor((FILD.offsetWidth - 60) / 80);

  const LEFTPostion = randomLean(leans) * 80 - 60;

  DROP.classList.add("drop");
  DROPcontainer.classList.add("drop__container");
  DROP.style.left = `${LEFTPostion}px`;
  DROP.addEventListener("transitionend", feiled);

  SPAN1.classList.add("drop__span");
  SPAN2.classList.add("drop__span", "drop__span_big");
  SPAN3.classList.add("drop__span");

  if (inxDrop % NUMBERS_OF_DROPS_FOR_BONUS === 0) {
    console.log(inxDrop);
    DROP.classList.add("bonus");
    DROP.dataset.bonus = 1;
  }
  [
    SPAN1.textContent,
    SPAN3.textContent,
    DROP.dataset.goal,
    SPAN2.textContent,
  ] = setNumbers();

  document.body.prepend(DROP);
  DROP.appendChild(DROPcontainer);
  DROPcontainer.appendChild(SPAN2);
  DROPcontainer.appendChild(SPANcontainer);

  SPANcontainer.appendChild(SPAN1);
  SPANcontainer.appendChild(SPAN3);

  setTimeout(() => {
    DROP.style.transform = `translateY(${BOTTOM - 40}px)`;
    DROP.style.transition = `${currentTIMEForOneDrop}s transform ease-in`;
  }, 100);

  currentDrops[inxDrop] = DROP;
}
function dropTransitionEnd(e) {
  e.target.removeEventListener("transitionend", dropTransitionEnd);
  feiled(e);
}
function setNumbers() {
  operator = currentOperators[randomAll(0, currentOperators.length - 1)];
  if (operator == "+") {
    firstNumder = randomAll(START_NUMBER, END_NUMBER);
    secondNumber = randomAll(START_NUMBER, END_NUMBER);
    result = firstNumder + secondNumber;
  }
  if (operator == "–") {
    firstNumder = randomAll(START_NUMBER, END_NUMBER);
    secondNumber = randomAll(START_NUMBER, END_NUMBER);
    let max = Math.max(firstNumder, secondNumber);
    let min = Math.min(firstNumder, secondNumber);
    [firstNumder, secondNumber] = [max, min];
    result = firstNumder - secondNumber;
  }
  if (operator == "x") {
    firstNumder = randomAll(START_NUMBER, END_NUMBER > 10 ? 10 : END_NUMBER);
    secondNumber = randomAll(START_NUMBER, END_NUMBER > 10 ? 10 : END_NUMBER);
    result = firstNumder * secondNumber;
  }
  if (operator == "÷") {
    result = randomAll(START_NUMBER, END_NUMBER > 10 ? 10 : END_NUMBER);
    secondNumber = randomAll(START_NUMBER, END_NUMBER > 10 ? 10 : END_NUMBER);
    firstNumder = result * secondNumber;
  }
  return [firstNumder, secondNumber, result, operator];
}
function setOperatops() {
  let i = 0;
  OPERATORS_check.forEach((operator) => {
    if (operator.classList.contains("operator_check_active")) {
      currentOperators.push(OPERATORS[i]);
    }
    ++i;
  });
}
function randomAll(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
function randomLean(leans) {
  const idx = randomAll(1, leans);
  if (idx === lastDropLean) {
    return randomLean(leans);
  }
  lastDropLean = idx;
  return idx;
}
function enterGoal() {
  if (!isGamePlayed) return;
  const DROPS = document.querySelectorAll(".drop");
  for (let i = DROPS.length - 1; i >= 0; --i) {
    if (
      DROPS[i].dataset.bonus &&
      DROPS[i].dataset.goal == CALC_SCREEN.textContent
    ) {
      setBonus(DROPS);
      return;
    }
    if (DROPS[i].dataset.goal == CALC_SCREEN.textContent) {
      SCORE.textContent = +SCORE.textContent + coint++;
      dropQuickDown(DROPS[i]);
      VICTORY_sound.currentTime = 0;
      VICTORY_sound.play();
      CALC_SCREEN.textContent = "";
      ++countWinDrop;
      return;
    }
  }
  CALC_SCREEN.textContent = "";
  SCORE.textContent =
    +SCORE.textContent - coint < 0 ? "" : +SCORE.textContent - coint;
  DROP_sound.currentTime = 0;
  DROP_sound.play();
  ++counWrongEnter;
}
function setBonus(drops) {
  drops.forEach((drop) => dropQuickDown(drop));
  SCORE.textContent = +SCORE.textContent + 3 * coint++;
  currentTIMEForOneDrop *= COMPLEXITY_INDEX;
  currentDROPFollenInterval *= COMPLEXITY_INDEX;
  clearInterval(game);
  game = setInterval(createDrop, currentDROPFollenInterval * 1000);
  VICTORY_sound.currentTime = 0;
  VICTORY_sound.play();
  CALC_SCREEN.textContent = "";
  ++countWinDrop;
}
function dropQuickDown(drop) {
  drop.removeEventListener("transitionend", feiled);

  drop.style.transition = "";
  drop.dataset.goal = "";
  drop.style.top = drop.getBoundingClientRect().top + "px";
  drop.style.transform = "";
  setTimeout(() => {
    drop.style.top = drop.getBoundingClientRect().top + 900 + "px";
    drop.style.transition = `${INTERVAL_FOR_DROP_OPACITY}s all ease-in`;
    drop.style.opacity = 0;
  }, 10);

  setTimeout(drop.remove.bind(drop), INTERVAL_FOR_DROP_OPACITY * 1000);
}
function keydown(e) {
  CALC_BTNS.forEach((btn) => {
    if (btn.dataset.code === e.code) {
      btn.dispatchEvent(myevent);
    }
  });
}
function efficiency() {
  if (!countWinDrop) return "0%";
  return Math.round((1 - counWrongEnter / inxDrop) * 100) + "%";
}
function showMessage() {
  let results = [
    SCORE.textContent,
    countWinDrop,
    counWrongEnter,
    efficiency(),
    getGameTime(),
  ];
  let resultsComment = [
    "Score: ",
    "Win Drops: ",
    "Wrong Enters: ",
    "Efficiency: ",
    "Game time: ",
  ];
  let resultMessage = "<b>Game over!</b> <hr>";

  for (let i = 0; i < results.length; ++i) {
    resultMessage +=
      resultsComment[i] + (results[i] ? results[i] : "0") + "<br>";
  }

  MESSAGE_end.innerHTML = resultMessage;
  OVERLAY_end.removeEventListener("transitionend", setDisplayNone);
  OVERLAY_end.classList.remove("display-none");
  setTimeout(() => {
    OVERLAY_end.classList.remove("opacity-null");
  }, 10);
}
function getGameTime() {
  return formatDuration((endTime - startTime) / 1000);
}
function setDisplayNone(e) {
  e.target.classList.add("display-none");
}
function formatDuration(seconds) {
  var time = { year: 31536000, day: 86400, hour: 3600, minute: 60, second: 1 },
    res = [];

  if (seconds === 0) return "now";

  for (var key in time) {
    if (seconds >= time[key]) {
      var val = Math.floor(seconds / time[key]);
      res.push((val += val > 1 ? " " + key + "s" : " " + key));
      seconds = seconds % time[key];
    }
  }

  return res.length > 1
    ? res.join(", ").replace(/,([^,]*)$/, " and" + "$1")
    : res[0];
}
OPTIONS_DURING_GAME_btn.addEventListener("mousedown", () => {
  endGame("End without message");
  OVERLAY_start.removeEventListener("transitionend", setDisplayNone);
  OVERLAY_start.classList.remove("display-none");
  setTimeout(() => {
    OVERLAY_start.classList.remove("opacity-null");
  }, 10);
  configuration.classList.remove("display-none");
  HOW_TO_PLAY_container.classList.add("display-none");
  MESSAGE_start.style.width = "";
});
PLAY_START_btn.addEventListener("click", () => {
  OVERLAY_start.classList.add("opacity-null");
  OVERLAY_start.addEventListener("transitionend", setDisplayNone);
  VIDEO_1.pause();
  VIDEO_2.pause();
  VIDEO_1.currentTime = 0;
  VIDEO_2.currentTime = 0;
  setOperatops();
  END_NUMBER = +SET_NUMBER.textContent;
  startGame();
});
PLAY_AGAIN_btn.addEventListener("click", () => {
  OVERLAY_end.classList.add("opacity-null");
  OVERLAY_end.addEventListener("transitionend", setDisplayNone);
  startGame();
});
FULL_SCREEN_btn.addEventListener("click", (e) => {
  if (e.clientX === 0) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else GAME.requestFullscreen();
});
END_btn.addEventListener("click", endGame);
OPTIONS_btn.addEventListener("click", () => {
  configuration.classList.remove("display-none");
  HOW_TO_PLAY_container.classList.add("display-none");
  MESSAGE_start.style.width = "";
});
HOW_TO_PLAY_btn.addEventListener("click", () => {
  configuration.classList.add("display-none");
  HOW_TO_PLAY_container.classList.remove("display-none");
  MESSAGE_start.style.width = "85%";
  VIDEO_1.play();
  VIDEO_1.onended = () => VIDEO_1.play();
});
OPERATORS_check.forEach((operator) => {
  operator.addEventListener("click", () => {
    if (!operator.classList.contains("operator_check_active")) {
      operator.classList.add("operator_check_active");
      return;
    }
    OPERATORS_check.forEach((oper) => {
      if (operator !== oper && oper.classList.contains("operator_check_active"))
        operator.classList.remove("operator_check_active");
    });
  });
});
CALC_PANEL.addEventListener("click", (e) => {
  if (!e.target.dataset.key) return;
  if (e.target.dataset.key >= 0 && e.target.dataset.key <= 9) {
    CALC_SCREEN.textContent += e.target.dataset.key;
  }
  if (e.target.dataset.key == "Del") {
    CALC_SCREEN.textContent = CALC_SCREEN.textContent.slice(0, -1);
  }
  if (e.target.dataset.key == "Clear") {
    CALC_SCREEN.textContent = "";
  }
  if (e.target.dataset.key == "Enter") {
    enterGoal();
  }
  e.target.style.backgroundColor = "red";
  setTimeout(removeStyle.bind(e.target), 300, e.target);

  function removeStyle(el) {
    el.style.backgroundColor = "";
  }
});
ARROW_UP.addEventListener("click", () => {
  if (++SET_NUMBER.textContent > 20) SET_NUMBER.textContent = 20;
});
ARROW_DOWN.addEventListener("click", () => {
  if (--SET_NUMBER.textContent < 3) SET_NUMBER.textContent = 2;
});
ARROW_LEFT.addEventListener("click", () => {
  if (currentVideo === 3) {
    ARROW_RIGHT.classList.toggle("arrows_right_passive");
    VIDEO_2.classList.toggle("display-none");
    VIDEO_3.classList.toggle("display-none");
    VIDEO_2.play();
    VIDEO_2.onended = () => VIDEO_2.play();
    DESCRIPTION.textContent =
      "When the third drop of water touches the sea, the game is over.";
    currentVideo = 2;
    return;
  }
  if (currentVideo === 2) {
    ARROW_LEFT.classList.toggle("arrows_left_passive");
    VIDEO_2.pause();
    VIDEO_2.currentTime = 0;
    VIDEO_1.classList.toggle("display-none");
    VIDEO_2.classList.toggle("display-none");
    VIDEO_1.play();
    VIDEO_1.onended = () => VIDEO_2.play();
    DESCRIPTION.textContent =
      "You must enter the value of the expression before the drop falls into the sea.";
    currentVideo = 1;
    return;
  }
});
ARROW_RIGHT.addEventListener("click", () => {
  if (currentVideo === 1) {
    ARROW_LEFT.classList.toggle("arrows_left_passive");
    VIDEO_1.pause();
    VIDEO_1.currentTime = 0;
    VIDEO_1.classList.toggle("display-none");
    VIDEO_2.classList.toggle("display-none");
    VIDEO_2.play();
    VIDEO_2.onended = () => VIDEO_2.play();
    DESCRIPTION.textContent =
      "When the third drop of water touches the sea, the game is over.";
    currentVideo = 2;
    return;
  }
  if (currentVideo === 2) {
    ARROW_RIGHT.classList.toggle("arrows_right_passive");
    VIDEO_2.pause();
    VIDEO_2.currentTime = 0;
    VIDEO_2.classList.toggle("display-none");
    VIDEO_3.classList.toggle("display-none");
    DESCRIPTION.textContent = "You can use the keyboard to play the game.";
    currentVideo = 3;
    return;
  }
});
document.addEventListener("keydown", keydown);
