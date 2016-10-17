'use strict';

(function() {
  'use strict';

  const HardwareProxy = require('./proxy').HardwareProxy;

  const Sides = {};

  Sides.topLeft = {
    top: 0,
    left: 0,
    right: -1,
    bottom: -1
  };

  Sides.bottomLeft = {
    top: -1,
    left: HardwareProxy.Constants.Height / 2,
    right: -1,
    bottom: 0 
  };

  Sides.bottomRight = {
    top: -1,
    left: -1,
    right: HardwareProxy.Constants.Height / 2,
    bottom: 16
  };

  Sides.topRight = {
    top: HardwareProxy.Constants.Width / 2,
    left: -1,
    right: 0,
    bottom: -1 
  };

  exports.Sides = Sides;
})();

