document.addEventListener('DOMContentLoaded', () => {
    // --- Container Elements ---
    const gameContainer = document.getElementById('game-container');
    const questionContainer = document.getElementById('question-container');
    const heartGameContainer = document.getElementById('heart-game-container');
    const finaleContainer = document.getElementById('finale-container');

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

    // --- State Variables ---
    let orbClicks = 0;
    const maxOrbClicks = 5;

    let currentQuestion = 0;
    const questions = [
        "Do you love me? 🥺",
        "Really really? 💕",
        "Will you be my forever Valentine? 💘"
    ];

    let heartsCaught = 0;
    const maxHearts = 10;
    let heartInterval;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
    function startQuestions() {
        btnNo.style.position = 'relative'; // Reset position
        btnNo.style.left = 'auto';
        btnNo.style.top = 'auto';
        currentQuestion = 0;
        updateQuestion();
    }

    function updateQuestion() {
        questionText.classList.remove('active');
        setTimeout(() => {
            questionText.textContent = questions[currentQuestion];
            questionText.classList.add('active');
        }, 200);
    }

    btnYes.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < questions.length - 1) {
            updateQuestion();
        } else if (currentQuestion === questions.length - 1) {
            // Last question, NO button runs away!
            updateQuestion();
            makeBtnNoRunaway();
        } else {
            // Questions done!
            switchPhase(questionContainer, heartGameContainer);
            startHeartGame();
        }
    });

    // Make the NO button move away when hovered/touched
    function makeBtnNoRunaway() {
        btnNo.classList.add('runaway');
        const moveBtn = () => {
            const cardRect = document.querySelector('.card').getBoundingClientRect();
            // Move it somewhere randomly inside the screen bounds, relative to card
            const maxW = window.innerWidth - 100;
            const maxH = window.innerHeight - 50;
            const randomX = Math.random() * maxW - cardRect.left;
            const randomY = Math.random() * maxH - cardRect.top;

            btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
        };

        btnNo.addEventListener('mouseover', moveBtn);
        btnNo.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent accidental clicking
            moveBtn();
        });

        btnNo.addEventListener('click', () => {
            // Just in case they manage to click it
            alert("Oops! You missed the 'Yes' button! 😜");
        });
    }

    // Default No button behavior for earlier questions
    btnNo.addEventListener('click', (e) => {
        if (!btnNo.classList.contains('runaway')) {
            alert("Wrong answer! Try again. 😠");
        }
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

        // Use text heart to allow CSS coloring across rendering engines
        heart.textContent = '\u2665\uFE0E';

        const isTarget = Math.random() > 0.6; // 40% chance of skyblue

        if (isTarget) {
            heart.dataset.target = 'true';
            heart.style.color = '#4facfe'; // Skyblue
            heart.style.filter = 'drop-shadow(0 5px 15px rgba(79, 172, 254, 0.8))';
        } else {
            heart.dataset.target = 'false';
            const wrongColors = ['#ff0844', '#fbc2eb', '#f6d365', '#a18cd1', '#ff512f', '#ffffff'];
            const randomColor = wrongColors[Math.floor(Math.random() * wrongColors.length)];
            heart.style.color = randomColor;
            heart.style.filter = `drop-shadow(0 5px 15px ${randomColor})`;
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
                // Wrong heart penalty
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
    function finishGame() {
        switchPhase(heartGameContainer, finaleContainer);
        document.body.classList.add('success-bg');
        setTimeout(fireGrandConfetti, 500);
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

        switchPhase(finaleContainer, gameContainer);
    });
});
