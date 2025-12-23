/*

Service  Description                                Methods
status   Status and control of the current node     get, spawn, stop
comm     A message communication interface          send
groups   A mapping from group names to nodes        get, put, add, rem, del
gossip   The receiver part of the gossip protocol   recv
routes   A mapping from names to functions          get, put

*/

/* Status Service */

const status = require('./status.js');

/* Groups Service */

const groups = require('./groups.js');

/* Routes Service */

const routes = require('./routes.js');

/* Comm Service */

const comm = require('./comm.js');

/* Gossip Service */

const gossip = require('./gossip.js');

/* Mem Service */

const mem = require('./mem.js');

/* Store Service */

const store = require('./store.js');

module.exports = {
  status: status,
  routes: routes,
  comm: comm,
  groups: groups,
  gossip: gossip,
  mem: mem,
  store: store,
};
