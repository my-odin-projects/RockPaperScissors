// Rock Paper Scissors
// Request user for number of games
// Request customer selection
// Computer selection

let items = [
  { name: "ROCK", losesTo: "PAPER" },
  { name: "PAPER", losesTo: "SCISSORS" },
  { name: "SCISSORS", losesTo: "ROCK" },
];

function computerSelection() {}

function playerSelectionFun() {
  let playerSelection = prompt("Select -> Rock, Paper, Scissors");
  let playerSelectionItem = items.find(
    (item) => item.name == playerSelection.toUpperCase()
  );
  if (playerSelectionItem) {
    return playerSelectionItem;
  } else {
    alert("Invalid choice.. Select Rock, Paper , Scissors");
    let tryAgain = confirm("Do you want to try again ? ");
    if (tryAgain) {
      return playerSelectionFun();
    }
  }
}

function checkWinner(playerSelection, computerSelection) {
  let playerSelectionLosesTo = playerSelection.losesTo;
  let computerSelectionLosesTo = computerSelection.losesTo;
  if (playerSelection.name == computerSelectionLosesTo) {
    return `You Won ! ${playerSelection.name} beat ${computerSelection.name}`;
  }
  if (computerSelection.name == playerSelectionLosesTo) {
    return `You Lost ! ${computerSelection.name} beat ${playerSelection.name}`;
  }

  return `Draw ! ${computerSelection.name} == ${playerSelection.name}`;
}

function playRound() {
  let playerSelection = playerSelectionFun();
  let computerSelection = items[Math.floor(Math.random() * items.length)];
  return checkWinner(playerSelection, computerSelection);
}

let game = () => {
  let noOfGames = prompt("How many games would you like to play", 5);
  for (let i = 1; i <= noOfGames; i++) {
    console.log(`Round ${i} :::::: ${playRound()}`);
  }
};

game();
