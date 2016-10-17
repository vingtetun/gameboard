
(function() {
  'use strict';

  const events = require('events');
  const eventEmitter = new events.EventEmitter();

  let isLocalGame = true;
  let connection = null;

  function tryRemoteConnect() {
    const Config = require('./config').Config;
    const kURL = Config.service.url + ':' + Config.service.port;

    connection = new WebSocket(kURL);
    connection.addEventListener('open', function(evt) {
      isLocalGame = false;
      console.log('Running Remote Game.');
    });

    connection.addEventListener('message', function(evt) {
      let json = JSON.parse(evt.data);
      eventEmitter.emit('update', json);
    });
  }

  function activate(playerId) {
    let data = { index: playerId, physical: true };
    send({ type: 'statechange', data: data }); 
  }

  function deactivate(playerId) {
    let data = { index: playerId, physical: false };
    send({ type: 'statechange', data: data }); 
  }

  function move(playerId, move) {
    let data = { index: playerId, move: move };
    send({ type: 'playermove', data: data }); 
  }

  function send(json) {
    if (isLocalGame) {
      eventEmitter.emit('update', json);
    } else {
      connection.send(JSON.stringify(json));
    }
  }

  const RemotePlayers = {
    activate: activate,
    deactivate: deactivate,
    move: move,
    events: eventEmitter
  };

  setTimeout(tryRemoteConnect);
  exports.RemotePlayers = RemotePlayers;
})();
