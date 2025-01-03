const distribution = require('../index');

test('(5 pts) simple callback practice', () => {
  /* Collect the result of 3 callback services in list  */
  const results = [];

  function add(a, b, callback) {
    const result = a + b;
    callback(result);
  }

  function storeResults(result) {
    results.push(result);
  }


  expect(results).toEqual([3, 5, 7]);
});

test('(5 pts) collect errors and successful results', (done) => {
  /*
        Call each delivery service in a loop, and collect the sucessful results and
        failures in an array.
    */

  // Sample service
  const appleDeliveryService = (callback) => {
    setTimeout(() => callback(null, 'good apples'), 4);
  };


  const services = [
    appleDeliveryService, pineappleDeliveryService, bananaDeliveryService,
    peachDeliveryService, mangoDeliveryService,
  ];

  const doneAndAssert = (es, vs) => {
    try {
      expect(vs.length).toBe(3);
      expect(vs).toContain('good apples');
      expect(vs).toContain('good bananas');
      expect(vs).toContain('good peaches');
      for (const e of es) {
        expect(e instanceof Error).toBe(true);
      }
      const messages = es.map((e) => e.message);
      expect(messages.length).toBe(2);
      expect(messages).toContain('bad pineapples');
      expect(messages).toContain('bad mangoes');
      done();
    } catch (e) {
      done(e);
    }
  };

  const vs = [];
  const es = [];
  let expecting = services.length;
  for (const service of services) {
    service((e, v) => {
      if (e) {
        es.push(e);
      } else {
        vs.push(v);
      }
      expecting -= 1;
      if (expecting === 0) {
        doneAndAssert(es, vs);
      }
    });
  }
});

test('(5 pts) use rpc', (done) => {
  let n = 0;
  let addOne = () => {
    return ++n;
  };

  const node = {ip: '127.0.0.1', port: 9009};


  const rpcService = {
    addOne: addOne,
  };

  distribution.node.start((server) => {
    function cleanup(callback) {
      server.close();
      distribution.local.comm.send([],
          {node: node, service: 'status', method: 'stop'},
          callback);
    }

    distribution.local.status.spawn(node, (e, v) => {
      distribution.local.comm.send([rpcService, 'addOneService'],
          {node: node, service: 'routes', method: 'put'}, (e, v) => {
            distribution.local.comm.send([],
                {node: node, service: 'addOneService', method: 'addOne'}, (e, v) => {
                  distribution.local.comm.send([],
                      {node: node, service: 'addOneService', method: 'addOne'}, (e, v) => {
                        distribution.local.comm.send([],
                            {node: node, service: 'addOneService', method: 'addOne'}, (e, v) => {
                              try {
                                expect(e).toBeFalsy();
                                expect(v).toBe(3);
                                cleanup(done);
                              } catch (error) {
                                cleanup(() => {
                                  done(error);
                                });
                              }
                            });
                      });
                });
          });
    });
  });
});
