function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + Math.pow(2, tile.value.toString().length), positionClass];

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = this.numberToWord(tile.value);

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.numberToWord = function(number) {
  var word;
  switch(number) {
    case 1: word = "幺"; break;
    case 2: word = "言"; break;
    case 3: word = "長"; break;
    case 4: word = "馬"; break;
    case 5: word = "月"; break;
    case 6: word = "刂"; break;
    case 7: word = "穴"; break;
    case 8: word = "心"; break;
    case 9: word = "辶"; break;
    case 11: word = "𢆶"; break;
    case 112: word = "A"; break; // 幺言幺
    case 112334: word = "C"; break; // 幺言幺長馬長
    case 1123345: word = "D"; break; // 月幺言幺長馬長
    case 11233456: word = "F"; break; // 月幺言幺長馬長刂
    case 112334567: word = "G"; break; // 穴月幺言幺長馬長刂
    case 1123345678: word = "I"; break; // 穴月幺言幺長馬長刂心
    case 11233456789: word = "𰻞"; break;
    case 112334568: word = "H"; break; // 月幺言幺長馬長刂心
    case 1123346: word = "E"; break; // 幺言幺長馬長刂
    case 1133: word = "K"; break; // 幺幺長長
    case 12: word = "a"; break; // ⿰言幺
    case 1234: word = "J"; break; // 言幺馬長
    case 126: word = "b"; break; // ⿰言㓜
    case 13: word = "𰿋"; break;
    case 146: word = "c"; break; // ⿰馬㓜
    case 15: word = "𦘷"; break;
    case 16: word = "㓜"; break;
    case 167: word = "d"; break; // ⿱穴㓜
    case 168: word="e"; break; // ⿰忄㓜
    case 22: word = "誩"; break;
    case 222: word = "譶"; break;
    case 2222: word = "𧮦"; break;
    case 23: word = "䛫"; break;
    case 24: word = "𧪨"; break;
    case 25: word = "䚴"; break;
    case 26: word = "䚯"; break;
    case 27: word = "䛎"; break;
    case 28: word = "悥"; break;
    case 29: word = "這"; break;
    case 33: word = "𨲍"; break;
    case 334: word = "B"; break; // 長馬長
    case 34: word = "𮪉"; break;
    case 35: word = "脹"; break;
    case 37: word = "f"; break; // ⿱穴長
    case 38: word = "悵"; break;
    case 39: word = "g"; break; // ⿺辶長
    case 44: word = "騳"; break;
    case 444: word = "驫"; break;
    case 45: word = "𩢋"; break;
    case 47: word = "𥧓"; break;
    case 48: word = "𢟀"; break;
    case 49: word = "遤"; break;
    case 55: word = "朋"; break;
    case 555: word = "𦜳"; break;
    case 5555: word = "朤"; break;
    case 56: word = "刖"; break;
    case 57: word = "𦙮"; break;
    case 58: word = "𦙦"; break;
    case 59: word = "迌"; break;
    case 66: word = "𠚥"; break;
    case 67: word = "𡧋"; break;
    case 68: word = "𰄜"; break;
    case 69: word = "辺"; break;
    case 77: word = "h"; break; // ⿱穴穴
    case 78: word = "𥥁"; break;
    case 88: word = "𢗰"; break;
    case 888: word = "惢"; break;
    case 89: word = "i"; break; // ⿺辶心
    default: word = number;
  }
  return word;
}
