const distribution = require('../distribution');
const id = distribution.util.id;

test('(0.5 pts) local.mem.get(jcarb)', (done) => {
  const key = 'jcarbmg';

  distribution.local.mem.get(key, (e, v) => {
    try {
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(0.5 pts) local.mem.del(jcarb)', (done) => {
  const key = 'jcarbmd';

  distribution.local.mem.del(key, (e, v) => {
    try {
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(0.5 pts) local.mem.put(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbmp';

  distribution.local.mem.put(user, key, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(user);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(0.5 pts) local.mem.put/get(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbmpg';

  distribution.local.mem.put(user, key, (e, v) => {
    distribution.local.mem.get(key, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(0.5 pts) local.mem.put/del(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbmpd';

  distribution.local.mem.put(user, key, (e, v) => {
    distribution.local.mem.del(key, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(0.5 pts) local.mem.put/del/get(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbmpdg';

  distribution.local.mem.put(user, key, (e, v) => {
    distribution.local.mem.del(key, (e, v) => {
      distribution.local.mem.get(key, (e, v) => {
        try {
          expect(e).toBeInstanceOf(Error);
          expect(v).toBeFalsy();
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });
});

test('(2 pts) local.mem.get(no key)', (done) => {
  const users = [
    {first: 'Emma', last: 'Watson'},
    {first: 'John', last: 'Krasinski'},
    {first: 'Julie', last: 'Bowen'},
  ];
  const keys = [
    'ewatson',
    'jkrasinski',
    'jbowen',
  ];

  distribution.local.mem.put(users[0], keys[0], (e, v) => {
    distribution.local.mem.put(users[1], keys[1], (e, v) => {
      distribution.local.mem.put(users[2], keys[2], (e, v) => {
        distribution.local.mem.get(null, (e, v) => {
          try {
            expect(e).toBeFalsy();
            expect(Object.values(v)).toEqual(expect.arrayContaining(keys));
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });
  });
});

test('(0.5 pts) local.mem.put(no key)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};

  distribution.local.mem.put(user, null, (e, v) => {
    distribution.local.mem.get(id.getID(user), (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toBe(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
