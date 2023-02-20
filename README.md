# Gongga

Gongga is a pong like ASCII game that is delivered as a installable web app, a terminal based game, and a plug-n-play web component.

[gongga.alexlockhart.me](https://gongga.alexlockhart.me/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/227ed963-f79e-4cab-8ed5-ed46d6efd2fe/deploy-status)](https://app.netlify.com/sites/gongga/deploys)

## Gongga on the Web

#### Develop

```
npm run serve
```

Open [localhost:3000](http://localhost:3000/)

#### Build

```
npm run build
```

#### Deploy

```
git commit -m "..."
git push origin master
```

## Gongga Web Component

You can use Gongga as a plug and play webcomponent by doing this:

```
npm install gongga
```

```js
import 'gongga';
```

```html
<gongga-game></gongga-game>
```

## Gongga on the Terminal

#### Install

```
npm install --global gongga
```

#### Run

```
gongga
```

#### Development of the CLI

You can make changes and test via the cli with this command

```
npm run play
```

#### Publishing the CLI

Bump the package.json version and then run:

```
npm publish
```
