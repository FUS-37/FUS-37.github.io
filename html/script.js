/*打字机效果*/
const texts = [
    "不完全收录自2023年以来的作品",
    "探索声音的另类边界"
];
let index = 0;
let charIndex = 0;
const typingSpeed = 100;
const erasingSpeed = 50;
const newTextDelay = 2000;
const textElement = document.getElementById("text");

function type() {
    if (charIndex < texts[index].length) {
        textElement.textContent += texts[index].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        textElement.textContent = texts[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        index = (index + 1) % texts.length;
        setTimeout(type, typingSpeed + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(type, newTextDelay + 250);
});

/*缓存设置*/
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

/*音频播放*/
const buttons = document.querySelectorAll('img[id^="playPauseButton"]');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const audioId = button.id.replace('playPauseButton', 'audio');
        const audio = document.getElementById(audioId);
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });
});