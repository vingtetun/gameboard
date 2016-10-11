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
var turnInt = 0;
var squares = [];
squares[0]= "start";

//squares[number of square] = [xLEDStart, xLEDFinish, yLEDStart, yLEDFinish);
//This determines the square that is the parent of the LEDS and helps us know which LEDs to light up.

//Squares in Row 1
squares[1] = [2,4,2,4];
squares[2] = [5,7,2,4];
squares[3] = [8,10,2,4];
squares[4] = [11,13,2,4];
squares[5] = [14,16,2,4];
squares[6] = [17,19,2,4];
squares[7] = [20,22,2,4];
squares[8] = [23,25,2,4];
squares[9] = [26,28,2,4];
squares[10] = [29,31,2,4];

//Squares in Row 2
squares[11] = [29,31,5,7];
squares[12] = [26,28,5,7];
squares[13] = [23,25,5,7];
squares[14] = [20,22,5,7];
squares[15] = [17,19,5,7];
squares[16] = [14,16,5,7];
squares[17] = [11,13,5,7];
squares[18] = [8,10,5,7];
squares[19]= [5,7,5,7];
squares[20] = [2,4,5,7];

//Squares in Row 3
squares[21] = [2,4,8,10];
squares[22] = [5,7,8,10];
squares[23] = [8,10,8,10];
squares[24] = [11,13,8,10];
squares[25] = [14,16,8,10];
squares[26] = [17,19,8,10];
squares[27] = [20,22,8,10];
squares[28] = [23,25,8,10];
squares[29] = [26,28,8,10];
squares[30] = [29,31,8,10];

//Squares in Row 4
squares[31] = [29,31,11,13];
squares[32] = [26,28,11,13];
squares[33] = [23,25,11,13];
squares[34] = [20,22,11,13];
squares[35] = [17,19,11,13];
squares[36] = [14,16,11,13];
squares[37] = [11,13,11,13];
squares[38] = [8,10,11,13];
squares[39] = [5,7,11,13];
squares[40] = [2,4,11,13];

//Squares in Row 5
squares[41] = [2,4,14,16];
squares[42] = [5,7,14,16];
squares[43] = [8,10,14,16];
squares[44] = [11,13,14,16];
squares[45] = [14,16,14,16];
squares[46] = [17,19,14,16];
squares[47] = [20,22,14,16];
squares[48] = [23,25,14,16];
squares[49] = [26,28,14,16];
squares[50] = [29,31,14,16];

//Squares in Row 6
squares[51] = [29,31,17,19];
squares[52] = [26,28,17,19];
squares[53] = [23,25,17,19];
squares[54] = [20,22,17,19];
squares[55] = [17,19,17,19];
squares[56] = [14,16,17,19];
squares[57] = [11,13,17,19];
squares[58] = [8,10,17,19];
squares[59] = [5,7,17,19];
squares[60] = [2,4,17,19];

//Squares in Row 7
squares[61] = [2,4,20,22];
squares[62] = [5,7,20,22];
squares[63] = [8,10,20,22];
squares[64] = [11,13,20,22];
squares[65] = [14,16,20,22];
squares[66] = [17,19,20,22];
squares[67] = [20,22,20,22];
squares[68] = [23,25,20,22];
squares[69] = [26,28,20,22];
squares[70] = [29,31,20,22];

//Squares in Row 8
squares[71] = [29,31,23,25];
squares[72] = [26,28,23,25];
squares[73] = [23,25,23,25];
squares[74] = [20,22,23,25];
squares[75] = [17,19,23,25];
squares[76] = [14,16,23,25];
squares[77] = [11,13,23,25];
squares[78] = [8,10,23,25];
squares[79] = [5,7,23,25];
squares[80] = [2,4,23,25];

//Squares in Row 9
squares[81] = [2,4,26,28];
squares[82] = [5,7,26,28];
squares[83] = [8,10,26,28];
squares[84] = [11,13,26,28];
squares[85] = [14,16,26,28;
squares[86] = [17,19,26,28];
squares[87] = [20,22,26,28];
squares[88] = [23,25,26,28];
squares[89] = [26,28,26,28];
squares[90] = [29,31,26,28];

//Squares in Row 10
squares[91] = [29,31,29,31];
squares[92] = [26,28,29,31];
squares[93] = [23,25,29,31];
squares[94] = [20,22,29,31];
squares[95] = [17,19,29,31];
squares[96] = [14,16,29,31];
squares[97] = [11,13,29,31];
squares[98] = [8,10,29,31];
squares[99] = [5,7,29,31];
squares[100] = [2,4,29,31];


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

//paintBorder(255, 0, 0);

function turn(turnInt) {
  switch (turnInt) {
    case 0:
      paintBorder(255,0,0);
      movement();
      break;

    case 1:
      paintBorder(0,255,0);
      movement();
      break;

    case 2:
      paintBorder(0,0,255);      
      movement();
  }


}

turn(2);

function movement() {
  return Math.floor(Math.random() * 5)+ 1;
}
