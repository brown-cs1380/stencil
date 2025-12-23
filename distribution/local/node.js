// @ts-check
/**
 * @typedef {import("../types.js").Node} Node
 * @typedef {import("../types.js").Callback} Callback
 */
const http = require('node:http');
const url = require('node:url');
const log = require('../util/log.js');

const args = require('yargs').argv;

/**
 * @returns {Node}
 */
function setNodeConfig() {
  let maybeIp; let maybePort; let maybeOnStart;
  if (typeof args.ip === 'string') {
    maybeIp = args.ip;
  }
  if (typeof args.port === 'string') {
    maybePort = parseInt(args.port);
  }

  if (typeof args.config === 'string') {
    const {ip, port, onStart} = globalThis.distribution.util.deserialize(
        args.config,
    );
    if (typeof ip === 'string') {
      maybeIp = ip;
    }
    if (typeof port === 'number') {
      maybePort = port;
    }
    if (typeof onStart === 'function') {
      maybeOnStart = onStart;
    }
  }

  // Default values for config
  maybeIp = maybeIp || '127.0.0.1';
  maybePort = maybePort || 1234;

  return {
    ip: maybeIp,
    port: maybePort,
    onStart: maybeOnStart,
  };
}
/*
    The start function will be called to start your node.
    It will take a callback as an argument.
    After your node has booted, you should call the callback.
*/


/**
 * @param {() => void} callback
 * @returns {void}
 */
function start(callback) {
  const server = http.createServer((req, res) => {
    /* Your server will be listening for PUT requests. */

    // Write some code...


    /*
      The path of the http request will determine the service to be used.
      The url will have the form: http://node_ip:node_port/service/method
    */

    // Write some code...


    /*

      A common pattern in handling HTTP requests in Node.js is to have a
      subroutine that collects all the data chunks belonging to the same
      request. These chunks are aggregated into a body variable.

      When the req.on('end') event is emitted, it signifies that all data from
      the request has been received. Typically, this data is in the form of a
      string. To work with this data in a structured format, it is often parsed
      into a JSON object using JSON.parse(body), provided the data is in JSON
      format.

      Our nodes expect data in JSON format.
  */

    // Write some code...

    /** @type {any[]} */
    const body = [];

    req.on('data', (chunk) => {
    });

    req.on('end', () => {

      /* Here, you can handle the service requests.
      Use the local routes service to get the service you need to call.
      You need to call the service with the method and arguments provided in the request.
      Then, you need to serialize the result and send it back to the caller.
      */

      // Write some code...


  });

  /*
    Your server will be listening on the port and ip specified in the config
    You'll be calling the `callback` callback when your server has successfully
    started.

    At some point, we'll be adding the ability to stop a node
    remotely through the service interface.
  */

  const config = globalThis.distribution.node.config;
  server.listen(config.port, config.ip, () => {
    globalThis.distribution.node.server = server;
    callback();
  });

  server.on('error', (error) => {
    // server.close();
    throw error;
  });
}

module.exports = {start, config: setNodeConfig()};
