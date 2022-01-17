const API_URL = "https://api.memory.lyliya.fr";
const PLAY_TIME = 1;
const MAX_PAIR = 18;
let game_started = false;
let difficulty = 9;
let last_tile = null;
let found_pair = 0;
let start_time;
let board;
let timer_animation;
let end_timeout = null;
let duration = null;

// Shuffle an array using Durstenfeld shuffle
Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

const setDifficulty = pair => {
  difficulty = pair;
  start();
};

// Generate an array with X pair
const generateArray = (pair_nb = 1) => {
  // If ask too few pair, set a default to 1 (really easy game)
  if (pair_nb < 1) {
    pair_nb = 1;
  }
  // If ask too many pair, set a default to MAX_PAIR
  if (pair_nb > MAX_PAIR) {
    pair_nb = MAX_PAIR;
  }

  // Push every pair in array
  let array = [];
  for (let i = 0; i < pair_nb; i++) {
    array.push(i, i);
  }

  // Shuffle the array
  return array.shuffle();
};

// Win handler
const win = () => {
  game_started = false;
  timer_animation.pause();
  const end = new Date();
  duration = end.getTime() - start_time.getTime();
  document.querySelector(".modal").style.visibility = "visible";
  console.log("Game last", duration, "ms");
};

// Loose handler
const loose = () => {
  game_started = false;
  const tiles = document.querySelectorAll(`.tile`);
  for (const tile of tiles) {
    tile.onclick = null;
    if (!tile.style.backgroundImage) {
      tile.style.backgroundImage = `url(./assets/tile${
        board[tile.dataset.pos]
      }.png)`;
      tile.classList.add("failed");
    }
  }
};

const checkPair = tile => {
  // If click same tiles twice, do nothing
  if (last_tile && tile.dataset.pos == last_tile.dataset.pos) return;

  const tmp = last_tile;

  // Show tile background on click
  tile.style.backgroundImage = `url(./assets/tile${
    board[tile.dataset.pos]
  }.png)`;

  // If first tile of the pair, save it
  if (last_tile === null) {
    last_tile = tile;
  } else {
    if (board[last_tile.dataset.pos] == board[tile.dataset.pos]) {
      // Get same pair
      last_tile.onclick = null;
      tile.onclick = null;
      found_pair += 1;
      if (found_pair == board.length / 2) {
        win();
      }
    } else {
      // Failed attempt
      setTimeout(() => {
        tile.style.backgroundImage = "";
        tmp.style.backgroundImage = "";
      }, 1000);
    }
    last_tile = null;
  }
};

const displayBoard = () => {
  const boardContainer = document.querySelector(".board-container");
  // Clear the board
  boardContainer.innerHTML = "";

  // Create the first row
  let row = document.createElement("div");
  row.classList.add("row-container");

  for (let i = 0; i < board.length; i++) {
    // Separate the tile in 4 rows, creating new one if needed
    if (i != 0 && i % (board.length / 4) == 0) {
      boardContainer.appendChild(row);
      row = document.createElement("div");
      row.classList.add("row-container");
    }

    // Create tile element
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.pos = i;

    // Handle tile click
    tile.onclick = () => {
      if (!game_started) startTimer();
      tile.style.backgroundImage = `url(./assets/tile${board[i]}.png)`;
      checkPair(tile);
    };

    row.appendChild(tile);
  }

  boardContainer.appendChild(row);
};

// Start timer at beginning of the game, handle timeout for running out of time
const startTimer = () => {
  game_started = true;
  start_time = new Date();
  timer_animation = anime({
    targets: ".timer",
    easing: "linear",
    width: 0,
    duration: PLAY_TIME * 60 * 1000
  });
  end_timeout = setTimeout(loose, PLAY_TIME * 60 * 1000);
};

const start = () => {
  // Reset the game and generate a new board
  document.querySelector(".modal").style.visibility = "hidden";
  if (timer_animation) timer_animation.pause();
  if (end_timeout) clearTimeout(end_timeout);
  game_started = false;
  found_pair = 0;
  last_tile = null;
  board = generateArray(difficulty);
  document.querySelector(".timer").style.width = "100%";

  // Show the board on screen
  displayBoard();
};

const genLeaderboardList = (array, element) => {
  element.innerHTML = "";
  for (const time of array) {
    const li = document.createElement("li");
    li.innerHTML = `${time.username} - ${(time.time / 1000).toFixed(2)}s`;
    element.appendChild(li);
  }
};

const getLeaderboard = async () => {
  const res = await fetch(`${API_URL}/leaderboard`);

  const leaderboard = await res.json();
  const easyList = document.querySelector("#easy");
  const mediumList = document.querySelector("#medium");
  const hardList = document.querySelector("#hard");
  const impossibleList = document.querySelector("#impossible");

  if (leaderboard["5"]) {
    genLeaderboardList(leaderboard["5"], easyList);
  }

  if (leaderboard["9"]) {
    genLeaderboardList(leaderboard["9"], mediumList);
  }

  if (leaderboard["18"]) {
    genLeaderboardList(leaderboard["18"], hardList);
  }

  if (leaderboard["1"]) {
    genLeaderboardList(leaderboard["1"], impossibleList);
  }
};

const sendScore = async () => {
  const username = document.querySelector("#username").value;
  if (!username) {
    document.querySelector("#log").innerHTML = "Username is empty";
    return;
  }
  if (!duration) {
    document.querySelector("#log").innerHTML = "No score found";
    return;
  }
  const body = {
    username,
    score: duration,
    difficulty
  };
  await fetch(`${API_URL}/leaderboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  getLeaderboard();
  exitModal();
};

const exitModal = () => {
  document.querySelector(".modal").style.visibility = "hidden";
  document.querySelector("#username").value = "";
};

window.onload = () => {
  start();
  getLeaderboard();
};
