// @ts-check
/**
 * @typedef {import("../types.js").Config} Config
 */

/*
Service   Description                            Methods
comm      A message communication interface      send
groups    A mapping from group names to nodes    get,put, add, rem, del
routes    A mapping from names to functions      put
status    Information about the current group    get, stop, spawn
gossip    Status and information dissemination   send, at, del
mem       An ephemeral (in-memory) store         get, put, del, reconf
store     A persistent store                     get, put, del, reconf
mr        A map-reduce implementation            exec
*/

/* Comm Service */
const comm = require('./comm.js');

/* Groups Service */
const groups = require('./groups.js');

/* Routes Service */
const routes = require('./routes.js');

/* Status Service */
const status = require('./status.js');

/* Gossip Service */
const gossip = require('./gossip.js');

/* Mem Service */
const mem = require('./mem.js');

/* Store Service */
const store = require('./store.js');

/* Map-Reduce Service */
const mr = require('./mr.js');

/**
 * @typedef {Object} GroupServices
 * @property {import("./comm.js").Comm} comm
 * @property {import("./groups.js").Groups} groups
 * @property {import("./status.js").Status} status
 * @property {import("./routes.js").Routes} routes
 * @property {import("./gossip.js").Gossip} gossip
 * @property {import("./mem.js").Mem} mem
 * @property {import("./mem.js").Mem} store
 * @property {import("./mr.js").Mr} mr
 *
 * @param {Config} config
 * @returns {GroupServices}
 */
function setup(config) {
  return {
    comm: comm(config),
    groups: groups(config),
    status: status(config),
    routes: routes(config),
    gossip: gossip(config),
    mem: mem(config),
    store: store(config),
    mr: mr(config),
  };
}

module.exports = {
  comm,
  groups,
  status,
  routes,
  gossip,
  mem,
  store,
  mr,
  setup,
};
