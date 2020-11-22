//make the drop
const BTN = document.querySelector("button");
const CALCPANEL = document.querySelector(".calc-panel__battons");
const CALCSCREEN = document.querySelector(".calc-panel__screen");
const BTNS = document.querySelectorAll(".calc-panel__battons_batton");
const SCORE = document.querySelector(".score");

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
const ENDNUMBER = 20;
const TIMEForOneDrop = 10; // in sec
const DROPFollenInterval = 5; // in sec
const IntervalOfDropOpacity = 1; // in sec

let IsGamePlayed = false;
let lastLean = 0;
let currentDrops = [];
let inxDrop = 0;
let countWinDrop = 0;
let operators = ["+", "-", "/", "x"];
let myevent = new Event("click", { bubbles: true });
let game = 0;
let numberOfFeils = 0;
let coint = 10;
let startTime;
let endTime;

let operator;
let first;
let second;
let result;

function startGame() {
  IsGamePlayed = true;
  lastLean = 0;
  coint = 10;
  countWinDrop = 0;
  startTime = new Date();
  createDrop();
  game = setInterval(createDrop, DROPFollenInterval * 1000);
  SEAsound.play();
}
function feiled(e) {
  if (!IsGamePlayed) return;
  e.target.dataset.goal = "dfvvedfv";
  e.target.style.transition = `${IntervalOfDropOpacity}s all`;
  e.target.style.opacity = 0;
  console.log(e.target.dataset.goal);
  setTimeout(e.target.remove.bind(e.target), IntervalOfDropOpacity * 1000);

  SMALLfailsound.currentTime = 0;
  SMALLfailsound.play();
  SCORE.textContent = +SCORE.textContent - coint;
  if (++numberOfFeils >= 3) {
    IsGamePlayed = false;
    setTimeout(endGame, IntervalOfDropOpacity * 1000);
  }
  console.log(numberOfFeils);
}
function endGame() {
  clearInterval(game);
  const GOAL = document.querySelectorAll(".drop");
  GOAL.forEach((drop) => drop.remove());
  numberOfFeils = 0;
  SEAsound.pause();
  FAILsound.play();
  endTime = new Date();
}
function createDrop() {
  if (!IsGamePlayed) return;
  const DROP = document.createElement("div");
  const DROPcontainer = document.createElement("div");
  const SPAN1 = document.createElement("span");
  const SPAN2 = document.createElement("span");
  const SPAN3 = document.createElement("span");
  const FILD = document.querySelector(".game__fild");

  const BOTTOM = FILD.offsetHeight;
  let leans = Math.floor((FILD.offsetWidth - 60) / 80);

  const LEFTPostion = randomLean(leans) * 80 - 60;

  DROP.classList.add("drop");
  DROPcontainer.classList.add("drop__container");
  DROP.style.left = `${LEFTPostion}px`;
  DROP.addEventListener("transitionend", dropTransitionEnd);

  function dropTransitionEnd(e) {
    e.target.removeEventListener("transitionend", dropTransitionEnd);
    feiled(e);
  }

  SPAN1.classList.add("drop__span");
  SPAN2.classList.add("drop__span", "drop__span_big");
  SPAN3.classList.add("drop__span");

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
    DROP.style.transition = `${TIMEForOneDrop}s transform ease-in`;
  }, 100);

  currentDrops[inxDrop] = DROP;
  inxDrop++;
}
function setNumbers() {
  operator = operators[randomAll(0, operators.length - 1)];
  if (operator == "+") {
    first = randomAll(STARTNUMBER, ENDNUMBER);
    second = randomAll(STARTNUMBER, ENDNUMBER);
    result = first + second;
  }
  if (operator == "-") {
    first = randomAll(STARTNUMBER, ENDNUMBER);
    second = randomAll(STARTNUMBER, ENDNUMBER);
    let max = Math.max(first, second);
    let min = Math.min(first, second);
    [first, second] = [max, min];
    result = first - second;
  }
  if (operator == "x") {
    first = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    second = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    result = first * second;
  }
  if (operator == "/") {
    result = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    second = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    first = result * second;
  }
  return [first, second, result, operator];
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
  const GOAL = document.querySelectorAll(".drop");
  for (let i = GOAL.length - 1; i >= 0; --i) {
    if (GOAL[i].dataset.goal == CALCSCREEN.textContent) {
      SCORE.textContent = +SCORE.textContent + coint++;
      GOAL[i].remove();
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

function keydown(e) {
  BTNS.forEach((btn) => {
    if (btn.dataset.code === e.code) {
      btn.dispatchEvent(myevent);
    }
  });
}

CALCPANEL.addEventListener("click", (e) => {
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
