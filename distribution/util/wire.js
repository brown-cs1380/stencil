function createRPC(func) {
  // Write some code...
}

/*
    The toAsync function converts a synchronous function that returns a value
    to one that takes a callback as its last argument and returns the value
    to the callback.
*/
function toAsync(func) {
  log(`Converting function to async: ${func.name}: ${func.toString().replace(/\n/g, '|')}`);

  // It's the caller's responsibility to provide a callback
  const asyncFunc = (...args) => {
    const callback = args.pop();
    try {
      const result = func(...args);
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  };

  /* Overwrite toString to return the original function's code.
   Otherwise, all functions passed through toAsync would have the same id. */
  asyncFunc.toString = () => func.toString();
  return asyncFunc;
}

module.exports = {
  createRPC: createRPC,
  toAsync: toAsync,
};
