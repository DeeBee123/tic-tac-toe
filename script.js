//import and extend GameUI

class Game {
  static boardUI;
  static scoreUI;
  static score1 = JSON.parse(localStorage.getItem("player1")) ?? 0;
  static score2 = JSON.parse(localStorage.getItem("player2")) ?? 0;
  static turn = JSON.parse(localStorage.getItem("turn")) ?? 1;
  static player1 = [];
  static player2 = [];
  static notEnd = true;
  static index = 0;

  static startGame() {
    this.#drawBoard();
    this.#addKeyControl();
  }

  static #drawBoard() {
    const body = document.querySelector("body");
    const boardDiv = document.createElement("div");
    boardDiv.classList = "board";
    this.boardUI = boardDiv;
    Array.from({ length: 9 }, (_) => {
      const boardSpan = document.createElement("span");
      this.boardUI.appendChild(boardSpan);
    });
    body.appendChild(this.boardUI);
    this.scoreUI = document.querySelector(".score");
    const dotTurn = document.createElement("span");
    dotTurn.innerText = ".";
    this.scoreUI.innerText = `${this.score1}:${this.score2}`;
    this.scoreUI.appendChild(dotTurn);
    this.#dynamicUI();
  }
  static #drawRestart(draw) {
    const body = document.querySelector("body");
    const btnRestart = document.createElement("button");
    btnRestart.innerText = "PLAY AGAIN";
    btnRestart.addEventListener("click", () => location.reload());
    if (!draw) {
      const congrats = document.createElement("div");
      congrats.innerText = `Well done player${this.turn} !`;
      body.appendChild(congrats);
    }

    body.appendChild(btnRestart);
  }

  static #dynamicUI() {
    if (this.turn === 1) {
      this.scoreUI.classList.remove("player2");
    } else if (this.turn === 2) {
      this.scoreUI.classList.add("player2");
    } else {
      this.scoreUI.classList.remove("score");
    }
  }

  static #addKeyControl() {
    const allowedKeys = [
      "w",
      "s",
      "d",
      "a",
      "ArrowUp",
      "ArrowLeft",
      "ArrowDown",
      "ArrowRight",
      " ",
    ];
    window.addEventListener(
      "keydown",
      (e) => allowedKeys.includes(e.key) && this.#keyDown(e.key)
    );

    this.boardUI.querySelectorAll("span").forEach((element, i) => {
      console.log(element);
      element.classList.remove("notChecked");
      element.addEventListener("click", function markOnce() {
        console.log(Game.notEnd);
        if (Game.notEnd) {
          Game.#checked(element, i);
        }
        Game.#removeControl(markOnce);
      });
    });
  }

  static #removeControl(fnName) {
    this.boardUI.querySelectorAll("span").forEach((element, i) => {
      element.removeEventListener("click", fnName);
    });
  }

  static #keyDown(key, element, i) {
    const allsquares = document.querySelectorAll(".board span");
    const emptysquares = document.querySelectorAll(".board span:not(.checked)");
    console.log(emptysquares);
    let prevIndex = this.index;

    switch (key) {
      case "ArrowLeft":
      case "a":
        if (this.index === 0) {
          this.index = emptysquares.length - 1;
          prevIndex = 0;
        } else this.index--;
        emptysquares[this.index].classList.add("notChecked");
        emptysquares[this.index].classList.add(`player${this.turn}`);
        emptysquares[prevIndex].classList.remove(`notChecked`);
        emptysquares[prevIndex].classList.remove(`player1`);
        emptysquares[prevIndex].classList.remove(`player2`);
        break;
      case "ArrowRight":
      case "d":
        if (allsquares.length - 1 <= this.index) {
          this.index = 0;
          prevIndex = allsquares.length - 1;
        } else this.index++;
        emptysquares[this.index].classList.add("notChecked");
        emptysquares[this.index].classList.add(`player${this.turn}`);
        emptysquares[prevIndex].classList.remove(`notChecked`);
        emptysquares[prevIndex].classList.remove(`player1`);
        emptysquares[prevIndex].classList.remove(`player2`);
        break;
      case "ArrowUp":
      case "w":
        console.log(this.index)
        if (this.index <= 2) {
          prevIndex = this.index;
          this.index += 6;
          console.log(this.index)
        } else {this.index -= 3;}

        console.log([...emptysquares].indexOf(allsquares[this.index]))
        if ([...emptysquares].indexOf(allsquares[this.index]) || [...emptysquares].indexOf(allsquares[this.index]) ===0) {
          allsquares[this.index].classList.add("notChecked");
          allsquares[this.index].classList.add(`player${this.turn}`);
        }
        if ([...emptysquares].indexOf(allsquares[prevIndex])|| [...emptysquares].indexOf(allsquares[prevIndex]) ===0) {
          console.log(emptysquares)
          allsquares[prevIndex].classList.remove(`notChecked`);
          allsquares[prevIndex].classList.remove(`player1`);
          allsquares[prevIndex].classList.remove(`player2`);
        }

        break;
      case "ArrowDown":
      case "s":
        if (this.index >= 6) {
          prevIndex = this.index;
          this.index -= 6;
        } else this.index += 3;
        allsquares[this.index].classList.add("notChecked");
        allsquares[this.index].classList.add(`player${this.turn}`);
        allsquares[prevIndex].classList.remove(`notChecked`);
        allsquares[prevIndex].classList.remove(`player1`);
        allsquares[prevIndex].classList.remove(`player2`);
        break;

      case " ":
        emptysquares[this.index].classList.remove("notChecked");
        let i = [...allsquares].indexOf(emptysquares[this.index]);
        Game.#checked(emptysquares[this.index], i);
        this.index = 0;
        console.log("checked");
        break;
      default:
        console.log("unpredictable action");
    }
  }

  static #checked(element, i) {
    console.log(element);
    //onClick or spaceBar
    //check if have not yet pressed

    if (this.turn === 1) {
      element.classList.add("player1");
      element.classList.add("checked");
      this.player1.push(i);
      if (this.player1.length > 2) {
        this.#checkIfWon(this.player1);
      }
      this.turn = 2;
      this.#dynamicUI();
    } else if (this.turn === 2) {
      element.classList.add("player2");
      element.classList.add("checked");
      this.player2.push(i);
      if (this.player2.length > 2) {
        this.#checkIfWon(this.player2);
      }
      this.turn = 1;
      this.#dynamicUI();
    } else {
      //end game
    }
  }
  static #checkIfWon(combinations) {
    //winning scenarios
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let count = 0;
    winCombinations.forEach((combArr) => {
      if (count !== 3) {
        combArr.forEach((el) => combinations.includes(el) && count++);
        if (count === 3) {
          this.#endGame("win");
          this.#removeControl();
          return;
        } else {
          count = 0;
        }
      }
    });
    if (this.player1.length + this.player2.length === 9) {
      Game.notEnd = false;
      this.#endGame("end");
    }
  }

  static #endGame(outcome) {
    console.log(outcome);
    if (outcome === "win") {
      console.log("WON player" + this.turn);
      if (this.turn === 1) {
        console.log(outcome);
        this.score1 += 1;
        // this.#removeKeyControl();
        Game.notEnd = false;
        this.#drawRestart();
        localStorage.setItem("player1", this.score1);
        localStorage.setItem("turn", 2);
        return;
      }
      if (this.turn === 2) {
        console.log(outcome);
        this.score2 += 1;
        localStorage.setItem("player2", this.score2);
        localStorage.setItem("turn", 1);
        // this.#removeKeyControl();
        Game.notEnd = false;
        this.#drawRestart();
        return;
      }
    }
    if (outcome === "end") {
      console.log("end of game");
      console.log(this.turn);
      Game.notEnd = false;
      this.#drawRestart("draw");
      return;
    }
  }
}

Game.startGame();
