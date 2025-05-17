document.addEventListener('DOMContentLoaded', async () => {
  const keypad = document.querySelector('.keypad')
  const redLed = document.getElementById('redLed')
  const greenLed = document.getElementById('greenLed')
  const correctPassword = '15964'
  let currentInput = ''

  // Move AudioContext initialization into a function
  let audioContext = null
  let audioBuffers = null

  async function initAudio() {
    if (audioContext) return // Only initialize once

    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioBuffers = {
      keyPress: null,
      correct: null,
      incorrect: null
    }

    // Load the audio files
    try {
      const [keyPressBuffer, correctBuffer, incorrectBuffer] =
        await Promise.all([
          loadAudio('assets/key_press.mp3'),
          loadAudio('assets/correct.mp3'),
          loadAudio('assets/incorrect.mp3')
        ])

      audioBuffers.keyPress = keyPressBuffer
      audioBuffers.correct = correctBuffer
      audioBuffers.incorrect = incorrectBuffer
    } catch (err) {
      console.log('Audio loading failed:', err)
    }
  }

  // Load audio files
  async function loadAudio(url) {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return await audioContext.decodeAudioData(arrayBuffer)
  }

  function playKeySound() {
    if (!audioBuffers.keyPress) return
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffers.keyPress
    source.connect(audioContext.destination)
    source.start(0)
  }

  function playCorrectSound() {
    if (!audioBuffers.correct) return
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffers.correct
    source.connect(audioContext.destination)
    source.start(0)
  }

  function playIncorrectSound() {
    if (!audioBuffers.incorrect) return
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffers.incorrect
    source.connect(audioContext.destination)
    source.start(0)
  }

  // Initialize audio on page load
  await initAudio()

  // Update click handler
  keypad.addEventListener('click', (e) => {
    if (e.target.classList.contains('key')) {
      playKeySound()
      const key = e.target.textContent
      pressKey(key)
    }
  })

  // Update touch handler
  keypad.addEventListener(
    'touchstart',
    (e) => {
      if (e.target.classList.contains('key')) {
        e.preventDefault()
        playKeySound()
        e.target.classList.add('active')
        const key = e.target.textContent
        pressKey(key)
      }
    },
    { passive: false }
  )

  keypad.addEventListener(
    'touchend',
    (e) => {
      if (e.target.classList.contains('key')) {
        e.preventDefault()
        e.target.classList.remove('active')
      }
    },
    { passive: false }
  )

  // Prevent stuck active state if touch is moved outside the key
  keypad.addEventListener('touchcancel', (e) => {
    if (e.target.classList.contains('key')) {
      e.target.classList.remove('active')
    }
  })

  // Update keyboard handler
  document.addEventListener('keydown', (e) => {
    const key = e.key
    if (isValidKey(key)) {
      const keyElement = Array.from(document.querySelectorAll('.key')).find(
        (el) => el.textContent === key
      )
      if (keyElement && !keyElement.classList.contains('active')) {
        playKeySound()
        keyElement.classList.add('active')
        pressKey(key)
      }
    }
  })

  // Handle keyboard release
  document.addEventListener('keyup', (e) => {
    const key = e.key
    if (isValidKey(key)) {
      const keyElement = Array.from(document.querySelectorAll('.key')).find(
        (el) => el.textContent === key
      )
      if (keyElement) {
        keyElement.classList.remove('active')
      }
    }
  })

  function pressKey(key) {
    // Limit input to 5 characters
    if (currentInput.length >= 5) return

    currentInput += key

    // Check password when 5 digits are entered
    if (currentInput.length === 5) {
      setTimeout(checkPassword, 300)
    }
  }

  function checkPassword() {
    if (currentInput === correctPassword) {
      greenLed.classList.add('active')
      playCorrectSound()
      setTimeout(() => {
        greenLed.classList.remove('active')
        currentInput = ''
      }, 2000)
    } else {
      redLed.classList.add('active')
      playIncorrectSound()
      setTimeout(() => {
        redLed.classList.remove('active')
        currentInput = ''
      }, 2000)
    }
  }

})
