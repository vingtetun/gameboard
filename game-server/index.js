'use strict';

const ws = require('nodejs-websocket')

const kPort = 8001;

function debug(str) {
  console.log('Server: ', str);
}

const server = ws.createServer(function(connection) {
  debug('Connection - New')

  connection.on('text', onText.bind(connection));
  connection.on('close', onClose.bind(connection));
});

server.listen(kPort);

function broadcast(server, msg) {
  server.connections.forEach(function(connection) {
    connection.send(msg);
  })
}

function onClose(code, reason) {
  debug('Connection: Closed');
}

function onText(str) {
  debug('Received ' + str);
  broadcast(server, str);
}

