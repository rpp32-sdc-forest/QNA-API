const sum = require('./demo.js');

describe('demo test', () => {
  test('return sum of two nums', () => {
        expect(sum(8,5)).toBe(13);
  })

});