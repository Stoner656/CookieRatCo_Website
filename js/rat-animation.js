/**
 * Cookie and Rat animation functionality
 * Handles interactive cookie dragging with rat following behind
 */

(function() {
    const cookie = document.getElementById('cookieDraggable');
    const rat = document.getElementById('ratFollowing');
    const playground = document.querySelector('.playground-area');

    // Return early if elements not found
    if (!cookie || !rat || !playground) {
        console.warn('Cookie/Rat animation elements not found');
        return;
    }

    let isDragging = false;
    let startX, currentLeft;
    let cookieFrame = 1;
    let ratFrame = 1;
    let frameInterval;

    // Animation constants
    const FRAME_DELAY_DRAG = 150; // ms between frames while dragging
    const FRAME_DELAY_RUN = 100; // ms between frames while running
    const RUN_SPEED = 10; // px per step when running left
    const RETURN_SPEED = 15; // px per step when returning from right
    const ANIMATION_INTERVAL = 30; // ms between animation steps
    const GAP_BETWEEN = 100; // px gap between cookie and rat

    // Cookie animation frames (4 frames cycling)
    const cookieFrames = [
        'images/animations/cookie/cookie_1.jpg',
        'images/animations/cookie/cookie_2.jpg',
        'images/animations/cookie/cookie_3.jpg',
        'images/animations/cookie/cookie_4.jpg'
    ];

    // Rat animation frames (4 frames cycling)
    const ratFrames = [
        'images/animations/rat/rat_1.jpg',
        'images/animations/rat/rat_2.jpg',
        'images/animations/rat/rat_3.jpg',
        'images/animations/rat/rat_4.jpg'
    ];

    /**
     * Updates both cookie and rat images to the next frame
     */
    function updateFrames() {
        cookie.src = cookieFrames[cookieFrame - 1];
        cookieFrame = cookieFrame >= 4 ? 1 : cookieFrame + 1;

        rat.src = ratFrames[ratFrame - 1];
        ratFrame = ratFrame >= 4 ? 1 : ratFrame + 1;
    }

    /**
     * Updates rat position to follow the cookie (rat stays to the RIGHT)
     */
    function updateRatPosition() {
        const cookieRect = cookie.getBoundingClientRect();
        const parentRect = playground.getBoundingClientRect();
        const cookieLeft = cookieRect.left - parentRect.left;
        const cookieWidth = cookie.offsetWidth;

        // Position rat to the right of cookie: cookie.left + cookie.width + gap
        const ratLeft = cookieLeft + cookieWidth + GAP_BETWEEN;

        rat.style.left = ratLeft + 'px';
        rat.style.right = 'auto';
    }

    /**
     * Handles the complete run-off-and-return animation sequence
     */
    function runOffAndReturn() {
        cookie.classList.add('running-left');
        rat.classList.add('running-left');
        isDragging = false;
        cookie.classList.remove('dragging');

        // Start running animation frames
        const runInterval = setInterval(updateFrames, FRAME_DELAY_RUN);

        // Animate both cookie and rat running off to the left
        const animateLeft = setInterval(() => {
            const cookieRect = cookie.getBoundingClientRect();
            const ratRect = rat.getBoundingClientRect();
            const parentRect = playground.getBoundingClientRect();
            const cookieLeftPos = cookieRect.left - parentRect.left;
            const ratLeftPos = ratRect.left - parentRect.left;

            // Check if rat (which is behind) has fully left the screen
            if (ratLeftPos > -200) {
                const newCookieLeft = parseInt(cookie.style.left || 0) - RUN_SPEED;
                const newRatLeft = parseInt(rat.style.left || 0) - RUN_SPEED;

                cookie.style.left = newCookieLeft + 'px';
                rat.style.left = newRatLeft + 'px';
            } else {
                clearInterval(animateLeft);
                clearInterval(runInterval);

                // Reset positions to outside right border
                cookie.classList.remove('running-left');
                rat.classList.remove('running-left');

                const parentRect = playground.getBoundingClientRect();
                const playgroundWidth = parentRect.width;
                const cookieStartPos = playgroundWidth + 150;
                const ratStartPos = cookieStartPos + cookie.offsetWidth + GAP_BETWEEN;

                cookie.style.left = cookieStartPos + 'px';
                cookie.style.right = 'auto';
                rat.style.left = ratStartPos + 'px';
                rat.style.right = 'auto';

                // Start running animation frames for entrance
                const entranceInterval = setInterval(updateFrames, FRAME_DELAY_RUN);

                // Animate from outside right to start positions
                // Cookie target: at right border (playgroundWidth - cookieWidth)
                const cookieTargetPos = playgroundWidth - cookie.offsetWidth;
                // Rat target: to the right of cookie (cookieTarget + cookieWidth + gap)
                const ratTargetPos = cookieTargetPos + cookie.offsetWidth + GAP_BETWEEN;
                let currentCookiePos = cookieStartPos;
                let currentRatPos = ratStartPos;

                const animateRight = setInterval(() => {
                    currentCookiePos -= RETURN_SPEED;
                    currentRatPos -= RETURN_SPEED;

                    if (currentCookiePos <= cookieTargetPos) {
                        currentCookiePos = cookieTargetPos;
                        currentRatPos = ratTargetPos;
                        clearInterval(animateRight);
                        clearInterval(entranceInterval);

                        // Reset to starting positions (cookie at right border, rat to the right of cookie)
                        cookie.style.left = 'auto';
                        cookie.style.right = '0px';
                        rat.style.left = 'auto';
                        rat.style.right = '-280px'; /* -(cookie width + gap) */

                        cookie.src = cookieFrames[0];
                        rat.src = ratFrames[0];
                        cookieFrame = 1;
                        ratFrame = 1;
                    } else {
                        cookie.style.left = currentCookiePos + 'px';
                        rat.style.left = currentRatPos + 'px';
                    }
                }, ANIMATION_INTERVAL);
            }
        }, ANIMATION_INTERVAL);
    }

    /**
     * Initiates dragging when user clicks/touches the cookie
     */
    function startDragging(e) {
        if (cookie.classList.contains('running-left') || cookie.classList.contains('running-right')) return;

        isDragging = true;
        cookie.classList.add('dragging');

        // Get the starting position
        const rect = cookie.getBoundingClientRect();
        const parentRect = playground.getBoundingClientRect();
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        currentLeft = rect.left - parentRect.left;

        // Start frame animation
        frameInterval = setInterval(updateFrames, FRAME_DELAY_DRAG);

        e.preventDefault();
    }

    /**
     * Updates cookie and rat positions while dragging
     */
    function drag(e) {
        if (!isDragging) return;

        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - startX;
        let newLeft = currentLeft + deltaX;

        // Get playground boundaries
        const parentRect = playground.getBoundingClientRect();
        const playgroundWidth = parentRect.width;
        const cookieWidth = cookie.offsetWidth;

        // Calculate max right position
        const maxRight = playgroundWidth - cookieWidth;

        // Stop at left border (position 0) and trigger run animation
        if (newLeft <= 0) {
            newLeft = 0;
            cookie.style.left = '0px';
            cookie.style.right = 'auto';

            // Stop dragging and trigger run animation
            clearInterval(frameInterval);
            runOffAndReturn();
            return;
        }

        // Stop at right border
        if (newLeft >= maxRight) {
            newLeft = maxRight;
        }

        cookie.style.left = newLeft + 'px';
        cookie.style.right = 'auto';

        // Update rat to follow cookie
        updateRatPosition();

        e.preventDefault();
    }

    /**
     * Ends dragging when user releases mouse/touch
     */
    function stopDragging(e) {
        if (!isDragging) return;

        isDragging = false;
        cookie.classList.remove('dragging');
        clearInterval(frameInterval);

        // Reset to first frames
        cookieFrame = 1;
        ratFrame = 1;
        cookie.src = cookieFrames[0];
        rat.src = ratFrames[0];
    }

    // Mouse events
    cookie.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    // Touch events for mobile
    cookie.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDragging);
})();
