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

paintBorder(255, 0, 0);
