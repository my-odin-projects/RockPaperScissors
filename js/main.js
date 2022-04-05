// Rock Paper Scissors
// Request user for number of games
// Request customer selection
// opponent selection

let items = [
  { name: "ROCK", losesTo: "PAPER", src: "./img/rock.svg" },
  { name: "PAPER", losesTo: "SCISSORS", src: "./img/paper.svg" },
  { name: "SCISSORS", losesTo: "ROCK", src: "./img/scissors.svg" },
];

const PLAYER = "PLAYER";
const OPPONENT = "OPPONENT";
const TIE = "TIE";
const WAITING_OPPONENT = "Waiting for opponent...";
const YOUR_PICK = "Take your Pick...";
const OPPONENT_SELECTED = "Opponent made a pick";
const PLAYER_SELECTED = "You made a pick";
const YOU_WIN_STATUS = "YOU WIN !";
const OPPONENT_WIN_STATUS = "OPPONENT WINS !";
const GAME_ON_STATUS = "GAME ON !";

let images = Array.from(document.querySelectorAll(".img-selection"));

let modal = document.querySelector(".modal");
let resultText = document.querySelector(".resultText");
let close = document.querySelector(".close");
let ellipsis = document.querySelector(".lds-ellipsis");
let checkMark = document.querySelector(".check-mark");
let opponentSelectionStatus = document.querySelector("#opponent-status");
let playerSelectionStatus = document.querySelector("#player-status");
let resultContent = document.querySelector(".result-content");
let roundElement = document.querySelector(".round");
let opponentSelectionElement = document.querySelector(".opponent .selections");

close.addEventListener("click", (e) => {
  closeResultModal();
});

window.addEventListener("click", (e) => {
  if (e.target == modal) {
    closeResultModal();
  }
});

images.forEach((image) =>
  image.addEventListener("click", (e) => {
    let playerSelection = e.target.dataset.playerSelection;
    game.playerSelection = items.find(
      (item) => item.name == playerSelection.toUpperCase()
    );
    playerSelectionStatus.textContent = PLAYER_SELECTED;
    hideUnselectedImg(e.target);
    displayResult();
  })
);

class Player {
  #name;
  #wins;

  constructor(name) {
    this.#name = name;
    this.#wins = 0;
  }

  roundWinner() {
    this.#wins += 1;
  }

  get wins() {
    return this.#wins;
  }

  set selection(selection) {
    this._selection = selection;
  }

  get selection() {
    return this._selection;
  }

  get name() {
    return this.#name;
  }
}

class Game {
  #totalRounds;
  #player;
  #opponent;

  constructor(totalRounds, playerName, ...players) {
    this.#totalRounds = totalRounds;
    this.#player = new Player(PLAYER);
    this.#opponent = new Player(OPPONENT);
    this.round = 0;
  }

  set opponentSelection(selection) {
    this.#opponent.selection = selection;
  }

  set playerSelection(selection) {
    this.#player.selection = selection;
  }

  get opponentSelection() {
    return this.#opponent.selection;
  }

  get playerSelection() {
    return this.#player.selection;
  }

  get totalRounds() {
    return this.#totalRounds;
  }

  determineWinner() {
    console.log("Player Selection " + this.playerSelection.name);
    console.log("opponent Selection " + this.opponentSelection.name);
    let playerSelectionLosesTo = this.playerSelection.losesTo;
    let opponentSelectionLosesTo = this.opponentSelection.losesTo;
    if (this.playerSelection.name == opponentSelectionLosesTo) {
      this.#player.roundWinner();
      return this.#player;
    }
    if (this.opponentSelection.name == playerSelectionLosesTo) {
      this.#opponent.roundWinner();
      return this.#opponent;
    }
    return null;
  }
}

let hideUnselectedImg = (selectedImg) => {
  images
    .filter((image) => image != selectedImg)
    .forEach((img) => (img.style.display = "none"));
};

let resetImg = () => {
  images.forEach((img) => (img.style.display = "block"));
};

let startRound = async () => {
  game.opponentSelection = null;
  game.playerSelection = null;
  game.round++;
  resetImg();
  hideOpponentSelection();
  roundElement.textContent = "ROUND - " + game.round;
  hideCheckMark();
  enableLoading();
  resultContent.textContent = GAME_ON_STATUS;
  opponentSelectionStatus.textContent = WAITING_OPPONENT;
  playerSelectionStatus.textContent = YOUR_PICK;
  game.opponentSelection = await triggeropponentSelection(2000);
  opponentSelectionStatus.textContent = OPPONENT_SELECTED;
  hideLoading();
  enableCheckMark();
  displayResult();
};

let assignStar = (winner) => {
  let star = document.querySelector(`#${winner.name}star${winner.wins - 1}`);
  star.innerHTML = "&#11088;";
};

let resetStars = (player) => {
  console.log(game.totalRounds);
  let playerStars = document.querySelector(".player .stars");
  let opponentStars = document.querySelector(".opponent .stars");
  createStars(playerStars, PLAYER);
  createStars(opponentStars, OPPONENT);
};

let createStars = (parentElement, elementPrefix) => {
  for (let i = 0; i < game.totalRounds; i++) {
    let starSpan = document.createElement("span");
    starSpan.innerHTML = "&#9734;";
    starSpan.setAttribute("id", `${elementPrefix}star${i}`);
    // image.setAttribute("id", "opponent-selection-img");
    parentElement.appendChild(starSpan);
  }
};

let createImage = (src) => {
  let image = document.createElement("img");
  image.classList.add = "img-selection";
  image.setAttribute("src", src);
  image.setAttribute("id", "opponent-selection-img");
  opponentSelectionElement.appendChild(image);
};

let displayOpponentSelection = (opponentSelection) => {
  hideCheckMark();
  let oppSelImg = document.querySelector("#opponent-selection-img");
  if (!oppSelImg) {
    oppSelImg = createImage(opponentSelection.src);
  } else {
    oppSelImg.style.display = "block";
    oppSelImg.setAttribute("src", opponentSelection.src);
  }
};

let hideOpponentSelection = () => {
  let oppSelImg = document.querySelector("#opponent-selection-img");
  if (oppSelImg) {
    oppSelImg.style.display = "none";
  }
};

let displayResult = () => {
  if (game.opponentSelection && game.playerSelection) {
    displayOpponentSelection(game.opponentSelection);
    let winner = game.determineWinner();
    let text = TIE;
    if (winner) {
      assignStar(winner);
      text = winner.name == PLAYER ? YOU_WIN_STATUS : OPPONENT_WIN_STATUS;
    }

    // modal.style.display = "block";
    // resultText.textContent = text;
    resultContent.textContent = text;
    if (winner && winner.wins == game.totalRounds) {
      displayModal(winner);
    } else {
      triggerNextRound(1000);
    }
  }
};

let displayModal = (winner) => {
  if (winner.name == PLAYER) {
    resultText.innerHTML =
      "<div class='resultTextString'>Congratulations !!! You beat the shit out of your opponent !!!</div>";
  } else {
    resultText.innerHTML =
      "<div class='resultTextString'>LOSER !!! Your Opponent is the SUPERIOR being than you are</div>";
  }
  modal.style.display = "block";
};

let closeResultModal = () => {
  modal.style.display = "none";
  resetForm();
};

let resetForm = () => {
  location.reload(true);
};

let triggeropponentSelection = async (delay) => {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(items[Math.floor(Math.random() * items.length)]),
      delay
    )
  );
};

let triggerNextRound = async (delay) => {
  return setTimeout(() => Promise.resolve(startRound()), delay);
};

let enableCheckMark = () => {
  checkMark.style.display = "block";
};

let enableLoading = () => {
  ellipsis.style.display = "block";
};

let hideLoading = () => {
  ellipsis.style.display = "none";
};

let hideCheckMark = () => {
  checkMark.style.display = "none";
};

let game = new Game(3, "Agatha");
resetStars();
startRound();
