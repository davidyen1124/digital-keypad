const assert = require('assert/strict')
const { isValidKey } = require('../utils')
const test = require('node:test')

test('isValidKey accepts digits', () => {
  for (let i = 0; i <= 9; i++) {
    assert.ok(isValidKey(String(i)))
  }
})

test('isValidKey accepts * and #', () => {
  assert.ok(isValidKey('*'))
  assert.ok(isValidKey('#'))
})

test('isValidKey rejects invalid characters', () => {
  const invalid = ['a', 'A', ' ', '', '10', '!']
  for (const ch of invalid) {
    assert.ok(!isValidKey(ch))
  }
})

