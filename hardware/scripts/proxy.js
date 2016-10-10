
(function() {

const HardwareProxy = (function HardwareProxy() {
  const Hardware = require('./hardware').Hardware;

  'use strict';

  const Constants = {
    Width: 32,
    Height: 32,
  };

  function size() {
    return Constants.Width *
           Constants.Height *
           Hardware.Constants.PixelSize;
  }

  function assert(value, msg) {
    if (!value) {
      throw new Error(msg);;
    }
  }

  function applyProtocol(inBuffer) {
    let outBuffer = new Uint8Array(
      Hardware.Constants.HeaderSize +
      (Hardware.Constants.Width * Hardware.Constants.Height * Hardware.Constants.PixelSize) +
      Hardware.Constants.FooterSize
    );

    // Write Header
    outBuffer[0] = 0x02;
    outBuffer[1] = 0x01;

    // Write Footer
    outBuffer[outBuffer.length - 1] = 0x0A;

    // Write Content
    //
    // Our mcu firmware is a little stupid. It assumes the board size is 64x32,
    // but our board size is 32x32.
    // To make the embedders works easier, our HardwareProxy expect buffer sized
    // for a 32x32 board - which means those buffers needs to be converted to
    // the format expected by the mcu firmware.
    // All this happens at the cost of performance. It should be fine for now but
    // if we continue to prototype with this board and expect 60 fps it will be 
    // definitively better to have a new firmware.
    //
    let step = Constants.Width * Hardware.Constants.PixelSize;
    for (let i = 0; i < inBuffer.length; i+=step) {
      let iteration = i / step * 2;

      for (let j = 0; j < step; j++) {
        let outIndex = Hardware.Constants.HeaderSize + (iteration * step) + j;
        outBuffer[outIndex] = 0x00;
      }

      for (let j = step; j < (step * 2); j+=Hardware.Constants.PixelSize) {
        let outIndex = Hardware.Constants.HeaderSize + (iteration * step) + j;
        let inIndex = i + (j - step);

        outBuffer[outIndex + 0] = inBuffer[inIndex + 0];
        outBuffer[outIndex + 1] = inBuffer[inIndex + 1];
        outBuffer[outIndex + 2] = inBuffer[inIndex + 2];
      }
    }

    return outBuffer;
  }

  function write(buffer) {
    let msg = 'Buffer length (' + buffer.length + ') should be ' + size() + '.';
    assert(buffer.length === size(), msg);

    Hardware.update(applyProtocol(buffer));
  }

  return {
    Constants: Constants,
    size: size,
    write: write
  };
})();

exports.HardwareProxy = HardwareProxy;

})();

