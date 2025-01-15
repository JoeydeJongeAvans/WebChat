const keyboardToggle = document.getElementById('keyboardToggle');
const keyboard = document.getElementById('keyboard');
const chatInput = document.getElementById('chat-input');
const messagesContainer = document.getElementById('messages');
let isShiftActive = false;

// Toetsenbord layout
const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ['space', 'enter']
];

function addMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleEnter() {
    const text = chatInput.value.trim();
    if (text) {
        addMessage(text);
        chatInput.value = '';
        keyboard.style.display = 'none';
    }
}

// Toetsenbord opbouwen
function createKeyboard() {
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        row.forEach(key => {
            const button = document.createElement('button');
            button.className = 'key';
            button.setAttribute('data-key', key);
            button.textContent = key;
            rowDiv.appendChild(button);
        });
        
        keyboard.appendChild(rowDiv);
    });
}

// Toetsenbord initialiseren
createKeyboard();

// Toetsenbord tonen/verbergen
keyboardToggle.addEventListener('click', () => {
    keyboard.style.display = keyboard.style.display === 'none' ? 'block' : 'none';
});

// Tekst invoegen op cursor positie
function insertAtCursor(field, value) {
    if (field.selectionStart || field.selectionStart === 0) {
        const startPos = field.selectionStart;
        const endPos = field.selectionEnd;
        field.value = field.value.substring(0, startPos) + value + 
                    field.value.substring(endPos, field.value.length);
        field.selectionStart = startPos + value.length;
        field.selectionEnd = startPos + value.length;
    } else {
        field.value += value;
    }
    field.focus();
}

// Event handlers voor toetsen
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', (e) => {
        e.preventDefault();
        const keyValue = key.getAttribute('data-key');
        
        switch(keyValue) {
            case 'shift':
                isShiftActive = !isShiftActive;
                keyboard.classList.toggle('shift-active');
                break;
                
            case 'backspace':
                const pos = chatInput.selectionStart;
                if (pos > 0) {
                    chatInput.value = chatInput.value.slice(0, pos - 1) + 
                                    chatInput.value.slice(pos);
                    chatInput.selectionStart = chatInput.selectionEnd = pos - 1;
                }
                break;
                
            case 'enter':
                handleEnter();
                break;
                
            case 'space':
                insertAtCursor(chatInput, ' ');
                break;
                
            default:
                let insertValue = keyValue;
                if (isShiftActive) {
                    insertValue = insertValue.toUpperCase();
                    isShiftActive = false;
                    keyboard.classList.remove('shift-active');
                }
                insertAtCursor(chatInput, insertValue);
        }
        
        chatInput.focus();
    });
});

// Enter toets op fysiek toetsenbord
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleEnter();
    }
});

// Sluit toetsenbord met Escape toets
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && keyboard.style.display === 'block') {
        keyboard.style.display = 'none';
    }
});

// Voorkom native mobiel toetsenbord
chatInput.addEventListener('focus', (e) => {
    if (window.innerWidth <= 768) {
        chatInput.blur();
        keyboard.style.display = 'block';
    }
});