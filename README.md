# Reversi Game in Javascript

## Development Setup

### on Windows

* Download node installer from [here](https://nodejs.org/en/download/stable/)
* Download and install git for windows from [here](https://git-scm.com/downloads)

cd into the project directory and run:

```
npm install
```

## Sample gameplay(Command Line)

```
./node_modules/babel-cli/bin/babel-node.js test/human_game_starter.js
```

![](http://i.imgur.com/V0gYLMf.png)

and on Windows:
```
node node_modules\babel-cli\bin\babel-node.js test\haman_game_starter.js
```

![](http://i.imgur.com/BTjsQGi.png)

And now is your turn. :p

## Sample Gameplay(HTML Canvas)

```
brunch watch --server
```

![](http://i.imgur.com/XNgHgIF.png)

then visit `http://localhost:3333` and start playing.


## Write an AI Plugin Example

```js
// src/player/RandomPlay.js
import BasePlayer from './BasePlayer';

export default class RandomPlay extends BasePlayer {

  move(board) {
    var validPositions = board.getValidPositions();
    var pos = validPositions[this.randomPick(0, validPositions.length-1)];
    board.placePiece(this.color, pos[0], pos[1]);
    return board;
  }

  randomPick(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
}
```

繼承自 BasePlayer，需要實作 `move` 方法。move 傳入目前的 ReversiBoard instance，對 board 進行 placePiece 的操作，this.color 是目前 ai player 所代表的顏色。
