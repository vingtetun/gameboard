'use strict';

const Players = require('./../scripts/players').Players;
const Colors = require('./../scripts/colors').Colors;
const Composition = require('./../scripts/composition').Composition;

// Examples
function blink() {
  let isRed = false;
  setInterval(function() {
    isRed ? paintGreen() : paintRed();
    isRed = !isRed;
  }, 200);
}

function paintAll(color) {
  let compose = new Composition();
  compose.all(color);
  compose.commit();
}

function paintPlayerTurn(playerId) {
  let color = Players[playerId].color;

  let compose = new Composition();
  compose.player(playerId);
  compose.borders(color);
  compose.cells(1, 4, color);
  compose.commit();
}

function paintPlayersBorders() {
  let compose = new Composition();
  compose.players();
  compose.commit();
}

function paintBorder(color) {
  let compose = new Composition();
  compose.borders(color);
  compose.commit();
}

function paintCell(id, color) {
  let compose = new Composition();
  composite.cell(id, color);
  compose.commit();
}

function paintCells(begin, end, color) {
  let compose = new Composition();
  composite.cells(begin, end, color);
  compose.commit();
}

function clear() {
  paintAll(Colors.black);
}

clear();
