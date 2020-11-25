"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var BTN = document.querySelector(".start-button");
var CALCPANEL = document.querySelector(".calc-panel__battons");
var CALCSCREEN = document.querySelector(".calc-panel__screen");
var BTNS = document.querySelectorAll(".calc-panel__battons_batton");
var SCORE = document.querySelector(".score");
var WAVE = document.querySelector(".wave");
var FULL_SCREEN_btn = document.querySelector(".fullScreenBtn");
var GAME = document.querySelector("body");
var END_btn = document.querySelector(".end-button");
var PLAY_START_btn = document.querySelector(".play-start");
var OPTIONS_btn = document.querySelector(".options");
var HOW_TO_PLAY_btn = document.querySelector(".how-to-play");
var HOW_TO_PLAY_container = document.querySelector(".how-to-play_container");
var OPERATORS_check = document.querySelectorAll(".operator_check");
var configuration = document.querySelector(".configuration");
var ARROW_UP = document.querySelector(".arrows_up");
var ARROW_LEFT = document.querySelector(".arrows_left");
var ARROW_DOWN = document.querySelector(".arrows_down");
var ARROW_RIGHT = document.querySelector(".arrows_right");
var SET_NUMBER = document.querySelector(".arrows_set-number");
var DESCRIPTION = document.querySelector(".description");
var overlay = document.querySelector(".overlay-end");
var overlay_start = document.querySelector(".overlay-start");
var message_start = document.querySelector(".message-start");
var message = document.querySelector(".message_end h2");
var PLAY_AGAIN_btn = document.querySelector(".confirm");
var FAILsound = new Audio("./assets/sounds/fail.mp3");
var SMALLfailsound = new Audio("./assets/sounds/smallfail.mp3");
var VICTORYsound = new Audio("./assets/sounds/pobeda.mp3");
var DROPsound = new Audio("./assets/sounds/kap.mp3");
var SEAsound = new Audio("./assets/sounds/sea.mp3");

SEAsound.onended = function () {
  return SEAsound.play();
};

var VIDEO1 = document.querySelector(".video1");
var VIDEO2 = document.querySelector(".video2");
var VIDEO3 = document.querySelector(".video3");
var currentVideo = 1;
var STARTNUMBER = 1;
var ENDNUMBER = 4;
var TIMEForOneDrop = 10; // in sec

var DROPFollenInterval = 7; // in sec

var IntervalOfDropOpacity = 1; // in sec

var BONUSnomber = 10;
var INDEXcomplexity = 0.9; // from 0 to 1

var OPERATORS = ["+", "–", "÷", "x"];
var isGamePlayed = false;
var lastLean = 0;
var currentDrops = [];
var inxDrop = 0;
var countWinDrop = 0;
var counWrongEnter = 0; // let operators = ["+"];

var operators = [];
var myevent = new Event("click", {
  bubbles: true
});
var game = 0;
var numberOfFeils = 0;
var coint = 10;
var startTime;
var endTime;
var currentTIMEForOneDrop;
var currentDROPFollenInterval;
var operator;
var firstNumder;
var secondNumber;
var result;

function startGame() {
  WAVE.style.height = "12%";
  isGamePlayed = true;
  lastLean = 0;
  coint = 10;
  countWinDrop = 0;
  counWrongEnter = 0;
  inxDrop = 0;
  currentTIMEForOneDrop = TIMEForOneDrop;
  currentDROPFollenInterval = DROPFollenInterval;
  SCORE.textContent = "";
  startTime = new Date();
  createDrop();
  game = setInterval(createDrop, currentDROPFollenInterval * 1000);
  SEAsound.play();
}

function feiled() {
  if (!isGamePlayed) return;

  if (++numberOfFeils >= 3) {
    isGamePlayed = false;
    setTimeout(endGame, IntervalOfDropOpacity * 1000);
  }

  var DROPS = document.querySelectorAll(".drop");
  DROPS.forEach(function (drop) {
    return dropQuickDown(drop);
  });
  WAVE.style.height = "".concat(12 + 20 * numberOfFeils, "%");
  clearInterval(game);
  game = setInterval(createDrop, currentDROPFollenInterval * 1000);
  SMALLfailsound.currentTime = 0;
  SMALLfailsound.play();
  SCORE.textContent = +SCORE.textContent - coint < 0 ? "" : +SCORE.textContent - coint;
}

function endGame(e) {
  if (!inxDrop) return;
  clearInterval(game);
  var GOAL = document.querySelectorAll(".drop");
  GOAL.forEach(function (drop) {
    return drop.remove();
  });
  numberOfFeils = 0;
  SEAsound.pause();
  endTime = new Date();
  isGamePlayed = false;

  if (e !== "End without message") {
    showMessage();
    FAILsound.play();
  }
}

function createDrop() {
  if (!isGamePlayed) return;
  inxDrop++;
  var DROP = document.createElement("div");
  var DROPcontainer = document.createElement("div");
  var SPANcontainer = document.createElement("div");
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
  DROPcontainer.appendChild(SPAN2);
  DROPcontainer.appendChild(SPANcontainer);
  SPANcontainer.appendChild(SPAN1);
  SPANcontainer.appendChild(SPAN3);
  setTimeout(function () {
    DROP.style.transform = "translateY(".concat(BOTTOM - 40, "px)");
    DROP.style.transition = "".concat(currentTIMEForOneDrop, "s transform ease-in");
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

  if (operator == "–") {
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

  if (operator == "÷") {
    result = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    secondNumber = randomAll(STARTNUMBER, ENDNUMBER > 10 ? 10 : ENDNUMBER);
    firstNumder = result * secondNumber;
  }

  return [firstNumder, secondNumber, result, operator];
}

function setOperatops() {
  var i = 0;
  OPERATORS_check.forEach(function (operator) {
    if (operator.classList.contains("operator_check_active")) {
      operators.push(OPERATORS[i]);
    }

    ++i;
  });
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
  if (!isGamePlayed) return;
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
  SCORE.textContent = +SCORE.textContent - coint < 0 ? "" : +SCORE.textContent - coint;
  DROPsound.currentTime = 0;
  DROPsound.play();
  ++counWrongEnter;
}

function setBonus(drops) {
  drops.forEach(function (drop) {
    return dropQuickDown(drop);
  });
  SCORE.textContent = +SCORE.textContent + 3 * coint++;
  currentTIMEForOneDrop *= INDEXcomplexity;
  currentDROPFollenInterval *= INDEXcomplexity;
  clearInterval(game);
  game = setInterval(createDrop, currentDROPFollenInterval * 1000);
  VICTORYsound.currentTime = 0;
  VICTORYsound.play();
  CALCSCREEN.textContent = "";
  ++countWinDrop;
}

function dropQuickDown(drop) {
  drop.removeEventListener("transitionend", feiled);
  drop.style.transition = "";
  drop.dataset.goal = "";
  drop.style.top = drop.getBoundingClientRect().top + "px";
  drop.style.transform = "";
  setTimeout(function () {
    drop.style.top = drop.getBoundingClientRect().top + 900 + "px";
    drop.style.transition = "".concat(IntervalOfDropOpacity, "s all ease-in");
    drop.style.opacity = 0;
  }, 10);
  setTimeout(drop.remove.bind(drop), IntervalOfDropOpacity * 1000);
}

function keydown(e) {
  BTNS.forEach(function (btn) {
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
  var results = [SCORE.textContent, countWinDrop, counWrongEnter, efficiency(), getGameTime()];
  var resultsComment = ["Score: ", "Win Drops: ", "Wrong Enters: ", "Efficiency: ", "Game time: "];
  var resultMessage = "<b>Game over!</b> <hr>";

  for (var i = 0; i < results.length; ++i) {
    resultMessage += resultsComment[i] + (results[i] ? results[i] : "0") + "<br>";
  }

  message.innerHTML = resultMessage;
  overlay.removeEventListener("transitionend", setDisplayNone);
  overlay.classList.remove("display-none");
  setTimeout(function () {
    overlay.classList.remove("opacity-null");
  }, 10);
}

function getGameTime() {
  return formatDuration((endTime - startTime) / 1000);
}

function setDisplayNone(e) {
  e.target.classList.add("display-none");
}

function formatDuration(seconds) {
  var time = {
    year: 31536000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  },
      res = [];
  if (seconds === 0) return "now";

  for (var key in time) {
    if (seconds >= time[key]) {
      var val = Math.floor(seconds / time[key]);
      res.push(val += val > 1 ? " " + key + "s" : " " + key);
      seconds = seconds % time[key];
    }
  }

  return res.length > 1 ? res.join(", ").replace(/,([^,]*)$/, " and" + "$1") : res[0];
}

BTN.addEventListener("mousedown", function () {
  endGame("End without message");
  overlay_start.removeEventListener("transitionend", setDisplayNone);
  overlay_start.classList.remove("display-none");
  setTimeout(function () {
    overlay_start.classList.remove("opacity-null");
  }, 10);
  configuration.classList.remove("display-none");
  HOW_TO_PLAY_container.classList.add("display-none");
  message_start.style.width = "";
});
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
END_btn.addEventListener("click", endGame);
FULL_SCREEN_btn.addEventListener("click", function (e) {
  if (e.clientX === 0) return;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else GAME.requestFullscreen();
});
PLAY_AGAIN_btn.addEventListener("click", function () {
  overlay.classList.add("opacity-null");
  overlay.addEventListener("transitionend", setDisplayNone);
  startGame();
});
PLAY_START_btn.addEventListener("click", function () {
  overlay_start.classList.add("opacity-null");
  overlay_start.addEventListener("transitionend", setDisplayNone);
  setOperatops();
  ENDNUMBER = +SET_NUMBER.textContent;
  startGame();
});
OPTIONS_btn.addEventListener("click", function () {
  configuration.classList.remove("display-none");
  HOW_TO_PLAY_container.classList.add("display-none");
  message_start.style.width = "";
});
OPERATORS_check.forEach(function (operator) {
  operator.addEventListener("click", function () {
    if (!operator.classList.contains("operator_check_active")) {
      operator.classList.add("operator_check_active");
      return;
    }

    OPERATORS_check.forEach(function (oper) {
      if (operator !== oper && oper.classList.contains("operator_check_active")) operator.classList.remove("operator_check_active");
    });
  });
});
ARROW_UP.addEventListener("click", function () {
  if (++SET_NUMBER.textContent > 20) SET_NUMBER.textContent = 20;
});
ARROW_DOWN.addEventListener("click", function () {
  if (--SET_NUMBER.textContent < 3) SET_NUMBER.textContent = 2;
});
HOW_TO_PLAY_btn.addEventListener("click", function () {
  configuration.classList.add("display-none");
  HOW_TO_PLAY_container.classList.remove("display-none");
  message_start.style.width = "85%";
  VIDEO1.play();

  VIDEO1.onended = function () {
    return VIDEO1.play();
  };
});
ARROW_LEFT.addEventListener("click", function () {
  if (currentVideo === 3) {
    ARROW_RIGHT.classList.toggle("arrows_right_passive");
    VIDEO2.classList.toggle("display-none");
    VIDEO3.classList.toggle("display-none");
    VIDEO2.play();

    VIDEO2.onended = function () {
      return VIDEO2.play();
    };

    DESCRIPTION.textContent = "When the third drop of water touches the sea, the game is over.";
    currentVideo = 2;
    return;
  }

  if (currentVideo === 2) {
    ARROW_LEFT.classList.toggle("arrows_left_passive");
    VIDEO2.pause();
    VIDEO2.currentTime = 0;
    VIDEO1.classList.toggle("display-none");
    VIDEO2.classList.toggle("display-none");
    VIDEO1.play();

    VIDEO1.onended = function () {
      return VIDEO2.play();
    };

    DESCRIPTION.textContent = "You must enter the value of the expression before the drop falls into the sea.";
    currentVideo = 1;
    return;
  }
});
ARROW_RIGHT.addEventListener("click", function () {
  if (currentVideo === 1) {
    ARROW_LEFT.classList.toggle("arrows_left_passive");
    VIDEO1.pause();
    VIDEO1.currentTime = 0;
    VIDEO1.classList.toggle("display-none");
    VIDEO2.classList.toggle("display-none");
    VIDEO2.play();

    VIDEO2.onended = function () {
      return VIDEO2.play();
    };

    DESCRIPTION.textContent = "When the third drop of water touches the sea, the game is over.";
    currentVideo = 2;
    return;
  }

  if (currentVideo === 2) {
    ARROW_RIGHT.classList.toggle("arrows_right_passive");
    VIDEO2.pause();
    VIDEO2.currentTime = 0;
    VIDEO2.classList.toggle("display-none");
    VIDEO3.classList.toggle("display-none");
    DESCRIPTION.textContent = "You can use the keyboard to play the game.";
    currentVideo = 3;
    return;
  }
});