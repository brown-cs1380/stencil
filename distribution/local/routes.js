/**
 * @typedef {import("../types").Callback} Callback
 * @typedef {'comm' | 'groups' | 'status' | 'routes' | 'gossip' | 'mem' | 'store' | 'mr'} ServiceName
 */


/**
 * @param {ServiceName | {service: ServiceName, gid?: string}} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
}

/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {
}

module.exports = {get, put, rem};
