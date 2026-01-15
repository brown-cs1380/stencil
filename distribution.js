#!/usr/bin/env node
/**
 * @typedef {import("./distribution/types.js").Node} Node
 */

const log = require('./distribution/util/log.js');

/**
 * @param {Node} [config]
 */
function bootstrap(config) {
    // This loads the reference implementation in case you want to selectively override parts of your implementation with it (e.g., extra credit ypu are not doing or missing functionality from previous milestones).
    // This needs to run before the rest of the code so that the globalThis.distribution object is populated correctly.
    // @ts-ignore Optional dependency for reference implementation.
    const distributionLib = require('@brown-ds/distribution')(config);
    distributionLib; // To avoid unused variable warning
  const distribution = {};
  // @ts-ignore This is the first time globalThis.distribution is being initialized, so the object does not have all the necessary properties.
  globalThis.distribution = distribution;
  distribution.util = require('./distribution/util/util.js');
  // @ts-ignore node.server is lazily initialized.
  distribution.node = require('./distribution/local/node.js');
  distribution.local = require('./distribution/local/local.js');

  if (config) {
    distribution.node.config = config;
  }

  for (const [key, service] of Object.entries(distribution.local)) {
    distribution.local.routes.put(service, key, () => {});
  }

  const {setup} = require('./distribution/all/all.js');
  distribution.all = setup({gid: 'all'});

  /* Overrides when missing functionality from previous milestone or extra credit is needed */

  // For M3, when missing RPC, its path through routes, and status.{spawn, stop}
  /* __start_M3_solution__
  distribution.util.wire.createRPC = distributionLib.util.wire.createRPC;
  distribution.local.routes.get = distributionLib.local.routes.get;
  distribution.local.status.spawn = distributionLib.local.status.spawn;
  distribution.local.status.stop = distributionLib.local.status.stop;
  __end_M3_solution__ */
  return distribution;
}

/*
  This logic determines which implementation of the distribution library to use.
  It can either be:
  1. The reference implementation from the library @brown-ds/distribution
  2. Your own, local implementation

  Which one to be used by the tests is determined by the "useLibrary" value in the package.json file.
*/
// @ts-ignore JSON import resolved at runtime.
const {useLibrary} = require('./package.json');
// @ts-ignore Optional dependency for reference implementation.
const distribution = useLibrary ? require('@brown-ds/distribution') : bootstrap;

/* The following code is run when distribution.js is run directly */
if (require.main === module) {
  globalThis.distribution = distribution();
}

module.exports = distribution;
