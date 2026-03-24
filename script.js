document.addEventListener('DOMContentLoaded', () => {
    // --- Container Elements ---
    const loginContainer = document.getElementById('login-container');
    const gameContainer = document.getElementById('game-container');
    const questionContainer = document.getElementById('question-container');
    const heartGameContainer = document.getElementById('heart-game-container');
    const finaleContainer = document.getElementById('finale-container');

    // --- Phase 0: Login Elements ---
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');

    // --- Phase 1: Orb Game Elements ---
    const orbContainer = document.getElementById('orb-container');
    const orb = document.getElementById('orb');
    const progressBar = document.getElementById('progress-bar');

    // --- Phase 2: Question Elements ---
    const questionText = document.getElementById('question-text');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    // --- Phase 3: Heart Game Elements ---
    const heartArea = document.getElementById('heart-area');
    const heartProgressBar = document.getElementById('heart-progress-bar');

    // --- Phase 4: Finale Elements ---
    const resetBtn = document.getElementById('reset-btn');
    const extraBtn = document.getElementById('extra-btn');
    const secretMessage = document.getElementById('secret-message');
    const finalMainText = document.getElementById('final-main-text');
    const finalSubText = document.getElementById('final-sub-text');

    // --- State Variables ---
    let orbClicks = 0;
    const maxOrbClicks = 5;

    let currentQuestion = 0;
    const questions = [
        "Are you ready for your surprise? 👀",
        "Are you sure? It's a big one! 🎁",
        "Promise you won't get mad if it's too cheesy? 🧀"
    ];

    let heartsCaught = 0;
    const maxHearts = 1; // Catch an icecream
    let heartInterval;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // ==========================================
    // PHASE 0: LOGIN LOGIC
    // ==========================================
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const user = usernameInput.value.trim().toLowerCase();
            const pass = passwordInput.value.trim();

            if (user === 'navinkaviya' && pass === '3018') {
                loginError.style.display = 'none';
                switchPhase(loginContainer, gameContainer);
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    // ==========================================
    // PHASE TRANSITION LOGIC
    // ==========================================
    function switchPhase(fromContainer, toContainer) {
        fromContainer.classList.remove('active');
        setTimeout(() => {
            fromContainer.classList.add('hidden');
            toContainer.classList.remove('hidden');
            // Slight delay before fading in
            setTimeout(() => {
                toContainer.classList.add('active');
            }, 50);
        }, 600); // Wait for fade out
    }

    // ==========================================
    // PHASE 1: ORB GAME
    // ==========================================
    if (!isMobile) {
        orbContainer.addEventListener('mouseover', () => {
            // Easier difficulty: 40% chance to dodge, smaller dodge area
            if (Math.random() > 0.6) {
                const maxX = window.innerWidth / 4;
                const maxY = window.innerHeight / 4;

                const randomX = (Math.random() - 0.5) * maxX;
                const randomY = (Math.random() - 0.5) * maxY;

                orbContainer.style.transform = `translate(${randomX}px, ${randomY}px)`;
            }
        });
    }

    orb.addEventListener('click', (e) => {
        e.stopPropagation();

        orbClicks++;
        const progress = (orbClicks / maxOrbClicks) * 100;
        progressBar.style.width = `${progress}%`;

        // Change color based on progress
        if (orbClicks === 1) {
            document.documentElement.style.setProperty('--orb-color-1', '#f6d365');
            document.documentElement.style.setProperty('--orb-color-2', '#fda085');
            document.documentElement.style.setProperty('--orb-shadow', 'rgba(253, 160, 133, 0.5)');
        } else if (orbClicks === 3) {
            document.documentElement.style.setProperty('--orb-color-1', '#a18cd1');
            document.documentElement.style.setProperty('--orb-color-2', '#fbc2eb');
            document.documentElement.style.setProperty('--orb-shadow', 'rgba(161, 140, 209, 0.5)');
        } else if (orbClicks === 4) {
            document.documentElement.style.setProperty('--orb-color-1', '#ff0844');
            document.documentElement.style.setProperty('--orb-color-2', '#ffb199');
            document.documentElement.style.setProperty('--orb-shadow', 'rgba(255, 8, 68, 0.5)');
            orb.style.animation = 'float 0.5s ease-in-out infinite, pulse 0.2s infinite';
        }

        if (orbClicks >= maxOrbClicks) {
            switchPhase(gameContainer, questionContainer);
            startQuestions();
        } else {
            orbContainer.style.transform = `translate(0px, 0px) scale(1.1)`;
            setTimeout(() => {
                orbContainer.style.transform = `translate(0px, 0px) scale(1)`;
            }, 200);
        }
    });

    // ==========================================
    // PHASE 2: QUESTIONS
    // ==========================================
    let isYesDodgingPhase = false;
    let yesDodgeTimer;

    function startQuestions() {
        currentQuestion = 0;
        updateQuestion();
    }

    function updateQuestion() {
        questionText.classList.remove('active');
        
        // Reset Yes button dodge logic for each question
        isYesDodgingPhase = true;
        btnYes.style.transform = '';
        btnYes.classList.remove('runaway');
        btnYes.style.position = '';
        btnYes.style.bottom = '';
        btnYes.style.right = '';
        btnYes.style.left = '';
        btnYes.style.top = '';

        if (yesDodgeTimer) clearTimeout(yesDodgeTimer);

        // After 10 seconds, stop dodging and move to the corner
        yesDodgeTimer = setTimeout(() => {
            isYesDodgingPhase = false;
            
            // Move to corner (fixed position at bottom right)
            btnYes.style.transform = '';
            btnYes.style.position = 'fixed';
            btnYes.style.bottom = '30px';
            btnYes.style.right = '30px';
        }, 10000);

        setTimeout(() => {
            questionText.textContent = questions[currentQuestion];
            questionText.classList.add('active');
        }, 200);
    }

    const moveYesBtn = () => {
        // Move within a small radius (~100px) from its original position
        const maxRadius = 100;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * maxRadius + 20; // Move 20px to 120px away
        
        const randomX = Math.cos(angle) * distance;
        const randomY = Math.sin(angle) * distance;

        btnYes.style.transform = `translate(${randomX}px, ${randomY}px)`;
    };

    btnYes.addEventListener('mouseover', () => {
        if (isYesDodgingPhase) {
            btnYes.classList.add('runaway');
            moveYesBtn();
        }
    });

    btnYes.addEventListener('touchstart', (e) => {
        if (isYesDodgingPhase) {
            e.preventDefault(); // Prevent accidental clicking
            btnYes.classList.add('runaway');
            moveYesBtn();
        }
    });

    btnYes.addEventListener('click', (e) => {
        if (isYesDodgingPhase) {
            e.preventDefault();
            return;
        }

        currentQuestion++;
        if (currentQuestion < questions.length) {
            updateQuestion();
        } else {
            // Questions done!
            switchPhase(questionContainer, heartGameContainer);
            startHeartGame();
        }
    });

    // Default No button behavior for all questions
    btnNo.addEventListener('click', (e) => {
        alert("Wrong answer! Try again. 😠");
    });

    // ==========================================
    // PHASE 3: HEART GAME
    // ==========================================
    function startHeartGame() {
        heartsCaught = 0;
        heartProgressBar.style.width = '0%';
        heartArea.innerHTML = ''; // Clear existing hearts

        heartInterval = setInterval(spawnHeart, 600); // Spawn faster for more options
    }

    function spawnHeart() {
        if (!heartGameContainer.classList.contains('active')) return;

        const heart = document.createElement('div');
        heart.classList.add('falling-heart');

        const isTarget = Math.random() > 0.7; // 30% chance of ice cream

        if (isTarget) {
            heart.dataset.target = 'true';
            heart.textContent = '🍦';
            heart.style.filter = 'drop-shadow(0 5px 15px rgba(255, 255, 255, 0.8))';
        } else {
            heart.dataset.target = 'false';
            heart.textContent = Math.random() > 0.5 ? '🍫' : '🍪';
            heart.style.filter = 'drop-shadow(0 5px 15px rgba(100, 50, 0, 0.5))';
        }

        // Random position and duration
        const startX = Math.random() * (window.innerWidth - 60);
        heart.style.left = `${startX}px`;

        const duration = Math.random() * 2 + 3; // 3 to 5 seconds
        heart.style.animationDuration = `${duration}s`;

        heartArea.appendChild(heart);

        // Click to catch
        heart.addEventListener('mousedown', catchHeart);
        heart.addEventListener('touchstart', (e) => {
            e.preventDefault();
            catchHeart(e);
        }, { passive: false });

        function catchHeart(e) {
            if (heart.dataset.target === 'true') {
                heart.remove();
                heartsCaught++;

                // Pop effect with skyblue confetti
                const rect = heart.getBoundingClientRect();
                createMiniConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, ['#4facfe', '#00f2fe']);

                const progress = (heartsCaught / maxHearts) * 100;
                heartProgressBar.style.width = `${progress}%`;

                if (heartsCaught >= maxHearts) {
                    clearInterval(heartInterval);
                    finishGame();
                }
            } else {
                // Wrong item penalty
                heart.style.animation = 'none';
                heart.textContent = '❌';
                heart.style.filter = 'none';

                if (heartsCaught > 0) {
                    heartsCaught--;
                    const progress = (heartsCaught / maxHearts) * 100;
                    heartProgressBar.style.width = `${progress}%`;
                }

                setTimeout(() => {
                    if (heart.parentNode) heart.remove();
                }, 500);
            }
        }

        // Remove after animation completes to avoid DOM clutter
        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, duration * 1000);
    }

    function createMiniConfetti(x, y, colors = null) {
        let options = { startVelocity: 15, spread: 360, ticks: 40, zIndex: 15, particleCount: 15 };
        if (colors) options.colors = colors;

        // Normalize coordinates for canvas-confetti
        const normalizedX = x / window.innerWidth;
        const normalizedY = y / window.innerHeight;
        confetti(Object.assign({}, options, { origin: { x: normalizedX, y: normalizedY } }));
    }

    // ==========================================
    // PHASE 4: FINALE
    // ==========================================
    let floatingWordsInterval;

    function startFloatingWords() {
        floatingWordsInterval = setInterval(() => {
            if (!finaleContainer.classList.contains('active')) return;
            
            const wordList = ['love u', 'kN', 'Happy Birthday!', 'Pondatti', 'Umma', '❤️', '😘', '💕'];
            const wordText = wordList[Math.floor(Math.random() * wordList.length)];
            
            const wordEl = document.createElement('div');
            wordEl.classList.add('floating-word');
            wordEl.textContent = wordText;
            
            const startX = Math.random() * (window.innerWidth - 100);
            wordEl.style.left = `${startX}px`;
            
            const colors = ['#ff0844', '#fbc2eb', '#f6d365', '#a18cd1', '#ff512f', '#ffffff', '#4facfe', '#ff9a9e'];
            wordEl.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            const duration = Math.random() * 4 + 4;
            wordEl.style.animationDuration = `${duration}s`;
            const size = Math.random() * 1.5 + 1.2;
            wordEl.style.fontSize = `${size}rem`;
            
            document.body.appendChild(wordEl);
            
            setTimeout(() => {
                if (wordEl.parentNode) wordEl.remove();
            }, duration * 1000);
        }, 300);
    }

    function finishGame() {
        switchPhase(heartGameContainer, finaleContainer);
        document.body.classList.add('success-bg');
        setTimeout(fireGrandConfetti, 500);
        setTimeout(startFloatingWords, 1000);
    }

    function fireGrandConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 15 };

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    }

    // ==========================================
    // EXTRA BUTTON LOGIC
    // ==========================================
    if (extraBtn) {
        extraBtn.addEventListener('click', () => {
            if (secretMessage.style.display === 'none' || secretMessage.style.display === '') {
                secretMessage.style.display = 'block';
                finalMainText.style.display = 'none';
                finalSubText.style.display = 'none';
                extraBtn.textContent = 'Hide Secret';
            } else {
                secretMessage.style.display = 'none';
                finalMainText.style.display = 'block';
                finalSubText.style.display = 'block';
                extraBtn.textContent = 'Click for a Surprise!';
            }
        });
    }

    // ==========================================
    // RESET LOGIC
    // ==========================================
    resetBtn.addEventListener('click', () => {
        // Reset Phase 1
        orbClicks = 0;
        progressBar.style.width = '0%';
        document.documentElement.style.setProperty('--orb-color-1', '#4facfe');
        document.documentElement.style.setProperty('--orb-color-2', '#00f2fe');
        document.documentElement.style.setProperty('--orb-shadow', 'rgba(79, 172, 254, 0.5)');
        orb.style.animation = 'float 4s ease-in-out infinite';
        orbContainer.style.transform = `translate(0px, 0px)`;

        // Reset visuals
        document.body.classList.remove('success-bg');
        btnNo.classList.remove('runaway');
        btnNo.style.transform = 'none';

        if (floatingWordsInterval) clearInterval(floatingWordsInterval);
        document.querySelectorAll('.floating-word').forEach(el => el.remove());

        usernameInput.value = '';
        passwordInput.value = '';
        loginError.style.display = 'none';

        if (secretMessage) secretMessage.style.display = 'none';
        if (finalMainText) finalMainText.style.display = 'block';
        if (finalSubText) finalSubText.style.display = 'block';
        if (extraBtn) extraBtn.textContent = 'Click for a Surprise!';

        switchPhase(finaleContainer, loginContainer);
    });
});
