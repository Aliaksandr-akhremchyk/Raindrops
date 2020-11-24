"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//make the drop
var BTN = document.querySelector(".start-button");
var CALCPANEL = document.querySelector(".calc-panel__battons");
var CALCSCREEN = document.querySelector(".calc-panel__screen");
var BTNS = document.querySelectorAll(".calc-panel__battons_batton");
var SCORE = document.querySelector(".score");
var WAVE = document.querySelector(".wave");
var FULLScreenBtn = document.querySelector(".fullScreenBtn");
var GAME = document.querySelector("body");
var ENDBtn = document.querySelector(".end-button");
var overlay = document.querySelector(".overlay");
var message = document.querySelector(".message h2");
var confirmBtn = document.querySelector(".confirm");
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
var ENDNUMBER = 4;
var TIMEForOneDrop = 10; // in sec

var DROPFollenInterval = 3; // in sec

var IntervalOfDropOpacity = 1; // in sec

var BONUSnomber = 5;
var INXcomplexity = 0.9; // from 0 to 1

var IsGamePlayed = false;
var lastLean = 0;
var currentDrops = [];
var inxDrop = 0;
var countWinDrop = 0; // let operators = ["+"];

var operators = ["+", "-", "/", "x"];
var myevent = new Event("click", {
  bubbles: true
});
var game = 0;
var numberOfFeils = 0;
var coint = 10;
var startTime;
var endTime;
var carrentTIMEForOneDrop;
var carrentDROPFollenInterval;
var operator;
var firstNumder;
var secondNumber;
var result;

function startGame() {
  WAVE.style.height = "".concat(20 + 18 * numberOfFeils, "%");
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

  var DROPS = document.querySelectorAll(".drop");
  DROPS.forEach(function (drop) {
    return dropQuickDown(drop);
  });
  WAVE.style.height = "".concat(20 + 18 * numberOfFeils, "%");
  clearInterval(game);
  game = setInterval(createDrop, carrentDROPFollenInterval * 1000);
  SMALLfailsound.currentTime = 0;
  SMALLfailsound.play();
  SCORE.textContent = +SCORE.textContent - coint;
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
  IsGamePlayed = false;
  showMessage();
}

function createDrop() {
  if (!IsGamePlayed) return;
  inxDrop++;
  var DROP = document.createElement("div");
  var DROPcontainer = document.createElement("div");
  var SPAN1 = document.createElement("span");
  var SPAN2 = document.createElement("span");
  var SPAN3 = document.createElement("span");
  var FILD = document.querySelector(".game__container_fild");
  var BOTTOM = FILD.offsetHeight + 30;
  var leans = Math.floor((FILD.offsetWidth - 60) / 80);
  var LEFTPostion = randomLean(leans) * 80 - 60;
  DROP.classList.add("drop");
  DROPcontainer.classList.add("drop__container");
  DROP.style.left = "".concat(LEFTPostion, "px");
  DROP.addEventListener("transitionend", feiled);
  SPAN1.classList.add("drop__span");
  SPAN2.classList.add("drop__span", "drop__span_big");
  SPAN3.classList.add("drop__span");

  if (inxDrop % BONUSnomber === 0) {
    console.log(inxDrop);
    DROP.classList.add("bonus");
    DROP.dataset.bonus = 1;
  }

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
    DROP.style.transition = "".concat(carrentTIMEForOneDrop, "s transform ease-in");
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
    var max = Math.max(firstNumder, secondNumber);
    var min = Math.min(firstNumder, secondNumber);
    firstNumder = max;
    secondNumber = min;
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
  var idx = randomAll(1, leans);

  if (idx === lastLean) {
    return randomLean(leans);
  }

  lastLean = idx;
  return idx;
}

function enterGoal() {
  if (!IsGamePlayed) return;
  var DROPS = document.querySelectorAll(".drop");

  for (var i = DROPS.length - 1; i >= 0; --i) {
    if (DROPS[i].dataset.bonus && DROPS[i].dataset.goal == CALCSCREEN.textContent) {
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
  drops.forEach(function (drop) {
    return dropQuickDown(drop);
  });
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
  drop.style.transition = "".concat(IntervalOfDropOpacity, "s all"); // drop.dataset.goal = "";

  drop.style.top = drop.getBoundingClientRect().top + 500 + "px"; // console.log(drop.style.top);

  drop.style.opacity = 0;
  drop.style.transform = "";
  setTimeout(drop.remove.bind(drop), IntervalOfDropOpacity * 1000);
}

function keydown(e) {
  BTNS.forEach(function (btn) {
    if (btn.dataset.code === e.code) {
      btn.dispatchEvent(myevent);
    }
  });
}

function showMessage() {
  message.textContent = "Your Game is over ";
  overlay.removeEventListener("transitionend", setDisplayNone);
  overlay.classList.remove("display-none");
  setTimeout(function () {
    overlay.classList.remove("opacity-null");
  }, 10);
}

function setDisplayNone() {
  overlay.classList.add("display-none");
}

CALCPANEL.addEventListener("click", function (e) {
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
FULLScreenBtn.addEventListener("click", function (e) {
  if (e.clientX === 0) return;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else GAME.requestFullscreen();
});
confirmBtn.addEventListener("click", function () {
  overlay.classList.add("opacity-null");
  overlay.addEventListener("transitionend", setDisplayNone);
});