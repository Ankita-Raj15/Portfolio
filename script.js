/* ==========================================================================
   ANKITA RAJ - PERSONAL PORTFOLIO INTERACTIVE LOGIC (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. MOBILE NAVIGATION TOGGLE
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // 2. NAVBAR SCROLL EFFECT & SCROLL SPY (ACTIVE LINK ON SCROLL)
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Spy: Highlight active section
        let currentSectionId = 'landing';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120; // offset for sticky nav
            const sectionHeight = sec.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially


    // 3. SCROLL-TRIGGERED ENTRANCE ANIMATIONS (Intersection Observer)
    const animatedElements = document.querySelectorAll('.trigger-animate, .section-title, .skills-card, .cert-card, .achievement-card');

    const scrollObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // offset to trigger animations slightly before visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Add animated class to trigger CSS keyframes
                target.classList.add('animated');
                
                // Check if this is the skills section grid to start bar fill & count-up
                if (target.id === 'skills-grid-container') {
                    animateSkillsProgress();
                }

                // Check if this is the certifications grid to trigger tilt-to-flat snap
                if (target.id === 'certs-grid-container') {
                    snapCertsFlat();
                }

                // Check if this is the contact form panel to run underline drawer sequencer
                if (target.id === 'contact-form-panel') {
                    runContactUnderlineSequencer();
                }

                // Unobserve since we only want to animate in once
                observer.unobserve(target);
            }
        });
    }, scrollObserverOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Also observe grid containers directly for special triggers
    const skillsGrid = document.getElementById('skills-grid-container');
    if (skillsGrid) scrollObserver.observe(skillsGrid);

    const certsGrid = document.getElementById('certs-grid-container');
    if (certsGrid) scrollObserver.observe(certsGrid);


    // 4. LANDING PAGE IMMEDIATE ON-LOAD ANIMATIONS
    const triggerLandingAnimations = () => {
        const landingLogo = document.getElementById('landing-logo-badge');
        const landingTitle = document.getElementById('landing-title');
        const landingDesig = document.getElementById('landing-designation');
        const landingIntro = document.getElementById('landing-intro-text');
        const landingCtas = document.getElementById('landing-ctas');
        const landingSocials = document.getElementById('landing-socials');

        if (landingLogo) landingLogo.classList.add('animated');
        if (landingTitle) landingTitle.classList.add('animated');
        if (landingDesig) landingDesig.classList.add('animated');
        if (landingIntro) landingIntro.classList.add('animated');
        if (landingCtas) landingCtas.classList.add('animated');
        if (landingSocials) landingSocials.classList.add('animated');
    };

    // Run landing animations on page load
    triggerLandingAnimations();


    // 5. PROJECTS INTERACTIVE SWITCHER
    const projectSelectors = document.querySelectorAll('.project-selector');
    const projectDetailViews = document.querySelectorAll('.project-detail-view');

    projectSelectors.forEach(selector => {
        selector.addEventListener('click', () => {
            const targetProj = selector.getAttribute('data-project');
            
            // Update selectors
            projectSelectors.forEach(sel => sel.classList.remove('active'));
            selector.classList.add('active');

            // Update views
            projectDetailViews.forEach(view => {
                view.classList.remove('active');
                
                // If it is the target view, activate it
                if (view.id === `detail-${targetProj}`) {
                    view.classList.add('active');

                    // Reset outcomes and tech tags animations to run again
                    const outcomes = view.querySelectorAll('.outcome-box');
                    const techPills = view.querySelectorAll('.tech-pill');

                    outcomes.forEach(out => {
                        out.style.animation = 'none';
                        // Trigger reflow to restart animation
                        void out.offsetWidth;
                        out.style.animation = '';
                    });

                    techPills.forEach(pill => {
                        pill.style.animation = 'none';
                        void pill.offsetWidth;
                        pill.style.animation = '';
                    });
                }
            });
        });
    });


    // 6. SKILLS BAR FILL & VALUE COUNT-UP
    const animateSkillsProgress = () => {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const progressFill = item.querySelector('.progress-bar-fill');
            const percentageText = item.querySelector('.skill-percentage');
            const targetVal = parseInt(item.getAttribute('data-value'), 10);
            
            // Set width to trigger CSS transition
            if (progressFill) {
                progressFill.style.width = `${targetVal}%`;
            }

            // Animate number count-up in sync
            if (percentageText) {
                let currentVal = 0;
                const duration = 1200; // matching CSS fill transition duration (1.2s)
                const frameRate = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameRate);
                const increment = targetVal / totalFrames;
                
                const countInterval = setInterval(() => {
                    currentVal += increment;
                    if (currentVal >= targetVal) {
                        percentageText.textContent = `${targetVal}%`;
                        clearInterval(countInterval);
                    } else {
                        percentageText.textContent = `${Math.round(currentVal)}%`;
                    }
                }, frameRate);
            }
        });
    };


    // 7. CERTIFICATIONS CARD EFFECTS (Tilt Flat & Mouse Follow Tilt)
    
    // Set random rotation initially
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
        const randomRot = (Math.random() * 4 - 2).toFixed(2); // Random rot between -2 and +2 deg
        card.style.transform = `translateY(50px) rotate(${randomRot}deg)`;
    });

    // Snap flat function (when entering viewport)
    const snapCertsFlat = () => {
        setTimeout(() => {
            certCards.forEach((card, index) => {
                setTimeout(() => {
                    // Overwrite transform back to flat
                    card.style.transform = 'translateY(0) rotate(0deg)';
                }, index * 80); // Stagger flat transition slightly
            });
        }, 300);
    };

    // Mouse-follow 3D tilt effect on hover
    certCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            
            // Cursor position relative to card boundaries (0 to width/height)
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            // Normalize to -0.5 to +0.5
            const normX = (x / cardRect.width) - 0.5;
            const normY = (y / cardRect.height) - 0.5;
            
            // Calculate tilt angle (max 4.5 degrees)
            const rotateX = (-normY * 9).toFixed(2);
            const rotateY = (normX * 9).toFixed(2);
            
            // Apply 3D tilt transform
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly transition back to flat
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), background-color 0.4s ease';
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            
            // Remove transition override after it's finished, so mousemove reacts fast again
            setTimeout(() => {
                card.style.transition = 'transform 0.1s ease, box-shadow 0.4s ease, background-color 0.4s ease';
            }, 500);
        });
    });


    // 8. CERTIFICATE POPUP IMAGE MODAL
    const certModal = document.createElement('div');
    certModal.classList.add('cert-modal');
    certModal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <img class="modal-img" src="" alt="Certificate View">
            <h3 class="modal-title"></h3>
        </div>
    `;
    document.body.appendChild(certModal);

    const modalImg = certModal.querySelector('.modal-img');
    const modalTitle = certModal.querySelector('.modal-title');
    const modalClose = certModal.querySelector('.modal-close');

    // Click to open popup
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.cert-img');
            const title = card.querySelector('.cert-name').textContent;
            
            if (img) {
                modalImg.src = img.src;
                modalTitle.textContent = title;
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // stop background scroll
            }
        });
    });

    // Close popup
    const closeModal = () => {
        certModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.classList.contains('active')) {
            closeModal();
        }
    });


    // 9. CONTACT FORM: DRAWING UNDERLINE SEQUENCER & FLOATING LABELS & SIMULATION
    const formPanel = document.getElementById('contact-form-panel');
    const formFields = document.querySelectorAll('.form-group');
    const submitBtn = document.getElementById('btn-submit-form');
    const contactForm = document.getElementById('portfolio-contact-form');
    const statusMsg = document.getElementById('form-status');

    // Underline drawer sequencer on contact form entry
    const runContactUnderlineSequencer = () => {
        formFields.forEach((group, index) => {
            const underline = group.querySelector('.underline-draw');
            if (underline) {
                setTimeout(() => {
                    // Temporarily trigger drawing animation to show functionality
                    underline.style.width = '100%';
                    
                    // Keep drawn for a bit, then shrink back so focus underline works normally
                    setTimeout(() => {
                        underline.style.width = '';
                    }, 800);
                }, index * 400 + 400); // Sequential delays: Name -> Email -> Subject -> Message
            }
        });

        // Pulse submit button once after underlines finished sequencing
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.classList.add('pulse-once');
            }
        }, formFields.length * 400 + 400);
    };

    // Simulate sending message on form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract input values
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Simple validation check
            if (!name || !email || !subject || !message) {
                statusMsg.textContent = "Please fill in all fields.";
                statusMsg.className = "form-status-msg error";
                return;
            }

            // Disable submit button during "sending"
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span> <svg class="send-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;

            // Simulate Network Request Delay
            setTimeout(() => {
                // Display success status
                statusMsg.textContent = `Thank you, ${name}! Your message has been sent to ankitaraj15122004@gmail.com.`;
                statusMsg.className = "form-status-msg success";

                // Reset form inputs
                contactForm.reset();
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Send Message</span> <svg class="send-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

                // Clear success message after 6 seconds
                setTimeout(() => {
                    statusMsg.style.opacity = '0';
                    setTimeout(() => {
                        statusMsg.textContent = '';
                        statusMsg.style.opacity = '1';
                        statusMsg.className = 'form-status-msg';
                    }, 400);
                }, 6000);

            }, 1500);
        });
    }

});
