
(function() {
  'use strict';

  let globalCallbacks = {};

  const eventEmitter = {
    on: function(type, callback) {
      if (!globalCallbacks[type]) {
        globalCallbacks[type] = [];
      }

      globalCallbacks[type].push(callback);
    },

    emit: function(type, data) {
      let callbacks = globalCallbacks[type];
      if (!callbacks) {
        return;
      }

      callbacks.forEach(function(callback) {
        callback(type, data);
      });
    }
  };

  addEventListener('keypress', function(key) {
    eventEmitter.emit('next');
  });

  exports.KeyShortcuts = eventEmitter;
})();
