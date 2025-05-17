const assert = require('assert/strict')
const test = require('node:test')

function createDom() {
  class Element {
    constructor(tagName, opts = {}) {
      this.tagName = tagName
      this.id = opts.id || null
      this.textContent = opts.textContent || ''
      this.classSet = new Set(opts.classList || [])
      this.classList = {
        add: (c) => this.classSet.add(c),
        remove: (c) => this.classSet.delete(c),
        contains: (c) => this.classSet.has(c)
      }
      this.listeners = {}
    }
    addEventListener(event, fn) {
      ;(this.listeners[event] ||= []).push(fn)
    }
    dispatchEvent(event, payload) {
      for (const fn of this.listeners[event] || []) {
        fn(payload)
      }
    }
  }

  const keypad = new Element('div', { classList: ['keypad'] })
  const digits = ['1','2','3','4','5','6','7','8','9','*','0','#']
  const keys = digits.map(d => new Element('div', { classList: ['key'], textContent: d }))
  const greenLed = new Element('div', { classList: ['led','green'], id: 'greenLed' })
  const redLed = new Element('div', { classList: ['led','red'], id: 'redLed' })

  const elementsById = { greenLed, redLed }

  const docEvents = {}
  const document = {
    addEventListener(event, fn) {
      ;(docEvents[event] ||= []).push(fn)
    },
    async _dispatch(event) {
      for (const fn of docEvents[event] || []) {
        await fn({})
      }
    },
    querySelector(selector) {
      if (selector === '.keypad') return keypad
      return null
    },
    querySelectorAll(selector) {
      if (selector === '.key') return keys
      return []
    },
    getElementById(id) {
      return elementsById[id] || null
    }
  }

  const timers = []
  const originalSetTimeout = global.setTimeout
  const originalFetch = global.fetch
  const originalWindow = global.window

  global.setTimeout = (fn, _delay) => {
    timers.push(fn)
    return timers.length
  }

  global.fetch = async () => ({ arrayBuffer: async () => new ArrayBuffer(0) })

  class FakeAudioContext {
    constructor() { this.destination = {} }
    createBufferSource() { return { connect() {}, start() {}, buffer: null } }
    decodeAudioData() { return Promise.resolve(null) }
  }
  global.window = { AudioContext: FakeAudioContext, webkitAudioContext: FakeAudioContext }
  global.document = document

  const runNextTimer = () => {
    const fn = timers.shift()
    if (fn) fn()
  }
  const pendingTimers = () => timers.length

  const teardown = () => {
    global.setTimeout = originalSetTimeout
    global.fetch = originalFetch
    global.window = originalWindow
    delete global.document
  }

  return { document, keypad, keys, greenLed, redLed, runNextTimer, pendingTimers, teardown }
}

function pressSequence(env, seq) {
  const handler = env.keypad.listeners['click'][0]
  for (const ch of seq) {
    const key = env.keys.find(k => k.textContent === ch)
    handler({ target: key })
  }
}

test('green LED on correct password and reset', async () => {
  const env = createDom()
  delete require.cache[require.resolve('../script.js')]
  require('../script.js')
  await env.document._dispatch('DOMContentLoaded')

  pressSequence(env, ['1','5','9','6','4'])
  assert.strictEqual(env.pendingTimers(), 1)
  env.runNextTimer() // checkPassword
  assert.ok(env.greenLed.classList.contains('active'))
  assert.ok(!env.redLed.classList.contains('active'))
  assert.strictEqual(env.pendingTimers(), 1)
  env.runNextTimer() // reset LED and input
  assert.ok(!env.greenLed.classList.contains('active'))
  assert.strictEqual(env.pendingTimers(), 0)

  pressSequence(env, ['1','5','9','6','4'])
  assert.strictEqual(env.pendingTimers(), 1)
  env.runNextTimer()
  assert.ok(env.greenLed.classList.contains('active'))
  env.runNextTimer()
  env.teardown()
})

test('red LED on incorrect password and reset', async () => {
  const env = createDom()
  delete require.cache[require.resolve('../script.js')]
  require('../script.js')
  await env.document._dispatch('DOMContentLoaded')

  pressSequence(env, ['1','2','3','4','5'])
  assert.strictEqual(env.pendingTimers(), 1)
  env.runNextTimer()
  assert.ok(env.redLed.classList.contains('active'))
  assert.ok(!env.greenLed.classList.contains('active'))
  assert.strictEqual(env.pendingTimers(), 1)
  env.runNextTimer()
  assert.ok(!env.redLed.classList.contains('active'))
  assert.strictEqual(env.pendingTimers(), 0)

  pressSequence(env, ['1','2','3','4','5'])
  assert.strictEqual(env.pendingTimers(), 1)
  env.runNextTimer()
  assert.ok(env.redLed.classList.contains('active'))
  env.runNextTimer()
  env.teardown()
})
