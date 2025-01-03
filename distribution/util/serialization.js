/*
    Checklist:

    1. Serialize strings
    2. Serialize numbers
    3. Serialize booleans
    4. Serialize (non-circular) Objects
    5. Serialize (non-circular) Arrays
    6. Serialize undefined and null
    7. Serialize Date, Error objects
    8. Serialize (non-native) functions
    9. Serialize circular objects and arrays
    10. Serialize native functions
*/

var nativeFunctions = {
  forward: new Map(),
  reverse: new Map(),
};

function createNativeMap() {
  var seenObjects = [];

  function getProperties(name, o) {
    if (o === null || o === undefined) {
      return;
    }

    if (seenObjects.indexOf(o) !== -1) {
      return;
    }

    seenObjects.push(o);

    Object.getOwnPropertyNames(o).forEach((key) => {
      /* We consider all functions inside native modules as native functions. */
      if (typeof o[key] === 'function') {
        nativeFunctions.forward.set(o[key], name + '.' + key);
        nativeFunctions.reverse.set(name + '.' + key, o[key]);
        return;
      }

      if (typeof o[key] === 'object' && seenObjects.indexOf(o[key]) === -1) {
        getProperties(name + '.' + key, o[key]);
      }
    });
  }

  const fs = require('fs');
  const http = require('http');
  const https = require('https');
  const url = require('url');
  const path = require('path');
  const os = require('os');
  const events = require('events');
  const stream = require('stream');
  const util = require('util');
  const querystring = require('querystring');
  // const crypto = require('crypto'); /* Deprecation warning */
  const zlib = require('zlib');
  const buffer = require('buffer');
  const childProcess = require('child_process');
  const cluster = require('cluster');
  const dgram = require('dgram');
  const dns = require('dns');
  const http2 = require('http2');
  const v8 = require('v8');

  getProperties('globalThis', globalThis);
  getProperties('fs', fs);
  getProperties('http', http);
  getProperties('https', https);
  getProperties('url', url);
  getProperties('path', path);
  getProperties('os', os);
  getProperties('events', events);
  getProperties('stream', stream);
  getProperties('util', util);
  getProperties('querystring', querystring);
  // getProperties('crypto', crypto); /* Deprecation warning */
  getProperties('zlib', zlib);
  getProperties('buffer', buffer);
  getProperties('child_process', childProcess);
  getProperties('cluster', cluster);
  getProperties('dgram', dgram);
  getProperties('dns', dns);
  getProperties('http2', http2);
  getProperties('v8', v8);
}

createNativeMap();

function decycleObject(o) {
  if (o === null || o === undefined) {
    return o;
  }

  var objects = new WeakMap(); // object to path map

  function decycle(value, path) {
    var oldPath; // The path of an earlier occurance of value
    var nu; // The new object or array

    if (!( typeof value === 'object' &&
               !(value instanceof Error) &&
               !(value instanceof Date) &&
               !(value instanceof Boolean) &&
               value !== null)) {
      return value;
    }

    oldPath = objects.get(value);
    if (oldPath !== undefined) {
      return {'$reference': oldPath};
    }

    objects.set(value, path);

    if (Array.isArray(value)) {
      nu = [];
      value.forEach(function(element, i) {
        let pathNew = [...path, i];
        nu[i] = decycle(element, pathNew);
      });
    } else {
      nu = {};
      Object.keys(value).forEach((name) => {
        let pathNew = [...path, JSON.stringify(name)];
        nu[name] = decycle(
            value[name],
            pathNew,
        );
      });
    }
    return nu;
  }

  return decycle(o, []);
};

function serializeBaseStructure(s) {
  return {
    type: typeof s,
    value: s.toString(),
  };
}

function serializeUndefined(_) {
  return {
    type: 'undefined',
    value: '',
  };
}

function getObjectSubType(o) {
  if (o instanceof Array) {
    return 'array';
  }

  if (o instanceof Date) {
    return 'date';
  }

  if (o instanceof Error) {
    return 'error';
  }

  if (o === null) {
    return 'null';
  }

  return 'object';
}

function serializeObject(o) {
  /* Handle subtypes of Object. */
  let objectSubType = getObjectSubType(o);

  if (objectSubType === 'null') {
    return {
      type: objectSubType,
      value: '',
    };
  }

  if (objectSubType === 'date') {
    return {
      type: objectSubType,
      value: o.toJSON(),
    };
  }

  if (objectSubType === 'error') {
    return {
      type: objectSubType,
      value: serializeObject({
        name: o.name,
        message: o.message,
        cause: o.cause,
      }),
    };
  }

  function isCyclicReference(o) {
    return Object.keys(o).length == 1 && Object.keys(o)[0] == '$reference';
  }

  /* Handle cyclic objects. */
  if (isCyclicReference(o)) {
    return {
      type: 'reference',
      value: o['$reference'],
    };
  }

  let serializedObject = {};

  for (const [key, value] of Object.entries(o)) {
    serializedObject[key] = serialize(value);
  }

  return {
    type: objectSubType,
    value: serializedObject,
  };
}

function serializeFunction(f) {
  if (nativeFunctions.forward.has(f)) {
    return {
      type: 'native',
      value: nativeFunctions.forward.get(f),
    };
  }

  return {
    type: 'function',
    value: f.toString(),
  };
}

function serialize(object) {
  object = decycleObject(object);

  let serializedObject;

  switch (typeof object) {
    case 'object':
      serializedObject = serializeObject(object);
      break;
    case 'function':
      serializedObject = serializeFunction(object);
      break;
    case 'undefined':
      serializedObject = serializeUndefined(object);
      break;
    case 'number':
    case 'string':
    case 'boolean':
      serializedObject = serializeBaseStructure(object);
      break;
  }

  return JSON.stringify(serializedObject);
}

function deserializeObject(serializedObject, object) {
  for (const [key, value] of Object.entries(serializedObject)) {
    object[key] = deserialize(value, object);
  }

  return object;
}

function deserializeArray(serializedArray, array) {
  for (const [key, value] of Object.entries(serializedArray)) {
    array[key] = deserialize(value, array);
  }

  return array;
}

function deserializeString(serializedString) {
  return serializedString;
}

function deserializeNumber(serializedNumber) {
  return Number(serializedNumber);
}

function deserializeFunction(serializedFunction) {
  /*
       The Function constructor expects only the function body.
       For that, we need to 'wrap' it inside a return statement.
    */
  return new Function('return ' + serializedFunction)();
}

function deserializeError(serializedError) {
  let errorObject = deserialize(serializedError);
  let error = new Error(errorObject.message, errorObject.cause);

  return error;
}

function deserializeReference(serializedReference, object) {
  let value = object;

  for (let k of serializedReference) {
    k = JSON.parse(k);
    value = value[k];
  }

  return value;
}


function deserializeNative(serializedNative) {
  return nativeFunctions.reverse.get(serializedNative);
}

function deserialize(string, object=null) {
  let serializedObject;

  if (typeof string === 'object') {
    serializedObject = string;
  } else if (typeof string === 'string') {
    serializedObject = JSON.parse(string);
  } else {
    throw new Error(`Invalid argument type: ${typeof string}.`);
  }

  if (object === null) {
    object = {};
  }

  switch (serializedObject.type) {
    case 'object':
      object = deserializeObject(serializedObject.value, {});
      break;
    case 'array':
      object = deserializeArray(serializedObject.value, []);
      break;
    case 'function':
      object = deserializeFunction(serializedObject.value);
      break;
    case 'native':
      object = deserializeNative(serializedObject.value);
      break;
    case 'reference':
      object = deserializeReference(serializedObject.value, object);
      break;
    case 'number':
      object = deserializeNumber(serializedObject.value);
      break;
    case 'string':
      object = deserializeString(serializedObject.value);
      break;
    case 'boolean':
      object = serializedObject.value === 'true';
      break;
    case 'date':
      object = new Date(serializedObject.value);
      break;
    case 'error':
      object = deserializeError(serializedObject.value);
      break;
    case 'null':
      object = null;
      break;
    case 'undefined':
      object = undefined;
      break;
  }

  return object;
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
