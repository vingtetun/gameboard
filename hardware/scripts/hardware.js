
(function() {

const Hardware = (function Hardware() {
  'use strict';

  const Constants = {
    HeaderSize: 2,
    FooterSize: 1,
    PixelSize: 3,
    Width: 64,
    Height: 32,
  };

  const leds = document.getElementsByClassName('led');

  const kLedsCount = (Constants.Width / 2) * Constants.Height;
  if (leds.length != kLedsCount) {
    let msg = 'The total number of leds should be ' + kLedsCount + '.\n' +
              'Current count is ' + leds.lenght + '.';
    throw new Error(msg);
  } 

  function updateLed(id, r, g, b) {
    if (r == 0 && g == 0 && b == 0) {
      leds[id].style.backgroundColor = 'transparent';
    } else {
      leds[id].style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

  function update(buffer) {
    let begin = Constants.HeaderSize;
    let end = buffer.length - Constants.FooterSize;
    let step = Constants.Width * Constants.PixelSize;

    for (let i = begin; i < end; i += step) {
      // The first half does not have any physical representation as the real board is 32x32
      // but the protocol used is 64x32.
      let offset =  i + (step / 2);
      let iteration = (i - begin) / step;

      for (let j = offset; j < (i + step); j += Constants.PixelSize) {
        let id = ((j - begin) / Constants.PixelSize) - ((iteration + 1) * Constants.Width / 2);
        updateLed(id, buffer[j], buffer[j+1], buffer[j+2]);
      }
    }
  }

  return {
    update: update,
    Constants: Constants
  };
})();

exports.Hardware = Hardware;

})();
