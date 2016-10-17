'use strict';

const exports = {};

function EventEmitter() {
  let globalCallbacks = {};

  this.on = function(type, callback) {
    if (!globalCallbacks[type]) {
      globalCallbacks[type] = [];
    }

    globalCallbacks[type].push(callback);
  };

  this.emit = function(type, data) {
    let callbacks = globalCallbacks[type];
    if (!callbacks) {
      return;
    }

    callbacks.forEach(function(callback) {
      callback(data);
    });
  };
};

function require(src) {
  switch (src) {
    case 'events':
      return { EventEmitter: EventEmitter };

    default:
      return exports;
  }

  return null;
}

