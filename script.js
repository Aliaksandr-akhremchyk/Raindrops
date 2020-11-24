//make the drop
const BTN = document.querySelector(".start-button");
const CALCPANEL = document.querySelector(".calc-panel__battons");
const CALCSCREEN = document.querySelector(".calc-panel__screen");
const BTNS = document.querySelectorAll(".calc-panel__battons_batton");
const SCORE = document.querySelector(".score");
const WAVE = document.querySelector(".wave");
const FULLScreenBtn = document.querySelector(".fullScreenBtn");
const GAME = document.querySelector("body");
const ENDBtn = document.querySelector(".end-button");

const overlay = document.querySelector(".overlay");
const message = document.querySelector(".message h2");
const confirmBtn = document.querySelector(".confirm");

BTN.addEventListener("mousedown", () => {
  startGame();
  //   console.log("херь");
  //   console.log(currentDrops);
});

const FAILsound = new Audio("./assets/sounds/fail.mp3");
const SMALLfailsound = new Audio("./assets/sounds/smallfail.mp3");
const VICTORYsound = new Audio("./assets/sounds/pobeda.mp3");
const DROPsound = new Audio("./assets/sounds/kap.mp3");

const SEAsound = new Audio("./assets/sounds/sea.mp3");
SEAsound.onended = () => SEAsound.play();

const STARTNUMBER = 1;
const ENDNUMBER = 4;
const TIMEForOneDrop = 10; // in sec
const DROPFollenInterval = 3; // in sec
const IntervalOfDropOpacity = 1; // in sec
const BONUSnomber = 5;
const INXcomplexity = 0.9; // from 0 to 1

let IsGamePlayed = false;
let lastLean = 0;
let currentDrops = [];
let inxDrop = 0;
let countWinDrop = 0;
// let operators = ["+"];
let operators = ["+", "-", "/", "x"];
let myevent = new Event("click", { bubbles: true });
let game = 0;
let numberOfFeils = 0;
let coint = 10;
let startTime;
let endTime;

let carrentTIMEForOneDrop;
let carrentDROPFollenInterval;

let operator;
let firstNumder;
let secondNumber;
let result;

function startGame() {
  WAVE.style.height = `${20 + 18 * numberOfFeils}%`;
  IsGamePlayed = true;
  lastLean = 0;
  coint = 10;
  countWinDrop = 0;
  carrentTIMEForOneDrop = TIMEForOneDrop;
  carrentDROPFollenInterval = DROPFollenInterval;
  SCORE.textContent = "";
  startTime = new Date();
  createDrop();
  game = setInterval(createDrop, carrentDROPFollenInterval * 1000);
  SEAsound.play();
}
function feiled(e) {
  if (!IsGamePlayed) return;
  if (++numberOfFeils >= 3) {
    IsGamePlayed = false;
    setTimeout(endGame, IntervalOfDropOpacity * 1000);
  }
  const DROPS = document.querySelectorAll(".drop");
  DROPS.forEach((drop) => dropQuickDown(drop));

  WAVE.style.height = `${20 + 18 * numberOfFeils}%`;

  clearInterval(game);
  game = setInterval(createDrop, carrentDROPFollenInterval * 1000);

  SMALLfailsound.currentTime = 0;
  SMALLfailsound.play();
  SCORE.textContent = +SCORE.textContent - coint;
}
function endGame() {
  clearInterval(game);
  const GOAL = document.querySelectorAll(".drop");
  GOAL.forEach((drop) => drop.remove());
  numberOfFeils = 0;
  SEAsound.pause();
  FAILsound.play();
  endTime = new Date();
  IsGamePlayed = false;
  showMessage();
}
function createDrop() {
  if (!IsGamePlayed) return;
  inxDrop++;
  const DROP = document.createElement("div");
  const DROPcontainer = document.createElement("div");
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

  if (inxDrop % BONUSnomber === 0) {
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
  DROPcontainer.appendChild(SPAN1);
  DROPcontainer.appendChild(SPAN2);
  DROPcontainer.appendChild(SPAN3);

  setTimeout(() => {
    DROP.style.transform = `translateY(${BOTTOM}px)`;
    DROP.style.transition = `${carrentTIMEForOneDrop}s transform ease-in`;
  }, 100);

  currentDrops[inxDrop] = DROP;
}
function dropTransitionEnd(e) {
  e.target.removeEventListener("transitionend", dropTransitionEnd);
  feiled(e);
}
function setNumbers() {
  operator = operators[randomAll(0, operators.length - 1)];
  if (operator == "+") {
    firstNumder = randomAll(STARTNUMBER, ENDNUMBER);
    secondNumber = randomAll(STARTNUMBER, ENDNUMBER);
    result = firstNumder + secondNumber;
  }
  if (operator == "-") {
    firstNumder = randomAll(STARTNUMBER, ENDNUMBER);
    secondNumber = randomAll(STARTNUMBER, ENDNUMBER);
    let max = Math.max(firstNumder, secondNumber);
    let min = Math.min(firstNumder, secondNumber);
    [firstNumder, secondNumber] = [max, min];
    result = firstNumder - secondNumber;
  }
  if (operator == "x") {
    firstNumder = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    secondNumber = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    result = firstNumder * secondNumber;
  }
  if (operator == "/") {
    result = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    secondNumber = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    firstNumder = result * secondNumber;
  }
  return [firstNumder, secondNumber, result, operator];
}

function randomAll(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomLean(leans) {
  const idx = randomAll(1, leans);
  if (idx === lastLean) {
    return randomLean(leans);
  }
  lastLean = idx;
  return idx;
}
function enterGoal() {
  if (!IsGamePlayed) return;
  const DROPS = document.querySelectorAll(".drop");
  for (let i = DROPS.length - 1; i >= 0; --i) {
    if (
      DROPS[i].dataset.bonus &&
      DROPS[i].dataset.goal == CALCSCREEN.textContent
    ) {
      setBonus(DROPS);
      return;
    }
    if (DROPS[i].dataset.goal == CALCSCREEN.textContent) {
      SCORE.textContent = +SCORE.textContent + coint++;
      dropQuickDown(DROPS[i]);
      VICTORYsound.currentTime = 0;
      VICTORYsound.play();
      CALCSCREEN.textContent = "";
      ++countWinDrop;
      return;
    }
  }
  CALCSCREEN.textContent = "";
  DROPsound.currentTime = 0;
  DROPsound.play();
}
function setBonus(drops) {
  drops.forEach((drop) => dropQuickDown(drop));
  SCORE.textContent = +SCORE.textContent + 3 * coint++;
  carrentTIMEForOneDrop *= INXcomplexity;
  carrentDROPFollenInterval *= INXcomplexity;
  clearInterval(game);
  game = setInterval(createDrop, carrentDROPFollenInterval * 1000);
  VICTORYsound.currentTime = 0;
  VICTORYsound.play();
  CALCSCREEN.textContent = "";
  ++countWinDrop;
}
function dropQuickDown(drop) {
  drop.removeEventListener("transitionend", feiled);
  drop.style.transition = `${IntervalOfDropOpacity}s all`;
  // drop.dataset.goal = "";
  drop.style.top = drop.getBoundingClientRect().top + 500 + "px";
  // console.log(drop.style.top);
  drop.style.opacity = 0;
  drop.style.transform = "";
  setTimeout(drop.remove.bind(drop), IntervalOfDropOpacity * 1000);
}
function keydown(e) {
  BTNS.forEach((btn) => {
    if (btn.dataset.code === e.code) {
      btn.dispatchEvent(myevent);
    }
  });
}

function showMessage() {
  message.textContent = `Your Game is over `;
  overlay.removeEventListener("transitionend", setDisplayNone);
  overlay.classList.remove("display-none");
  setTimeout(() => {
    overlay.classList.remove("opacity-null");
  }, 10);
}
function setDisplayNone() {
  overlay.classList.add("display-none");
}

CALCPANEL.addEventListener("click", (e) => {
  if (!e.target.dataset.key) return;
  if (e.target.dataset.key >= 0 && e.target.dataset.key <= 9) {
    CALCSCREEN.textContent += e.target.dataset.key;
  }
  if (e.target.dataset.key == "Del") {
    CALCSCREEN.textContent = CALCSCREEN.textContent.slice(0, -1);
  }
  if (e.target.dataset.key == "Clear") {
    CALCSCREEN.textContent = "";
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
document.addEventListener("keydown", keydown);
ENDBtn.addEventListener("click", endGame);
FULLScreenBtn.addEventListener("click", (e) => {
  if (e.clientX === 0) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else GAME.requestFullscreen();
});
confirmBtn.addEventListener("click", () => {
  overlay.classList.add("opacity-null");
  overlay.addEventListener("transitionend", setDisplayNone);
});
