var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 8001;

app.use(express.static(__dirname + "/../"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on("connection", function(ws) {
  console.log("websocket connection open")

  ws.on("message", function(data, flags) {
    console.log('got message', data, flags)
    broadcast(data);
  });

  ws.on("close", function() {
    console.log("websocket connection close");
  });
});
