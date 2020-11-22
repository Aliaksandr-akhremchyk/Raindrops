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

const FAIL = new Audio("./assets/sounds/fail.mp3");
const VICTORY = new Audio("./assets/sounds/pobeda.mp3");

const SEA = new Audio("./assets/sounds/sea.mp3");
SEA.onended = () => SEA.play();

const STARTNUMBER = 1;
const ENDTNUMBER = 2;
const TIME = 5;
const TIMEInterval = 1;

let lastLean = 0;
let currentDrops = [];
let inxDrop = 0;
let myevent = new Event("click", { bubbles: true });
let game = 0;
let numberOfFeils = 0;
// clearInterval(autoClick);
// let second = randomAll(STARTNUMBER, ENDTNUMBER);
function startGame() {
  createDrop();
  game = setInterval(createDrop, TIMEInterval * 1000);
}
function feiled() {
  FAIL.currentTime = 0;
  FAIL.play();
  SCORE.textContent = +SCORE.textContent - 17;
  if (++numberOfFeils >= 3) setTimeout(endGame, 800);
  console.log(numberOfFeils);
}
function endGame() {
  clearInterval(game);
  const GOAL = document.querySelectorAll(".drop");
  GOAL.forEach((drop) => drop.remove());
  numberOfFeils = 0;
}
function createDrop() {
  const DROP = document.createElement("div");
  const DROPcontainer = document.createElement("div");
  const SPAN1 = document.createElement("span");
  const SPAN2 = document.createElement("span");
  const SPAN3 = document.createElement("span");
  const FILD = document.querySelector(".game__fild");

  const BOTTOM = FILD.offsetHeight;
  let leans = Math.floor((FILD.offsetWidth - 60) / 80);

  const LEFT = randomLean(leans) * 80 - 60;

  DROP.classList.add("drop");
  DROPcontainer.classList.add("drop__container");
  DROP.style.left = `${LEFT}px`;
  DROP.addEventListener("transitionend", dropTransitionEnd);

  function dropTransitionEnd(e) {
    e.target.removeEventListener("transitionend", dropTransitionEnd);
    e.target.dataset.goal = "dfvvedfv";
    e.target.style.transition = "1s all";
    e.target.style.opacity = 0;
    console.log(e.target.dataset.goal);
    feiled();
    setTimeout(e.target.remove, 1000);
  }

  SPAN1.classList.add("drop__span");

  SPAN2.classList.add("drop__span", "drop__span_big");
  SPAN2.textContent = "+";
  SPAN3.classList.add("drop__span");

  let first = randomAll(STARTNUMBER, ENDTNUMBER);
  let second = randomAll(STARTNUMBER, ENDTNUMBER);
  SPAN1.textContent = Math.max(first, second);
  SPAN3.textContent = Math.min(first, second);
  DROP.dataset.goal = first + second;

  document.body.prepend(DROP);
  DROP.appendChild(DROPcontainer);
  DROPcontainer.appendChild(SPAN1);
  DROPcontainer.appendChild(SPAN2);
  DROPcontainer.appendChild(SPAN3);

  setTimeout(() => {
    DROP.style.transform = `translateY(${BOTTOM}px)`;
    DROP.style.transition = `${TIME}s transform ease-in`;
  }, 100);

  currentDrops[inxDrop] = DROP;
  inxDrop++;
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
  const GOAL = document.querySelectorAll(".drop");
  for (let i = GOAL.length - 1; i >= 0; --i) {
    if (GOAL[i].dataset.goal == CALCSCREEN.textContent) {
      SCORE.textContent = +SCORE.textContent + 10;
      GOAL[i].remove();
      VICTORY.currentTime = 0;
      VICTORY.play();
      CALCSCREEN.textContent = "";
    }
  }
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
