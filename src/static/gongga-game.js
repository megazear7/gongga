import GameEngine from './game-engine.mjs';

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
