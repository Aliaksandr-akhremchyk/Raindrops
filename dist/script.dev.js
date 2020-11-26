"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//Buttons
var PLAY_START_btn = document.querySelector(".play-start");
var OPTIONS_btn = document.querySelector(".options");
var HOW_TO_PLAY_btn = document.querySelector(".how-to-play");
var OPTIONS_DURING_GAME_btn = document.querySelector(".start-button");
var END_btn = document.querySelector(".end-button");
var FULL_SCREEN_btn = document.querySelector(".fullScreenBtn");
var PLAY_AGAIN_btn = document.querySelector(".confirm");
var OVERLAY_start = document.querySelector(".overlay-start");
var MESSAGE_start = document.querySelector(".message-start");
var configuration = document.querySelector(".configuration");
var ARROW_UP = document.querySelector(".arrows_up");
var ARROW_DOWN = document.querySelector(".arrows_down");
var OPERATORS_check = document.querySelectorAll(".operator_check");
var SET_NUMBER = document.querySelector(".arrows_set-number");
var HOW_TO_PLAY_container = document.querySelector(".how-to-play_container");
var ARROW_LEFT = document.querySelector(".arrows_left");
var ARROW_RIGHT = document.querySelector(".arrows_right");
var DESCRIPTION = document.querySelector(".description");
var VIDEO_1 = document.querySelector(".video1");
var VIDEO_2 = document.querySelector(".video2");
var VIDEO_3 = document.querySelector(".video3");
var GAME = document.querySelector("body");
var WAVE = document.querySelector(".wave");
var SCORE = document.querySelector(".score");
var CALC_PANEL = document.querySelector(".calc-panel__battons");
var CALC_SCREEN = document.querySelector(".calc-panel__screen");
var CALC_BTNS = document.querySelectorAll(".calc-panel__battons_batton");
var OVERLAY_end = document.querySelector(".overlay-end");
var MESSAGE_end = document.querySelector(".message_end h2");
var FAIL_sound = new Audio("./assets/sounds/fail.mp3");
var SMALL_FAIL_sound = new Audio("./assets/sounds/smallfail.mp3");
var VICTORY_sound = new Audio("./assets/sounds/pobeda.mp3");
var DROP_sound = new Audio("./assets/sounds/kap.mp3");
var SEA_sound = new Audio("./assets/sounds/sea.mp3");

SEA_sound.onended = function () {
  return SEA_sound.play();
};

var currentVideo = 1;
var START_NUMBER = 1;
var END_NUMBER = 4;
var TIME_FOR_ONE_DRO_PFOLLEN = 10; // in sec

var INTERVAL_FOR_DROP_FOLLEN = 7; // in sec

var INTERVAL_FOR_DROP_OPACITY = 1; // in sec

var NUMBERS_OF_DROPS_FOR_BONUS = 10;
var COMPLEXITY_INDEX = 0.9; // from 0 to 1

var OPERATORS = ["+", "–", "÷", "x"];
var isGamePlayed = false;
var lastDropLean = 0;
var currentDrops = [];
var inxDrop = 0;
var countWinDrop = 0;
var counWrongEnter = 0;
var currentOperators = [];
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

  var DROPS = document.querySelectorAll(".drop");
  DROPS.forEach(function (drop) {
    return dropQuickDown(drop);
  });
  WAVE.style.height = "".concat(12 + 20 * numberOfFeils, "%");
  clearInterval(game);
  game = setInterval(createDrop, currentDROPFollenInterval * 1000);
  SMALL_FAIL_sound.currentTime = 0;
  SMALL_FAIL_sound.play();
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

  if (inxDrop % NUMBERS_OF_DROPS_FOR_BONUS === 0) {
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
  operator = currentOperators[randomAll(0, currentOperators.length - 1)];

  if (operator == "+") {
    firstNumder = randomAll(START_NUMBER, END_NUMBER);
    secondNumber = randomAll(START_NUMBER, END_NUMBER);
    result = firstNumder + secondNumber;
  }

  if (operator == "–") {
    firstNumder = randomAll(START_NUMBER, END_NUMBER);
    secondNumber = randomAll(START_NUMBER, END_NUMBER);
    var max = Math.max(firstNumder, secondNumber);
    var min = Math.min(firstNumder, secondNumber);
    firstNumder = max;
    secondNumber = min;
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
  var i = 0;
  OPERATORS_check.forEach(function (operator) {
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
  var idx = randomAll(1, leans);

  if (idx === lastDropLean) {
    return randomLean(leans);
  }

  lastDropLean = idx;
  return idx;
}

function enterGoal() {
  if (!isGamePlayed) return;
  var DROPS = document.querySelectorAll(".drop");

  for (var i = DROPS.length - 1; i >= 0; --i) {
    if (DROPS[i].dataset.bonus && DROPS[i].dataset.goal == CALC_SCREEN.textContent) {
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
  SCORE.textContent = +SCORE.textContent - coint < 0 ? "" : +SCORE.textContent - coint;
  DROP_sound.currentTime = 0;
  DROP_sound.play();
  ++counWrongEnter;
}

function setBonus(drops) {
  drops.forEach(function (drop) {
    return dropQuickDown(drop);
  });
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
  setTimeout(function () {
    drop.style.top = drop.getBoundingClientRect().top + 900 + "px";
    drop.style.transition = "".concat(INTERVAL_FOR_DROP_OPACITY, "s all ease-in");
    drop.style.opacity = 0;
  }, 10);
  setTimeout(drop.remove.bind(drop), INTERVAL_FOR_DROP_OPACITY * 1000);
}

function keydown(e) {
  CALC_BTNS.forEach(function (btn) {
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

  MESSAGE_end.innerHTML = resultMessage;
  OVERLAY_end.removeEventListener("transitionend", setDisplayNone);
  OVERLAY_end.classList.remove("display-none");
  setTimeout(function () {
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

OPTIONS_DURING_GAME_btn.addEventListener("mousedown", function () {
  endGame("End without message");
  OVERLAY_start.removeEventListener("transitionend", setDisplayNone);
  OVERLAY_start.classList.remove("display-none");
  setTimeout(function () {
    OVERLAY_start.classList.remove("opacity-null");
  }, 10);
  configuration.classList.remove("display-none");
  HOW_TO_PLAY_container.classList.add("display-none");
  MESSAGE_start.style.width = "";
});
PLAY_START_btn.addEventListener("click", function () {
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
PLAY_AGAIN_btn.addEventListener("click", function () {
  OVERLAY_end.classList.add("opacity-null");
  OVERLAY_end.addEventListener("transitionend", setDisplayNone);
  startGame();
});
FULL_SCREEN_btn.addEventListener("click", function (e) {
  if (e.clientX === 0) return;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else GAME.requestFullscreen();
});
END_btn.addEventListener("click", endGame);
OPTIONS_btn.addEventListener("click", function () {
  configuration.classList.remove("display-none");
  HOW_TO_PLAY_container.classList.add("display-none");
  MESSAGE_start.style.width = "";
});
HOW_TO_PLAY_btn.addEventListener("click", function () {
  configuration.classList.add("display-none");
  HOW_TO_PLAY_container.classList.remove("display-none");
  MESSAGE_start.style.width = "85%";
  VIDEO_1.play();

  VIDEO_1.onended = function () {
    return VIDEO_1.play();
  };
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
CALC_PANEL.addEventListener("click", function (e) {
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
ARROW_UP.addEventListener("click", function () {
  if (++SET_NUMBER.textContent > 20) SET_NUMBER.textContent = 20;
});
ARROW_DOWN.addEventListener("click", function () {
  if (--SET_NUMBER.textContent < 3) SET_NUMBER.textContent = 2;
});
ARROW_LEFT.addEventListener("click", function () {
  if (currentVideo === 3) {
    ARROW_RIGHT.classList.toggle("arrows_right_passive");
    VIDEO_2.classList.toggle("display-none");
    VIDEO_3.classList.toggle("display-none");
    VIDEO_2.play();

    VIDEO_2.onended = function () {
      return VIDEO_2.play();
    };

    DESCRIPTION.textContent = "When the third drop of water touches the sea, the game is over.";
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

    VIDEO_1.onended = function () {
      return VIDEO_2.play();
    };

    DESCRIPTION.textContent = "You must enter the value of the expression before the drop falls into the sea.";
    currentVideo = 1;
    return;
  }
});
ARROW_RIGHT.addEventListener("click", function () {
  if (currentVideo === 1) {
    ARROW_LEFT.classList.toggle("arrows_left_passive");
    VIDEO_1.pause();
    VIDEO_1.currentTime = 0;
    VIDEO_1.classList.toggle("display-none");
    VIDEO_2.classList.toggle("display-none");
    VIDEO_2.play();

    VIDEO_2.onended = function () {
      return VIDEO_2.play();
    };

    DESCRIPTION.textContent = "When the third drop of water touches the sea, the game is over.";
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