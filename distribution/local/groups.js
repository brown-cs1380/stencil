// @ts-check
/**
 * @typedef {import("../types.js").Callback} Callback
 * @typedef {import("../types.js").Config} Config
 * @typedef {import("../types.js").Node} Node
 */

/**
 * @param {string} name
 * @param {(e: ?Error, v: ?Object.<string, Node>) => void} callback
 */
function get(name, callback) {
}

/**
 * @param {Config | string} config
 * @param {Object<string, Node>} group
 * @param {(e: ?Error, v: ?Object.<string, Node>) => void} callback
 */
function put(config, group, callback) {
  log(
      `groups.put: config: ${JSON.stringify(config)} group: ${
        JSON.stringify(group)
      }`,
  );

  group = group || {};

  if (typeof config === 'string') {
    config = {gid: config};
  }

  if (!config.gid) {
    return callback(Error('Config gid was null'), null);
  }

  groupsStore[config.gid] = group;

  Object.values(group).forEach((node) => {
    groupsStore['all'][globalThis.distribution.util.id.getSID(node)] = node;
  });

  const {setup} = require('../../distribution/all/all.js');
  globalThis.distribution[config.gid] = setup(config);

  return callback(null, group);
  // __end_solution__
}

/**
 * @param {string} name
 * @param {Callback} callback
 */
function del(name, callback) {
}

/**
 * @param {string} name
 * @param {Node} node
 * @param {Callback} callback
 */
function add(name, node, callback) {
};

/**
 * @param {string} name
 * @param {string} node
 * @param {Callback} callback
 */
function rem(name, node, callback) {
};

module.exports = {get, put, del, add, rem};
