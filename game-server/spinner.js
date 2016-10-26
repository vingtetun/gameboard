function spinner (onChange) {

  // Requires process.env.USE_SPINNER to be set for this code.
  if (!process.env.USE_SPINNER) return;

  var pinio = new (require('pinio')).Pinio();

  var numSensors = 8;

  var currValues = new Array(numSensors);

  var changeTimeout = null;
  var lastLowestRegion = null;
  var lowestSensor = null;

  function getCurrentRegion() {
    var region = lowestSensor * 2;

    var nextSensorIdx = lowestSensor + 1;
    if (nextSensorIdx >= numSensors) nextSensorIdx = 0;
    var nextSensorVal = currValues[nextSensorIdx];

    if (nextSensorVal < 200) region++;

    return region + 1;
  };

  pinio.on('ready', function(board) {
    var sensors = [
      board.pins('A0'),
      board.pins('A1'),
      board.pins('A2'),
      board.pins('A3'),
      board.pins('A4'),
      board.pins('A5'),
      board.pins('A6'),
      board.pins('A7'),
    ];

    sensors.forEach((sensor, idx) => {
      sensor.read((val) => {
        currValues[idx] = val;
      });
    });

    setInterval(() => {
      for (var i = 0; i < currValues.length; i++) {
        if (lowestSensor === null || currValues[i] < currValues[lowestSensor]) {
          if (currValues[i] < 500) {
            lowestSensor = i;
          }
        }
      }

      var currRegion = getCurrentRegion();
      if (lastLowestRegion !== currRegion) {
        // Early exit if we have a null value to prevent broadcast on startup.
        if (lastLowestRegion === null) {
          lastLowestRegion = currRegion;
          return;
        }

        lastLowestRegion = currRegion;
        clearTimeout(changeTimeout);
        changeTimeout = setTimeout(function() {
          onChange(currRegion);
        }, 500);
      }
    }, 50);
  });
}

module.exports = spinner;
