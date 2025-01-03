const http = require('http');
const url = require('url');
const log = require('../util/log');

const serialization = require('../util/serialization');

/*
    The start function will be called to start your node.
    It will take a callback as an argument.
    After your node has booted, you should call the callback.
*/


function isValidBody(body) {
  error = undefined;
  if (body.length === 0) {
    return new Error('No body');
  }

  try {
    body = JSON.parse(body);
  } catch (error) {
    return error;
  }

  return error;
}

function endRequest(res, error) {
  res.end(serialization.serialize([error]));
}


const start = function(callback) {
  const server = http.createServer((req, res) => {
    /* Your server will be listening for PUT requests. */

    // Write some code...

    if (req.method !== 'PUT') {
      res.end(serialization.serialize(new Error('Method not allowed!')));
      return;
    }

    /*
      The path of the http request will determine the service to be used.
      The url will have the form: http://node_ip:node_port/service/method
    */


    // Write some code...


    const pathname = url.parse(req.url).pathname;
    const [, service, method] = pathname.split('/');

    log(`[server] got request ${service}:${method}`);


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


    let body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      body = Buffer.concat(body).toString();

      let error;

      if (error = isValidBody(body)) {
        endRequest(res, error);
        return;
      }

      body = JSON.parse(body);
      body = serialization.deserialize(body);
      let args = body;
      if (!Array.isArray(args)) {
        endRequest(res, new Error(`Invalid argument type, expected array, got ${typeof args}`));
      }


      /* Here, you can handle the service requests. */

      // Write some code...

      let serviceName = service;

      global.distribution.local.routes.get(serviceName, (error, service) => {
        /*
      Here, we provide a default callback which will be passed to services.
      It will be called by the service with the result of it's call
      then it will serialize the result and send it back to the caller.
        */
        const serviceCallback = (e, v) => {
          res.end(serialization.serialize([e, v]));
        };

        if (error) {
          serviceCallback(error);
          return;
        }

        if (!service[method]) {
          serviceCallback(new Error(`Method ${method} not found in service ${serviceName}`));
          return;
        }


        // Write some code...


        log(`[server]  Calling service: ${serviceName}:${method}\
with args: ${JSON.stringify(args)}`);

        /* Some service methods have their second argument be optional.
          In order to not pass the callback there, we need to do this. */
        if (args.length === 1 && service[method].length === 3) {
          args.push(undefined);
        }

        try {
          service[method](...args, serviceCallback);
        } catch (error) {
          serviceCallback(error);
        }
      });
    });
  });


  // Write some code...

  /*
    Your server will be listening on the port and ip specified in the config
    You'll be calling the callback callback when your server has successfully
    started.

    In this milestone, we'll be adding the ability to stop a node
    remotely through the service interface.
  */

  server.listen(global.nodeConfig.port, global.nodeConfig.ip, () => {
    log(`Server running at http://${global.nodeConfig.ip}:${global.nodeConfig.port}/`);
    global.distribution.node.server = server;
    callback(server);
  });

  server.on('error', (error) => {
    // server.close();
    log(`Server error: ${error}`);
    throw error;
  });
};

module.exports = {
  start: start,
};
