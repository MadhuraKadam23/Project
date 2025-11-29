document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const contactForm = document.getElementById('contactForm');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    /* ====== NAVIGATION ====== */
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 70;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }

            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });

    /* ====== SCROLL TO TOP BUTTON ====== */
    const scrollToTopBtn = document.createElement('div');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '↑';
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) scrollToTopBtn.classList.add('visible');
        else scrollToTopBtn.classList.remove('visible');

        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ====== CONTACT FORM ====== */
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !phone || !message) {
                alert('कृपया सर्व आवश्यक माहिती भरा!');
                return;
            }

            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone)) {
                alert('कृपया वैध मोबाईल नंबर टाका (१० अंक)!');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, email, message })
                });

                const result = await res.json();
                alert(result.message || 'संदेश यशस्वीपणे पाठवला गेला आहे!');
                contactForm.reset();
            } catch (err) {
                alert('सर्व्हरशी संपर्क होत नाही!');
                console.error(err);
            }
        });
    }

    /* ====== LOGIN FORM ====== */
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();


            if (!username || !password) {
                alert('कृपया सर्व माहिती भरा!');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: username, password })
                });

                const result = await res.json();
                alert(result.message);

                if (result.message.includes('successful') || result.message.includes('यशस्वी')) {
                    // Redirect to a dashboard page or success section
                    window.location.hash = '#home';
                }
            } catch (err) {
                alert('सर्व्हरशी संपर्क होत नाही!');
                console.error(err);
            }
        });
    }

    /* ====== SIGNUP FORM ====== */
/* ====== SIGNUP FORM ====== */
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

       const fullname = document.getElementById('signupFullname')?.value.trim();
       const email = document.getElementById('signupEmail')?.value.trim();
       const phone = document.getElementById('signupPhone')?.value.trim();
       const password = document.getElementById('signupPassword')?.value.trim();
       const confirmPassword = document.getElementById('signupConfirmPassword')?.value.trim();


        // 🔍 Debug Log
        console.log("DEBUG: Signup field values =>", {
            fullname, email, phone, password, confirmPassword
        });

        // Check for missing values
        if (!fullname || !email || !phone || !password || !confirmPassword) {
            alert('कृपया सर्व माहिती भरा!');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('कृपया वैध ईमेल पत्ता टाका!');
            return;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone)) {
            alert('कृपया वैध मोबाईल नंबर टाका (१० अंक)!');
            return;
        }

        if (password !== confirmPassword) {
            alert('पासवर्ड जुळत नाही!');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, phone, password })
            });

            const result = await res.json();
            console.log("DEBUG: Server response =>", result);

            alert(result.message);

            if (result.message.includes('successful') || result.message.includes('यशस्वी')) {
                signupForm.reset();
                window.location.hash = '#login';
            }
        } catch (err) {
            alert('सर्व्हरशी संपर्क होत नाही!');
            console.error("DEBUG: Error while signing up:", err);
        }
    });
}

    /* ====== SCROLL ANIMATIONS ====== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    const committeeMembers = document.querySelectorAll('.committee-member, .staff-member');
    committeeMembers.forEach((member, index) => {
        member.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(member);
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    const highlightCards = document.querySelectorAll('.highlight-card');
    highlightCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    const schemeCategories = document.querySelectorAll('.scheme-category');
    schemeCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateX(-30px)';
        category.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(category);
    });

    /* ====== MISC ====== */
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    });
});
