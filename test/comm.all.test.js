const distribution = require('../config.js');
const id = distribution.util.id;

test('(2 pts) all.comm.send(status.get(random))', (done) => {
  const remote = {service: 'status', method: 'get'};

  distribution.mygroup.comm.send(['random'], remote, (e, v) => {
    try {
      Object.keys(mygroupGroup).forEach((sid) => {
        expect(e[sid]).toBeDefined();
        expect(e[sid]).toBeInstanceOf(Error);
        expect(v).toEqual({});
      });

      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(4 pts) all.comm.send(status.get(heapTotal))', (done) => {
  const node = {ip: '127.0.0.1', port: 9001};
  const remote = {node: node, service: 'status', method: 'get'};
  distribution.local.comm.send(['heapTotal'], remote, (e, oneHeap) => {
    distribution.mygroup.status.get('heapTotal', (e, groupHeap) => {
      try {
        expect(e).toEqual({});
        expect(groupHeap).toBeGreaterThan(oneHeap);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

/* Testing infrastructure code */

const mygroupGroup = {};

/*
   This is necessary since we can not
   gracefully stop the local listening node.
   This is because the process that node is
   running in is the actual jest process
*/
let localServer = null;

const n1 = {ip: '127.0.0.1', port: 9001};
const n2 = {ip: '127.0.0.1', port: 9002};
const n3 = {ip: '127.0.0.1', port: 9003};
const n4 = {ip: '127.0.0.1', port: 9004};
const n5 = {ip: '127.0.0.1', port: 9005};
const n6 = {ip: '127.0.0.1', port: 9006};

test('(4 pts) all.comm.send(status.get(nid))', (done) => {
  const nids = Object.values(mygroupGroup).map((node) => id.getNID(node));
  const remote = {service: 'status', method: 'get'};

  distribution.mygroup.comm.send(['nid'], remote, (e, v) => {
    expect(e).toEqual({});
    try {
      expect(Object.values(v).length).toBe(nids.length);
      expect(Object.values(v)).toEqual(expect.arrayContaining(nids));
      done();
    } catch (error) {
      done(error);
    }
  });
});


beforeAll((done) => {
  // First, stop the nodes if they are running
  let remote = {service: 'status', method: 'stop'};

  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n4;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n5;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n6;
            distribution.local.comm.send([], remote, (e, v) => {
              startNodes();
            });
          });
        });
      });
    });
  });

  const startNodes = () => {
    mygroupGroup[id.getSID(n1)] = n1;
    mygroupGroup[id.getSID(n2)] = n2;
    mygroupGroup[id.getSID(n3)] = n3;
    mygroupGroup[id.getSID(n4)] = n4;
    mygroupGroup[id.getSID(n5)] = n5;


    const groupInstantiation = () => {
      const mygroupConfig = {gid: 'mygroup'};


      // Create the groups
      distribution.local.groups
          .put(mygroupConfig, mygroupGroup, (e, v) => {
            done();
          });
    };


    // Now, start the nodes listening node
    distribution.node.start((server) => {
      localServer = server;

      // Start the nodes
      distribution.local.status.spawn(n1, (e, v) => {
        distribution.local.status.spawn(n2, (e, v) => {
          distribution.local.status.spawn(n3, (e, v) => {
            distribution.local.status.spawn(n4, (e, v) => {
              distribution.local.status.spawn(n5, (e, v) => {
                distribution.local.status.spawn(n6, (e, v) => {
                  groupInstantiation();
                });
              });
            });
          });
        });
      });
    }); ;
  };
});

afterAll((done) => {
  let remote = {service: 'status', method: 'stop'};
  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n4;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n5;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n6;
            distribution.local.comm.send([], remote, (e, v) => {
              localServer.close();
              done();
            });
          });
        });
      });
    });
  });
});

