function isValidKey(key) {
  const validKeys = [
    '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9',
    '*', '#'
  ]
  return validKeys.includes(key)
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidKey }
}

