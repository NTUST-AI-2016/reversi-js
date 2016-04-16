(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.reset = function() {
    modules = {};
    cache = {};
    aliases = {};
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("src/DrawBoard.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;
exports.reset = reset;
exports.drawBoard = drawBoard;
exports.checkMove = checkMove;
exports.touchBoard = touchBoard;
exports.drawChess = drawChess;

var _ReversiBoard = require('./ReversiBoard');

var _ReversiBoard2 = _interopRequireDefault(_ReversiBoard);

var _RandomPlay = require('./player/RandomPlay');

var _RandomPlay2 = _interopRequireDefault(_RandomPlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chessB = new Image();
var chessW = new Image();

chessB.src = "/images/blackChess.png";
chessW.src = "/images/whiteChess.png";

function initialize() {
  window.board = new _ReversiBoard2.default();
  window.playerBlack = new _RandomPlay2.default(_ReversiBoard.B);
  window.playerWhite = null;

  drawBoard();
  checkMove();
}

function reset() {
  initialize();
}

function drawBoard() {
  var canvas = window.document.getElementById("canvas");
  var context = canvas.getContext("2d");

  for (var count = 0; count <= 320; count += 40) {
    context.beginPath();
    context.moveTo(0, count);
    context.lineTo(320, count);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(count, 0);
    context.lineTo(count, 320);
    context.closePath();
    context.stroke();
  }

  var boardData = window.board.getBoardData();

  // draw current chess
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if (boardData[x + y * 8] != null) {
        drawChess(context, x, y, boardData[x + y * 8]);
      }
    }
  }
}

function checkMove() {
  var turn = window.board.getTurn();

  if (turn == _ReversiBoard.W) {
    if (playerWhite != null) {
      window.playerWhite.move(window.board);
    }
  } else if (turn == _ReversiBoard.B) {
    if (playerBlack != null) {
      window.playerBlack.move(window.board);
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  console.log("OVERRRRR");
}

function touchBoard(pos) {
  var x = parseInt(pos.clientX / 40);
  var y = parseInt(pos.clientY / 40);

  if (window.board.isValidPosition(x, y)) {
    window.board.placePiece(window.board.getTurn(), x, y);
    drawBoard();
  }

  checkMove();
}

function drawChess(context, x, y, color) {
  if (color == _ReversiBoard.B) {
    context.drawImage(chessB, x * 40 + 1.5, y * 40 + 1.5);
  } else {
    context.drawImage(chessW, x * 40 + 1.5, y * 40 + 1.5);
  }
}
});

;require.register("src/Game.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ReversiBoard = require('./ReversiBoard');

var _ReversiBoard2 = _interopRequireDefault(_ReversiBoard);

var _player = require('./player');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Game);

    this.playerBlack = typeof opts.black == 'undefined' ? new _player.RandomPlay(_ReversiBoard.B) : new opts.black(_ReversiBoard.B);
    this.playerWhite = typeof opts.white == 'undefined' ? new _player.RandomPlay(_ReversiBoard.W) : new opts.white(_ReversiBoard.W);
    this.board = new _ReversiBoard2.default();
  }

  _createClass(Game, [{
    key: 'start',
    value: function start() {
      while (this.board.getTurn() != null) {
        switch (this.board.getTurn()) {
          case _ReversiBoard.W:
            this.playerWhite.move(this.board);
            break;
          case _ReversiBoard.B:
            this.playerBlack.move(this.board);
            break;
          default:
            break;
        }
        this.board.logBoard();
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.board = new _ReversiBoard2.default();
    }
  }]);

  return Game;
}();

exports.default = Game;
});

;require.register("src/ReversiBoard.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var W = exports.W = 1,
    B = exports.B = 2;

var InvalidMoveError = exports.InvalidMoveError = function InvalidMoveError() {
  _classCallCheck(this, InvalidMoveError);
};

;

var ReversiBoard = function () {
  function ReversiBoard() {
    _classCallCheck(this, ReversiBoard);

    this._boardData = new Array(8 * 8).fill(null);
    this._boardData[3 + 3 * 8] = W;
    this._boardData[4 + 3 * 8] = B;
    this._boardData[3 + 4 * 8] = B;
    this._boardData[4 + 4 * 8] = W;
    this._turn = B;
    this._clearCache();
  }

  _createClass(ReversiBoard, [{
    key: 'getBoardData',
    value: function getBoardData() {
      return this._boardData;
    }
  }, {
    key: 'getPosition',
    value: function getPosition(x, y) {
      return this._boardData[x + y * 8];
    }
  }, {
    key: 'getTurn',
    value: function getTurn() {
      if (this.getValidPositions().length == 0) {
        if (this._turn == B) {
          this._turn = W;
        } else if (this._turn == W) {
          this._turn = B;
        }

        if (this.getValidPositions().length == 0) {
          this._turn = null;
        }
      }

      return this._turn;
    }
  }, {
    key: 'flippedPositionsFor',
    value: function flippedPositionsFor(x, y) {
      // Use cache if available
      if (typeof this._flippedPositionsCache['' + x + y] === 'array') {
        return this._flippedPositionsCache['' + x + y];
      }

      var flippedPositions = [];
      var currentBoardData = this.getBoardData();

      if (currentBoardData[x + y * 8] != null) {
        // Placing on a position that already has something on it is invalid, and
        // yet will flip nothing, so just leave flippedPositions blank without
        // doing anything else
      } else {
          for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
              if (this.willPositionFlip(i, j, x, y)) {
                flippedPositions.push([i, j]);
              }
            }
          }
        }

      // Keep the results in cache
      this._flippedPositionsCache['' + x + y] = flippedPositions;

      return flippedPositions;
    }
  }, {
    key: 'willPositionFlip',
    value: function willPositionFlip(x, y, px, py) {
      var currentBoardData = this.getBoardData();

      // Placing on a position that already has something on it is invalid, and
      // yet will flip nothing
      if (currentBoardData[px + py * 8] != null) return false;

      // Use cache if available
      if (typeof this._flippedPositionsDataCache['' + px + py] === 'array') {
        return this._flippedPositionsDataCache['' + px + py][x + y * 8];
      }

      var currentTurn = this._turn;
      var flippedPositionsDataForPxPy = new Array(8 * 8).fill(false);

      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          if (dx == 0 && dy == 0) continue;

          var searchFootprints = [];
          var searchMove = 1;

          while (true) {
            var searchPositionX = px + dx * searchMove;
            var searchPositionY = py + dy * searchMove;
            var searchPosition = currentBoardData[searchPositionX + searchPositionY * 8];

            if (searchPositionX < 0 || searchPositionY < 0 || searchPositionX >= 8 || searchPositionY >= 8) {
              break;
            } else if (searchPosition != B && searchPosition != W) {
              break;
            } else if (searchPosition != currentTurn) {
              searchFootprints.push([searchPositionX, searchPositionY]);
            } else if (searchPosition == currentTurn) {
              searchFootprints.forEach(function (searchFootprint) {
                flippedPositionsDataForPxPy[searchFootprint[0] + searchFootprint[1] * 8] = true;
              });
              break;
            }

            searchMove++;
          }
        }
      }

      // Keep the calculated data in cache
      this._flippedPositionsDataCache['' + px + py] = flippedPositionsDataForPxPy;

      return flippedPositionsDataForPxPy[x + y * 8];
    }
  }, {
    key: 'getValidPositions',
    value: function getValidPositions() {
      // Use cache if available
      if (typeof this._validPositionsCache === 'array') {
        return this._validPositionsCache;
      }

      var validPositions = [];

      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          if (this.isValidPosition(i, j)) {
            validPositions.push([i, j]);
          }
        }
      }

      // Keep the data in cache
      this._validPositionsCache = validPositions;

      return validPositions;
    }
  }, {
    key: 'isValidPosition',
    value: function isValidPosition(x, y) {
      return this.flippedPositionsFor(x, y).length > 0;
    }
  }, {
    key: 'getScore',
    value: function getScore(color) {
      if (typeof this._scoreCache[color] !== 'undefined') {
        return this._scoreCache[color];
      }

      var score = 0;

      for (var i = 0; i < 8 * 8; i++) {
        if (this._boardData[i] == color) {
          score++;
        }
      }

      this._scoreCache[color] = score;

      return score;
    }
  }, {
    key: 'placePiece',
    value: function placePiece(color, x, y) {
      var _this = this;

      if (color != this.getTurn()) throw new InvalidMoveError();
      if (!this.isValidPosition(x, y)) throw new InvalidMoveError();

      var positionsToFlip = this.flippedPositionsFor(x, y);

      this._boardData[x + y * 8] = color;
      positionsToFlip.forEach(function (flippedPosition) {
        _this._boardData[flippedPosition[0] + flippedPosition[1] * 8] = color;
      });

      if (color == W) {
        this._turn = B;
      } else if (color == B) {
        this._turn = W;
      }

      this._clearCache();
    }
  }, {
    key: 'setBoardDataForTesting',
    value: function setBoardDataForTesting(boardData) {
      this._boardData = boardData;
      this._clearCache();
    }
  }, {
    key: 'setTurnForTesting',
    value: function setTurnForTesting(turn) {
      this._turn = turn;
      this._clearCache();
    }
  }, {
    key: '_clearCache',
    value: function _clearCache() {
      this._flippedPositionsDataCache = {};
      this._flippedPositionsCache = {};
      this._validPositionsCache = undefined;
      this._scoreCache = {};
    }
  }, {
    key: 'logBoard',
    value: function logBoard() {
      var p = function p(c) {
        if (c == null) return ' ';
        if (c == B) return 'X';
        if (c == W) return 'O';
      };

      var b = this._boardData;

      console.log('  0 1 2 3 4 5 6 7');
      for (var i = 0; i < 8; i++) {
        var line = [i];
        for (var j = 0; j < 8; j++) {
          line.push(p(b[i * 8 + j]));
        }
        console.log(line.join(' '));
      }
    }
  }]);

  return ReversiBoard;
}();

exports.default = ReversiBoard;
});

;require.register("src/player/BasePlayer.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BasePlayer = function BasePlayer(color) {
  _classCallCheck(this, BasePlayer);

  this.color = color;
};

exports.default = BasePlayer;
});

;require.register("src/player/HumanPlay.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BasePlayer2 = require('./BasePlayer');

var _BasePlayer3 = _interopRequireDefault(_BasePlayer2);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HumanPlay = function (_BasePlayer) {
  _inherits(HumanPlay, _BasePlayer);

  function HumanPlay() {
    _classCallCheck(this, HumanPlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HumanPlay).apply(this, arguments));
  }

  _createClass(HumanPlay, [{
    key: 'move',
    value: function move(board) {
      var line = _readlineSync2.default.question('Enter position(x,y): ');
      var strs = line.trim().split(',');
      board.placePiece(this.color, parseInt(strs[0]), parseInt(strs[1]));
      return board;
    }
  }]);

  return HumanPlay;
}(_BasePlayer3.default);

exports.default = HumanPlay;
});

;require.register("src/player/RandomPlay.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BasePlayer2 = require('./BasePlayer');

var _BasePlayer3 = _interopRequireDefault(_BasePlayer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RandomPlay = function (_BasePlayer) {
  _inherits(RandomPlay, _BasePlayer);

  function RandomPlay() {
    _classCallCheck(this, RandomPlay);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RandomPlay).apply(this, arguments));
  }

  _createClass(RandomPlay, [{
    key: 'move',
    value: function move(board) {
      var validPositions = board.getValidPositions();
      var pos = validPositions[this.randomPick(0, validPositions.length - 1)];
      board.placePiece(this.color, pos[0], pos[1]);
      return board;
    }
  }, {
    key: 'randomPick',
    value: function randomPick(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }]);

  return RandomPlay;
}(_BasePlayer3.default);

exports.default = RandomPlay;
});

;require.register("src/player/index.js", function(exports, require, module) {
'use strict';

var _RandomPlay = require('./RandomPlay');

var _RandomPlay2 = _interopRequireDefault(_RandomPlay);

var _HumanPlay = require('./HumanPlay');

var _HumanPlay2 = _interopRequireDefault(_HumanPlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  RandomPlay: _RandomPlay2.default,
  HumanPlay: _HumanPlay2.default
};
});

;
//# sourceMappingURL=app.js.map