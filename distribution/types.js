/**
 * Asynchronous callback function
 * @callback Callback
 * @param {Error | Object.<string, Error> | null} error
 * @param {any} [result]
 * @returns {void}
 *
 * @typedef {{ip: string, port: number, onStart?: Callback, [key: string]: any}} Node
 *
 * @typedef {Object.<string, Node>} Group
 *
 * @typedef {!string} ID
 * @typedef {!string} NID
 * @typedef {!string} SID
 *
 * @typedef {(kid: ID, nids: NID[]) => NID} Hasher
 *
 * @typedef {(lst: any[]) => number} Sampler
 *
 * @typedef {Object} Config
 * @property {?string} gid
 * @property {Hasher} [hash]
 * @property {Sampler} [subset]
 */

module.exports = {};
