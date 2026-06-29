document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SELECTOR LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Determine initial theme
    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme;
        return systemPrefersDark.matches ? 'dark' : 'light';
    };

    let currentTheme = getInitialTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        currentTheme = newTheme;
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', systemTheme);
            currentTheme = systemTheme;
        }
    });

    // --- STICKY HEADER LOGIC ---
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case user loads page scrolled down

    // --- MOBILE HAMBURGER MENU LOGIC ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent background scrolling when mobile menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // --- INTERSECTION OBSERVER FOR FADE-IN ON SCROLL ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once animate is done
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- SCROLL TRIGGERED COUNTERS ---
    const counters = document.querySelectorAll('.counter');

    const animateCounters = (counterElement) => {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000; // Total duration in ms
        const stepTime = 20; // Interval in ms
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let count = 0;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                counterElement.innerText = Math.floor(count);
                setTimeout(updateCount, stepTime);
            } else {
                counterElement.innerText = target;
            }
        };

        updateCount();
    };

    const counterObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, counterObserverOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // --- WEB3FORMS ACCESS KEY CONFIGURATION ---
    // Please replace "YOUR_ACCESS_KEY_HERE" with the Web3Forms access key sent to digitalaisolution243@gmail.com
    const WEB3FORMS_ACCESS_KEY = "3a6e0785-07e5-49aa-9eb5-39343b21f850";

    // --- FORM SUBMISSION WITH DYNAMIC FEEDBACK ---
    const setupFormHandler = (formId, feedbackId, nameId, emailId, messageId, successMsgPrefix) => {
        const form = document.getElementById(formId);
        const feedback = document.getElementById(feedbackId);
        const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

        if (form && feedback) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Clean active classes
                feedback.className = 'form-feedback';
                feedback.style.display = 'none';

                // Get values
                const name = document.getElementById(nameId).value.trim();
                const email = document.getElementById(emailId).value.trim();
                const message = document.getElementById(messageId).value.trim();

                // Simple validation
                if (!name || !email || !message) {
                    feedback.innerText = 'Please fill out all the fields.';
                    feedback.classList.add('error');
                    feedback.style.display = 'block';
                    feedback.style.color = '#ef4444';
                    feedback.style.background = 'rgba(239, 68, 68, 0.1)';
                    feedback.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                    return;
                }

                // Visual loading state
                if (submitBtn) {
                    submitBtn.disabled = true;
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                    // Fallback alert if key has not been configured yet
                    if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || !WEB3FORMS_ACCESS_KEY) {
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;

                            feedback.innerText = 'Email sending is not configured. Please set your Web3Forms access key in public/js/script.js.';
                            feedback.classList.add('error');
                            feedback.style.display = 'block';
                            feedback.style.color = '#eab308'; // Warning yellow
                            feedback.style.background = 'rgba(234, 179, 8, 0.1)';
                            feedback.style.border = '1px solid rgba(234, 179, 8, 0.2)';
                            console.warn('Form submission received, but WEB3FORMS_ACCESS_KEY is still set to placeholder.');
                        }, 800);
                        return;
                    }

                    // Prepare form payload
                    const payload = {
                        access_key: WEB3FORMS_ACCESS_KEY,
                        name: name,
                        email: email,
                        message: message,
                        subject: `New submission from Digital-AI-Solution - ${formId === 'contact-form' ? 'Proposal' : 'Support Desk'}`
                    };

                    // Send email dispatcher request
                    fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    })
                        .then(async (response) => {
                            const json = await response.json();
                            if (response.status === 200) {
                                feedback.innerText = `Thank you, ${name}! ${successMsgPrefix}`;
                                feedback.className = 'form-feedback success';
                                feedback.style.display = 'block';
                                feedback.style.color = ''; // reset inline styles
                                feedback.style.background = '';
                                feedback.style.border = '';
                                form.reset();
                            } else {
                                throw new Error(json.message || "Failed to dispatch email notification.");
                            }
                        })
                        .catch(error => {
                            feedback.innerText = error.message || 'An error occurred. Please try again.';
                            feedback.classList.add('error');
                            feedback.style.display = 'block';
                            feedback.style.color = '#ef4444';
                            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
                            feedback.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                        })
                        .finally(() => {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        });
                }
            });
        }
    };

    setupFormHandler('contact-form', 'form-feedback', 'user-name', 'user-email', 'user-message', 'Your proposal request has been submitted successfully.');
    setupFormHandler('support-form', 'support-form-feedback', 'user-name-support', 'user-email-support', 'user-message-support', 'Your support ticket has been submitted successfully.');

    // --- ACCESSIBLE FOCUS MICRO-INTERACTIONS ---
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.parentElement.classList.remove('focused');
            }
        });
        // Run once on load to style fields prefilled by browser autocomplete
        if (input.value.trim()) {
            input.parentElement.classList.add('focused');
        }
    });

    // --- FAQ ACCORDION LOGIC ---
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Collapse all items first for standard accordion feel
            const allItems = header.closest('.faq-accordion').querySelectorAll('.faq-item');
            allItems.forEach(item => {
                item.classList.remove('active');
            });

            // If it was not active, expand it
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // --- AGENCY PAGE TAB CONTROLS ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabSections = document.querySelectorAll('.agency-section');

    const switchTab = (tabId) => {
        let targetId = tabId || '#about';
        // Validate target
        if (!['#about', '#strategy', '#careers', '#support'].includes(targetId)) {
            targetId = '#about';
        }

        // Update active classes on links
        tabLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Show matching section, hide others
        tabSections.forEach(section => {
            if ('#' + section.id === targetId) {
                section.style.display = 'block';
                // Trigger animated appearance for content elements inside tab
                section.querySelectorAll('.fade-in').forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('appear');
                    }, index * 100);
                });
            } else {
                section.style.display = 'none';
            }
        });

        // Scroll slightly above section viewport on click navigation
        const tabNav = document.querySelector('.agency-tabs');
        if (tabNav && window.scrollY > tabNav.offsetTop) {
            window.scrollTo({
                top: tabNav.offsetTop - 10,
                behavior: 'smooth'
            });
        }
    };

    // Trigger tab setup only if elements exist in current document
    if (tabLinks.length > 0 && tabSections.length > 0) {
        // Initial load check
        switchTab(window.location.hash);

        // Listen for internal clicks
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetHash = link.getAttribute('href');
                switchTab(targetHash);
            });
        });

        // Listen for back/forward browser actions
        window.addEventListener('hashchange', () => {
            switchTab(window.location.hash);
        });
    }

    // --- INTERACTIVE SPLIT SHOWCASE LOGIC ---
    const splitContainer = document.querySelector('.split-container');
    if (splitContainer) {
        let isTransitioningTimeout;

        const updateSplit = (clientX) => {
            const rect = splitContainer.getBoundingClientRect();
            const posX = clientX - rect.left;
            let percentage = (posX / rect.width) * 100;

            // Constrain between 15% and 85% to prevent empty panels
            percentage = Math.max(15, Math.min(85, percentage));
            splitContainer.style.setProperty('--split-pos', `${percentage}%`);
        };

        const onMove = (e) => {
            if (window.innerWidth <= 768) return; // Disable interactive sliding on mobile layouts

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSplit(clientX);
        };

        const triggerTransition = () => {
            splitContainer.classList.add('is-transitioning');
            clearTimeout(isTransitioningTimeout);
            isTransitioningTimeout = setTimeout(() => {
                splitContainer.classList.remove('is-transitioning');
            }, 400); // matches CSS transition duration
        };

        splitContainer.addEventListener('mousemove', onMove);
        splitContainer.addEventListener('touchmove', onMove, { passive: true });

        // Reset to 50% split on mouse leave
        splitContainer.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            triggerTransition();
            splitContainer.style.setProperty('--split-pos', '50%');
        });

        // Trigger transition on mouse enter to smoothly snap to cursor starting pos
        splitContainer.addEventListener('mouseenter', (e) => {
            if (window.innerWidth <= 768) return;
            triggerTransition();
            onMove(e);
        });
    }
});

