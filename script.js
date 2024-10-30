document.addEventListener('DOMContentLoaded', () => {
    const keypad = document.querySelector('.keypad');
    const redLed = document.getElementById('redLed');
    const greenLed = document.getElementById('greenLed');
    const correctPassword = '15923';
    let currentInput = '';
    
    // Handle clicks
    keypad.addEventListener('click', (e) => {
        if (e.target.classList.contains('key')) {
            const key = e.target.textContent;
            pressKey(key);
        }
    });
    
    // Handle touch events
    keypad.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('key')) {
            e.preventDefault(); // Prevent double-firing of click event
            e.target.classList.add('active');
            const key = e.target.textContent;
            pressKey(key);
        }
    }, { passive: false });

    keypad.addEventListener('touchend', (e) => {
        if (e.target.classList.contains('key')) {
            e.preventDefault();
            e.target.classList.remove('active');
        }
    }, { passive: false });

    // Prevent stuck active state if touch is moved outside the key
    keypad.addEventListener('touchcancel', (e) => {
        if (e.target.classList.contains('key')) {
            e.target.classList.remove('active');
        }
    });
    
    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (isValidKey(key)) {
            // Find and animate the corresponding key button
            const keyElement = Array.from(document.querySelectorAll('.key'))
                .find(el => el.textContent === key);
            if (keyElement) {
                keyElement.classList.add('active');
                pressKey(key);
            }
        }
    });

    // Handle keyboard release
    document.addEventListener('keyup', (e) => {
        const key = e.key;
        if (isValidKey(key)) {
            const keyElement = Array.from(document.querySelectorAll('.key'))
                .find(el => el.textContent === key);
            if (keyElement) {
                keyElement.classList.remove('active');
            }
        }
    });
    
    function pressKey(key) {
        // Limit input to 5 characters
        if (currentInput.length >= 5) return;
        
        currentInput += key;
        
        // Check password when 5 digits are entered
        if (currentInput.length === 5) {
            setTimeout(checkPassword, 300);
        }
    }
    
    function checkPassword() {
        if (currentInput === correctPassword) {
            greenLed.classList.add('active');
            setTimeout(() => {
                greenLed.classList.remove('active');
                currentInput = '';
            }, 2000);
        } else {
            redLed.classList.add('active');
            setTimeout(() => {
                redLed.classList.remove('active');
                currentInput = '';
            }, 2000);
        }
    }
    
    function isValidKey(key) {
        const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];
        return validKeys.includes(key);
    }
});
