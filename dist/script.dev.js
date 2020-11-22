"use strict";

//make the drop
var BTN = document.querySelector("button");
var CALCPANEL = document.querySelector(".calc-panel__battons");
var CALCSCREEN = document.querySelector(".calc-panel__screen");
var BTNS = document.querySelectorAll(".calc-panel__battons_batton");
var SCORE = document.querySelector(".score");
BTN.addEventListener("mousedown", function () {
  startGame(); //   console.log("херь");
  //   console.log(currentDrops);
});
var FAIL = new Audio("./assets/sounds/fail.mp3");
var VICTORY = new Audio("./assets/sounds/pobeda.mp3");
var SEA = new Audio("./assets/sounds/sea.mp3");

SEA.onended = function () {
  return SEA.play();
};

var STARTNUMBER = 1;
var ENDTNUMBER = 2;
var TIME = 5;
var TIMEInterval = 1;
var lastLean = 0;
var currentDrops = [];
var inxDrop = 0;
var myevent = new Event("click", {
  bubbles: true
});
var game = 0;
var numberOfFeils = 0; // clearInterval(autoClick);
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
  var GOAL = document.querySelectorAll(".drop");
  GOAL.forEach(function (drop) {
    return drop.remove();
  });
  numberOfFeils = 0;
}

function createDrop() {
  var DROP = document.createElement("div");
  var DROPcontainer = document.createElement("div");
  var SPAN1 = document.createElement("span");
  var SPAN2 = document.createElement("span");
  var SPAN3 = document.createElement("span");
  var FILD = document.querySelector(".game__fild");
  var BOTTOM = FILD.offsetHeight;
  var leans = Math.floor((FILD.offsetWidth - 60) / 80);
  var LEFT = randomLean(leans) * 80 - 60;
  DROP.classList.add("drop");
  DROPcontainer.classList.add("drop__container");
  DROP.style.left = "".concat(LEFT, "px");
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
  var first = randomAll(STARTNUMBER, ENDTNUMBER);
  var second = randomAll(STARTNUMBER, ENDTNUMBER);
  SPAN1.textContent = Math.max(first, second);
  SPAN3.textContent = Math.min(first, second);
  DROP.dataset.goal = first + second;
  document.body.prepend(DROP);
  DROP.appendChild(DROPcontainer);
  DROPcontainer.appendChild(SPAN1);
  DROPcontainer.appendChild(SPAN2);
  DROPcontainer.appendChild(SPAN3);
  setTimeout(function () {
    DROP.style.transform = "translateY(".concat(BOTTOM, "px)");
    DROP.style.transition = "".concat(TIME, "s transform ease-in");
  }, 100);
  currentDrops[inxDrop] = DROP;
  inxDrop++;
}

function randomAll(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomLean(leans) {
  var idx = randomAll(1, leans);

  if (idx === lastLean) {
    return randomLean(leans);
  }

  lastLean = idx;
  return idx;
}

function enterGoal() {
  var GOAL = document.querySelectorAll(".drop");

  for (var i = GOAL.length - 1; i >= 0; --i) {
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
  BTNS.forEach(function (btn) {
    if (btn.dataset.code === e.code) {
      btn.dispatchEvent(myevent);
    }
  });
}

CALCPANEL.addEventListener("click", function (e) {
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