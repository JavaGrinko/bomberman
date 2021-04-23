const width = 900;
const height = 600;
const rows = 10; // рядов
const columns = 15; // столбцов
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
    requestAnimationFrame(render);
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