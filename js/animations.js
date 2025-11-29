/**
 * Animation effects
 * Handles typewriter effect and logo glitch
 */

// Typewriter effect for hero subtitle
function typeWriter(element, text, speed = 100) {
    element.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Random glitch effect on logo
setInterval(() => {
    const logo = document.querySelector('.logo');
    if (Math.random() < 0.1) { // 10% chance every interval
        logo.style.animation = 'glitch 0.3s';
        setTimeout(() => {
            logo.style.animation = '';
        }, 300);
    }
}, 3000);

// Start typewriter effect on page load
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.hero .subtitle');
    const originalText = subtitle.textContent;

    // Start typewriter effect immediately
    typeWriter(subtitle, originalText, 80);
});
