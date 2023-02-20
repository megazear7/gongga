export default class GameObject {
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
            () => { this.moveUp = true; this.moveLeft = true },
            () => { this.moveLeft = true; this.moveDown = true },
            () => { this.moveDown = true; this.moveRight = true },
            () => { this.moveUp = true; this.moveRight = true },
        ][Math.floor(Math.random() * 4)]();
    }
}
