/* ==========================================================================
   ANABEL DOG GROOMING - 3D DOG ANIMATION
   ========================================================================== */

class Dog3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.dog = null;
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.isWagging = false;
        this.tailWagDirection = 1;
        this.animationId = null;
        
        this.init();
        this.addEventListeners();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        
        // Create camera - Adjusted for smaller dog
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.offsetWidth / this.canvas.offsetHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 4; // Moved closer for smaller dog
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Create lighting
        this.setupLighting();
        
        // Create dog
        this.createDog();
        
        // Scale the entire dog to make it smaller and cuter
        this.dog.scale.setScalar(0.8);
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Point light for rim lighting
        const pointLight = new THREE.PointLight(0xffd1dc, 0.5);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }
    
    createDog() {
        this.dog = new THREE.Group();
        
        // Enhanced Materials with textures and realistic properties
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xd2691e,
            shininess: 20,
            specular: 0x222222
        });
        
        const spotMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8b4513,
            shininess: 25,
            specular: 0x111111
        });
        
        const noseMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            shininess: 100,
            specular: 0x444444
        });
        
        const eyeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            shininess: 150,
            specular: 0x888888
        });
        
        const eyeWhiteMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100,
            specular: 0x666666
        });
        
        const tongueMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff69b4,
            shininess: 80,
            specular: 0x333333
        });
        
        const pawPadMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c2c2c,
            shininess: 30,
            specular: 0x222222
        });
        
        // Body - Made smaller and cuter
        const bodyGeometry = new THREE.SphereGeometry(0.6, 32, 32);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1.3, 0.9, 1.1);
        body.position.y = -0.3;
        body.castShadow = true;
        this.dog.add(body);
        
        // Head - Made smaller and cuter
        const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 0.3, 0);
        head.castShadow = true;
        this.dog.add(head);
        this.head = head; // Store reference for rotation
        
        // Snout - Made smaller and cuter
        const snoutGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const snout = new THREE.Mesh(snoutGeometry, bodyMaterial);
        snout.scale.set(1, 0.7, 1.6);
        snout.position.set(0, 0.2, 0.4);
        head.add(snout);
        
        // Nose - Made smaller and cuter
        const noseGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 0.25, 0.7);
        head.add(nose);
        
        // Enhanced Eyes with whites and pupils - Made bigger and cuter
        const eyeWhiteGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyePupilGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const eyeHighlightGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        
        // Left Eye
        const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        leftEyeWhite.position.set(-0.2, 0.4, 0.3);
        head.add(leftEyeWhite);
        
        const leftEyePupil = new THREE.Mesh(eyePupilGeometry, eyeMaterial);
        leftEyePupil.position.set(-0.2, 0.4, 0.37);
        head.add(leftEyePupil);
        
        const leftEyeHighlight = new THREE.Mesh(eyeHighlightGeometry, eyeWhiteMaterial);
        leftEyeHighlight.position.set(-0.17, 0.43, 0.4);
        head.add(leftEyeHighlight);
        
        // Right Eye
        const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
        rightEyeWhite.position.set(0.2, 0.4, 0.3);
        head.add(rightEyeWhite);
        
        const rightEyePupil = new THREE.Mesh(eyePupilGeometry, eyeMaterial);
        rightEyePupil.position.set(0.2, 0.4, 0.37);
        head.add(rightEyePupil);
        
        const rightEyeHighlight = new THREE.Mesh(eyeHighlightGeometry, eyeWhiteMaterial);
        rightEyeHighlight.position.set(0.23, 0.43, 0.4);
        head.add(rightEyeHighlight);
        
        // Store pupils for animation
        this.leftPupil = leftEyePupil;
        this.rightPupil = rightEyePupil;
        
        // Ears - Made smaller and cuter
        const earGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        
        const leftEar = new THREE.Mesh(earGeometry, spotMaterial);
        leftEar.scale.set(0.7, 1.3, 0.4);
        leftEar.position.set(-0.35, 0.6, -0.1);
        leftEar.rotation.z = -0.4;
        head.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, spotMaterial);
        rightEar.scale.set(0.7, 1.3, 0.4);
        rightEar.position.set(0.35, 0.6, -0.1);
        rightEar.rotation.z = 0.3;
        head.add(rightEar);
        
        // Tongue (initially hidden)
        const tongueGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const tongue = new THREE.Mesh(tongueGeometry, tongueMaterial);
        tongue.scale.set(0.5, 1.5, 0.3);
        tongue.position.set(0, 0.15, 0.9);
        tongue.visible = false;
        head.add(tongue);
        this.tongue = tongue;
        
        // Enhanced Legs with joints and paws - Made smaller and cuter
        const upperLegGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.35, 16);
        const lowerLegGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.3, 16);
        const pawGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const pawPadGeometry = new THREE.SphereGeometry(0.04, 12, 12);
        
        // Create leg function for reusability
        const createLeg = (x, z, isBack = false) => {
            const legGroup = new THREE.Group();
            
            // Upper leg
            const upperLeg = new THREE.Mesh(upperLegGeometry, bodyMaterial);
            upperLeg.position.set(0, -0.55, 0);
            upperLeg.castShadow = true;
            legGroup.add(upperLeg);
            
            // Lower leg
            const lowerLeg = new THREE.Mesh(lowerLegGeometry, bodyMaterial);
            lowerLeg.position.set(0, -0.9, 0);
            lowerLeg.castShadow = true;
            legGroup.add(lowerLeg);
            
            // Paw
            const paw = new THREE.Mesh(pawGeometry, bodyMaterial);
            paw.position.set(0, -1.15, 0);
            paw.scale.set(1, 0.7, 1);
            paw.castShadow = true;
            legGroup.add(paw);
            
            // Paw pads
            const mainPad = new THREE.Mesh(pawPadGeometry, pawPadMaterial);
            mainPad.position.set(0, -1.25, 0.08);
            mainPad.scale.set(1.2, 0.8, 1);
            legGroup.add(mainPad);
            
            // Toe pads
            for (let i = 0; i < 4; i++) {
                const toePad = new THREE.Mesh(pawPadGeometry, pawPadMaterial);
                const angle = (i / 4) * Math.PI * 2;
                toePad.position.set(
                    Math.cos(angle) * 0.08,
                    -1.2,
                    Math.sin(angle) * 0.08 + 0.12
                );
                toePad.scale.set(0.6, 0.6, 0.6);
                legGroup.add(toePad);
            }
            
            legGroup.position.set(x, -0.3, z);
            return legGroup;
        };
        
        // Create all four legs
        const frontLeftLeg = createLeg(-0.4, 0.35);
        const frontRightLeg = createLeg(0.4, 0.35);
        const backLeftLeg = createLeg(-0.4, -0.35, true);
        const backRightLeg = createLeg(0.4, -0.35, true);
        
        this.dog.add(frontLeftLeg);
        this.dog.add(frontRightLeg);
        this.dog.add(backLeftLeg);
        this.dog.add(backRightLeg);
        
        // Store legs for animation
        this.legs = [frontLeftLeg, frontRightLeg, backLeftLeg, backRightLeg];
        
        // Enhanced multi-segment tail - Made smaller and cuter
        const tailGroup = new THREE.Group();
        const tailSegments = [];
        
        for (let i = 0; i < 5; i++) {
            const segmentSize = 0.06 - (i * 0.01);
            const segmentLength = 0.15;
            const tailSegmentGeometry = new THREE.CylinderGeometry(segmentSize, segmentSize * 0.8, segmentLength, 12);
            const tailSegment = new THREE.Mesh(tailSegmentGeometry, bodyMaterial);
            
            tailSegment.position.set(0, i * segmentLength * 0.8, 0);
            tailSegment.castShadow = true;
            tailSegments.push(tailSegment);
            
            if (i === 0) {
                tailGroup.add(tailSegment);
            } else {
                tailSegments[i - 1].add(tailSegment);
            }
        }
        
        tailGroup.position.set(0, -0.1, -0.8);
        tailGroup.rotation.x = Math.PI / 3;
        this.dog.add(tailGroup);
        this.tail = tailGroup;
        this.tailSegments = tailSegments;
        
        // Enhanced spots and fur texture - Made smaller and cuter
        const spotGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const furDetailGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        
        // Face spots
        const spot1 = new THREE.Mesh(spotGeometry, spotMaterial);
        spot1.position.set(0.2, 0.15, 0.2);
        spot1.scale.set(1.2, 0.8, 0.5);
        head.add(spot1);
        
        const spot2 = new THREE.Mesh(spotGeometry, spotMaterial);
        spot2.position.set(-0.35, 0.1, 0.25);
        spot2.scale.set(0.9, 1.1, 0.4);
        head.add(spot2);
        
        // Body spots
        const bodySpot1 = new THREE.Mesh(spotGeometry, spotMaterial);
        bodySpot1.position.set(-0.4, -0.3, 0.5);
        bodySpot1.scale.set(0.8, 1, 0.3);
        body.add(bodySpot1);
        
        const bodySpot2 = new THREE.Mesh(spotGeometry, spotMaterial);
        bodySpot2.position.set(0.5, 0.1, -0.3);
        bodySpot2.scale.set(1.1, 0.7, 0.4);
        body.add(bodySpot2);
        
        const bodySpot3 = new THREE.Mesh(spotGeometry, spotMaterial);
        bodySpot3.position.set(-0.2, 0.3, -0.6);
        bodySpot3.scale.set(0.6, 0.9, 0.3);
        body.add(bodySpot3);
        
        // Fur texture details (small bumps for realistic fur appearance)
        const furDetails = [];
        for (let i = 0; i < 20; i++) {
            const furDetail = new THREE.Mesh(furDetailGeometry, bodyMaterial);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 0.85 + Math.random() * 0.1;
            
            furDetail.position.set(
                Math.sin(phi) * Math.cos(theta) * radius,
                Math.sin(phi) * Math.sin(theta) * radius * 0.8 - 0.1,
                Math.cos(phi) * radius
            );
            furDetail.scale.setScalar(0.3 + Math.random() * 0.4);
            body.add(furDetail);
            furDetails.push(furDetail);
        }
        
        // Head fur details
        for (let i = 0; i < 15; i++) {
            const furDetail = new THREE.Mesh(furDetailGeometry, bodyMaterial);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 0.75 + Math.random() * 0.1;
            
            furDetail.position.set(
                Math.sin(phi) * Math.cos(theta) * radius,
                Math.sin(phi) * Math.sin(theta) * radius,
                Math.cos(phi) * radius
            );
            furDetail.scale.setScalar(0.2 + Math.random() * 0.3);
            head.add(furDetail);
            furDetails.push(furDetail);
        }
        
        this.furDetails = furDetails;
        
        // Position the dog
        this.dog.position.y = 0;
        this.dog.scale.setScalar(0.8);
        
        this.scene.add(this.dog);
        
        // Start random animations
        this.startRandomAnimations();
        this.initBlinking();
    }
    
    initBlinking() {
        this.blinkInterval = setInterval(() => {
            if (Math.random() > 0.3) { // 70% chance to blink
                this.blink();
            }
        }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
    }
    
    blink() {
        if (this.leftPupil && this.rightPupil) {
            // Scale down pupils to simulate closed eyes
            this.leftPupil.scale.setScalar(0.1);
            this.rightPupil.scale.setScalar(0.1);
            
            setTimeout(() => {
                this.leftPupil.scale.setScalar(1);
                this.rightPupil.scale.setScalar(1);
            }, 150); // Blink duration
        }
    }
    
    addEventListeners() {
        // Mouse move event for cursor following
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        // Click event for interaction
        this.canvas.addEventListener('click', () => {
            this.playHappyAnimation();
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = event.touches[0];
            this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        this.canvas.addEventListener('touchstart', () => {
            this.playHappyAnimation();
        });
    }
    
    startRandomAnimations() {
        // Random tail wagging
        setInterval(() => {
            if (!this.isWagging && Math.random() > 0.7) {
                this.startTailWag();
            }
        }, 2000);
        
        // Random tongue appearance
        setInterval(() => {
            if (Math.random() > 0.8) {
                this.showTongue();
            }
        }, 5000);
        
        // Random head tilts
        setInterval(() => {
            if (Math.random() > 0.6) {
                this.tiltHead();
            }
        }, 3000);
    }
    
    startTailWag() {
        if (this.isWagging) return;
        
        this.isWagging = true;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const wag = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed < duration) {
                const progress = elapsed / duration;
                const wagIntensity = Math.sin(progress * Math.PI * 8) * 0.8; // 8 wags with more intensity
                
                // Animate each tail segment with cascading effect
                if (this.tailSegments) {
                    this.tailSegments.forEach((segment, index) => {
                        const delay = index * 0.1;
                        const segmentIntensity = wagIntensity * (1 - delay);
                        segment.rotation.z = segmentIntensity;
                        segment.rotation.y = segmentIntensity * 0.3; // Add some y rotation for more natural movement
                    });
                } else if (this.tail) {
                    // Fallback for simple tail
                    this.tail.rotation.z = wagIntensity;
                }
                
                requestAnimationFrame(wag);
            } else {
                // Reset tail segments
                if (this.tailSegments) {
                    this.tailSegments.forEach(segment => {
                        segment.rotation.z = 0;
                        segment.rotation.y = 0;
                    });
                } else if (this.tail) {
                    this.tail.rotation.z = 0;
                }
                this.isWagging = false;
            }
        };
        
        wag();
    }
    
    showTongue() {
        this.tongue.visible = true;
        
        setTimeout(() => {
            this.tongue.visible = false;
        }, 1500);
    }
    
    tiltHead() {
        const originalRotation = this.head.rotation.z;
        const tiltAmount = (Math.random() - 0.5) * 0.5;
        
        // Tilt
        this.animateRotation(this.head, 'z', tiltAmount, 500);
        
        // Return to normal after 2 seconds
        setTimeout(() => {
            this.animateRotation(this.head, 'z', originalRotation, 500);
        }, 2000);
    }
    
    playHappyAnimation() {
        // Bounce animation
        const originalY = this.dog.position.y;
        
        this.animatePosition(this.dog, 'y', originalY + 0.3, 300);
        setTimeout(() => {
            this.animatePosition(this.dog, 'y', originalY, 300);
        }, 300);
        
        // Start tail wagging
        this.startTailWag();
        
        // Show tongue
        this.showTongue();
    }
    
    animatePosition(object, axis, targetValue, duration) {
        const startValue = object.position[axis];
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            object.position[axis] = startValue + (targetValue - startValue) * easedProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    animateRotation(object, axis, targetValue, duration) {
        const startValue = object.rotation[axis];
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            object.rotation[axis] = startValue + (targetValue - startValue) * easedProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.dog) return;
        
        const time = Date.now() * 0.001;
        
        // Smooth cursor following with pupil tracking - Fixed inverted Y movement
        this.targetRotation.y = this.mouse.x * 0.3;
        this.targetRotation.x = -this.mouse.y * 0.2; // Fixed: Inverted Y movement
        
        // Lerp for smooth head movement
        this.head.rotation.y += (this.targetRotation.y - this.head.rotation.y) * 0.05;
        this.head.rotation.x += (this.targetRotation.x - this.head.rotation.x) * 0.05;
        
        // Pupil tracking (follow mouse more closely) - Fixed positions for smaller dog
        if (this.leftPupil && this.rightPupil) {
            const pupilMovement = 0.015;
            this.leftPupil.position.x = -0.2 + (this.mouse.x * pupilMovement);
            this.leftPupil.position.y = 0.4 + (-this.mouse.y * pupilMovement); // Fixed: Inverted Y movement
            this.rightPupil.position.x = 0.2 + (this.mouse.x * pupilMovement);
            this.rightPupil.position.y = 0.4 + (-this.mouse.y * pupilMovement); // Fixed: Inverted Y movement
        }
        
        // Breathing animation (chest rise and fall)
        const breathingCycle = Math.sin(time * 1.2) * 0.02 + 1;
        if (this.dog.children.length > 0) {
            // Find the body (first child should be the body)
            const body = this.dog.children.find(child => child.geometry && child.geometry.type === 'SphereGeometry');
            if (body) {
                body.scale.y = 0.8 * breathingCycle;
                body.scale.x = 1.2 * (1 + (breathingCycle - 1) * 0.5);
            }
        }
        
        // Gentle floating animation with walking movement
        this.dog.position.y = Math.sin(time * 0.5) * 0.05;
        
        // Add walking movement following mouse
        const targetX = this.mouse.x * 0.5;
        const targetZ = this.mouse.y * 0.3;
        
        this.dog.position.x += (targetX - this.dog.position.x) * 0.02;
        this.dog.position.z += (targetZ - this.dog.position.z) * 0.02;
        
        // Gentle body rotation
        this.dog.rotation.y = Math.sin(time * 0.3) * 0.03;
        
        // Subtle ear movement
        if (this.head && this.head.children) {
            this.head.children.forEach((child, index) => {
                if (child.material && child.material.color && child.material.color.getHex() === 0x8b4513) {
                    // This is likely an ear
                    child.rotation.z += Math.sin(time * 2 + index) * 0.002;
                }
            });
        }
        
        // Fur detail subtle movement for more realism
        if (this.furDetails) {
            this.furDetails.forEach((detail, index) => {
                const detailTime = time + index * 0.1;
                detail.scale.setScalar(
                    (0.3 + (index % 3) * 0.1) + Math.sin(detailTime * 3) * 0.02
                );
            });
        }
        
        // Enhanced tail movement when not wagging
        if (!this.isWagging && this.tailSegments) {
            this.tailSegments.forEach((segment, index) => {
                const segmentTime = time + index * 0.2;
                segment.rotation.z = Math.sin(segmentTime * 1.5) * 0.1 * (index + 1);
                segment.rotation.x = Math.sin(segmentTime * 0.8) * 0.05 * (index + 1);
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (!this.canvas) return;
        
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.clear();
        }
    }
}

/* ==========================================================================
   INITIALIZE 3D DOG
   ========================================================================== */

let dog3DInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on homepage
    const canvas = document.getElementById('dog-3d-canvas');
    if (canvas) {
        // Wait a bit for the canvas to be properly sized
        setTimeout(() => {
            dog3DInstance = new Dog3D('dog-3d-canvas');
        }, 100);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (dog3DInstance) {
        dog3DInstance.destroy();
    }
});

// Handle page visibility change to pause/resume animation
document.addEventListener('visibilitychange', function() {
    if (dog3DInstance) {
        if (document.hidden) {
            // Page is hidden, you might want to pause heavy animations
            // dog3DInstance.pause();
        } else {
            // Page is visible, resume animations
            // dog3DInstance.resume();
        }
    }
});
