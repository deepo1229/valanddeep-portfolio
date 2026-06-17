// --- Three.js Background Animation ---
const canvas = document.querySelector('#bg-canvas');

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// --- 3D Objects ---
// Create a complex geometric structure
const geometry = new THREE.IcosahedronGeometry(12, 1);
const material = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    wireframe: true,
    transparent: true,
    opacity: 0.2
});
const mainObject = new THREE.Mesh(geometry, material);
scene.add(mainObject);

// Add a smaller inner object for depth
const innerGeometry = new THREE.IcosahedronGeometry(8, 0);
const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0xaa00ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const innerObject = new THREE.Mesh(innerGeometry, innerMaterial);
mainObject.add(innerObject);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles randomly in a large area
    posArray[i] = (Math.random() - 0.5) * 100;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffcc, 2);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

// --- Mouse Interaction ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate Main Object
    mainObject.rotation.y += 0.003;
    mainObject.rotation.x += 0.002;
    innerObject.rotation.y -= 0.005;
    innerObject.rotation.x -= 0.004;

    // Rotate particles slowly
    particlesMesh.rotation.y = -0.05 * elapsedTime;
    if(mouseX > 0) {
        particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
        particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00008);
    }

    // Ease camera movement towards mouse position
    targetX = mouseX * 0.01;
    targetY = mouseY * 0.01;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// --- Responsive Canvas ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- Form Submission Logic (Web3Forms API) ---
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (form) {
    let formStatus = document.getElementById('form-status');
    if (!formStatus) {
        formStatus = document.createElement('div');
        formStatus.id = 'form-status';
        formStatus.style.marginTop = '20px';
        formStatus.style.textAlign = 'center';
        formStatus.style.fontWeight = '600';
        form.appendChild(formStatus);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent native form submission
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const accessKey = document.getElementById('access_key').value;

        if (accessKey === "YOUR_ACCESS_KEY_HERE" || !accessKey) {
            formStatus.textContent = "Please replace YOUR_ACCESS_KEY_HERE in index.html with your Web3Forms Access Key.";
            formStatus.style.color = '#ff3366';
            return;
        }

        if (!name || !email || !message) {
            formStatus.textContent = "Please fill out all fields.";
            formStatus.style.color = '#ff3366';
            return;
        }

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
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
                    subject: `New Portfolio Contact from ${name}`
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
                formStatus.style.color = 'var(--accent-color)';
                form.reset();
            } else {
                throw new Error(data.message || 'Server error');
            }
        } catch (error) {
            formStatus.textContent = "Oops! Something went wrong. Please check your internet connection and try again.";
            formStatus.style.color = '#ff3366';
            console.error("Error submitting form:", error);
        } finally {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
            
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        }
    });
}

// --- Custom Cursor ---
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }
});

// Add hover effect to links and interactive elements
document.querySelectorAll('a, button, .project-card, input, textarea, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '50px';
            cursorGlow.style.height = '50px';
            cursorGlow.style.backgroundColor = 'rgba(0, 255, 204, 0.4)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '20px';
            cursorGlow.style.height = '20px';
            cursorGlow.style.backgroundColor = 'var(--accent-color)';
        }
    });
});

// --- Scroll Animations (Intersection Observer) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden').forEach((section) => {
    observer.observe(section);
});

// --- 3D Tilt Effect for Project Cards ---
const tiltCards = document.querySelectorAll('.tilt');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on cursor position relative to card center
        const rotateX = ((y - centerY) / centerY) * -15; // Max rotation 15deg
        const rotateY = ((x - centerX) / centerX) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});
