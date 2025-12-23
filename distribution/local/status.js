// @ts-check
/**
 * @typedef {import("../types.js").Callback} Callback
 * @typedef {import("../types.js").Node} Node
 */
const log = require('../util/log');

const counts = 0; // TODO: Implement a counter for the number of times the status service has been called

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function get(configuration, callback) {
};


/**
 * @param {Node} configuration
 * @param {Callback} callback
 */
function spawn(configuration, callback) {
}

/**
 * @param {Callback} callback
 */
function stop(callback) {
}

module.exports = {get, spawn, stop};
