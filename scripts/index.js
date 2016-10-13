'use strict';

//Endstate branch

//
// This is the main scrip to animate the board.
//
// The board is made up of 1024 leds. They are ordered as a 32x32 matrix.
// Each led is made of 3 components:
//  1. red
//  2. green
//  3. blue
//
// The board communicates using a single protocol call. The protocol
// expects a unsigned int 8 buffer with the state of every led.
//
// The buffer contains the information for the 1024 leds, and the
// value of each components (r, g, b). The buffer size is then 3072 (1024 * 3).
//
// The buffer is organized such as:
// led0_r, led0_g, led0_b, led1_r, led1_g, led1_r, led2_r, led2_g, led2_b, ...
// ... led1022_r, led1022_g, led1022_b, led1023_r, led_1023_g, led1023_b
//
// So a buffer to turn red led 0 will be:
// 255, 0, 0, ... 0, 0, 0
//
// A buffer to turn led 0 white (all the 3 components are set to 255):
// 255, 255, 255, 0, 0, 0, ... 0, 0, 0
//
// A buffer to turn led 0 red and led 1 white:
// 255, 0, 0, 255, 255, 255, 0, 0, 0, ... 0, 0, 0
//

const Hardware = require('./scripts/hardware').Hardware;
const HardwareProxy = require('./scripts/proxy').HardwareProxy;

let kBoard = {
  width: HardwareProxy.Constants.Width,
  height: HardwareProxy.Constants.Height,
  offset: {
    left: 1,
    bottom: 1 * HardwareProxy.Constants.Width,
    right: 1,
    top: 1 * HardwareProxy.Constants.Width,
  }
};


//Creating Players
var player1 = {playerId:0, position:1, r:255, g:0, b:0};
var player2 = {playerId:1, position:1, r:0, g:0, b:255};
var player3 = {playerId:2, position:1, r:255, g:140, b:0};

//Add to Player Array
var players = [];
players.push(player1);
players.push(player2);
players.push(player3);


//Player position global variables
var player1position = 1;
var player2position = 1;
var player3position = 1;

//Game Won Boolean
var isGameWon = false;

//Special Cases 
var specialCases = [4,15,8,31,17,7,20,38,28,84,40,42,51,67,53,34,62,19,63,81,64,60,71,91,87,24,93,69,95,76,99,61];

// Helpers
function updateLedById(buffer, id, r, g, b) {
  let pixelSize = Hardware.Constants.PixelSize;
  buffer[id * pixelSize + 0] = r;
  buffer[id * pixelSize + 1] = g;
  buffer[id * pixelSize + 2] = b;
}

function updateBufferRow(buffer, index, r, g, b) {
  let pixelSize = Hardware.Constants.PixelSize;
  let begin = index * kBoard.width * pixelSize;
  let end = (index + 1) * kBoard.width * pixelSize;

  for (let i = begin; i < end; i += pixelSize) {
    buffer[i + 0] = r;
    buffer[i + 1] = g;
    buffer[i + 2] = b;
  }
}

function updateBufferColumn(buffer, index, r, g, b) {
  let pixelSize = Hardware.Constants.PixelSize;
  let begin = index * pixelSize;
  let end = kBoard.width * kBoard.height * pixelSize;

  for (let i = begin; i < end; i += (pixelSize * kBoard.width)) {
    buffer[i + 0] = r;
    buffer[i + 1] = g;
    buffer[i + 2] = b;
  }
}

function updateBufferRange(buffer, begin, end, r, g, b) {
  let pixelSize = Hardware.Constants.PixelSize;

  for (let i = begin * pixelSize; i < end * pixelSize; i += pixelSize) {
    buffer[i + 0] = r;
    buffer[i + 1] = g;
    buffer[i + 2] = b;
  }
}


// Examples

function blink() {
  let isRed = false;
  setInterval(function() {
    isRed ? paintGreen() : paintRed();
    isRed = !isRed;
  }, 200);
}

function paintAll(r, g, b) {
  let buffer = new Uint8Array(HardwareProxy.size());
  updateBufferRange(buffer, 0, kBoard.width * kBoard.height, r, g, b);
  HardwareProxy.write(buffer);
}

function paintRed() {
  paintAll(255, 0, 0);
}

function paintGreen() {
  paintAll(0, 255, 0);
}

function paintBlue() {
  paintAll(0, 0, 255);
}


function paintBorder(r, g, b) {
  let buffer = new Uint8Array(HardwareProxy.size());

  // top border
  updateBufferRow(buffer, 0, r, g, b);

  // bottom border
  updateBufferRow(buffer, kBoard.height - 1, r, g, b);

  // left border
  updateBufferColumn(buffer, 0, r, g, b);

  // right border
  updateBufferColumn(buffer, kBoard.width - 1, r, g, b);

  HardwareProxy.write(buffer);
}

function getIdsForCase(id) {
  // While the physical board is 32x32 pixels, the game board itself is a 10x10
  // case. Each case is then 3x3 pixels wide, and there is an offset of 1 pixel
  // on every sides.
  //
  // The game board coordinate system is also starting bottom-left, while our
  // physical board is top-left. Which means we need to apply a transformation
  // from one coordinate system to another.
  //
  // Lastly, the game board ordering of rows and columns follow a 'snake'
  // pattern, where the end column of a row map to the start column of the next
  // row.

  // Step 0. Apply the side offsets to our coordinates
  let offset = kBoard.offset.top + kBoard.offset.left;

  // Step 1. Convert the board row/column information to a physical coord.
  //         Going from 10x10 coordinates system starting bottom-left, to
  //         a 32x32 coordinates system starting top-left

  // The board ids are going from 1-100, while the array indexes are going
  // 0-99.
  id = id - 1;

  // Split the absolute number to row/column information. This way they can be
  // worked on individually.
  let row = Math.floor(id / 10);
  let column = id % 10;

  // Invert column depending if the row is odd or even. This is to match the
  // behavior of our board plate.
  if (row % 2) {
    column = 9 - column;
  }
  row = 9 - row;

  // Translate row/colum coordinate to the physical coordinate
  column = column * 3;
  row = row * 3 * kBoard.width;

  // Step 3. Calculate the starting led for our case
  let coordinate = offset + row + column;


  // Step 4. Finally returns a 3x3 square leds id to represent a particular
  //         case.
  let rv = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      rv.push(coordinate + (i * kBoard.width) + j);
    }
  }

  return rv;
}

function updateCase(buffer, id, r, g, b) {
  getIdsForCase(id).forEach(function(id) {
    updateLedById(buffer, id, r, g, b);
  });
}

function paintCase(id, r, g, b) {
  let buffer = new Uint8Array(HardwareProxy.size());

  updateCase(buffer, id, r, g, b);

  HardwareProxy.write(buffer);
}

function paintCases(begin, end, r, g, b) {
  let buffer = new Uint8Array(HardwareProxy.size());

  for (let i = begin; i <= end; i++) {
    updateCase(buffer, i, r, g, b);
  }

  HardwareProxy.write(buffer);
}


//Turn Logic
function turn(turnInt) {

  
    paintBorder(players[turnInt].r, players[turnInt].g, players[turnInt].b);
    var turnMove = rng();
    console.log("Player " + (players[turnInt].playerId +1) + " starts on: " + players[turnInt].position);
    console.log("Player "  + (players[turnInt].playerId+1) + " rolled a: " + turnMove);
    console.log("Player " + (players[turnInt].playerId+1) + " move to space #: " + (players[turnInt].position + turnMove));
    paintCases(players[turnInt].position, turnMove + players[turnInt].position, players[turnInt].r, players[turnInt].g, players[turnInt].b);
    players[turnInt].position += turnMove;

    //Check to see if we landed on a chute or ladder, and if so, do an animation
    var isSpecialCase = checkSpecialCase(players[turnInt].position);
      if (isSpecialCase) {
        if (isSpecialCase < players[turnInt].position) {
          paintCases(isSpecialCase, isSpecialCase, players[turnInt].r, players[turnInt].g, players[turnInt].b);
          }
        else {
        paintCases(players[turnInt].position, isSpecialCase, players[turnInt].r, players[turnInt].g, players[turnInt].b);
        }
        players[turnInt].position = isSpecialCase;
      }

      //Check if we have won the game

      var winStr = "Player " + (players[turnInt].playerId + 1).toString();
      checkWin(players[turnInt].position, winStr);
} 


//Check if a special case like a chutes or ladders
function checkSpecialCase (pos) {
  for (var i=0; i<specialCases.length; i+=2) {
    if (pos == specialCases[i]) {
        return specialCases[i+1];
        break;
    }
  }
}

//Check if won game
function checkWin(num, str) {
  if (num >=100) {
    alert("CONGRATULATIONS, " + str + ", YOU WON!!!!! WOW!!!!");
    isGameWon = true;
  }
}

//Automation Timer

function playGame() {
    if (isGameWon == false) {
    turn(0);
    if (isGameWon == false){
    setTimeout("turn(1);", 2000);
    }
    if(isGameWon==false){
    setTimeout("turn(2);", 4000);
   }
    setTimeout(playGame, 6000);
  }

  else {
    alert("Indeed, someone has won so the game is over..");
  }
}


var turnIncrement = 0;
function doTurn() {
  if (turnIncrement == players.length) {
    turnIncrement = 0;
  }
  if (isGameWon == false) {
  turn(turnIncrement);
  turnIncrement+=1;
  }

  else {
    alert("Indeed, someone has won so the game is over..");
  }
}

// Single case update
//paintCase(3, 255, 255, 0);

function rng() {
  return Math.floor(Math.random() * 5)+ 1;
}

//Run the game timer
//playGame();
