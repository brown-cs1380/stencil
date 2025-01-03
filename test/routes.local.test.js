const distribution = require('../distribution');
const local = distribution.local;
const routes = distribution.local.routes;


test('(4 pts) local.routes.get(status)', (done) => {
  const status = local.status;

  local.routes.get('status', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(status);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(4 pts) local.routes.get(routes)', (done) => {
  local.routes.get('routes', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(routes);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(4 pts) local.routes.get(comm)', (done) => {
  const comm = local.comm;

  local.routes.get('comm', (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(comm);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(4 pts) local.routes.get(random)', (done) => {
  local.routes.get('random', (e, v) => {
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

test('(8 pts) local.routes.put/get(echo)', (done) => {
  const echoService = {};

  echoService.echo = () => {
    return 'echo!';
  };

  local.routes.put(echoService, 'echo', (e, v) => {
    local.routes.get('echo', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v.echo()).toBe('echo!');
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});


