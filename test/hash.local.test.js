const distribution = require('../distribution');
const id = distribution.util.id;

test('(2 pts) naiveHash()', (done) => {
  const key = 'jcarb';
  const nodes = [
    {ip: '127.0.0.1', port: 10000},
    {ip: '127.0.0.1', port: 10001},
    {ip: '127.0.0.1', port: 10002},
  ];

  const kid = id.getID(key);
  const nids = nodes.map((node) => id.getNID(node));

  const hash = id.naiveHash(kid, nids);
  const expectedHash = '8df6d087feed28c8a46dbd0fba5413e59e2d4c537aad8efff54d7b3ec62b0511';

  try {
    expect(expectedHash).toBeTruthy();
    expect(hash).toBe(expectedHash);
    done();
  } catch (error) {
    done(error);
  }
});

test('(2 pts) consistentHash()', (done) => {
  const key = 'jcarb';
  const nodes = [
    {ip: '127.0.0.1', port: 10000},
    {ip: '127.0.0.1', port: 10001},
    {ip: '127.0.0.1', port: 10002},
  ];

  const kid = id.getID(key);
  const nids = nodes.map((node) => id.getNID(node));

  const hash = id.consistentHash(kid, nids);
  const expectedHash = '8970c41015d3ccbf1f46691ae77ab225aa6c3d401f6c1c5297f4df7ec35c72b0';

  try {
    expect(expectedHash).toBeTruthy();
    expect(hash).toBe(expectedHash);
    done();
  } catch (error) {
    done(error);
  }
});

test('(2 pts) rendezvousHash()', (done) => {
  const key = 'jcarb';
  const nodes = [
    {ip: '127.0.0.1', port: 20000},
    {ip: '127.0.0.1', port: 20001},
    {ip: '127.0.0.1', port: 20002},
  ];

  const kid = id.getID(key);
  const nids = nodes.map((node) => id.getNID(node));

  const hash = id.rendezvousHash(kid, nids);
  const expectedHash = '2f29d190dcd1d1e835881ecef3cd06edfb89db1d81676ef52587d4065e24b915';

  try {
    expect(expectedHash).toBeTruthy();
    expect(hash).toBe(expectedHash);
    done();
  } catch (error) {
    done(error);
  }
});

