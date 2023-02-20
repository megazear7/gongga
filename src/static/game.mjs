import { listen } from './io.mjs';
import { waitMs } from './utils.mjs';
import GameObject from './game-object.mjs';
import Player from './player.mjs';

export default class Game {
    width = 12;
    height = 9;
    speed = 100;

    constructor() {
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
        listen(this);
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
            '"w"': () => this.player1.moveUp = true,
            '"a"': () => this.player1.moveLeft = true,
            '"s"': () => this.player1.moveDown = true,
            '"d"': () => this.player1.moveRight = true,
            '"\\u001b[A"': () => this.player2.moveUp = true,
            '"\\u001b[D"': () => this.player2.moveLeft = true,
            '"\\u001b[B"': () => this.player2.moveDown = true,
            '"\\u001b[C"': () => this.player2.moveRight = true,
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
        console.clear();
        this.drawLine();
        this.drawBoard();
        this.drawLine();
        console.log();
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
            console.log(line);
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
        console.log(line);
    }

    drawScoreBoard() {
        let line = this.player1.points + ' ';
        for (var i = 0; i < this.width * 3 + 2 - 4; i++) {
            line += ' ';
        }
        line += ' ' + this.player2.points;
        console.log(line);
    }
}
