import Game from '../src/static/game.mjs';

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.resume();

class CLIGongga {
    constructor() {
        this.engine = new Game({ screen: this });
    }

    play() {
        this.engine.play();

        stdin.on('data', key => {
            if (key === '\u0003') {
                process.exit();
            } else {
                this.engine.on(JSON.stringify(key));
            }
        });
    }

    drawLine(line) {
        console.log(line || '');
    }
}

new CLIGongga().play();
