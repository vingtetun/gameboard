'use strict';

const Game = require('./index').Game;
const RemotePlayers = require('./scripts/players').RemotePlayers;

function $(id) {
  return document.getElementById(id);
}

function disableAddPlayers() {
  $('playingHeader').innerHTML = 'Game is in session. Start over to add players.';
  enablePlayersButtons(false);
}

function enableAddPlayers() {
  enablePlayersButtons(true);
}

function enablePlayersButtons(enable) {
  $('p0button').disabled = !enable;
  $('p1button').disabled = !enable;
  $('p2button').disabled = !enable;
  $('p3button').disabled = !enable;
}

function togglePlayer(playerId) {
  // TODO: Message game server to set number of players.
  this.disabled = !this.disabled;
  if (this.disabled) {
    RemotePlayers.activate(playerId);
  } else {
    RemotePlayers.deactivate(playerId);
  }
}

RemotePlayers.events.on('update', function(json) {
  let data = json.data;
  let button = $('p' + data.index + 'button');
  button.disabled = data.physical;
});

function startOver () {
  // TODO: Message game server to reset game state.
  enableAddPlayers();
  window.location.reload();
}

function doAutoplay() {
  enablePlayersButtons(false);
  Game.playAutomatedGame();
}

function doTurn() {
  enablePlayersButtons(false);
  Game.playTurn();
}

function createPlayersButton() {
  let colors = [
    'success',
    'primary',
    'warning',
    'danger'
  ];

  let root = $('players-buttons-container');

  for (let i = 0; i < 4; i++) {
    let element = document.createElement('button');
    element.type = 'button';
    element.className = 'btn btn-block btn-' + colors[i];
    element.id = 'p' + i + 'button';
    element.onclick = togglePlayer.bind(element, i);
    element.textContent = 'Player ' + i;
    root.appendChild(element);
  }
}

Game.events.on('gamestarted', function() {
  disableAddPlayers();
});

Game.events.on('chute', function() {
  $('chuteSound').play();
});

Game.events.on('ladder', function() {
  $('ladderSound').play();
});

Game.events.on('gameended', function(data) {
  $('victorySound').play();

  let msg = 'Player ' + data.playerId + ' has won!';
  window.alert(msg);

  setTimeout(startOver, 500);
});

createPlayersButton();
