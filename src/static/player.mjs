import GameObject from "./game-object.mjs";

export default class Player extends GameObject {
    constructor(name, x, y, symbol, game) {
        super(name, x, y, symbol, game);
        this.points = 0;
    }
}
