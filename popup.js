class AestheticTimer {
    constructor() {
        this.totalTime = 0;
        this.currentTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.interval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.startBackgroundAnimation();
    }
    
    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.minuteInput = document.getElementById('minuteInput');
        this.secondInput = document.getElementById('secondInput');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressCircle = document.getElementById('progressCircle');
        this.container = document.querySelector('.timer-container');
        
        // Calculate circle circumference for progress animation
        this.circumference = 2 * Math.PI * 54; // radius = 54
        this.progressCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressCircle.style.strokeDashoffset = this.circumference;
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Update display when inputs change
        this.minuteInput.addEventListener('input', () => this.updateInputs());
        this.secondInput.addEventListener('input', () => this.updateInputs());
        
        // Prevent invalid inputs
        [this.minuteInput, this.secondInput].forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }
    
    validateInput(input) {
        const min = parseInt(input.getAttribute('min'));
        const max = parseInt(input.getAttribute('max'));
        let value = parseInt(input.value);
        
        if (isNaN(value) || value < min) value = min;
        if (value > max) value = max;
        
        input.value = value;
    }
    
    updateInputs() {
        if (!this.isRunning) {
            this.validateInput(this.minuteInput);
            this.validateInput(this.secondInput);
            
            const minutes = parseInt(this.minuteInput.value) || 0;
            const seconds = parseInt(this.secondInput.value) || 0;
            
            this.totalTime = minutes * 60 + seconds;
            this.currentTime = this.totalTime;
            this.updateDisplay();
            this.updateProgress();
        }
    }
    
    start() {
        if (!this.isRunning && !this.isPaused) {
            // Starting fresh
            const minutes = parseInt(this.minuteInput.value) || 0;
            const seconds = parseInt(this.secondInput.value) || 0;
            this.totalTime = minutes * 60 + seconds;
            this.currentTime = this.totalTime;
        }
        
        if (this.currentTime <= 0) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.container.classList.add('timer-running');
        this.container.classList.remove('timer-finished');
        
        this.updateButtonStates();
        
        this.interval = setInterval(() => {
            this.currentTime--;
            this.updateDisplay();
            this.updateProgress();
            
            if (this.currentTime <= 0) {
                this.finish();
            }
        }, 1000);
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.container.classList.remove('timer-running');
            
            clearInterval(this.interval);
            this.updateButtonStates();
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        
        clearInterval(this.interval);
        
        const minutes = parseInt(this.minuteInput.value) || 0;
        const seconds = parseInt(this.secondInput.value) || 0;
        this.totalTime = minutes * 60 + seconds;
        this.currentTime = this.totalTime;
        
        this.container.classList.remove('timer-running', 'timer-finished');
        
        this.updateDisplay();
        this.updateProgress();
        this.updateButtonStates();
    }
    
    finish() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 0;
        
        clearInterval(this.interval);
        
        this.container.classList.remove('timer-running');
        this.container.classList.add('timer-finished');
        
        this.updateDisplay();
        this.updateProgress();
        this.updateButtonStates();
        
        // Play a subtle notification (visual feedback)
        this.showFinishAnimation();
    }
    
    showFinishAnimation() {
        // Create a gentle pulse effect
        const pulseAnimation = [
            { transform: 'scale(1)', filter: 'brightness(1)' },
            { transform: 'scale(1.05)', filter: 'brightness(1.2)' },
            { transform: 'scale(1)', filter: 'brightness(1)' }
        ];
        
        this.container.animate(pulseAnimation, {
            duration: 800,
            iterations: 3,
            easing: 'ease-in-out'
        });
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateProgress() {
        if (this.totalTime === 0) {
            this.progressCircle.style.strokeDashoffset = this.circumference;
            return;
        }
        
        const progress = (this.totalTime - this.currentTime) / this.totalTime;
        const offset = this.circumference - (progress * this.circumference);
        this.progressCircle.style.strokeDashoffset = offset;
    }
    
    updateButtonStates() {
        if (this.isRunning) {
            this.startBtn.style.opacity = '0.5';
            this.startBtn.style.pointerEvents = 'none';
            this.pauseBtn.style.opacity = '1';
            this.pauseBtn.style.pointerEvents = 'auto';
        } else {
            this.startBtn.style.opacity = '1';
            this.startBtn.style.pointerEvents = 'auto';
            this.pauseBtn.style.opacity = this.isPaused ? '1' : '0.5';
            this.pauseBtn.style.pointerEvents = this.isPaused ? 'auto' : 'none';
        }
        
        if (this.isPaused) {
            this.startBtn.textContent = 'Resume';
        } else {
            this.startBtn.textContent = 'Start';
        }
    }
    
    startBackgroundAnimation() {
        // Dynamic background color changes
        const colors = [
            ['#ff9a8b', '#a8e6cf', '#dcedc1', '#ffd3a5'],
            ['#ffeaa7', '#fab1a0', '#fd79a8', '#e17055'],
            ['#a29bfe', '#6c5ce7', '#fd79a8', '#fdcb6e'],
            ['#00cec9', '#55efc4', '#81ecec', '#74b9ff'],
            ['#ff7675', '#fd79a8', '#fdcb6e', '#e17055']
        ];
        
        let currentColorIndex = 0;
        const background = document.querySelector('.background');
        
        setInterval(() => {
            currentColorIndex = (currentColorIndex + 1) % colors.length;
            const newColors = colors[currentColorIndex];
            
            background.style.background = `linear-gradient(45deg, ${newColors.join(', ')})`;
        }, 15000); // Change colors every 15 seconds
        
        // Dynamic blob color changes
        this.animateBlobs();
    }
    
    animateBlobs() {
        const blobs = document.querySelectorAll('.blob');
        const blobColors = [
            ['#ff6b8a', '#ff9a8b'],
            ['#a8e6cf', '#7fcdcd'],
            ['#ffd3a5', '#ffb347'],
            ['#dcedc1', '#b8e6b8'],
            ['#74b9ff', '#0984e3'],
            ['#fd79a8', '#e84393'],
            ['#fdcb6e', '#f39c12'],
            ['#55efc4', '#00b894']
        ];
        
        setInterval(() => {
            blobs.forEach((blob, index) => {
                const randomColorPair = blobColors[Math.floor(Math.random() * blobColors.length)];
                blob.style.background = `radial-gradient(circle, ${randomColorPair[0]}, ${randomColorPair[1]})`;
            });
        }, 8000); // Change blob colors every 8 seconds
    }
}

// Initialize the timer when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new AestheticTimer();
});

// Add some gentle interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle hover effects to inputs
    const inputs = document.querySelectorAll('.time-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
