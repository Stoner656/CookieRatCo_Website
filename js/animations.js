/**
 * Animation effects
 * Handles typewriter effect and logo glitch
 */

// Typewriter effect for hero subtitle
function typeWriter(element, text, speed = 200) {
    element.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            // Don't show underscore when typing the period
            if (text.charAt(i) === '.') {
                element.innerHTML = text.substring(0, i + 1);
            } else {
                element.innerHTML = text.substring(0, i + 1) + '_';
            }
            i++;
            setTimeout(type, speed);
        } else {
            // Remove the underscore when typing is complete
            element.innerHTML = text;
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
    const heroTitle = document.querySelector('.hero h1');

    if (heroTitle) {
        const originalText = heroTitle.textContent;

        // Clear text immediately
        heroTitle.innerHTML = '';

        // Start typewriter effect after a short delay
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
});
