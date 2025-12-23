# scenarios

## Running

Use `npm test` to test all scenarios or `npm test $MILESTONE` to test a specific milestone.

```bash
npm test $MILESTONE # Example: npm test m1
```

## Scenario Format

Each scenario is a single test case.
The test case will usually include some preparation steps, ask you to either fill out
some code to make the `expect` calls pass, or write the `expect` calls themselves.

An example of a scenario to M1 is shown below:
```javascript
test('(5 pts) (scenario) 40 bytes object', () => {
/* 
    Come up with a JavaScript object, which when serialized, 
    will result in a string that is 40 bytes in size.
*/
    let object = null;
    // Make the object so that the serialized size is 40 bytes
    object = "abcdefghijkl";

    const serialized = util.serialize(object);
    expect(serialized.length).toEqual(40);
});
```
