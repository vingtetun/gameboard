
(function() {
  const Config = {
    service: {
      url: 'ws://localhost',
      port: 8001
    },

    boards: {
      leds: {
        port: '/dev/ttyACM0',
        bauds: 115200
      },

      players: {
        port: '/dev/ttyACM1',
        bauds: 9600
      }
    }
  };

  exports.Config = Config;
})();
