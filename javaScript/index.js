let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("eat.mp3");
const moveSound = new Audio("move1.wav");
const coinSound = new Audio("coin.wav");
const gameOverSound = new Audio("gameOver.mp3");
let speed = 10;
let score = 0;
let highScoreVal = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 3, y: 4 };
let food1 = { x: 4, y: 3 };

// GAME FUNCTIONS
function main(ctime) {
  window.requestAnimationFrame(main);
  // console.log(ctime)

  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}
function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // If you bumb in the wall
  if (snake[0].x > 18 || snake[0].x < 1 || snake[0].y > 18 || snake[0].y < 1) {
    return true;
  }
}
function gameEngine() {
  // Part 1: Updating the snake array and food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    alert("Game over! Press any key to play again");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Score=" + score;
  }

  // If you have eaten the food, increament the score and regenerate the food
  if (
    (snakeArr[0].y == food.y && snakeArr[0].x == food.x) ||
    (snakeArr[0].y == food1.y && snakeArr[0].x == food1.x)
  ) {
    if (snakeArr[0].y == food.y && snakeArr[0].x == food.x) {
      foodSound.play();
      score += 1;
    }
    if (snakeArr[0].y == food1.y && snakeArr[0].x == food1.x) {
      coinSound.play();
      score += 2;
    }

    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreVal));
      HighScoreBox.innerHTML = "High Score = " + highScoreVal;
    }
    scoreBox.innerHTML = "Score=" + score;
    // speed.innerHTML = "Speed" + speed;
    console.log(speed);
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 1;
    let b = 16;
    if (score % 10 == 0) {
      food1 = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random()),
      };
    } else {
      food = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random()),
      };
    }
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }; //for refference problem
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Part 2: Display the snake array and food

  // Display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index == 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // Display the food
  if (score != 0 && score % 5 == 0) {
    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food1.y;
    foodElement.style.gridColumnStart = food1.x;
    foodElement.classList.add("food1");
    board.appendChild(foodElement);
  }
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// MAIN LOGIC
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScoreVal = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
  HighScoreBox.innerHTML = "High Score = " + highScore;
}

window.requestAnimationFrame(main);
prevKey = "ArrowUp";
window.addEventListener("keydown", (e) => {
  //   inputDir = { x: 1, y: 0 };
  switch (prevKey) {
    case "ArrowUp":
      inputDir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      inputDir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      inputDir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      inputDir = { x: 1, y: 0 };
      break;
    default:
      break;
  }
  moveSound.play();
  switch (true) {
    case e.key == "ArrowUp" && prevKey != "ArrowDown":
      inputDir.x = 0;
      inputDir.y = -1;
      prevKey = "ArrowUp";
      break;
    case e.key == "ArrowDown" && prevKey != "ArrowUp":
      inputDir.x = 0;
      inputDir.y = 1;
      prevKey = "ArrowDown";
      break;
    case e.key == "ArrowLeft" && prevKey != "ArrowRight":
      inputDir.x = -1;
      inputDir.y = 0;
      prevKey = "ArrowLeft";
      break;
    case e.key == "ArrowRight" && prevKey != "ArrowLeft":
      inputDir.x = 1;
      inputDir.y = 0;
      prevKey = "ArrowRight";
      break;
    //   Adding this for speeding up
    case e.key == "Shift":
      speed++;
      break;

    default:
      //  inputDir.x=0;
      //  inputDir.y=0;
      break;
  }
});
document.addEventListener('swiped-up', function(e) {
  inputDir = { x: 0, y: -1 };
  moveSound.play();
});

document.addEventListener('swiped-left', function(e) {
  inputDir = { x: -1, y: 0 };
  moveSound.play();
});

document.addEventListener('swiped-down', function(e) {
  inputDir = { x: 0, y: 1 };
  moveSound.play();
});

document.addEventListener('swiped-right', function(e) {
  inputDir = { x: 1, y: 0 };
  moveSound.play();
});
// Add event listeners for mobile controls
document.getElementById('upBtn').addEventListener('click', () => {
  inputDir = { x: 0, y: -1 };
  moveSound.play();
});

document.getElementById('leftBtn').addEventListener('click', () => {
  inputDir = { x: -1, y: 0 };
  moveSound.play();
});

document.getElementById('downBtn').addEventListener('click', () => {
  inputDir = { x: 0, y: 1 };
  moveSound.play();
});

document.getElementById('rightBtn').addEventListener('click', () => {
  inputDir = { x: 1, y: 0 };
  moveSound.play();
});

const speedSlider = document.getElementById('speedSlider');
const speedLabel = document.getElementById('speedLabel'); 

// Add event listener for speed adjuster
speedSlider.addEventListener('input', () => {
    speedGot = parseInt(speedSlider.value);
    speed=speedGot
    console.log(speed);
    // speedLabel.innerHTML = `Speed: ${speed}`; 
});

