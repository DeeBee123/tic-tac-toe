class Game {
  static boardUI;
  static scoreUI;
  static score1 = JSON.parse(localStorage.getItem("player1")) ?? 0;
  static score2 = JSON.parse(localStorage.getItem("player2")) ?? 0;
  static turn = JSON.parse(localStorage.getItem("turn")) ?? 1;
  static player1 = [];
  static player2 = [];
  static notEnd = true;

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
  static #clickMethod(element, i) {
    this.#checked(element, i);
  }

  static #addKeyControl() {
    // window.addEventListener('keyDown', )
    //
    this.boardUI.querySelectorAll("span").forEach((element, i) => {
      element.addEventListener("click", function markOnce() {
        console.log(Game.notEnd);
        if (Game.notEnd) {
          Game.#clickMethod(element, i);
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

  static #checked(element, i) {
    //onClick or spaceBar
    //check if have not yet pressed

    if (this.turn === 1) {
      element.classList.add("player1");
      this.player1.push(i);
      if (this.player1.length > 2) {
        this.#checkIfWon(this.player1);
      }
      this.turn = 2;
      this.#dynamicUI();
    } else if (this.turn === 2) {
      element.classList.add("player2");
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
