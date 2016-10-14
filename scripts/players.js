'use strict';

(function() {
  'use strict';

  const HardwareProxy = require('./proxy').HardwareProxy;

  const Players = {
    0: {
      color: {
        r: 0,
        g: 255,
        b: 0
      },

      sides: {
        top: 0,
        left: 0,
        right: -1,
        bottom: -1
      },

      physical: false,
      active: false,
      position: 1
    },

    1: {
      color: {
        r: 0,
        g: 0,
        b: 255
      },

     sides: {
        top: -1,
        left: HardwareProxy.Constants.Height / 2,
        right: -1,
        bottom: 0 
      },

      physical: false,
      active: false,
      position: 1
    },

    2: {
      color: {
        r: 255,
        g: 255,
        b: 0 
      },

      sides: {
        top: -1,
        left: -1,
        right: HardwareProxy.Constants.Height / 2,
        bottom: 16
      },

      physical: false,
      active: false,
      position: 1
    },

    3: {
      color: {
        r: 255,
        g: 0,
        b: 0
      },

      sides: {
        top: HardwareProxy.Constants.Width / 2,
        left: -1,
        right: 0,
        bottom: -1 
      },

      physical: false,
      active: false,
      position: 1
    },

    events: { on: function() {} }
  };

  exports.Players = Players;
})();

