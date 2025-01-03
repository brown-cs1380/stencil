global.nodeConfig = {ip: '127.0.0.1', port: 8080};

const distribution = require('../index');

const n1 = {ip: '127.0.0.1', port: 8000};
const n2 = {ip: '127.0.0.1', port: 8001};
const n3 = {ip: '127.0.0.1', port: 8002};
const allNodes = [n1, n2, n3];

const groupA = {};
const id = distribution.util.id;
groupA[id.getSID(n1)] = n1;
groupA[id.getSID(n2)] = n2;
groupA[id.getSID(n3)] = n3;

let localServer = null;

function stopAllNodes(callback) {
  let remote = {service: 'status', method: 'stop'};

  function stopStep(step) {
    if (step == allNodes.length) {
      callback();
      return;
    }

    if (step < allNodes.length) {
      remote.node = allNodes[step];
      distribution.local.comm.send([], remote, (e, v) => {
        stopStep(step + 1);
      });
    }
  }

  if (localServer) localServer.close();
  stopStep(0);
}


function startAllNodes(callback) {
  distribution.node.start((server) => {
    localServer = server;

    function startStep(step) {
      if (step >= allNodes.length) {
        callback();
        return;
      }

      distribution.local.status.spawn(allNodes[step], (e, v) => {
        if (e) {
          callback(e);
        }
        startStep(step + 1);
      });
    }
    startStep(0);
  });
}

beforeAll((done) => {
  // Stop any leftover nodes
  stopAllNodes(() => {
    startAllNodes(done);
  });
});

afterAll((done) => {
  stopAllNodes(done);
});

test('(5 pts) create group', (done) => {
/*
    Create a group with the nodes n1, n2, and n3.
    Then, fetch their NIDs using the distributed status service.
*/

  const nids = Object.values(allNodes).map((node) => id.getNID(node));

      expect(Object.values(v)).toEqual(expect.arrayContaining(nids));
      done();
});
