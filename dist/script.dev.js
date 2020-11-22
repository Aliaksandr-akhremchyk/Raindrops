"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var FAILsound = new Audio("./assets/sounds/fail.mp3");
var SMALLfailsound = new Audio("./assets/sounds/smallfail.mp3");
var VICTORYsound = new Audio("./assets/sounds/pobeda.mp3");
var DROPsound = new Audio("./assets/sounds/kap.mp3");
var SEAsound = new Audio("./assets/sounds/sea.mp3");

SEAsound.onended = function () {
  return SEAsound.play();
};

var STARTNUMBER = 1;
var ENDNUMBER = 20;
var TIMEForOneDrop = 10; // in sec

var DROPFollenInterval = 5; // in sec

var IntervalOfDropOpacity = 1; // in sec

var IsGamePlayed = false;
var lastLean = 0;
var currentDrops = [];
var inxDrop = 0;
var countWinDrop = 0;
var operators = ["+", "-", "/", "x"];
var myevent = new Event("click", {
  bubbles: true
});
var game = 0;
var numberOfFeils = 0;
var coint = 10;
var startTime;
var endTime;
var operator;
var first;
var second;
var result;

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
  e.target.style.transition = "".concat(IntervalOfDropOpacity, "s all");
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
  var GOAL = document.querySelectorAll(".drop");
  GOAL.forEach(function (drop) {
    return drop.remove();
  });
  numberOfFeils = 0;
  SEAsound.pause();
  FAILsound.play();
  endTime = new Date();
}

function createDrop() {
  if (!IsGamePlayed) return;
  var DROP = document.createElement("div");
  var DROPcontainer = document.createElement("div");
  var SPAN1 = document.createElement("span");
  var SPAN2 = document.createElement("span");
  var SPAN3 = document.createElement("span");
  var FILD = document.querySelector(".game__fild");
  var BOTTOM = FILD.offsetHeight;
  var leans = Math.floor((FILD.offsetWidth - 60) / 80);
  var LEFTPostion = randomLean(leans) * 80 - 60;
  DROP.classList.add("drop");
  DROPcontainer.classList.add("drop__container");
  DROP.style.left = "".concat(LEFTPostion, "px");
  DROP.addEventListener("transitionend", dropTransitionEnd);

  function dropTransitionEnd(e) {
    e.target.removeEventListener("transitionend", dropTransitionEnd);
    feiled(e);
  }

  SPAN1.classList.add("drop__span");
  SPAN2.classList.add("drop__span", "drop__span_big");
  SPAN3.classList.add("drop__span");

  var _setNumbers = setNumbers();

  var _setNumbers2 = _slicedToArray(_setNumbers, 4);

  SPAN1.textContent = _setNumbers2[0];
  SPAN3.textContent = _setNumbers2[1];
  DROP.dataset.goal = _setNumbers2[2];
  SPAN2.textContent = _setNumbers2[3];
  document.body.prepend(DROP);
  DROP.appendChild(DROPcontainer);
  DROPcontainer.appendChild(SPAN1);
  DROPcontainer.appendChild(SPAN2);
  DROPcontainer.appendChild(SPAN3);
  setTimeout(function () {
    DROP.style.transform = "translateY(".concat(BOTTOM, "px)");
    DROP.style.transition = "".concat(TIMEForOneDrop, "s transform ease-in");
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
    var max = Math.max(first, second);
    var min = Math.min(first, second);
    first = max;
    second = min;
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
  var idx = randomAll(1, leans);

  if (idx === lastLean) {
    return randomLean(leans);
  }

  lastLean = idx;
  return idx;
}

function enterGoal() {
  if (!IsGamePlayed) return;
  var GOAL = document.querySelectorAll(".drop");

  for (var i = GOAL.length - 1; i >= 0; --i) {
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