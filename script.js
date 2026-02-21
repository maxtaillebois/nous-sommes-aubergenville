// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe cards and sections for animation
document.querySelectorAll('.engagement-card, .accordion, .programme-engagement').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'white';
        }
    });
});

// ===== MODAL PDF (Plan par quartiers) =====
const planVilleImg = document.getElementById('planVilleImg');
const modalPlanVille = document.getElementById('modalPlanVille');
const modalClose = document.getElementById('modalClose');

if (planVilleImg && modalPlanVille) {
    planVilleImg.addEventListener('click', () => {
        modalPlanVille.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    modalClose.addEventListener('click', () => {
        modalPlanVille.classList.remove('active');
        document.body.style.overflow = '';
    });

    modalPlanVille.addEventListener('click', (e) => {
        if (e.target === modalPlanVille) {
            modalPlanVille.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalPlanVille.classList.contains('active')) {
            modalPlanVille.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== CONTACT FORM VALIDATION & SUBMIT =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formSubmitBtn = document.getElementById('formSubmitBtn');

if (contactForm) {
    // Live validation: remove error state on input
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('invalid');
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate required fields
        contactForm.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('invalid');
                isValid = false;
            } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                field.classList.add('invalid');
                isValid = false;
            } else {
                field.classList.remove('invalid');
            }
        });

        if (!isValid) return;

        // Submit via Formspree
        formSubmitBtn.disabled = true;
        formSubmitBtn.textContent = 'Envoi en cours\u2026';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactForm.reset();
                formSuccess.style.display = 'block';
                formSubmitBtn.textContent = 'Message envoy\u00e9';
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.textContent = 'Envoyer le message';
                }, 5000);
            } else {
                formSubmitBtn.disabled = false;
                formSubmitBtn.textContent = 'Envoyer le message';
                alert('Une erreur est survenue. Veuillez r\u00e9essayer.');
            }
        } catch (err) {
            formSubmitBtn.disabled = false;
            formSubmitBtn.textContent = 'Envoyer le message';
            alert('Erreur de connexion. V\u00e9rifiez votre connexion internet.');
        }
    });
}
