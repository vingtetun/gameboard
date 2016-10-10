'use strict';

function createElement(id, className) {
  let element = document.createElement('div');
  element.id = id;
  element.className = className;
  return element;
}

function buildBoard() {
  let board = createElement('board', 'board');

  for (let i = 0; i < 1024; i++) {
    let led = createElement('led_' + i, 'led');
    board.appendChild(led);
  }

  document.body.appendChild(board);
}

function buildVirtualBoard() {
  let virtual = createElement('virtual', 'virtual');

  let content = createElement('content', 'content');
  for (let i = 0; i < 100; i++) {
    let c = createElement('case_' + i, 'case');
    content.appendChild(c);
  }

  board.appendChild(content);
  document.body.appendChild(virtual);
}

buildBoard();
buildVirtualBoard();
