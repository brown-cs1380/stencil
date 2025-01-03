const distribution = require('../index');
const util = distribution.util;

test('(1 pts) use the local store', (done) => {
/*
    Use the distributed store to put a key-value pair.
    Make sure to run the check() function at the last callback of your solution.
*/
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbspsg';


  function check() {
    distribution.local.store.get(key, (e, v) => {
      try {
        expect(v).toEqual(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  }
});


test('(5 pts) hash functions return different nodes', () => {
  /*

        Identify two keys that consistentHash maps to the same node. You will
        likely need to try a few (but not many) keys. What can you conclude
        about using consistentHash for a small number of keys.

    */
  const nodeIds = [
    util.id.getNID({ip: '192.168.0.1', port: 8000}),
    util.id.getNID({ip: '192.168.0.2', port: 8000}),
    util.id.getNID({ip: '192.168.0.3', port: 8000}),
    util.id.getNID({ip: '192.168.0.4', port: 8000}),
    util.id.getNID({ip: '192.168.0.5', port: 8000}),
  ];
  let key1;
  let key2;


  const kid1 = util.id.getID(key1);
  const kid2 = util.id.getID(key2);

  const key1Node = util.id.consistentHash(kid1, nodeIds);
  const key2Node = util.id.consistentHash(kid2, nodeIds);

  expect(key1Node).toBe(key2Node);
});

test('(5 pts) hash functions return the same node', () => {
  /*

        Identify a key for which the three hash functions agree about its placement.
        You will likely need to try a few (but not many) keys.

    */

  const nodeIds = [
    util.id.getNID({ip: '192.168.0.1', port: 8000}),
    util.id.getNID({ip: '192.168.0.2', port: 8000}),
    util.id.getNID({ip: '192.168.0.3', port: 8000}),
    util.id.getNID({ip: '192.168.0.4', port: 8000}),
  ];
  let key;


  const kid = util.id.getID(key);

  const a = util.id.naiveHash(kid, nodeIds);
  const b = util.id.rendezvousHash(kid, nodeIds);
  const c = util.id.consistentHash(kid, nodeIds);

  expect(a).toBe(b);
  expect(b).toBe(c);
});


