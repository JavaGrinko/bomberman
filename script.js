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
        frameHeight: 80,
        frameWidth: 62,
        animations: {
            DOWN: { x: 1, y: 0, frameCount: 3 },
            RIGHT: { x: 188, y: 0, frameCount: 3 },
            UP: { x: 2, y: 84, frameCount: 3 },
            EXPLOSION: { x: 0, y: 380, frameCount: 6 },
            // TODO: LEFT
        },
        timeout: 100,
        image: "images/bomberman.png"
    });
    player = {
        sprite: playerSprite,
        x: 66,
        y: 66,
        width: 48,
        height: 60,
        state: 'EXPLOSION'
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