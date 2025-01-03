const distribution = require('../index');
const util = distribution.util;

test('(5 pts) 40 bytes object', () => {
  /*
        Come up with a JavaScript object, which when serialized,
        will result in a string that is 40 bytes in size.
    */
  let object = null;

  const serialized = util.serialize(object);
  expect(serialized.length).toBe(40);
});

test('(5 pts) equal but not identical', () => {
  /* Come up with two JavaScript values
       that while not being the same when compared using JavaScript,
       result in the same serialized string.
    */

  let objectA = null;
  let objectB = null;


  const serializedA = util.serialize(objectA);
  const serializedB = util.serialize(objectB);

  expect(serializedA).toBe(serializedB);
  expect(objectA).not.toBe(objectB);
});

test('(5 pts) object for specific string', () => {
  /* Come up with a JavaScript object that will
       result in a specific string
    */
  let object = null;


  const serialized = util.serialize(object);
  // eslint-disable-next-line
    expect(serialized).toBe('{\"type\":\"object\",\"value\":{\"f\":\"{\\\"type\\\":\\\"function\\\",\\\"value\\\":\\\"(a, b) => {\\\\n      data: `data-${a}-${b}`;\\\\n    }\\\"}\"}}');
});
test('(5 pts) object not serializable', () => {
  /* Come up with a JavaScript object that cannot be
        serialized.
    */
  let objectA = null;


  const serializedA = util.serialize(objectA);

  expect(serializedA).toBe(undefined);
});

test('(5 pts) object changes after deserialization', () => {
  let object = null;


  const backAndForth = util.deserialize(util.serialize(object));

  expect(backAndForth).toStrictEqual(object);
});

test('(5 pts) object fix', () => {
  /* Modify the following object so that when serialized,
         results in the expected string. */

  let object = {a: 'jcerb', b: -87, c: (a) => 4};

  // eslint-disable-next-line
    const serializedObject = '{"type":"object","value":{"a":"{\\"type\\":\\"string\\",\\"value\\":\\"jcarb\\"}","b":"{\\"type\\":\\"number\\",\\"value\\":\\"1\\"}","c":"{\\"type\\":\\"function\\",\\"value\\":\\"(a, b) => a + b\\"}"}}';
  expect(util.serialize(object)).toBe(serializedObject);
});

test('(5 pts) string deserialized into target object', () => {
  /*
        Come up with a string that when deserialized, results in the following object:
        {a: 1, b: "two", c: false}
    */

  let string = null;


  const object = {a: 1, b: 'two', c: false};
  const deserialized = util.deserialize(string);
  expect(object).toEqual(deserialized);
});

test('(5 pts) unequal strings but equal objects', () => {
  /*
        Come up with two strings that are not equal, but when deserialized,
        result in equal objects.
    */

  let stringA = null;
  let stringB = null;


  const objectA = util.deserialize(stringA);
  const objectB = util.deserialize(stringB);
  expect(objectA).toEqual(objectB);
  expect(stringA).not.toBe(stringB);
});

test('(5 pts) malformed serialized string', () => {
  /* Come up with a string that is not a valid serialized object.
       When this string is passed to the deserialize function,
       it should throw a SyntaxError.
    */
  let malformedSerializedString = null;


  expect(() => {
    util.deserialize(malformedSerializedString);
  }).toThrow(SyntaxError);
});

function objectContainsType(object, type) {
  if (type === typeof object) {
    return true;
  }
  if ('object' !== typeof object) {
    return false;
  }
  for (const key of Object.keys(object)) {
    if (objectContainsType(object[key], type)) {
      return true;
    }
  }
  return false;
}

test('(5 pts) object contains number, bool, string', () => {
  /*

        Create an object, containing a number, a bool, and a string, that has
        length 200 when serialized.

    */
  let object = null;

  const serialized = util.serialize(object);
  expect(serialized.length).toBe(200);
  expect(objectContainsType(object, 'number')).toBe(true);
  expect(objectContainsType(object, 'boolean')).toBe(true);
  expect(objectContainsType(object, 'string')).toBe(true);
});

test('(5 pts) no digits in serialized object', () => {
  /*
        Create a non-string value whose serialized representation does not include digits.
    */
  let object;

  expect(objectContainsType(object, 'string')).toBe(false);

  const serialized = util.serialize(object);
  for (const digit of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    expect(serialized).toEqual(expect.not.stringContaining(digit.toString()));
  }
});


test('(5 pts) object with all supported data types', () => {
  /*
      An object that uses all valid (serializable) built-in data types
      supported by the serialization library.
      */
  let object = null;

  const setTypes = new Set();
  for (let k in object) {
    setTypes.add(typeof object[k]);
    if (typeof object[k] == 'object' && object[k] != null) {
      setTypes.add(object[k].constructor.name);
    } else if (typeof object[k] == 'object' && object[k] == null) {
      setTypes.add('null');
    }
  }

  let typeList = Array.from(setTypes).sort();
  let goalTypes = ['Array', 'Date', 'Error', 'Object',
    'boolean', 'function', 'null', 'number', 'object', 'string', 'undefined'];
  expect(typeList).toStrictEqual(goalTypes);

  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).not.toBeNull();

  // Deleting functions because they are not treated as equivalent by Jest
  for (let k in object) {
    if (typeof object[k] == 'function') {
      delete object[k];
      delete deserialized[k];
    }
  }
  expect(deserialized).toEqual(object);
});
