class Game {
  static boardUI;
  static scoreUI;
  static score1 = 0;
  static score2 = 0;
  static turn = 1;
  static player1 = [];
  static player2 = [];

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

  static #dynamicUI() {
    if (this.turn === 1) {
      this.scoreUI.classList.remove("player2");
    } else if (this.turn === 2) {
      this.scoreUI.classList.add("player2");
    } else {
      //end game
    }
  }

  static #addKeyControl() {
    // window.addEventListener('keyDown', )
    //
    this.boardUI.querySelectorAll("span").forEach((element, i) => {
      element.addEventListener("click", () => this.#checked(element, i));
    });
  }
  static #checked(element, i) {
    //onClick or spaceBar
    if (this.turn === 1) {
      element.classList.add("player1");
      this.player1.push(i);
      this.#checkIfWon(this.player1) ||
      this.player1.length + this.player2.length === 9
        ? console.log("end game")
        : (this.turn = 2);
      this.#dynamicUI();
    } else if (this.turn === 2) {
      element.classList.add("player2");
      this.player2.push(i);
      this.#checkIfWon(this.player1) ||
      this.player1.length + this.player2.length === 9
        ? console.log("end game")
        : (this.turn = 1);
      this.#dynamicUI();
    } else {
      //end game
    }

    this.#checkIfWon();
  }
  static #checkIfWon() {
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
  }
}

Game.startGame();
