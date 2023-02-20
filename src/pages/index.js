import { html } from 'orison';

export default context => html`
  <h1>Gongga</h1>
  <h6>A pong like ASCII game</h6>
  <img class="game-icon-left" src="/icons/icon-128x128.png">
  <img class="game-icon-right" src="/icons/icon-128x128.png">
  <gongga-game></gongga-game>
  <a class="attribution" href="https://www.flaticon.com/free-icons/ping-pong" title="ping pong icons">Ping pong icons created by Freepik - Flaticon</a>
`;
