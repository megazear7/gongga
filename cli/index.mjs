import GameEngine from '../src/static/game-engine.mjs';

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.resume();

class CLIGongga {
    constructor() {
        this.engine = new GameEngine({ screen: this });
    }

    play() {
        this.engine.play();

        stdin.on('data', key => {
            if (key === '\u0003') {
                process.exit();
            } else {
                const command = {
                    '"w"': 'upPlayer1',
                    '"a"': 'leftPlayer1',
                    '"s"': 'downPlayer1',
                    '"d"': 'rightPlayer1',
                    '"\\u001b[A"': 'upPlayer2',
                    '"\\u001b[D"': 'leftPlayer2',
                    '"\\u001b[B"': 'downPlayer2',
                    '"\\u001b[C"': 'rightPlayer2',
                }[JSON.stringify(key)];
                this.engine.on(command);
            }
        });
    }

    drawLine(line) {
        console.log(line || '');
    }

    clear() {
        console.clear();
    }
}

new CLIGongga().play();
