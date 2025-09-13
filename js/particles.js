
/* ================================ */
/* PARTICLES.JS CONFIGURATION */
/* ================================ */

function initParticles() {
    // Check if particles.js is loaded
    if (typeof particlesJS === 'undefined') {
        console.warn('Particles.js not loaded, using fallback particle system');
        initFallbackParticles();
        return;
    }

    // Main particles configuration
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#7C3AED"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#7C3AED",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

/* ================================ */
/* FALLBACK PARTICLE SYSTEM */
/* ================================ */

function initFallbackParticles() {
    const particleContainer = document.getElementById('particles-js');
    if (!particleContainer) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    particleContainer.appendChild(canvas);

    // Canvas setup
    function resizeCanvas() {
        canvas.width = particleContainer.offsetWidth;
        canvas.height = particleContainer.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = Math.random() * 3 + 1;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.color = `hsla(${260 + Math.random() * 40}, 70%, 60%, ${this.opacity})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            
            // Reset when particle goes off screen
            if (this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        drawConnections();

        requestAnimationFrame(animate);
    }

    function drawConnections() {
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.3 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
    }

    // Mouse interaction
    let mouse = { x: 0, y: 0 };
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        particles.forEach(particle => {
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particle.vx += dx * 0.0001;
                particle.vy += dy * 0.0001;
            }
        });
    });

    animate();
}

/* ================================ */
/* MATRIX DIGITAL RAIN EFFECT */
/* ================================ */

function initMatrixRain() {
    const matrixContainer = document.querySelector('.matrix-rain');
    if (!matrixContainer) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    matrixContainer.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;

    // Array of drops - one per column
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        // Black BG for the canvas with transparency
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F4';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 35);

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/* ================================ */
/* NEURAL NETWORK VISUALIZATION */
/* ================================ */

function initNeuralNetwork() {
    const neuralContainer = document.querySelector('.neural-network');
    if (!neuralContainer) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    neuralContainer.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = neuralContainer.offsetWidth;
        canvas.height = neuralContainer.offsetHeight;
    }
    resizeCanvas();

    // Neural network structure
    const layers = [4, 6, 6, 3]; // Input, Hidden, Hidden, Output
    const nodes = [];
    const connections = [];

    // Create nodes
    let nodeId = 0;
    layers.forEach((layerSize, layerIndex) => {
        const layerNodes = [];
        const x = (canvas.width / (layers.length - 1)) * layerIndex;
        
        for (let i = 0; i < layerSize; i++) {
            const y = (canvas.height / (layerSize + 1)) * (i + 1);
            layerNodes.push({
                id: nodeId++,
                x: x,
                y: y,
                activation: Math.random(),
                layer: layerIndex
            });
        }
        nodes.push(layerNodes);
    });

    // Create connections
    for (let i = 0; i < layers.length - 1; i++) {
        nodes[i].forEach(node => {
            nodes[i + 1].forEach(nextNode => {
                connections.push({
                    from: node,
                    to: nextNode,
                    weight: (Math.random() - 0.5) * 2,
                    active: false
                });
            });
        });
    });

    // Animation variables
    let time = 0;

    function animateNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02;

        // Update node activations
        nodes.forEach((layer, layerIndex) => {
            layer.forEach((node, nodeIndex) => {
                if (layerIndex === 0) {
                    // Input layer - simulate data input
                    node.activation = (Math.sin(time + nodeIndex) + 1) / 2;
                } else {
                    // Calculate activation based on previous layer
                    let sum = 0;
                    connections.forEach(conn => {
                        if (conn.to.id === node.id) {
                            sum += conn.from.activation * conn.weight;
                        }
                    });
                    node.activation = 1 / (1 + Math.exp(-sum)); // Sigmoid activation
                }
            });
        });

        // Draw connections
        connections.forEach(conn => {
            const opacity = Math.abs(conn.from.activation * conn.weight) * 0.8;
            const color = conn.weight > 0 ? '124, 58, 237' : '239, 68, 68';
            
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.strokeStyle = `rgba(${color}, ${opacity})`;
            ctx.lineWidth = Math.abs(conn.weight) * 2;
            ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(layer => {
            layer.forEach(node => {
                const radius = 8 + node.activation * 6;
                const opacity = 0.3 + node.activation * 0.7;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(124, 58, 237, ${opacity})`;
                ctx.fill();
                
                // Node border
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(124, 58, 237, 1)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        });

        requestAnimationFrame(animateNetwork);
    }

    animateNetwork();

    // Resize handler
    window.addEventListener('resize', () => {
        resizeCanvas();
        // Recalculate node positions
        nodes.forEach((layer, layerIndex) => {
            const x = (canvas.width / (layers.length - 1)) * layerIndex;
            layer.forEach((node, nodeIndex) => {
                node.x = x;
                node.y = (canvas.height / (layer.length + 1)) * (nodeIndex + 1);
            });
        });
    });
}

/* ================================ */
/* FLOATING GEOMETRIC SHAPES */
/* ================================ */

function initFloatingShapes() {
    const shapesContainer = document.querySelector('.floating-shapes');
    if (!shapesContainer) return;

    const shapes = ['triangle', 'circle', 'hexagon', 'square'];
    const colors = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444'];

    function createShape() {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 20 + 10;

        shape.className = `floating-shape ${shapeType}`;
        shape.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            opacity: 0.6;
            pointer-events: none;
            animation: floatShape ${Math.random() * 10 + 15}s linear infinite;
        `;

        // Apply shape-specific styles
        switch (shapeType) {
            case 'triangle':
                shape.style.background = 'transparent';
                shape.style.borderLeft = `${size / 2}px solid transparent`;
                shape.style.borderRight = `${size / 2}px solid transparent`;
                shape.style.borderBottom = `${size}px solid ${color}`;
                shape.style.width = '0';
                shape.style.height = '0';
                break;
            case 'circle':
                shape.style.background = color;
                shape.style.borderRadius = '50%';
                break;
            case 'hexagon':
                shape.style.background = color;
                shape.style.position = 'relative';
                shape.style.width = `${size * 1.73}px`;
                shape.style.height = `${size}px`;
                shape.style.transform = 'rotate(30deg)';
                break;
            case 'square':
                shape.style.background = color;
                shape.style.transform = `rotate(${Math.random() * 360}deg)`;
                break;
        }

        shapesContainer.appendChild(shape);

        // Remove shape after animation
        setTimeout(() => {
            if (shape.parentNode) {
                shape.parentNode.removeChild(shape);
            }
        }, 25000);
    }

    // Create shapes periodically
    setInterval(createShape, 3000);
    
    // Create initial shapes
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createShape(), i * 1000);
    }
}

/* ================================ */
/* CURSOR TRAIL EFFECT */
/* ================================ */

function initCursorTrail() {
    const trails = [];
    const maxTrails = 20;
    let mouseX = 0;
    let mouseY = 0;

    // Create trail elements
    for (let i = 0; i < maxTrails; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(124, 58, 237, ${1 - i / maxTrails});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
        `;
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate trail
    function updateTrail() {
        for (let i = trails.length - 1; i > 0; i--) {
            trails[i].x = trails[i - 1].x;
            trails[i].y = trails[i - 1].y;
        }
        
        trails[0].x = mouseX;
        trails[0].y = mouseY;

        trails.forEach((trail, index) => {
            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
            trail.element.style.transform = `scale(${1 - index / maxTrails})`;
        });

        requestAnimationFrame(updateTrail);
    }

    updateTrail();
}

/* ================================ */
/* INTERACTIVE BACKGROUND DOTS */
/* ================================ */

function initInteractiveDots() {
    const dotsContainer = document.querySelector('.interactive-dots');
    if (!dotsContainer) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    dotsContainer.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    const dots = [];
    const spacing = 30;
    const maxDistance = 100;

    // Create dot grid
    for (let x = spacing; x < canvas.width; x += spacing) {
        for (let y = spacing; y < canvas.height; y += spacing) {
            dots.push({
                x: x,
                y: y,
                originalX: x,
                originalY: y,
                vx: 0,
                vy: 0
            });
        }
    }

    let mouse = { x: 0, y: 0 };

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function animateDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            // Calculate distance from mouse
            const dx = mouse.x - dot.x;
            const dy = mouse.y - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                // Repel from mouse
                const force = (maxDistance - distance) / maxDistance;
                dot.vx -= (dx / distance) * force * 0.3;
                dot.vy -= (dy / distance) * force * 0.3;
            }

            // Return to original position
            dot.vx += (dot.originalX - dot.x) * 0.05;
            dot.vy += (dot.originalY - dot.y) * 0.05;

            // Apply velocity with damping
            dot.vx *= 0.95;
            dot.vy *= 0.95;

            dot.x += dot.vx;
            dot.y += dot.vy;

            // Draw dot
            const opacity = 0.3 + (distance < maxDistance ? (1 - distance / maxDistance) * 0.7 : 0);
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(animateDots);
    }

    animateDots();

    window.addEventListener('resize', () => {
        resizeCanvas();
        // Regenerate dots for new canvas size
        dots.length = 0;
        for (let x = spacing; x < canvas.width; x += spacing) {
            for (let y = spacing; y < canvas.height; y += spacing) {
                dots.push({
                    x: x,
                    y: y,
                    originalX: x,
                    originalY: y,
                    vx: 0,
                    vy: 0
                });
            }
        }
    });
}

/* ================================ */
/* WAVE ANIMATION BACKGROUND */
/* ================================ */

function initWaveBackground() {
    const waveContainer = document.querySelector('.wave-background');
    if (!waveContainer) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    waveContainer.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    let time = 0;
    const waves = [
        { amplitude: 20, frequency: 0.01, phase: 0, speed: 0.02, color: 'rgba(124, 58, 237, 0.1)' },
        { amplitude: 15, frequency: 0.015, phase: Math.PI / 3, speed: 0.025, color: 'rgba(16, 185, 129, 0.1)' },
        { amplitude: 25, frequency: 0.008, phase: Math.PI / 2, speed: 0.015, color: 'rgba(245, 158, 11, 0.1)' }
    ];

    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.01;

        waves.forEach((wave, index) => {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);

            for (let x = 0; x <= canvas.width; x++) {
                const y = canvas.height / 2 + 
                    Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            ctx.fillStyle = wave.color;
            ctx.fill();
        });

        requestAnimationFrame(drawWaves);
    }

    drawWaves();

    window.addEventListener('resize', resizeCanvas);
}

/* ================================ */
/* 3D PARTICLE SYSTEM */
/* ================================ */

function init3DParticles() {
    const container = document.querySelector('.particles-3d');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resizeCanvas();

    // 3D Particle class
    class Particle3D {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = (Math.random() - 0.5) * 2000;
            this.y = (Math.random() - 0.5) * 2000;
            this.z = Math.random() * 2000;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.vz = -Math.random() * 5 - 1;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.8 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;

            // Reset particle when it goes behind camera
            if (this.z <= 0) {
                this.reset();
                this.z = 2000;
            }
        }

        draw() {
            // Project 3D to 2D
            const scale = 400 / this.z;
            const x2d = canvas.width / 2 + this.x * scale;
            const y2d = canvas.height / 2 + this.y * scale;
            const size2d = this.size * scale;

            if (x2d >= 0 && x2d <= canvas.width && y2d >= 0 && y2d <= canvas.height) {
                const opacity = this.opacity * (1 - this.z / 2000);
                
                ctx.beginPath();
                ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(124, 58, 237, ${opacity})`;
                ctx.fill();

                // Add glow effect
                const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size2d * 3);
                gradient.addColorStop(0, `rgba(124, 58, 237, ${opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
                
                ctx.beginPath();
                ctx.arc(x2d, y2d, size2d * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }

    // Create particles
    const particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push(new Particle3D());
    }

    // Mouse interaction
    let mouse = { x: 0, y: 0 };
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left - canvas.width / 2) / canvas.width * 2;
        mouse.y = (e.clientY - rect.top - canvas.height / 2) / canvas.height * 2;
    });

    // Animation loop
    function animate3D() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            // Mouse attraction/repulsion
            const dx = mouse.x * 1000 - particle.x;
            const dy = mouse.y * 1000 - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                particle.vx += dx * 0.00001;
                particle.vy += dy * 0.00001;
            }

            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate3D);
    }

    animate3D();
    window.addEventListener('resize', resizeCanvas);
}

/* ================================ */
/* PERFORMANCE MONITORING */
/* ================================ */

function initParticlePerformanceMonitoring() {
    let fps = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    function monitorPerformance() {
        const currentTime = performance.now();
        frameCount++;

        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;

            // Adjust particle count based on performance
            if (fps < 30) {
                reduceParticles();
            } else if (fps > 55) {
                increaseParticles();
            }

            // Log performance data
            console.log(`🎭 Particle system FPS: ${fps}`);
        }

        requestAnimationFrame(monitorPerformance);
    }

    monitorPerformance();
}

function reduceParticles() {
    // Reduce particle count for better performance
    const particleSystem = window.pJSDom && window.pJSDom[0];
    if (particleSystem && particleSystem.pJS) {
        const currentCount = particleSystem.pJS.particles.number.value;
        if (currentCount > 20) {
            particleSystem.pJS.particles.number.value = Math.max(20, currentCount * 0.8);
            particleSystem.pJS.fn.particlesRefresh();
            console.log('🔽 Reduced particle count for performance');
        }
    }
}

function increaseParticles() {
    // Increase particle count if performance allows
    const particleSystem = window.pJSDom && window.pJSDom[0];
    if (particleSystem && particleSystem.pJS) {
        const currentCount = particleSystem.pJS.particles.number.value;
        if (currentCount < 100) {
            particleSystem.pJS.particles.number.value = Math.min(100, currentCount * 1.2);
            particleSystem.pJS.fn.particlesRefresh();
            console.log('🔼 Increased particle count');
        }
    }
}

/* ================================ */
/* RESPONSIVE PARTICLE ADJUSTMENTS */
/* ================================ */

function initResponsiveParticles() {
    function adjustParticlesForDevice() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        const particleSystem = window.pJSDom && window.pJSDom[0];
        
        if (!particleSystem || !particleSystem.pJS) return;

        const pJS = particleSystem.pJS;
        
        if (isMobile) {
            // Mobile optimizations
            pJS.particles.number.value = 30;
            pJS.particles.line_linked.enable = false;
            pJS.particles.move.speed = 3;
            pJS.interactivity.events.onhover.enable = false;
        } else if (isTablet) {
            // Tablet optimizations
            pJS.particles.number.value = 50;
            pJS.particles.line_linked.enable = true;
            pJS.particles.move.speed = 4;
            pJS.interactivity.events.onhover.enable = true;
        } else {
            // Desktop - full features
            pJS.particles.number.value = 80;
            pJS.particles.line_linked.enable = true;
            pJS.particles.move.speed = 6;
            pJS.interactivity.events.onhover.enable = true;
        }
        
        pJS.fn.particlesRefresh();
        console.log(`🎯 Adjusted particles for ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`);
    }

    // Initial adjustment
    adjustParticlesForDevice();
    
    // Adjust on resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustParticlesForDevice, 250);
    });
}

/* ================================ */
/* THEME-AWARE PARTICLE COLORS */
/* ================================ */

function updateParticleTheme(theme = 'dark') {
    const particleSystem = window.pJSDom && window.pJSDom[0];
    if (!particleSystem || !particleSystem.pJS) return;

    const colors = {
        dark: {
            particles: '#7C3AED',
            lines: '#7C3AED'
        },
        light: {
            particles: '#5B21B6',
            lines: '#5B21B6'
        }
    };

    const themeColors = colors[theme] || colors.dark;
    
    particleSystem.pJS.particles.color.value = themeColors.particles;
    particleSystem.pJS.particles.line_linked.color = themeColors.lines;
    particleSystem.pJS.fn.particlesRefresh();
    
    console.log(`🎨 Updated particle theme to ${theme}`);
}

/* ================================ */
/* PARTICLE PRESETS */
/* ================================ */

const particlePresets = {
    minimal: {
        "particles": {
            "number": { "value": 30 },
            "color": { "value": "#7C3AED" },
            "opacity": { "value": 0.3 },
            "size": { "value": 2 },
            "line_linked": { "enable": false },
            "move": { "speed": 2 }
        },
        "interactivity": {
            "events": {
                "onhover": { "enable": false },
                "onclick": { "enable": false }
            }
        }
    },
    
    interactive: {
        "particles": {
            "number": { "value": 80 },
            "color": { "value": "#7C3AED" },
            "opacity": { "value": 0.5 },
            "size": { "value": 3 },
            "line_linked": { 
                "enable": true,
                "distance": 150,
                "opacity": 0.4
            },
            "move": { "speed": 6 }
        },
        "interactivity": {
            "events": {
                "onhover": { "enable": true, "mode": "repulse" },
                "onclick": { "enable": true, "mode": "push" }
            }
        }
    },
    
    space: {
        "particles": {
            "number": { "value": 100 },
            "color": { "value": ["#7C3AED", "#10B981", "#F59E0B"] },
            "opacity": { 
                "value": 0.7,
                "random": true,
                "anim": { "enable": true, "speed": 1 }
            },
            "size": { 
                "value": 4,
                "random": true,
                "anim": { "enable": true, "speed": 2 }
            },
            "line_linked": { "enable": false },
            "move": { 
                "speed": 1,
                "random": true,
                "direction": "none"
            }
        },
        "interactivity": {
            "events": {
                "onhover": { "enable": true, "mode": "bubble" },
                "onclick": { "enable": true, "mode": "repulse" }
            }
        }
    },
    
    network: {
        "particles": {
            "number": { "value": 60 },
            "color": { "value": "#7C3AED" },
            "opacity": { "value": 0.6 },
            "size": { "value": 2 },
            "line_linked": { 
                "enable": true,
                "distance": 200,
                "color": "#7C3AED",
                "opacity": 0.6,
                "width": 2
            },
            "move": { 
                "speed": 3,
                "attract": { "enable": true, "rotateX": 600, "rotateY": 1200 }
            }
        },
        "interactivity": {
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" }
            }
        }
    }
};

function applyParticlePreset(presetName) {
    const preset = particlePresets[presetName];
    if (!preset) {
        console.error(`Particle preset '${presetName}' not found`);
        return;
    }

    // Destroy existing particles
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }

    // Apply new preset
    particlesJS('particles-js', preset);
    console.log(`🎭 Applied particle preset: ${presetName}`);
}

/* ================================ */
/* PARTICLE EFFECTS MANAGER */
/* ================================ */

class ParticleEffectsManager {
    constructor() {
        this.activeEffects = new Set();
        this.performanceMode = 'auto'; // 'high', 'medium', 'low', 'auto'
        this.init();
    }

    init() {
        this.detectPerformanceCapability();
        this.initializeEffects();
        this.setupEventListeners();
    }

    detectPerformanceCapability() {
        // Basic performance detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const hasWebGL = !!gl;
        const hardwareConcurrency = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 4;

        let capability = 'medium';
        
        if (hasWebGL && hardwareConcurrency >= 4 && memory >= 4) {
            capability = 'high';
        } else if (hardwareConcurrency <= 2 || memory < 2) {
            capability = 'low';
        }

        this.performanceMode = capability;
        console.log(`🔍 Detected performance capability: ${capability}`);
    }

    initializeEffects() {
        const effects = {
            high: ['particles', 'matrix', 'neural', '3d', 'waves'],
            medium: ['particles', 'floating-shapes', 'cursor-trail'],
            low: ['minimal-particles']
        };

        const effectsToLoad = effects[this.performanceMode] || effects.medium;
        
        effectsToLoad.forEach(effect => {
            this.loadEffect(effect);
        });
    }

    loadEffect(effectName) {
        try {
            switch (effectName) {
                case 'particles':
                    initParticles();
                    this.activeEffects.add('particles');
                    break;
                case 'matrix':
                    initMatrixRain();
                    this.activeEffects.add('matrix');
                    break;
                case 'neural':
                    initNeuralNetwork();
                    this.activeEffects.add('neural');
                    break;
                case '3d':
                    init3DParticles();
                    this.activeEffects.add('3d');
                    break;
                case 'waves':
                    initWaveBackground();
                    this.activeEffects.add('waves');
                    break;
                case 'floating-shapes':
                    initFloatingShapes();
                    this.activeEffects.add('floating-shapes');
                    break;
                case 'cursor-trail':
                    initCursorTrail();
                    this.activeEffects.add('cursor-trail');
                    break;
                case 'interactive-dots':
                    initInteractiveDots();
                    this.activeEffects.add('interactive-dots');
                    break;
                case 'minimal-particles':
                    applyParticlePreset('minimal');
                    this.activeEffects.add('minimal-particles');
                    break;
                default:
                    console.warn(`Unknown effect: ${effectName}`);
            }
        } catch (error) {
            console.error(`Failed to load effect ${effectName}:`, error);
        }
    }

    toggleEffect(effectName, enable = null) {
        const isActive = this.activeEffects.has(effectName);
        const shouldEnable = enable !== null ? enable : !isActive;

        if (shouldEnable && !isActive) {
            this.loadEffect(effectName);
        } else if (!shouldEnable && isActive) {
            this.disableEffect(effectName);
        }
    }

    disableEffect(effectName) {
        // Implementation would depend on each effect's cleanup method
        this.activeEffects.delete(effectName);
        console.log(`🚫 Disabled effect: ${effectName}`);
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        this.activeEffects.clear();
        
        // Clear existing effects
        document.querySelectorAll('.particles-js, canvas').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });

        this.initializeEffects();
    }

    setupEventListeners() {
        // Theme change listener
        document.addEventListener('themeChange', (e) => {
            updateParticleTheme(e.detail.theme);
        });

        // Visibility change - pause/resume effects
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseEffects();
            } else {
                this.resumeEffects();
            }
        });

        // Performance monitoring
        this.startPerformanceMonitoring();
    }

    pauseEffects() {
        // Pause animations when page is hidden
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            canvas.style.animationPlayState = 'paused';
        });
    }

    resumeEffects() {
        // Resume animations when page is visible
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            canvas.style.animationPlayState = 'running';
        });
    }

    startPerformanceMonitoring() {
        initParticlePerformanceMonitoring();
    }

    getActiveEffects() {
        return Array.from(this.activeEffects);
    }

    getPerformanceMode() {
        return this.performanceMode;
    }
}

/* ================================ */
/* INITIALIZATION & EXPORT */
/* ================================ */

// Initialize particle system
let particleManager;

function initializeParticleSystem() {
    console.log('🎭 Initializing particle effects system...');
    
    particleManager = new ParticleEffectsManager();
    initResponsiveParticles();
    
    console.log('✨ Particle effects system initialized!');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeParticleSystem);
} else {
    initializeParticleSystem();
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleEffectsManager,
        initParticles,
        initFallbackParticles,
        updateParticleTheme,
        applyParticlePreset,
        particlePresets
    };
}

// Global access for debugging
window.ParticleSystem = {
    manager: () => particleManager,
    presets: particlePresets,
    applyPreset: applyParticlePreset,
    updateTheme: updateParticleTheme,
    effects: {
        matrix: initMatrixRain,
        neural: initNeuralNetwork,
        shapes: initFloatingShapes,
        trail: initCursorTrail,
        dots: initInteractiveDots,
        waves: initWaveBackground,
        particles3d: init3DParticles
    }
};

console.log('🌟 Particle system loaded and ready!');
