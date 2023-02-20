import GonggaEngine from './gongga-engine.js';

class GonggaGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innterHTML = this.template();
        this.engine = new GonggaEngine();
    }

    update() {
        if (this.shadowRoot.querySelector('div')) {
            this.shadowRoot.querySelector('div').innerText = this.engine.output();
        }
    }

    template() {
        return '<div></div>';
    }
}

window.customElements.define('gongga-game', GonggaGame);
