'use strict';

(function() {

//
// This is the main scrip to animate the board.
//

const Players = require('./scripts/players').Players;
const Colors = require('./scripts/colors').Colors;
const Composition = require('./scripts/composition').Composition;
const KeyShortcuts = require('./scripts/key_shortcuts').KeyShortcuts;
const events = require('events');
const eventEmitter = new events.EventEmitter();
var checkerOption = 0;

function clear() {
  let compose = new Composition();
  compose.all(Colors.black);
  compose.commit();
}

function clearTimers() {
  clearTimeout(automationTimer);
  clearInterval(playerTurnTimer);
}

function setup() {
 // clear();

  let compose = new Composition();
  compose.borders(Colors.white);
  compose.commit();
}

Players.events.on('statechange', function(data) {
  if (gameHasStarted) {
    return;
  }

  let playerId = data.index;
  let onBoard = data.physical;

  let player = Players[playerId];
  let isAlreadyActive = player.active;

  if (isAlreadyActive && !onBoard) {
    playerTurn = playerId;
    reallyStartGame();

    let compose = new Composition();
    compose.players();
    compose.commit();
    lastComposition = compose;
  } else {
    player.active = onBoard;

    if (checkerOption != 1) {
    let compose = new Composition();
    compose.borders(Colors.white);
    compose.players();
    compose.commit();
  }
  }
});

function resolveTurn(playerId, move) {
  let player = Players[playerId];

  let compose = new Composition();
  compose.players();
  compose.positions();
    
  let destinations = getDestinations(player, move);
  compose.cells(player.position, destinations.regular, player.color);

  if (destinations.regular != destinations.final) {
    compose.lineEndArrow(destinations.final, player.color);
    compose.cell(destinations.final, player.color);
  }

  else if (destinations.regular == destinations.final) {
    compose.lineEndArrow(destinations.regular, player.color);
  }

  player.position = destinations.final;

  compose.commit();

  checkIfPlayerHasWin(playerId);

  lastComposition = compose;
  playerTurn++;
}

//Check if a special case like a chutes or ladders
const specialCases = [
  4, 15,
  8, 31,
  17, 7,
  20, 38,
  28, 84,
  40, 42,
  51, 67,
  53, 34,
  62, 19,
  63, 81,
  64, 60,
  71, 91,
  87, 24,
  93, 69,
  95, 76,
  99, 61
];

function getDestinations(player, move) {
  let rv = {};

  // Do dice/spinner move
  rv.regular = Math.min(player.position + move, 100);

  // Check if the player ends up on a snake or a ladder.
  rv.final = rv.regular;
  for (let i = 0; i < specialCases.length; i += 2) {
    if (rv.regular == specialCases[i]) {
      rv.final = specialCases[i+1];
      if (rv.final < rv.regular) {
        eventEmitter.emit('chute');
      }

      if (rv.final > rv.regular) {
        eventEmitter.emit('ladder');
      }
    }
  }

  return rv;
}

let automationTimer = null;
let playerTurnTimer = null;
let playerTurn = 0;
let gameHasStarted = false;

function checkIfPlayerHasWin(playerId) {
  let hasWin = Players[playerId].position >= 100;
  if (!hasWin) {
    return;
  }

  clearTimeout(automationTimer);
  clearInterval(playerTurnTimer);

  // TODO
  // Would be much better to animate the borders with an animation
  let msg = 'Player ' + playerId + ' has won!';
  console.log(msg);

  eventEmitter.emit('gameended', { playerId: playerId });
}

function diceRoll() {
  return Math.floor(Math.random() * 5) + 1;
}

function getNextPlayer() {
  let playerId = -1;

  for (let i = playerTurn; i < 4; i++) {
    let player = Players[i];
    if (player.active) {
      playerTurn = i;
      return playerTurn;
    }
  }

  for (let i = 0; i < playerTurn; i++) {
    let player = Players[i];
    if (player.active) {
      playerTurn = i;
      return playerTurn;
    }
  }

  return playerTurn;
}

let lastComposition = null;
let lastCompositionIsPainted = true;
function blinkPlayerTurn() {
  if (!lastComposition) {
    return;
  }

  if (lastCompositionIsPainted) {
    let compose = lastComposition.clone();
    compose.player(getNextPlayer(), Colors.black);
    compose.commit();
  } else {
    lastComposition.commit();
  }
  lastCompositionIsPainted = !lastCompositionIsPainted;
}

function reallyStartGame() {
  gameHasStarted = true;
  blinkPlayerTurn();
  playerTurnTimer = setInterval(blinkPlayerTurn, 400);
  eventEmitter.emit('gamestarted');
}

function ensureGameIsStarted() {
  if (!gameHasStarted) {
    reallyStartGame();
  }
}

function playTurn() {
  ensureGameIsStarted();
  Players[getNextPlayer()].move(diceRoll());
}

function playAutomatedGame() {
  ensureGameIsStarted();
  playTurn();
  automationTimer = setTimeout(playAutomatedGame, 1000);
}

function playCheckers() {
  alert("This worked");
  let playerCheckers = Players[0];
  console.log(playerCheckers);
  let compose = new Composition();
  for (var i =1; i<21; i=i+2) {
    console.log(i);
    compose.checker(i, Colors.red);
    compose.commit();
  }

  for (var i =99; i>80; i=i-2) {
    console.log(i);
    compose.checker(i, Colors.blue);
    compose.commit();
  }
}

function initializeCheckerBoard() {
  var activeCheckers = [];
  for (var i = 1; i<20; i++) {
    var temp = new Checker(i, i+1, "red");
    activeCheckers.push(temp);
  }
}


Players.events.on('playermove', function(data) {
  ensureGameIsStarted();
  resolveTurn(data.index, data.move);
});

//setup();

KeyShortcuts.on('next', playTurn);

const Game = {
  playAutomatedGame: playAutomatedGame,
  playTurn: playTurn,
  playCheckers: playCheckers,
  events: eventEmitter
};

exports.Game = Game;
})();
