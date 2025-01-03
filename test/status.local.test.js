const distribution = require('../distribution');
const local = distribution.local;
const comm = distribution.local.comm;
const id = distribution.util.id;

const config = distribution.node.config;

test('(2 pts) local.status.get(sid)', (done) => {
  local.status.get('sid', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(id.getSID(config));
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(2 pts) local.status.get(ip)', (done) => {
  local.status.get('ip', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(config.ip);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(2 pts) local.status.get(port)', (done) => {
  local.status.get('port', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(config.port);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(2 pts) local.status.get(counts)', (done) => {
  local.status.get('counts', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(2 pts) local.status.get(random)', (done) => {
  local.status.get('random', (e, v) => {
    try {
      expect(e).toBeDefined();
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(? pts) local.status.spawn/stop using local.comm', (done) => {
  try {
    expect(local.status.spawn).toBeDefined();
    expect(local.status.stop).toBeDefined();
    expect(local.comm).toBeDefined();
    expect(local.comm.send).toBeDefined();
  } catch (error) {
    done(error);
  }

  const node = {
    ip: '127.0.0.1',
    port: 9090,
  };

  const config = {
    ip: node.ip,
    port: node.port,
    onStart: () => {
      console.log('Node is started!');
    },
  };

  const cleanup = (s, done) => {
    comm.send([], {service: 'status', method: 'stop', node: node}, (e, v) => {
      s.close();
      try {
        expect(e).toBeFalsy();
        expect(v.ip).toBe(node.ip);
        expect(v.port).toBe(node.port);
        done();
      } catch (error) {
        done(error);
      }
    });
  };

  const spawnNode = (s) => {
    local.status.spawn(config, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBeDefined();
        cleanup(s, done);
      } catch (error) {
        s.close();
        cleanup(s, done);
      }
    });
  };

  distribution.node.start((s) => {
    spawnNode(s);
  });
});
