const width = 900;
const height = 600;
const rows = 10; // рядов
const columns = 15; // столбцов
let player;
let game;

const GRASS = new Image();
GRASS.src = "images/grass.png";

const WALL = new Image();
WALL.src = "images/wall.png";

const BRICKS = new Image();
BRICKS.src = "images/bricks.png";

window.onload = function() {
    console.log("Скрипты подключены");
    createCanvas();
    loadPlayer();
    requestAnimationFrame(render);
}

function loadPlayer() {
    const playerSprite = new Sprite({
        frameHeight: 140,
        frameWidth: 101,
        animations: {
            DOWN: { x: 0, y: 0, frameCount: 3 },
            RIGHT: { x: 303, y: 0, frameCount: 3 },
            LEFT: { x: 303, y: 140, frameCount: 3 },
            UP: { x: 0, y: 280, frameCount: 3 },
            EXPLOSION: { x: 0, y: 560, frameCount: 6 },
            STAY: { x: 0, y: 0, frameCount: 1 },
        },
        timeout: 100,
        image: "images/bomberman.png"
    });
    player = {
        sprite: playerSprite,
        x: 65,
        y: 65,
        width: 45,
        height: 55,
        state: 'STAY',
        speed: 5,
        right: () => {
            player.x += player.speed;
            if (player.checkCollision(player.x + player.width, player.y)) { // если новые координаты - стена
                player.x -= player.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            player.state = 'RIGHT';
        },
        left: () => {
            player.x -= player.speed;
            if (player.checkCollision(player.x, player.y)) { // если новые координаты - стена
                player.x += player.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            player.state = 'LEFT';
        },
        up: () => {
            player.y -= player.speed;
            if (player.checkCollision(player.x, player.y)) { // если новые координаты - стена
                player.y += player.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            player.state = "UP";
        },
        down: () => {
            player.y += player.speed;
            if (player.checkCollision(player.x, player.y + player.height)) { // если новые координаты - стена
                player.y -= player.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            player.state = "DOWN";
        },
        checkCollision: (x, y) => {
            let cell = player.getCellByCoors(x, y);
            if (level[cell[0]][cell[1]] > 0) { // внимательно тут с []
                return true;
            }
            return false;
        },
        getCellByCoors: (x, y) => {
            let cellSize = height / rows;
            let j = Math.trunc(y / cellSize);// ряд
            let i = Math.trunc(x / cellSize); // столбец
            return [j, i];
        }
    }
}

function createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.classList.add("canvas");
    document.body.appendChild(canvas);
    game = canvas.getContext("2d");
}

function render() {
    requestAnimationFrame(render);
    renderWorld();
    renderPlayer();
}

function renderPlayer() {
    const { sprite, state } = player;
    const frame = sprite.getFrame(state);
    game.drawImage(frame.image, frame.x, frame.y, frame.w, 
            frame.h, player.x, player.y, player.width, player.height);
    // game.fillRect(player.x, player.y, player.width, player.height);
}

function renderWorld() {
    let cellSize = height / rows;
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * cellSize;
            let y = j * cellSize;
            switch (level[j][i]) {
                case 0:
                    game.drawImage(GRASS, x, y, cellSize, cellSize);
                    break;
                case 1:
                    game.drawImage(WALL, x, y, cellSize, cellSize);
                    break;
                case 2:
                    game.drawImage(BRICKS, x, y, cellSize, cellSize);
                    break;
            }
        }
    }
}

window.addEventListener("keydown", onKeyDown, false);


function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 68:
            player.right();
            break;
        case 83:
            player.down();
            break;
        case 65:
            player.left();
            break;
        case 87:
            player.up();
            break;
    }
}

window.addEventListener("keyup", () =>  player.state = "STAY");