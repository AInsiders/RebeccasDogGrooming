/* ==========================================================================
   INTERACTIVE BACKGROUND - CUTE & MINIMALISTIC
   ========================================================================== */

class InteractiveBackground {
    constructor() {
        this.container = document.getElementById('hero-bg');
        if (!this.container) return;
        
        this.mouse = { x: 0, y: 0 };
        this.elements = [];
        this.isActive = false;
        
        this.init();
        this.addEventListeners();
        this.animate();
    }
    
    init() {
        // Create floating elements
        this.createFloatingElements();
        
        // Add subtle gradient overlay
        this.createGradientOverlay();
    }
    
    createFloatingElements() {
        const elementTypes = ['🐾', '🦴', '💕', '✨', '🌸'];
        const colors = ['#FDE2E4', '#FFF3B0', '#FFCDE1', '#FFF9F2'];
        
        // Create paw prints
        for (let i = 0; i < 8; i++) {
            this.createElement('paw-print', elementTypes[0], colors[Math.floor(Math.random() * colors.length)]);
        }
        
        // Create bubbles
        for (let i = 0; i < 6; i++) {
            this.createElement('bubble', '○', colors[Math.floor(Math.random() * colors.length)]);
        }
        
        // Create hearts
        for (let i = 0; i < 4; i++) {
            this.createElement('heart', elementTypes[2], colors[Math.floor(Math.random() * colors.length)]);
        }
        
        // Create sparkles
        for (let i = 0; i < 5; i++) {
            this.createElement('sparkle', elementTypes[3], colors[Math.floor(Math.random() * colors.length)]);
        }
    }
    
    createElement(type, symbol, color) {
        const element = document.createElement('div');
        element.className = `floating-element ${type}`;
        element.textContent = symbol;
        element.style.color = color;
        
        // Random positioning
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = 0.8 + Math.random() * 1.2;
        element.style.fontSize = (size * 24) + 'px';
        
        // Random opacity
        element.style.opacity = 0.3 + Math.random() * 0.4;
        
        // Random animation delay
        element.style.animationDelay = Math.random() * 5 + 's';
        
        // Store element data
        this.elements.push({
            element: element,
            type: type,
            originalX: parseFloat(element.style.left),
            originalY: parseFloat(element.style.top),
            speed: 0.5 + Math.random() * 1,
            direction: Math.random() * Math.PI * 2
        });
        
        this.container.appendChild(element);
    }
    
    createGradientOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'bg-gradient-overlay';
        this.container.appendChild(overlay);
    }
    
    addEventListeners() {
        // Mouse move for interactive response
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width;
            this.mouse.y = (e.clientY - rect.top) / rect.height;
            this.isActive = true;
        });
        
        // Mouse leave to reset
        this.container.addEventListener('mouseleave', () => {
            this.isActive = false;
        });
        
        // Touch events for mobile
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.container.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = (touch.clientX - rect.left) / rect.width;
            this.mouse.y = (touch.clientY - rect.top) / rect.height;
            this.isActive = true;
        });
        
        this.container.addEventListener('touchend', () => {
            this.isActive = false;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        this.elements.forEach((item, index) => {
            const element = item.element;
            const speed = item.speed;
            const direction = item.direction;
            
            // Base floating animation
            const floatX = Math.sin(time * speed + index) * 20;
            const floatY = Math.cos(time * speed * 0.7 + index) * 15;
            
            // Mouse interaction
            let mouseInfluence = 0;
            if (this.isActive) {
                const distanceX = this.mouse.x - (item.originalX / 100);
                const distanceY = this.mouse.y - (item.originalY / 100);
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                if (distance < 0.3) {
                    mouseInfluence = (0.3 - distance) / 0.3;
                    // Gentle repulsion effect
                    const repelX = -distanceX * mouseInfluence * 30;
                    const repelY = -distanceY * mouseInfluence * 30;
                    
                    element.style.transform = `translate(${item.originalX + floatX + repelX}px, ${item.originalY + floatY + repelY}px) scale(${1 + mouseInfluence * 0.2})`;
                } else {
                    element.style.transform = `translate(${item.originalX + floatX}px, ${item.originalY + floatY}px)`;
                }
            } else {
                element.style.transform = `translate(${item.originalX + floatX}px, ${item.originalY + floatY}px)`;
            }
            
            // Subtle rotation
            element.style.transform += ` rotate(${Math.sin(time * 0.5 + index) * 5}deg)`;
            
            // Opacity breathing effect
            const opacity = 0.3 + Math.sin(time * 2 + index) * 0.1;
            element.style.opacity = opacity;
        });
    }
}

/* ==========================================================================
   INITIALIZE INTERACTIVE BACKGROUND
   ========================================================================== */

let interactiveBg = null;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on homepage
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        interactiveBg = new InteractiveBackground();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (interactiveBg) {
        interactiveBg = null;
    }
});
