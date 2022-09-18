/**캔버스 셋팅 */
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage,
  spaceshipImage,
  bulletImage,
  enemyImage,
  gameOverImage,
  explosionImage;
let gameOver = false; //true면 게임 끝남
let score = 0;
let spaceshipX = canvas.width / 2 - 24;
let spaceshipY = canvas.height - 48;
let bulletList = [];

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 13;
    this.y = spaceshipY;
    this.alive = true;

    bulletList.push(this);
  };

  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        score++;
        this.alive = false; //죽은 총알
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 60);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 1; //적군의 속도조절

    if (this.y >= canvas.height - 60) {
      gameOver = true;
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpeg";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  explosionImage = new Image();
  explosionImage.src = "images/explosion.png";
}

let keysDown = {};

function setupKeyBoardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet(); //총알생성
    }
  });
}

function createBullet() {
  console.log("총알생성");
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 3; //우주선의 속도
  }
  if (37 in keysDown) {
    spaceshipX -= 3;
  }

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  //우주선 경기장 안에서만 있게
  if (spaceshipX >= canvas.width - 48) {
    spaceshipX = canvas.width - 48;
  }

  //총알위치 업데이트
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  //적위치 업데이트
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update(); //좌표값을 업데이트하고
    render(); //그려주고
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380);
  }
}

loadImage();
setupKeyBoardListener();
createEnemy();
main();
