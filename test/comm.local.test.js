const distribution = require('../distribution');
const local = distribution.local;
const id = distribution.util.id;

test('(10 pts) local.comm(status.get(nid))', (done) => {
  const node = distribution.node.config;

  remote = {node: node, service: 'status', method: 'get'};
  message = ['nid']; // Arguments to the method

  distribution.node.start((s) => {
    local.comm.send(message, remote, (e, v) => {
      s.close();

      try {
        expect(e).toBeFalsy();
        expect(v).toBe(id.getNID(node));
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(? pts) rpc', (done) => {
  let n = 0;

  function addOne() {
    return ++n;
  }

  const addOneRPC = distribution.util.wire.createRPC(
      distribution.util.wire.toAsync(addOne));

  const addOneService = {
    addOne: addOneRPC,
  };

  const otherNode = {ip: '127.0.0.1', port: 9090};

  const stopOtherNode = (cb) => {
    message = [];
    remote = {node: otherNode, service: 'status', method: 'stop'};
    local.comm.send(message, remote, (e, v) => {
      try {
        expect(e).toBeFalsy();
        done();
      } catch (error) {
        done(error);
      }
    });
  };

  const cleanup = (e, s) => {
    s.close();
    stopOtherNode();
    done(e);
  };

  const putAddOneService = (s) => {
    message = [addOneService, 'addOne'];
    remote = {node: otherNode, service: 'routes', method: 'put'};
    local.comm.send(message, remote, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe('addOne');
        callAddOneService(s);
      } catch (error) {
        cleanup(error);
      }
    });
  };

  const callAddOneService = (s) => {
    message = [];
    remote = {node: otherNode, service: 'addOne', method: 'addOne'};
    local.comm.send(message, remote, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe(1);
        cleanup(undefined, s);
      } catch (error) {
        cleanup(error, s);
      }
    });
  };

  distribution.node.start((s) => {
    try {
      expect(s).toBeTruthy();
    } catch (error) {
      cleanup(error, s);
    }

    local.status.spawn(otherNode, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBeDefined();
        expect(v.ip).toBe(otherNode.ip);
        expect(v.port).toBe(otherNode.port);

        // cleanup(undefined, s);

        putAddOneService(s);
      } catch (error) {
        cleanup(error, s);
      }
    });
  });
});
