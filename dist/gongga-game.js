const waitMs = async function(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

class GameObject {
    constructor(name, x, y, symbol, game) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.game = game;
        this.bouncy = false;
        this.resetMove();
    }

    setBouncy() {
        this.bouncy = true;
    }

    isAt(x, y) {
        return this.x === x && this.y === y;
    }

    resetMove() {
        this.moveUp = false;
        this.moveLeft = false;
        this.moveDown = false;
        this.moveRight = false;
    }

    update() {
        let newX = this.x;
        let newY = this.y;

        if (this.moveUp) {
            newY -= 1;
        }
        if (this.moveLeft) {
            newX -= 1;
        }
        if (this.moveDown) {
            newY += 1;
        }
        if (this.moveRight) {
            newX += 1;
        }

        if (this.bouncy) {
            if (newX <= 0) {
                this.moveLeft = false;
                this.moveRight = true;
            } else if (newX >= this.game.width - 1) {
                newX = this.game.width - 1;
                this.moveLeft = true;
                this.moveRight = false;
            } else if (newY <= 0) {
                this.moveUp = false;
                this.moveDown = true;
            } else if (newY >= this.game.height - 1) {
                this.moveUp = true;
                this.moveDown = false;
            }

            const object = this.game.impactedObject(this, newX, newY);
            if (object) {
                if (this.moveUp) {
                    newY += 2;
                }
                if (this.moveLeft) {
                    newX += 2;
                }
                if (this.moveDown) {
                    newY -= 2;
                }
                if (this.moveRight) {
                    newX -= 2;
                }
                this.moveUp = !this.moveUp;
                this.moveLeft = !this.moveLeft;
                this.moveDown = !this.moveDown;
                this.moveRight = !this.moveRight;
            }

            if (newX === 0 && this.game.isScoreForPlayer1(newY)) {
                this.game.player2Scored();
            }
            if (newX === this.game.width - 1 && this.game.isScoreForPlayer2(newY)) {
                this.game.player1Scored();
            }
        }

        if (this.validMove(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
    }

    validMove(x, y) {
        return (!this.game.anythingAt(this, x, y)) &&
            x >= 0 &&
            x <= this.game.width - 1 &&
            y >= 0 &&
            y <= this.game.height - 1;
    }

    randomDirection() {
        [
            () => { this.moveUp = true; this.moveLeft = true; },
            () => { this.moveLeft = true; this.moveDown = true; },
            () => { this.moveDown = true; this.moveRight = true; },
            () => { this.moveUp = true; this.moveRight = true; },
        ][Math.floor(Math.random() * 4)]();
    }
}

class Player extends GameObject {
    constructor(name, x, y, symbol, game) {
        super(name, x, y, symbol, game);
        this.points = 0;
    }
}

class GameEngine {
    width = 12;
    height = 18;
    speed = 100;

    constructor({ screen }) {
        this.midX = Math.floor(this.width / 2);
        this.midY =  Math.floor(this.height / 2);
        this.player1 = new Player('Player 1', 0, this.midY, '[A]', this);
        this.player2 = new Player('Player 2', this.width - 1, this.midY, '[B]', this);
        this.ball = new GameObject('Ball', this.midX, this.midY, ' o ', this);
        this.ball.randomDirection();
        this.ball.setBouncy();
        this.objects = [
            this.player1,
            this.player2,
            this.ball,
        ];
        this.screen = screen;
    }

    player1Scored() {
        this.player1.points += 1;
        this.scored();
    }

    player2Scored() {
        this.player2.points += 1;
        this.scored();
    }

    scored() {
        this.ball.x = this.midX;
        this.ball.y = this.midY;
        this.ball.randomDirection();
        this.player1.x = 0;
        this.player1.y = this.midY;
        this.player2.x = this.width - 1;
        this.player2.y = this.midY;
    }

    anythingAt(objA, x, y) {
        return this.impactedObjects(objA, x, y).length > 0;
    }

    impactedObject(objA, x, y) {
        const objects = this.impactedObjects(objA, x, y);
        return objects.length > 0 ? objects[0] : false;
    }

    impactedObjects(objA, x, y) {
        return this.objects.filter(objB => objB === objA ? false : objB.isAt(x, y));
    }

    on(key) {
        const moveFunction = {
            'upPlayer1': () => this.player1.moveUp = true,
            'leftPlayer1': () => this.player1.moveLeft = true,
            'downPlayer1': () => this.player1.moveDown = true,
            'rightPlayer1': () => this.player1.moveRight = true,
            'upPlayer2': () => this.player2.moveUp = true,
            'leftPlayer2': () => this.player2.moveLeft = true,
            'downPlayer2': () => this.player2.moveDown = true,
            'rightPlayer2': () => this.player2.moveRight = true,
        }[key];
        
        typeof moveFunction === 'function' ? moveFunction() : undefined;
    }

    async play() {
        while (this.playing()) {
            this.player1.resetMove();
            this.player2.resetMove();
            this.draw();
            await waitMs(this.speed);
            this.player1.update();
            this.player2.update();
            this.ball.update();
        }
    }

    playing() {
        return true;
    }

    draw() {
        this.screen.clear();
        this.drawLine();
        this.drawBoard();
        this.drawLine();
        this.screen.drawLine();
        this.drawScoreBoard();
    }

    drawBoard() {
        for (let i = 0; i < this.height; i++) {
            let line = this.isScoreForPlayer1(i) ? ' ' : '|';
            for (let j = 0; j < this.width; j++) {
                if (this.player1.isAt(j, i)) {
                    line += this.player1.symbol;
                } else if (this.player2.isAt(j, i)) {
                    line += this.player2.symbol;
                } else if (this.ball.isAt(j, i)) {
                    line += this.ball.symbol;
                } else {
                    line += '   ';
                }
            }
            line += this.isScoreForPlayer2(i) ? ' ' : '|';
            this.screen.drawLine(line);
        }
    }

    isScoreForPlayer1(y) {
        return y >= this.height / 3 && y < 2 * this.height / 3;
    }

    isScoreForPlayer2(y) {
        return y >= this.height / 3 && y < 2 * this.height / 3;
    }

    drawLine() {
        let line = '';
        for (var i = 0; i < this.width * 3 + 2; i++) {
            line += '-';
        }
        this.screen.drawLine(line);
    }

    drawScoreBoard() {
        let line = this.player1.points + ' ';
        for (var i = 0; i < this.width * 3 + 2 - 4; i++) {
            line += ' ';
        }
        line += ' ' + this.player2.points;
        this.screen.drawLine(line);
    }
}

class GonggaGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = this.notPlayingTemplate();
        this.engine = new GameEngine({ screen: this });

        this.shadowRoot.getElementById('play-button').addEventListener('click', () => {
            this.play();
        });
    }

    style() {
        return `
            <style>
                button {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 3px;
                    font-size: 1rem;
                    background-color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 300ms;
                }

                button:hover {
                    background-color: var(--secondary-color);
                }
            </style>
        `
    }

    notPlayingTemplate() {
        return `${this.style()}<button id="play-button">Play</button>`;
    }

    playingTemplate() {
        return `${this.style()}<pre id="game"></pre>`;
    }

    play() {
        this.shadowRoot.innerHTML = this.playingTemplate();
        this.engine.play();

        document.addEventListener("keydown", event => {
            const command = {
                'KeyW': 'upPlayer1',
                'KeyA': 'leftPlayer1',
                'KeyS': 'downPlayer1',
                'KeyD': 'rightPlayer1',
                'ArrowUp': 'upPlayer2',
                'ArrowLeft': 'leftPlayer2',
                'ArrowDown': 'downPlayer2',
                'ArrowRight': 'rightPlayer2',
            }[event.code];
            this.engine.on(command);
        });
    }

    drawLine(line) {
        if (this.shadowRoot.getElementById('game')) {
            this.shadowRoot.getElementById('game').insertAdjacentText('beforeend', (line || '') + '\n');
        } else {
            console.error('Engine attempting to draw to screen but container div not found');
        }
    }

    clear() {
        if (this.shadowRoot.getElementById('game')) {
            this.shadowRoot.getElementById('game').innerText = '';
        } else {
            console.error('Engine attempting to clear the screen but container div not found');
        }
    }
}

window.customElements.define('gongga-game', GonggaGame);
