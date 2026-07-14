document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const raccoonImg = document.getElementById('raccoon-img');
    const questionText = document.getElementById('question');
    const btnSi = document.getElementById('btn-si');
    const btnNo = document.getElementById('btn-no');
    const buttonsContainer = document.getElementById('buttons-container');
    const celebrationText = document.getElementById('celebration-text');
    const loveCard = document.getElementById('love-card');
    const canvas = document.getElementById('celebration-canvas');
    const ctx = canvas.getContext('2d');
    const heartsBg = document.getElementById('hearts-bg');

    // State Variables
    let clickCount = 0;
    let siScale = 1.0;
    let noScale = 1.0;
    let isCelebrating = false;
    let particles = [];
    let slideshowInterval = null;

    // Preload all images to prevent lag/blank frames
    const imagesToPreload = [
        'images/inicio.png',
        'images/sorpresa.png',
        'images/cintillo.png',
        'images/pizza.png',
        'images/pistola.png',
        'images/si.png',
        'images/adoracion.png'
    ];
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Background floating hearts
    function createBackgroundHeart() {
        if (isCelebrating) return; // Stop background spawn during heavy celebration
        
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        heart.innerHTML = '❤️';
        
        // Random horizontal position, size, and duration
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 15 + 10; // 10px to 25px
        const duration = Math.random() * 4 + 4; // 4s to 8s
        
        heart.style.left = `${startX}px`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        
        // Soft opacity variation
        heart.style.opacity = (Math.random() * 0.4 + 0.1).toFixed(2);
        
        heartsBg.appendChild(heart);
        
        // Remove after animation finishes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Spawn initial background hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createBackgroundHeart();
        }, Math.random() * 4000);
    }
    // Continue spawning background hearts
    setInterval(createBackgroundHeart, 800);

    // Spawn a physical broken heart flying out from click location
    function spawnBrokenHeart(x, y) {
        const heart = document.createElement('div');
        heart.classList.add('broken-heart-particle');
        heart.innerHTML = '💔';
        
        // Position at click coordinate
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // Random horizontal drift direction and speed
        const driftX = Math.random() * 120 - 60; // -60px to 60px
        heart.style.setProperty('--drift', `${driftX}px`);
        
        document.body.appendChild(heart);
        
        // Remove element after animation completes (1.2s in CSS)
        setTimeout(() => {
            heart.remove();
        }, 1200);
    }

    // Handle clicking "No"
    btnNo.addEventListener('click', (e) => {
        let currentImage = 'images/sorpresa.png';
        let currentText = '';

        // Spawn broken heart at cursor click coordinates
        spawnBrokenHeart(e.clientX, e.clientY);

        // Flow of images and texts based on clickCount
        if (clickCount === 0) {
            currentImage = 'images/sorpresa.png';
            currentText = '¿Seguro? 🥺';
        } else if (clickCount === 1) {
            currentImage = 'images/cintillo.png';
            currentText = 'Mira lo tierno que me puse para ti... 🥺🌸';
        } else if (clickCount === 2) {
            currentImage = 'images/pizza.png';
            currentText = 'Te compré pisa¿ 🍕 ¿Ahora sí?';
        } else if (clickCount === 3) {
            currentImage = 'images/pistola.png';
            currentText = 'A ver, ¡última advertencia, Simon! 🔫🦝';
        } else if (clickCount === 4) {
            currentImage = 'images/pistola.png';
            currentText = '¡Te dije que sí! 🔫😤';
        } else if (clickCount === 5) {
            currentImage = 'images/pistola.png';
            currentText = '¡O dices que sí o disparo amor! 🔫💥';
        } else {
            currentImage = 'images/pistola.png';
            currentText = '¡No me dejas otra opción! ¡Haz clic en SÍ! 🔫😈';
        }

        // Apply image changes with opacity transition
        raccoonImg.style.opacity = '0';
        setTimeout(() => {
            raccoonImg.src = currentImage;
            raccoonImg.style.opacity = '1';
        }, 100);

        // Trigger squash-and-stretch animation on the raccoon image
        raccoonImg.classList.add('pop');
        setTimeout(() => {
            raccoonImg.classList.remove('pop');
        }, 450);

        questionText.textContent = currentText;

        // Grow "Sí" button and shrink "No" button
        siScale += 0.22; // Grows by 22% each time to allow more clicks before covering screen
        noScale -= 0.12; // Shrinks by 12% each time
        if (noScale < 0.15) noScale = 0.15; // don't let it disappear completely

        // Apply scale transforms
        btnSi.style.transform = `scale(${siScale})`;
        
        // Trigger wobbly escape animation on "No" button
        btnNo.style.setProperty('--no-btn-scale', noScale);
        btnNo.style.transform = `scale(${noScale})`;
        btnNo.classList.add('wobble');
        setTimeout(() => {
            btnNo.classList.remove('wobble');
        }, 400);

        // Shake the card slightly for feedback
        loveCard.style.transform = 'scale(0.97) rotate(-1deg)';
        setTimeout(() => {
            loveCard.style.transform = 'scale(1) rotate(0deg)';
        }, 150);

        clickCount++;
    });

    // Handle clicking "Sí"
    btnSi.addEventListener('click', () => {
        if (isCelebrating) return;
        
        isCelebrating = true;

        // Stop button interactions and hide them
        buttonsContainer.classList.add('hidden');
        
        // Show celebration love letter text
        celebrationText.classList.remove('hidden');
        
        // Change title and subtitle
        const title = document.querySelector('.title');
        title.textContent = '¡SÍ ME AMA! 🎉💖';
        questionText.innerHTML = '¡SABÍA QUE SÍ! ¡TE AMO MUCHÍSIMO! 😭💍❤️';
        
        // Animate love card
        loveCard.classList.add('celebrating');

        // Happy images to cycle in the slideshow
        const happyImages = [
            'images/si.png',          // Proposal crying raccoon
            'images/adoracion.png',    // Praise/Glory raccoons
            'images/inicio.png',       // Hugging raccoon/cat
            'images/cintillo.png'      // Cute headband raccoon
        ];
        
        let slideshowIndex = 0;
        // Set initial celebration image
        raccoonImg.src = happyImages[slideshowIndex];

        // Start slideshow cycling through happy photos
        slideshowInterval = setInterval(() => {
            slideshowIndex = (slideshowIndex + 1) % happyImages.length;
            raccoonImg.style.opacity = '0';
            setTimeout(() => {
                raccoonImg.src = happyImages[slideshowIndex];
                raccoonImg.style.opacity = '1';
            }, 200);
        }, 2200);

        // Initialize particles
        initCanvas();
        startCelebration();
    });

    // Particle class for Canvas Celebration
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100; // start below screen
            this.size = Math.random() * 16 + 10;
            this.speedY = -(Math.random() * 8 + 5); // go up
            this.speedX = Math.random() * 6 - 3; // wobble
            
            // Rich color palette (confetti of colors)
            const colors = [
                '#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c6', // Pink shades
                '#ff0a54', '#ff5c8a', '#ff85a1', '#ffccd5', // Hot pinks
                '#ffd166', '#ffb703', '#fb8500',           // Golds & Orange
                '#06d6a0', '#118ab2', '#073b4c',           // Teals & Blues
                '#7209b7', '#f72585', '#4cc9f0',           // Purples & Cyans
                '#ff007f', '#d90429', '#3a86c8'            // Bold colors
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Types: 'heart', 'circle', 'rectangle', 'emoji'
            const types = ['heart', 'circle', 'rectangle', 'rectangle', 'emoji'];
            this.type = types[Math.floor(Math.random() * types.length)];
            
            // Choose an emoji if this particle is a bubble emoji
            const emojis = ['💖', '💍', '🦝', '✨', '😻', '💋', '❤️'];
            this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.1 - 0.05;
            this.opacity = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Apply gravity/drag (emojis rise lighter, like balloons)
            if (this.type === 'emoji') {
                this.speedY += 0.02; // slow rising deceleration
                this.speedX += Math.sin(this.y * 0.02) * 0.05;
            } else {
                this.speedY += 0.09; 
                this.speedX += Math.sin(this.y * 0.04) * 0.1;
            }
            
            this.rotation += this.rotationSpeed;
            
            // Fade out as they fall low
            if (this.speedY > 0 && this.y > canvas.height * 0.65) {
                this.opacity -= 0.015;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            
            if (this.type === 'heart') {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.bezierCurveTo(-this.size / 2, -this.size, -this.size, -this.size / 3, -this.size, 0);
                ctx.bezierCurveTo(-this.size, this.size / 3, -this.size / 3, this.size * 2/3, 0, this.size);
                ctx.bezierCurveTo(this.size / 3, this.size * 2/3, this.size, this.size / 3, this.size, 0);
                ctx.bezierCurveTo(this.size, -this.size / 3, this.size / 2, -this.size, 0, -this.size / 2);
                ctx.closePath();
                ctx.fill();
            } else if (this.type === 'circle') {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'emoji') {
                ctx.font = `${this.size * 1.5}px Arial`;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * 0.3); // rotate slower
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.emoji, 0, 0);
            } else {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            }
            
            ctx.restore();
        }
    }

    // Initialize/Resize Canvas
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => {
        if (isCelebrating) {
            initCanvas();
        }
    });

    // Celebration Loop
    function startCelebration() {
        // Spawn initial burst of particles
        for (let i = 0; i < 220; i++) {
            particles.push(new Particle());
        }

        // Periodically spawn new ones from bottom
        const spawnInterval = setInterval(() => {
            if (!isCelebrating) {
                clearInterval(spawnInterval);
                return;
            }
            for (let i = 0; i < 8; i++) {
                particles.push(new Particle());
            }
        }, 80);

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw();
                
                // Remove out of bounds or invisible particles
                if (p.y > canvas.height + 50 || p.opacity <= 0 || p.x < -50 || p.x > canvas.width + 50) {
                    particles.splice(i, 1);
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
});
