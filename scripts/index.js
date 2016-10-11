'use strict';

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

//Player position global variables
var player1position = 0;
var player2position = 0;
var player3position = 0;

//The array to represent gameboard squares
var squares = [];
squares[0]= [0,0,0,0];

//squares[number of square] = [xLEDStart, xLEDFinish, yLEDStart, yLEDFinish);
//This determines the square that is the parent of the LEDS and helps us know which LEDs to light up.

//Squares in Row 1
squares[1] = [1,3,1,3];
squares[2] = [4,6,1,3];
squares[3] = [7,9,1,3];
squares[4] = [10,12,1,3];
squares[5] = [13,15,1,3];
squares[6] = [16,18,1,3];
squares[7] = [19,21,1,3];
squares[8] = [22,24,1,3];
squares[9] = [25,27,1,3];
squares[10] = [28,30,1,3];

//Squares in Row 2
squares[11] = [28,30,4,6];
squares[12] = [25,27,4,6];
squares[13] = [22,24,4,6];
squares[14] = [19,21,4,6];
squares[15] = [16,18,4,6];
squares[16] = [13,15,4,6];
squares[17] = [10,12,4,6];
squares[18] = [7,9,4,6];
squares[19]= [4,6,4,6];
squares[20] = [1,3,4,6];

//Squares in Row 3
squares[21] = [1,3,7,9];
squares[22] = [4,6,7,9];
squares[23] = [7,9,7,9];
squares[24] = [10,12,7,9];
squares[25] = [13,15,7,9];
squares[26] = [16,18,7,9];
squares[27] = [19,21,7,9];
squares[28] = [22,24,7,9];
squares[29] = [25,27,7,9];
squares[30] = [28,30,7,9];

//Squares in Row 4
squares[31] = [28,30,10,12];
squares[32] = [25,27,10,12];
squares[33] = [22,24,10,12];
squares[34] = [19,21,10,12];
squares[35] = [16,18,10,12];
squares[36] = [13,15,10,12];
squares[37] = [10,12,10,12];
squares[38] = [7,9,10,12];
squares[39] = [4,6,10,12];
squares[40] = [1,3,10,12];

//Squares in Row 5
squares[41] = [1,3,13,15];
squares[42] = [4,6,13,15];
squares[43] = [7,9,13,15];
squares[44] = [10,12,13,15];
squares[45] = [13,15,13,15];
squares[46] = [16,18,13,15];
squares[47] = [19,21,13,15];
squares[48] = [22,24,13,15];
squares[49] = [25,27,13,15];
squares[50] = [28,30,13,15];

//Squares in Row 6
squares[51] = [28,30,16,18];
squares[52] = [25,27,16,18];
squares[53] = [22,24,16,18];
squares[54] = [19,21,16,18];
squares[55] = [16,18,16,18];
squares[56] = [13,15,16,18];
squares[57] = [10,12,16,18];
squares[58] = [7,9,16,18];
squares[59] = [4,6,16,18];
squares[60] = [1,3,16,18];

//Squares in Row 7
squares[61] = [1,3,19,21];
squares[62] = [4,6,19,21];
squares[63] = [7,9,19,21];
squares[64] = [10,12,19,21];
squares[65] = [13,15,19,21];
squares[66] = [16,18,19,21];
squares[67] = [19,21,19,21];
squares[68] = [22,24,19,21];
squares[69] = [25,27,19,21];
squares[70] = [28,30,19,21];

//Squares in Row 8
squares[71] = [28,30,22,24];
squares[72] = [25,27,22,24];
squares[73] = [22,24,22,24];
squares[74] = [19,21,22,24];
squares[75] = [16,18,22,24];
squares[76] = [13,15,22,24];
squares[77] = [10,12,22,24];
squares[78] = [7,9,22,24];
squares[79] = [4,6,22,24];
squares[80] = [1,3,22,24];

//Squares in Row 9
squares[81] = [1,3,25,27];
squares[82] = [4,6,25,27];
squares[83] = [7,9,25,27];
squares[84] = [10,12,25,27];
squares[85] = [13,15,25,27];
squares[86] = [16,18,25,27];
squares[87] = [19,21,25,27];
squares[88] = [22,24,25,27];
squares[89] = [25,27,25,27];
squares[90] = [28,30,25,27];

//Squares in Row 10
squares[91] = [28,30,28,30];
squares[92] = [25,27,28,30];
squares[93] = [22,24,28,30];
squares[94] = [19,21,28,30];
squares[95] = [16,18,28,30];
squares[96] = [13,15,28,30];
squares[97] = [10,12,28,30];
squares[98] = [7,9,28,30];
squares[99] = [4,6,28,30];
squares[100] = [1,3,28,30];


let kBoard = {
  width: HardwareProxy.Constants.Width,
  height: HardwareProxy.Constants.Height
};

// Helpers
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

function paintSquare(r,g,b,destinationSquare) {

  let buffer = new Uint8Array(HardwareProxy.size());
  var y1 = squares[destinationSquare][2];
  var y2 = squares[destinationSquare][3];
  console.log(y1);

  for (var i = y1; i<y2; i++) {
      updateBufferRow(buffer, i, r, g, b);
      HardwareProxy.write(buffer);
  }
}

//paintBorder(255, 0, 0);

function turn(turnInt) {
  switch (turnInt) {
    case 0:
      paintBorder(255,0,0);
      player1position = player1position + movement();
      console.log(player1position);
      paintSquare(255,0,0,player1position);
      break;

    case 1:
      paintBorder(0,255,0);
      player2position = player2position + movement();
      break;

    case 2:
      paintBorder(0,0,255);      
      player3position = player3position + movement();
  }


}

turn(0);

function movement() {
  return Math.floor(Math.random() * 5)+ 1;
}
