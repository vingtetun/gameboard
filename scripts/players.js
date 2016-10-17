'use strict';

(function() {
  'use strict';

  const Colors = require('./colors').Colors;
  const Sides = require('./sides').Sides;
  const RemotePlayers = require('./remote_players').RemotePlayers;

  const events = require('events');
  const eventEmitter = new events.EventEmitter();

  function Player(id, color, sides) {
    this.id = id;
    this.color = color;
    this.sides = sides;
    this.physical = false;
    this.active = false;
    this.position = 1;
  }

  Player.prototype.move = function(move) {
    RemotePlayers.move(this.id, move);
  };

  const Players = {
    0: new Player(0, Colors.green, Sides.topLeft),
    1: new Player(1, Colors.blue, Sides.bottomLeft),
    2: new Player(2, Colors.yellow, Sides.bottomRight),
    3: new Player(3, Colors.red, Sides.topRight),
    events: eventEmitter
  };

  RemotePlayers.events.on('update', function(json) {
    let data = json.data;
    switch (json.type) {
      case 'statechange':
        Players[data.index].physical = data.physical;
        break;
    }

    eventEmitter.emit(json.type, data);
  });

  exports.Players = Players;
})();

