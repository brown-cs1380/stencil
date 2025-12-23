// @ts-check
const serialization = require('./serialization.js');
const id = require('./id.js');
const wire = require('./wire.js');

/* Helper function that fills in any missing arguments with undefined */
/**
 * @param {string | any[]} func
 * @param {string | any[]} args
 */
function normalize(func, args) {
  const normalizedArgs = [...args];
  // Last argument is the callback
  if (args.length < func.length - 1) {
    const diff = func.length - args.length - 1;
    for (let i = 0; i < diff; i++) {
      normalizedArgs.push(undefined);
    }
  }
  return normalizedArgs;
}

module.exports = {
  normalize: normalize,
  serialize: serialization.serialize,
  deserialize: serialization.deserialize,
  id: id,
  wire: wire,
};
