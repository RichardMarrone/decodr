const plainText = document.querySelector('#plain-text div');
const encodedText = document.querySelector('#base64-text div');
const errorText = document.querySelector('#error-container p');
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const debounceInterval = 100;

// see https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem on converting unicode
function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}
  
function bytesToBase64(bytes) {
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
}

function debounce(func, interval) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            func.apply(context, args);
        }, interval);
    };
}

plainText.addEventListener('keyup', debounce(function () {
    encodedText.textContent = '';
    errorText.innerText = '';
    try {
        encodedText.textContent = bytesToBase64(encoder.encode(plainText.textContent));
    } catch (e) {
        errorText.innerText = 'Invalid Input';
    }
}, debounceInterval)    
);

encodedText.addEventListener('keyup',debounce(function () {
    plainText.textContent = '';
    errorText.innerText = ''
    try {
        plainText.textContent = decoder.decode(base64ToBytes(encodedText.textContent));
    } catch (e) {
        errorText.innerText = 'Invalid Input';
    }
}, debounceInterval));