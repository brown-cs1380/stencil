// @ts-check
/**
 * @typedef {import("../types").Callback} Callback
 * @typedef {import("../types").Node} Node
 *
 * @typedef {Object} Payload
 * @property {{service: string, method: string, node: Node}} remote
 * @property {any} message
 * @property {string} mid
 * @property {string} gid
 */

const N = 10;


/**
 * @param {Payload} payload
 * @param {Callback} callback
 */
function recv(payload, callback) {
}

module.exports = {recv};
