const distribution = require('../distribution');
const id = distribution.util.id;

test('(0.5 pts) local.store.get(jcarb)', (done) => {
  const key = 'jcarbsg';

  distribution.local.store.get(key, (e, v) => {
    try {
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(0.5 pts) local.store.del(jcarb)', (done) => {
  const key = 'jcarbsd';

  distribution.local.store.del(key, (e, v) => {
    try {
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(0.5 pts) local.store.put(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbsp';

  distribution.local.store.put(user, key, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(user);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(0.5 pts) local.store.put/get(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbspg';

  distribution.local.store.put(user, key, (e, v) => {
    distribution.local.store.get(key, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(0.5 pts) local.store.put/del(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbspd';

  distribution.local.store.put(user, key, (e, v) => {
    distribution.local.store.del(key, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(0.5 pts) local.store.put/del/get(jcarb)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};
  const key = 'jcarbspdg';

  distribution.local.store.put(user, key, (e, v) => {
    distribution.local.store.del(key, (e, v) => {
      distribution.local.store.get(key, (e, v) => {
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

test('(2 pts) local.store.get(no key)', (done) => {
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

  distribution.local.store.put(users[0], keys[0], (e, v) => {
    distribution.local.store.put(users[1], keys[1], (e, v) => {
      distribution.local.store.put(users[2], keys[2], (e, v) => {
        distribution.local.store.get(null, (e, v) => {
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

test('(0.5 pts) local.store.put(no key)', (done) => {
  const user = {first: 'Josiah', last: 'Carberry'};

  distribution.local.store.put(user, null, (e, v) => {
    distribution.local.store.get(id.getID(user), (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
