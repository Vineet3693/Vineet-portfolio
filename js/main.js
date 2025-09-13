
/* ================================ */
/* MAIN JAVASCRIPT FUNCTIONALITY */
/* ================================ */

// Global variables
let isLoading = true;
let currentSection = 'home';
let scrollProgress = 0;
let typingIndex = 0;
let typingTexts = [
    'Data Scientist & AI/ML Engineer',
    'Machine Learning Specialist',
    'Python Developer',
    'Data Visualization Expert',
    'AI Solution Architect'
];
let typingSpeed = 100;
let erasingSpeed = 50;
let newTextDelay = 2000;

// DOM elements
const loadingScreen = document.querySelector('.loading-screen');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const mainHeader = document.querySelector('.main-header');
const backToTopBtn = document.querySelector('.back-to-top');
const themeToggle = document.querySelector('.theme-toggle');
const soundToggle = document.querySelector('.sound-toggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.querySelector('#contactForm');
const modal = document.querySelector('#projectModal');

// Sound effects (optional)
let soundEnabled = true;
const sounds = {
    click: new Audio('assets/sounds/click.mp3'),
    hover: new Audio('assets/sounds/hover.mp3'),
    success: new Audio('assets/sounds/success.mp3'),
    error: new Audio('assets/sounds/error.mp3')
};

// Initialize website
function initializeWebsite() {
    console.log('🚀 Initializing Vineet Yadav Portfolio...');
    
    // Start loading sequence
    startLoadingSequence();
    
    // Initialize all components
    setTimeout(() => {
        initializeNavigation();
        initializeScrollEffects();
        initializeTypingEffect();
        initializeAnimations();
        initializeInteractions();
        initializeFormHandling();
        initializeTheme();
        initializeCursor();
        initializeParticles();
        
        console.log('✅ Portfolio initialization complete!');
    }, 1000);
}

/* ================================ */
/* LOADING SEQUENCE */
/* ================================ */

function startLoadingSequence() {
    const steps = [
        { text: 'Initializing AI systems...', progress: 20 },
        { text: 'Loading data models...', progress: 40 },
        { text: 'Connecting neural networks...', progress: 60 },
        { text: 'Optimizing algorithms...', progress: 80 },
        { text: 'Ready to showcase skills!', progress: 100 }
    ];
    
    let currentStep = 0;
    
    function updateProgress() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progressFill.style.width = `${step.progress}%`;
            progressText.textContent = step.text;
            
            if (step.progress === 100) {
                setTimeout(() => {
                    hideLoadingScreen();
                }, 1000);
            } else {
                setTimeout(updateProgress, 800);
            }
            currentStep++;
        }
    }
    
    setTimeout(updateProgress, 500);
}

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    isLoading = false;
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        startHeroAnimations();
    }, 500);
}

/* ================================ */
/* NAVIGATION FUNCTIONALITY */
/* ================================ */

function initializeNavigation() {
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Header scroll behavior
    let lastScrollTop = 0;
    window.addEventListener('scroll', handleScroll);
    
    // Active section highlighting
    window.addEventListener('scroll', updateActiveSection);
}

function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('show');
    
    // Animate hamburger lines
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.style.transformOrigin = 'center';
        if (mobileMenuToggle.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = '';
            span.style.opacity = '';
        }
    });
    
    playSound('click');
}

function handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href') || e.target.closest('a').getAttribute('href');
    
    if (href.startsWith('#')) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        }
    }
    
    playSound('click');
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header visibility
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        mainHeader.classList.add('hidden');
    } else {
        mainHeader.classList.remove('hidden');
    }
    
    // Header background
    if (scrollTop > 50) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }
    
    // Back to top button
    if (scrollTop > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    // Update scroll progress
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    scrollProgress = (scrollTop / documentHeight) * 100;
    
    // Update skill bars when visible
    updateSkillBars();
    
    lastScrollTop = scrollTop;
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentActiveSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentActiveSection = section.getAttribute('id');
        }
    });
    
    // Update nav link active states
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentActiveSection}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ================================ */
/* TYPING EFFECT */
/* ================================ */

function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    const cursorElement = document.querySelector('.typing-cursor');
    
    if (!typingElement) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingTexts.length;
                setTimeout(typeText, 500);
                return;
            }
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeText();
                }, newTextDelay);
                return;
            }
        }
        
        setTimeout(typeText, isDeleting ? erasingSpeed : typingSpeed);
    }
    
    setTimeout(typeText, 1000);
}

/* ================================ */
/* SCROLL ANIMATIONS */
/* ================================ */

function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for staggered animations
                if (entry.target.classList.contains('stagger-children')) {
                    staggerChildAnimations(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in, .bounce-in, .stagger-children'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

function staggerChildAnimations(parent) {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate');
        }, index * 100);
    });
}

function updateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !bar.classList.contains('animated')) {
            const percentage = bar.getAttribute('data-percentage') || '0';
            bar.style.width = `${percentage}%`;
            bar.classList.add('animated');
            
            // Animate the percentage counter
            animateCounter(bar.closest('.skill-item').querySelector('.skill-percentage'), percentage);
        }
    });
}

function animateCounter(element, target) {
    if (!element) return;
    
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = `${Math.round(current)}%`;
        
        if (current >= target) {
            element.textContent = `${target}%`;
            clearInterval(timer);
        }
    }, 50);
}

/* ================================ */
/* HERO SECTION ANIMATIONS */
/* ================================ */

function startHeroAnimations() {
    // Profile picture glow animation
    const profileGlow = document.querySelector('.profile-glow');
    if (profileGlow) {
        profileGlow.style.animation = 'profileGlow 4s linear infinite';
    }
    
    // Floating elements animation
    createFloatingElements();
    
    // Start typing effect
    setTimeout(() => {
        initializeTypingEffect();
    }, 2000);
    
    // Animate stats counters
    setTimeout(() => {
        animateStatsCounters();
    }, 3000);
}

function createFloatingElements() {
    const heroBackground = document.querySelector('.hero-background .floating-elements');
    if (!heroBackground) return;
    
    const icons = ['🤖', '📊', '🧠', '💡', '🔬', '📈', '🎯', '⚡'];
    
    icons.forEach((icon, index) => {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = icon;
        element.style.left = `${Math.random() * 80 + 10}%`;
        element.style.top = `${Math.random() * 80 + 10}%`;
        element.style.animationDelay = `${index * 0.5}s`;
        
        heroBackground.appendChild(element);
    });
}

function animateStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count')) || 0;
        animateCounter(stat, target);
    });
}

/* ================================ */
/* INTERACTIVE ELEMENTS */
/* ================================ */

function initializeInteractions() {
    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            playSound('click');
        });
    }
    
    // Project filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleProjectFilter);
    });
    
    // Project cards click handlers
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', handleProjectClick);
    });
    
    // Social links with hover effects
    const socialLinks = document.querySelectorAll('.social-link, .social-icon');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => playSound('hover'));
        link.addEventListener('click', () => playSound('click'));
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => playSound('hover'));
        btn.addEventListener('click', () => playSound('click'));
    });
    
    // Profile picture upload (if needed)
    initializeProfileUpload();
    
    // Theme and sound toggles
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }
}

function handleProjectFilter(e) {
    const filterValue = e.target.getAttribute('data-filter') || 'all';
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter projects
    projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories') || '';
        const shouldShow = filterValue === 'all' || categories.includes(filterValue);
        
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    playSound('click');
}

function handleProjectClick(e) {
    const projectCard = e.currentTarget;
    const projectId = projectCard.getAttribute('data-project-id');
    
    if (projectId) {
        openProjectModal(projectId);
    }
    
    playSound('click');
}

function openProjectModal(projectId) {
    // Project data (in a real implementation, this would come from an API or database)
    const projectData = {
        'customer-churn-analysis': {
            title: 'Customer Churn Analysis',
            category: 'Machine Learning',
            description: 'A comprehensive machine learning solution to predict customer churn using advanced algorithms and feature engineering techniques.',
            image: 'assets/images/projects/churn-analysis.jpg',
            technologies: ['Python', 'Scikit-learn', 'Pandas', 'XGBoost', 'Streamlit'],
            features: [
                'Data preprocessing and feature engineering',
                'Multiple ML algorithms comparison',
                'Model interpretability with SHAP values',
                'Interactive dashboard for predictions',
                'Automated model retraining pipeline'
            ],
            results: {
                accuracy: '94.2%',
                precision: '91.8%',
                recall: '89.5%',
                f1Score: '90.6%'
            },
            github: 'https://github.com/vineet-yadav/customer-churn-analysis',
            demo: 'https://churn-analysis-demo.streamlit.app',
            duration: '3 months',
            team: 'Solo project'
        },
        'recommendation-system': {
            title: 'AI-Powered Recommendation System',
            category: 'Deep Learning',
            description: 'An advanced recommendation system using collaborative filtering and deep learning techniques to provide personalized content suggestions.',
            image: 'assets/images/projects/recommendation-system.jpg',
            technologies: ['TensorFlow', 'Python', 'Neo4j', 'FastAPI', 'React'],
            features: [
                'Hybrid recommendation approach',
                'Real-time inference with low latency',
                'Graph-based user similarity',
                'Content-based filtering',
                'A/B testing framework'
            ],
            results: {
                ctr: '+23.5%',
                engagement: '+31.2%',
                retention: '+18.7%',
                satisfaction: '4.6/5'
            },
            github: 'https://github.com/vineet-yadav/recommendation-system',
            demo: 'https://recommendation-demo.herokuapp.com',
            duration: '4 months',
            team: '3 developers'
        }
        // Add more projects as needed
    };
    
    const project = projectData[projectId];
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    // Populate modal content
    const modalTitle = document.querySelector('#modalTitle');
    const modalContent = document.querySelector('#modalContent');
    
    if (modalTitle) modalTitle.textContent = project.title;
    
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='assets/images/placeholder-project.jpg'">
                    <div class="project-modal-category">${project.category}</div>
                </div>
                
                <div class="project-modal-info">
                    <p class="project-modal-description">${project.description}</p>
                    
                    <div class="project-modal-details">
                        <div class="detail-item">
                            <strong>Duration:</strong> ${project.duration}
                        </div>
                        <div class="detail-item">
                            <strong>Team Size:</strong> ${project.team}
                        </div>
                    </div>
                    
                    <div class="project-modal-technologies">
                        <h4>Technologies Used</h4>
                        <div class="tech-list">
                            ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="project-modal-features">
                        <h4>Key Features</h4>
                        <ul>
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-modal-results">
                        <h4>Results & Impact</h4>
                        <div class="results-grid">
                            ${Object.entries(project.results).map(([key, value]) => `
                                <div class="result-item">
                                    <div class="result-value">${value}</div>
                                    <div class="result-label">${key}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="project-modal-actions">
                        <a href="${project.github}" target="_blank" class="project-btn">
                            <i class="fab fa-github"></i> View Code
                        </a>
                        <a href="${project.demo}" target="_blank" class="project-btn">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Show modal
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Modal close handlers
if (modal) {
    const modalClose = document.querySelector('#modalClose');
    const modalOverlay = document.querySelector('#modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

/* ================================ */
/* FORM HANDLING */
/* ================================ */

function initializeFormHandling() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Input animations
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });
}

function handleInputFocus(e) {
    const inputGroup = e.target.closest('.input-group, .textarea-group, .select-group');
    if (inputGroup) {
        inputGroup.classList.add('focused');
    }
    playSound('hover');
}

function handleInputBlur(e) {
    const inputGroup = e.target.closest('.input-group, .textarea-group, .select-group');
    if (inputGroup) {
        inputGroup.classList.remove('focused');
        
        if (e.target.value.trim()) {
            inputGroup.classList.add('filled');
        } else {
            inputGroup.classList.remove('filled');
        }
    }
}

function handleInputChange(e) {
    const inputGroup = e.target.closest('.input-group, .textarea-group, .select-group');
    if (inputGroup) {
        if (e.target.value.trim()) {
            inputGroup.classList.add('filled');
        } else {
            inputGroup.classList.remove('filled');
        }
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('#submitBtn');
    const formStatus = contactForm.querySelector('#formStatus');
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    // Collect form data
    const formData = new FormData(contactForm);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        projectType: formData.get('projectType'),
        message: formData.get('message')
    };
    
    try {
        // Simulate form submission (replace with actual submission logic)
        await simulateFormSubmission(data);
        
        // Show success message
        showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
        
        // Clear filled states
        const inputGroups = contactForm.querySelectorAll('.input-group, .textarea-group, .select-group');
        inputGroups.forEach(group => group.classList.remove('filled'));
        
        playSound('success');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus('error', 'Something went wrong. Please try again or contact me directly.');
        playSound('error');
    } finally {
        submitBtn.classList.remove('loading');
    }
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve(data);
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 2000);
    });
}

function showFormStatus(type, message) {
    const formStatus = document.querySelector('#formStatus');
    if (!formStatus) return;
    
    formStatus.className = `form-status show ${type}`;
    
    const messageElement = formStatus.querySelector(`.${type}-message`);
    if (messageElement) {
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
    } else {
        formStatus.innerHTML = `
            <div class="${type}-message">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;
    }
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        formStatus.classList.remove('show');
    }, 5000);
}

/* ================================ */
/* PROFILE PICTURE UPLOAD */
/* ================================ */

function initializeProfileUpload() {
    const profileContainer = document.querySelector('.profile-picture-container');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    if (profileContainer) {
        profileContainer.appendChild(fileInput);
        
        const uploadBtn = profileContainer.querySelector('.upload-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
                playSound('click');
            });
        }
        
        fileInput.addEventListener('change', handleProfileImageUpload);
    }
}

function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const profileImg = document.querySelector('.profile-picture');
        if (profileImg) {
            profileImg.src = e.target.result;
            
            // Add upload animation
            profileImg.style.transform = 'scale(0.8)';
            profileImg.style.opacity = '0.5';
            
            setTimeout(() => {
                profileImg.style.transform = 'scale(1)';
                profileImg.style.opacity = '1';
            }, 100);
        }
        
        playSound('success');
    };
    
    reader.readAsDataURL(file);
}

/* ================================ */
/* THEME SYSTEM */
/* ================================ */

function initializeTheme() {
    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.body.className = savedTheme === 'light' ? 'light-theme' : '';
    
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    
    if (newTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
    playSound('click');
}

function updateThemeIcon(theme) {
    const themeIcon = themeToggle?.querySelector('i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundIcon = soundToggle?.querySelector('i');
    
    if (soundIcon) {
        soundIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
    
    localStorage.setItem('portfolio-sound', soundEnabled);
    
    if (soundEnabled) {
        playSound('click');
    }
}

/* ================================ */
/* SOUND EFFECTS */
/* ================================ */

function playSound(type) {
    if (!soundEnabled || !sounds[type]) return;
    
    try {
        sounds[type].currentTime = 0;
        sounds[type].volume = 0.3;
        sounds[type].play().catch(e => {
            console.log('Sound play failed:', e);
        });
    } catch (error) {
        console.log('Sound not available:', error);
    }
}

/* ================================ */
/* CUSTOM CURSOR */
/* ================================ */

function initializeCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const aiRobot = document.querySelector('.ai-robot');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update AI robot position with delay
        if (aiRobot) {
            setTimeout(() => {
                aiRobot.style.left = `${mouseX + 20}px`;
                aiRobot.style.top = `${mouseY + 20}px`;
            }, 300);
        }
    });
    
    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        cursorFollower.style.left = `${followerX}px`;
        cursorFollower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, input, textarea, select');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

/* ================================ */
/* ADDITIONAL INTERACTIVE FEATURES */
/* ================================ */

function initializeAnimations() {
    // Initialize AOS (Animate On Scroll) alternative
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add specific animation classes
                if (element.classList.contains('fade-in')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                if (element.classList.contains('slide-in-left')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }
                
                if (element.classList.contains('slide-in-right')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }
                
                if (element.classList.contains('scale-in')) {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                }
                
                // Trigger skill bar animations
                if (element.classList.contains('skill-item')) {
                    const progressBar = element.querySelector('.skill-progress');
                    const percentage = progressBar?.getAttribute('data-percentage');
                    
                    if (progressBar && percentage) {
                        setTimeout(() => {
                            progressBar.style.width = `${percentage}%`;
                        }, 300);
                    }
                }
                
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animation elements
    const animationElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skill-item');
    animationElements.forEach(el => animationObserver.observe(el));
}

/* ================================ */
/* CONTACT FORM ENHANCEMENTS */
/* ================================ */

function initializeContactEnhancements() {
    // Auto-resize textarea
    const textarea = document.querySelector('#message');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Input validation
    const inputs = document.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearInputError);
    });
}

function validateInput(e) {
    const input = e.target;
    const inputGroup = input.closest('.input-group, .textarea-group');
    
    if (!inputGroup) return;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Show/hide error
    if (!isValid) {
        showInputError(inputGroup, errorMessage);
    } else {
        clearInputError({ target: input });
    }
}

function showInputError(inputGroup, message) {
    inputGroup.classList.add('error');
    
    let errorElement = inputGroup.querySelector('.input-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'input-error';
        inputGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearInputError(e) {
    const inputGroup = e.target.closest('.input-group, .textarea-group');
    if (inputGroup) {
        inputGroup.classList.remove('error');
        const errorElement = inputGroup.querySelector('.input-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

/* ================================ */
/* PERFORMANCE OPTIMIZATIONS */
/* ================================ */

function initializePerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            updateScrollProgress();
            updateActiveSection();
        }, 10);
    });
    
    // Preload critical images
    const criticalImages = [
        'assets/images/profile-picture.jpg',
        'assets/images/hero-bg.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

function updateScrollProgress() {
    const scrolled = window.pageYOffset;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxHeight) * 100;
    
    // Update progress indicator if it exists
    const progressIndicator = document.querySelector('.scroll-progress');
    if (progressIndicator) {
        progressIndicator.style.width = `${progress}%`;
    }
}

/* ================================ */
/* ACCESSIBILITY ENHANCEMENTS */
/* ================================ */

function initializeAccessibility() {
    // Keyboard navigation for custom elements
    const focusableElements = document.querySelectorAll('.project-card, .skill-item, .filter-btn');
    
    focusableElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -100px;
        left: 0;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 1rem;
        z-index: 10000;
        text-decoration: none;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // ARIA labels for dynamic content
    const dynamicElements = document.querySelectorAll('.typing-text, .skill-progress, .stat-number');
    dynamicElements.forEach(element => {
        if (!element.hasAttribute('aria-label')) {
            element.setAttribute('aria-live', 'polite');
        }
    });
}

/* ================================ */
/* ERROR HANDLING & DEBUGGING */
/* ================================ */

function initializeErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        logError('JavaScript Error', e.error.message, e.filename, e.lineno);
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        logError('Promise Rejection', e.reason);
        e.preventDefault();
    });
}

function logError(type, message, filename = '', line = '') {
    const errorData = {
        type,
        message,
        filename,
        line,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // In production, send to error tracking service
    console.log('Error logged:', errorData);
    
    // Store in localStorage for debugging (limit to last 10 errors)
    let storedErrors = JSON.parse(localStorage.getItem('portfolio-errors') || '[]');
    storedErrors.unshift(errorData);
    storedErrors = storedErrors.slice(0, 10);
    localStorage.setItem('portfolio-errors', JSON.stringify(storedErrors));
}

/* ================================ */
/* ANALYTICS & TRACKING */
/* ================================ */

function initializeAnalytics() {
    // Track page views
    trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', debounce(() => {
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('scroll_depth', { depth: scrollDepth });
            }
        }
    }, 100));
    
    // Track interactions
    document.addEventListener('click', (e) => {
        const element = e.target.closest('a, button, .project-card, .skill-item');
        if (element) {
            const elementType = element.tagName.toLowerCase();
            const elementClass = element.className;
            const elementText = element.textContent.trim().substring(0, 50);
            
            trackEvent('interaction', {
                type: elementType,
                class: elementClass,
                text: elementText
            });
        }
    });
}

function trackEvent(eventName, eventData) {
    // In production, send to analytics service (Google Analytics, Mixpanel, etc.)
    console.log('Event tracked:', eventName, eventData);
    
    // Store locally for debugging
    const events = JSON.parse(localStorage.getItem('portfolio-events') || '[]');
    events.push({
        name: eventName,
        data: eventData,
        timestamp: Date.now()
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
        events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('portfolio-events', JSON.stringify(events));
}

/* ================================ */
/* UTILITY FUNCTIONS */
/* ================================ */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        return new Promise((resolve, reject) => {
            if (document.execCommand('copy')) {
                resolve();
            } else {
                reject();
            }
            document.body.removeChild(textArea);
        });
    }
}

/* ================================ */
/* SPECIAL FEATURES */
/* ================================ */

function initializeSpecialFeatures() {
    // Easter egg - Konami code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            triggerEasterEgg();
        }
    });
    
    // Developer console message
    console.log(`
    %c🚀 Welcome to Vineet Yadav's Portfolio! 
    %cLooking at the code? I like your curiosity! 
    %cFeel free to reach out if you want to discuss the implementation.
    
    Built with: HTML5, CSS3, Vanilla JavaScript
    Special features: Custom cursor, particles, typing effects, smooth animations
    
    Contact: vineet.yadav@email.com
    `, 
    'color: #10B981; font-size: 16px; font-weight: bold;',
    'color: #7C3AED; font-size: 14px;',
    'color: #F59E0B; font-size: 12px;'
    );
}

function triggerEasterEgg() {
    // Create celebration effect
    createConfettiEffect();
    
    // Show special message
    const easterEggModal = document.createElement('div');
    easterEggModal.className = 'easter-egg-modal';
    easterEggModal.innerHTML = `
        <div class="easter-egg-content">
            <h2>🎉 Konami Code Activated! 🎉</h2>
            <p>You found the easter egg! As a fellow developer, you deserve a special message:</p>
            <blockquote>
                "The best way to predict the future is to create it." - Peter Drucker
            </blockquote>
            <p>Thanks for exploring my portfolio code! 🚀</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    easterEggModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.5s ease;
    `;
    
    document.body.appendChild(easterEggModal);
    playSound('success');
}

function createConfettiEffect() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 9999;
            pointer-events: none;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation to CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .easter-egg-content {
        background: var(--bg-card);
        padding: 2rem;
        border-radius: var(--radius-lg);
        max-width: 500px;
        text-align: center;
        border: 2px solid var(--accent-color);
    }
    
    .easter-egg-content h2 {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }
    
    .easter-egg-content p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }
    
    .easter-egg-content blockquote {
        background: rgba(124, 58, 237, 0.1);
        padding: 1rem;
        border-left: 4px solid var(--accent-color);
        margin: 1rem 0;
        font-style: italic;
        color: var(--text-primary);
    }
    
    .easter-egg-content button {
        background: var(--gradient-primary);
        color: var(--text-primary);
        border: none;
        padding: 0.8rem 2rem;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 600;
        transition: all var(--transition-fast);
    }
    
    .easter-egg-content button:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
`;
document.head.appendChild(confettiStyle);

/* ================================ */
/* INITIALIZATION */
/* ================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM loaded, initializing portfolio...');
    
    // Initialize all components
    initializeWebsite();
    initializeErrorHandling();
    initializeAnalytics();
    initializeSpecialFeatures();
    initializePerformanceOptimizations();
    initializeAccessibility();
    initializeContactEnhancements();
    
    // Load saved preferences
    const savedSound = localStorage.getItem('portfolio-sound');
    if (savedSound !== null) {
        soundEnabled = JSON.parse(savedSound);
        const soundIcon = soundToggle?.querySelector('i');
        if (soundIcon) {
            soundIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    }
    
    console.log('🎉 Portfolio fully initialized!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause animations, etc.
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible - resume animations
        document.body.classList.remove('page-hidden');
        
        // Track page return
        trackEvent('page_return', {
            timestamp: new Date().toISOString()
        });
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('🌐 Connection restored');
    trackEvent('connection_restored');
});

window.addEventListener('offline', () => {
    console.log('📡 Connection lost');
    trackEvent('connection_lost');
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('📱 Window resized:', window.innerWidth, 'x', window.innerHeight);
        trackEvent('window_resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, 250);
});

// Export functions for external use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        playSound,
        trackEvent,
        copyToClipboard,
        formatNumber,
        formatDate
    };
}

// Global namespace for debugging
window.PortfolioDebug = {
    getStoredErrors: () => JSON.parse(localStorage.getItem('portfolio-errors') || '[]'),
    getStoredEvents: () => JSON.parse(localStorage.getItem('portfolio-events') || '[]'),
    clearStorage: () => {
        localStorage.removeItem('portfolio-errors');
        localStorage.removeItem('portfolio-events');
        console.log('🧹 Debug storage cleared');
    },
    triggerEasterEgg,
    playSound: (type) => playSound(type),
    getCurrentTheme: () => document.body.classList.contains('light-theme') ? 'light' : 'dark',
    isLoading: () => isLoading,
    soundEnabled: () => soundEnabled
};
