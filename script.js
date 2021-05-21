const width = 900;
const height = 600;
const rows = 10; // рядов
const columns = 15; // столбцов
let player;
let bot;
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
    loadBot();
    requestAnimationFrame(render);
}

function loadBot() {
    const botSprite = new Sprite({
        frameWidth: 32,
        frameHeight: 42,
        animations: {
            DOWN: { x: 0, y: 0, frameCount: 3 },
            RIGHT: { x: 0, y: 120, frameCount: 3 },
            LEFT: { x: 0, y: 40, frameCount: 3 },
            UP: { x: 0, y: 80, frameCount: 3 },
            EXPLOSION: { x: 0, y: 560, frameCount: 6 },
            STAY: { x: 0, y: 0, frameCount: 1 },
        },
        timeout: 100,
        image: "images/bomber.gif"
    });
    // клонируем плеера
    bot = {...player};
    bot.sprite = botSprite;
    bot.x = 600;
    bot.y = 400;
    bot.direction = "up"; // up, down, left, right
    bot.autopilot = () => {
        switch (bot.direction) {
            case "up":
                bot.up(bot);
                break;
            case "down":
                bot.down(bot);
                break;
            case "left":
                bot.left(bot);
                break;
            case "right":
                bot.right(bot);
                break;
        }
    }
    bot.onCollision = () => {
        bot.changeDirection();
    }
    bot.changeDirection = () => {
        let dirs = ["up", "down", "left", "right"];
        bot.direction = dirs[Math.round(Math.random() * 3)];
    }
    
}

function loadPlayer() {
    const playerSprite = new Sprite({
        frameWidth: 32,
        frameHeight: 42,
        animations: {
            DOWN: { x: 0, y: 0, frameCount: 3 },
            RIGHT: { x: 0, y: 120, frameCount: 3 },
            LEFT: { x: 0, y: 40, frameCount: 3 },
            UP: { x: 0, y: 80, frameCount: 3 },
            EXPLOSION: { x: 0, y: 560, frameCount: 6 },
            STAY: { x: 0, y: 0, frameCount: 1 },
        },
        timeout: 100,
        image: "images/bomber.gif"
    });
    player = {
        sprite: playerSprite,
        x: 65,
        y: 65,
        width: 42,
        height: 52,
        state: 'STAY',
        speed: 5,
        right: (me) => {
            me.x += me.speed;
            if (me.checkCollision(me)) { // проверяем, задел ли один из углов бомбера стену
                me.x -= me.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            me.state = 'RIGHT';
        },
        left: (me) => {
            me.x -= me.speed;
            if (me.checkCollision(me)) { // проверяем, задел ли один из углов бомбера стену
                me.x += me.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            me.state = 'LEFT';
        },
        up: (me) => {
            me.y -= me.speed;
            if (me.checkCollision(me)) { // проверяем, задел ли один из углов бомбера стену
                me.y += me.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            me.state = "UP";
        },
        down: (me) => {
            me.y += me.speed;
            if (me.checkCollision(me)) { // проверяем, задел ли один из углов бомбера стену
                me.y -= me.speed; // то выполняем движение в противоход, запрещая туда идти
            }
            me.state = "DOWN";
        },
        checkCollision: (me) => {
            let {x, y, width, height} = me;
            let points = [
                [x, y],
                [x + width, y],
                [x, y + height],
                [x + width, y + height]
            ];
            for (let p of points) {
                let cell = me.getCellByCoors(p[0], p[1]);
                if (level[cell[0]][cell[1]] > 0) { // внимательно тут с []
                    if (me.onCollision) {
                        me.onCollision();
                    }
                    return true;
                }
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
    renderAnyone(player);
    renderAnyone(bot);
    bot.autopilot();
}

function renderAnyone(anyone) {
    const { sprite, state } = anyone;
    const frame = sprite.getFrame(state);
    game.drawImage(frame.image, frame.x, frame.y, frame.w, 
            frame.h, anyone.x, anyone.y, anyone.width, anyone.height);
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
            player.right(player);
            break;
        case 83:
            player.down(player);
            break;
        case 65:
            player.left(player);
            break;
        case 87:
            player.up(player);
            break;
    }
}

window.addEventListener("keyup", () =>  player.state = "STAY");