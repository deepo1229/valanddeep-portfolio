/**
 * Valand Deep - Portfolio Script
 * Interactive Three.js Background, Responsive Navigation, Scroll Animations, Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Mobile Hamburger Menu & Navigation Drawer
    // ==========================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

    const toggleMobileMenu = (open) => {
        const isOpen = open !== undefined ? open : !mobileNavOverlay.classList.contains('active');
        
        if (isOpen) {
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            mobileNavOverlay.classList.add('active');
            mobileNavOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mobileNavOverlay.classList.remove('active');
            mobileNavOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (hamburgerBtn && mobileNavOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            toggleMobileMenu();
        });

        // Close when clicking any link inside mobile navigation
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(false);
            });
        });

        // Close on 'Escape' key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });

        // Close when clicking outside of the mobile nav container
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                toggleMobileMenu(false);
            }
        });
    }

    // ==========================================================================
    // 2. Active Navigation Highlight (ScrollSpy)
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                desktopNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ==========================================================================
    // 3. Scroll Reveal Animations (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // ==========================================================================
    // 4. Subtle Desktop Custom Cursor Glow
    // ==========================================================================
    const cursorGlow = document.getElementById('cursor-glow');
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cursorGlow && isFinePointer) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursorGlow.style.left = `${cursorX}px`;
            cursorGlow.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Hover scale up on interactive links & buttons
        const hoverables = document.querySelectorAll('a, button, .btn, .project-card, .skill-category-card, input, textarea');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '54px';
                cursorGlow.style.height = '54px';
                cursorGlow.style.backgroundColor = 'rgba(0, 245, 196, 0.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '28px';
                cursorGlow.style.height = '28px';
                cursorGlow.style.backgroundColor = 'var(--accent-cyan)';
            });
        });
    }

    // ==========================================================================
    // 5. 3D Tilt Effect for Cards (Desktop Only)
    // ==========================================================================
    if (isFinePointer) {
        const tiltCards = document.querySelectorAll('.tilt');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8; // Gentle tilt max 8deg
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

    // ==========================================================================
    // 6. Contact Form Submission (Web3Forms API)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const accessKeyInput = document.getElementById('access_key');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const accessKey = accessKeyInput ? accessKeyInput.value : '';

            // Simple validation
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.className = 'form-status error show';
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formStatus.textContent = 'Please enter a valid email address.';
                formStatus.className = 'form-status error show';
                return;
            }

            // Submit state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> Sending...</span>';
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: accessKey,
                        name: name,
                        email: email,
                        message: message,
                        subject: `New Portfolio Message from ${name}`
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    formStatus.textContent = "Thank you! Your message has been sent successfully. I'll get back to you soon.";
                    formStatus.className = 'form-status success show';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                console.error('Contact form submission error:', err);
                formStatus.textContent = 'Unable to send message right now. Please email directly at valanddeep46@gmail.com.';
                formStatus.className = 'form-status error show';
            } finally {
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;

                setTimeout(() => {
                    formStatus.classList.remove('show');
                }, 6000);
            }
        });
    }

    // ==========================================================================
    // 7. Three.js Background Animation
    // ==========================================================================
    const initThreeJsBackground = () => {
        const canvas = document.querySelector('#bg-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 3D Outer Structure (Icosahedron Wireframe)
        const geometry = new THREE.IcosahedronGeometry(12, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00f5c4,
            wireframe: true,
            transparent: true,
            opacity: 0.18
        });
        const mainObject = new THREE.Mesh(geometry, material);
        scene.add(mainObject);

        // Inner Nested Structure
        const innerGeometry = new THREE.IcosahedronGeometry(7.5, 0);
        const innerMaterial = new THREE.MeshStandardMaterial({
            color: 0x9d4edd,
            wireframe: true,
            transparent: true,
            opacity: 0.28
        });
        const innerObject = new THREE.Mesh(innerGeometry, innerMaterial);
        mainObject.add(innerObject);

        // Particles System
        const isMobileDevice = window.innerWidth < 768;
        const particlesCount = isMobileDevice ? 700 : 1300;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 110;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: isMobileDevice ? 0.08 : 0.12,
            color: 0x00f5c4,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f5c4, 2.5);
        pointLight.position.set(20, 20, 20);
        scene.add(pointLight);

        // Mouse Parallax Effect
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        if (isFinePointer) {
            document.addEventListener('mousemove', (event) => {
                mouseX = event.clientX - windowHalfX;
                mouseY = event.clientY - windowHalfY;
            }, { passive: true });
        }

        // Animation Loop
        const clock = new THREE.Clock();
        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotations
            mainObject.rotation.y += 0.0025;
            mainObject.rotation.x += 0.0018;
            innerObject.rotation.y -= 0.004;
            innerObject.rotation.x -= 0.003;

            particlesMesh.rotation.y = -0.04 * elapsedTime;

            if (isFinePointer) {
                targetX = mouseX * 0.008;
                targetY = mouseY * 0.008;
                camera.position.x += (targetX - camera.position.x) * 0.05;
                camera.position.y += (-targetY - camera.position.y) * 0.05;
            }
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Responsive Resize Handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 100);
        });

        // Clean up or pause when document is hidden to save battery
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });
    };

    initThreeJsBackground();
});
