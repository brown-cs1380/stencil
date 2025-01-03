const useLocal = false;

let distribution;

if (useLocal) {
  distribution = require('../distribution');
} else {
  distribution = require('distribution.js');
}

module.exports = distribution;
