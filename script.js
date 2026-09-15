/* ============================================================
   DENTÉRA — Premium Dental Clinic (Front-end Demo)
   Plain vanilla JavaScript — no frameworks, no build step.
   ------------------------------------------------------------
   Handles:
   01. Sticky navbar state + scroll progress
   02. Mobile navigation drawer
   03. Scroll spy (active navigation state)
   04. Scroll reveal (IntersectionObserver)
   05. Animated statistics counters
   06. Services / doctors generated from data (keeps HTML tidy)
   07. Before & After compare sliders
   08. Testimonials carousel (prev / next / dots / swipe / autoplay)
   09. FAQ accordion (one open at a time)
   10. Appointment form demo submission (no backend)
   11. Policy modal (Privacy / Terms) + Back to top + Year
   ============================================================ */
'use strict';

(function () {

    /* --------------------------------------------------------
       Small helpers
       -------------------------------------------------------- */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --------------------------------------------------------
       01. STICKY NAVBAR STATE + SCROLL PROGRESS
       -------------------------------------------------------- */
    const header = $('.site-header');
    const progress = $('.scroll-progress');
    const backToTop = $('.back-to-top');

    function onScroll() {
        const y = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (header) header.classList.toggle('scrolled', y > 40);
        if (backToTop) backToTop.classList.toggle('is-visible', y > 620);
        if (progress) {
            const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
            progress.style.width = Math.min(100, Math.max(0, pct)).toFixed(2) + '%';
        }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => { onScroll(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    onScroll();

    /* --------------------------------------------------------
       02. MOBILE NAVIGATION DRAWER
       -------------------------------------------------------- */
    const toggle   = $('.nav-toggle');
    const drawer   = $('#mobileMenu');
    const overlay  = $('.menu-overlay');
    const closeBtn = $('.mobile-menu__close');

    function openMenu() {
        if (!drawer) return;
        drawer.classList.add('is-open');
        overlay.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        const first = drawer.querySelector('a, button');
        if (first) window.setTimeout(() => first.focus(), 320);
    }

    function closeMenu() {
        if (!drawer) return;
        drawer.classList.remove('is-open');
        overlay.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            drawer.classList.contains('is-open') ? closeMenu() : openMenu();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            closeModal();
        }
    });

    /* --------------------------------------------------------
       03. SMOOTH IN-PAGE NAVIGATION (with header offset)
       -------------------------------------------------------- */
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            closeMenu();

            const offset = (header ? header.offsetHeight : 0) - 4;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: reduceMotion ? 'auto' : 'smooth'
            });

            history.replaceState(null, '', id);
        });
    });

    /* --------------------------------------------------------
       03b. SCROLL SPY — active navigation state
       -------------------------------------------------------- */
    const navLinks = $$('.nav__link, .mobile-menu__link');
    const spySections = navLinks
        .map((l) => document.querySelector(l.getAttribute('href')))
        .filter((s) => !!s && s.id)
        /* the navigation order is not the document order — sort by position */
        .sort((a, b) => a.offsetTop - b.offsetTop)
        .filter((s, i, arr) => arr.indexOf(s) === i);

    function scrollSpy() {
        if (!spySections.length) return;
        const probe = (header ? header.offsetHeight : 0) + window.innerHeight * 0.28;
        let current = spySections[0];

        spySections.forEach((section) => {
            if (section.offsetTop <= (window.pageYOffset || 0) + probe) current = section;
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === '#' + current.id;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    }

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(scrollSpy);
    }, { passive: true });
    window.addEventListener('load', scrollSpy);
    scrollSpy();

    /* --------------------------------------------------------
       04. SCROLL REVEAL
       -------------------------------------------------------- */
    const revealEls = $$('.reveal');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    /* --------------------------------------------------------
       05. ANIMATED STATISTICS COUNTERS
       -------------------------------------------------------- */
    const counters = $$('[data-counter]');

    function animateCounter(el) {
        const target = parseFloat(el.dataset.counter);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = reduceMotion ? 1 : 1600;
        const startTime = performance.now();

        function frame(now) {
            const p = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const value = target * eased;

            el.textContent = (decimals > 0
                ? value.toFixed(decimals)
                : Math.round(value).toLocaleString('en-US')) + suffix;

            if (p < 1) window.requestAnimationFrame(frame);
            else {
                el.textContent = (decimals > 0
                    ? target.toFixed(decimals)
                    : Math.round(target).toLocaleString('en-US')) + suffix;
            }
        }
        window.requestAnimationFrame(frame);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach((c) => counterObserver.observe(c));
    } else {
        counters.forEach(animateCounter);
    }

    /* --------------------------------------------------------
       07. BEFORE & AFTER COMPARE SLIDERS
       -------------------------------------------------------- */
    $$('.compare').forEach((compare) => {
        const range = $('.compare__input', compare);
        if (!range) return;

        const update = () => compare.style.setProperty('--split', range.value + '%');
        range.addEventListener('input', update);
        range.addEventListener('change', update);
        update();
    });

    /* --------------------------------------------------------
       08. TESTIMONIALS CAROUSEL
       -------------------------------------------------------- */
    const carousel = $('.testi__carousel');

    if (carousel) {
        const track  = $('.testi__track', carousel);
        const slides = $$('.testi__slide', carousel);
        const prev   = $('.testi__btn--prev', carousel);
        const next   = $('.testi__btn--next', carousel);
        const dots   = $$('.testi-dot', carousel);
        const total  = slides.length;
        let index = 0;
        let autoplayId = null;

        function goTo(i) {
            index = (i + total) % total;
            track.style.transform = 'translateX(' + (-index * 100) + '%)';
            slides.forEach((s, si) => s.setAttribute('aria-hidden', si === index ? 'false' : 'true'));
            dots.forEach((d, di) => {
                d.classList.toggle('is-active', di === index);
                d.setAttribute('aria-selected', di === index ? 'true' : 'false');
            });
        }

        if (prev) prev.addEventListener('click', () => { goTo(index - 1); restartAutoplay(); });
        if (next) next.addEventListener('click', () => { goTo(index + 1); restartAutoplay(); });
        dots.forEach((dot, di) => dot.addEventListener('click', () => { goTo(di); restartAutoplay(); }));

        /* Keyboard support on the carousel region */
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { goTo(index - 1); restartAutoplay(); }
            if (e.key === 'ArrowRight') { goTo(index + 1); restartAutoplay(); }
        });

        /* Touch swipe */
        let startX = 0, startY = 0, swiping = false;
        carousel.addEventListener('touchstart', (e) => {
            const t = e.changedTouches[0];
            startX = t.clientX; startY = t.clientY; swiping = true;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            if (!swiping) return;
            swiping = false;
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
                goTo(dx < 0 ? index + 1 : index - 1);
                restartAutoplay();
            }
        }, { passive: true });

        /* Autoplay (paused on hover / focus / when tab hidden) */
        function startAutoplay() {
            if (reduceMotion) return;
            autoplayId = window.setInterval(() => goTo(index + 1), 7000);
        }
        function stopAutoplay() {
            if (autoplayId) { window.clearInterval(autoplayId); autoplayId = null; }
        }
        function restartAutoplay() { stopAutoplay(); startAutoplay(); }

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);
        document.addEventListener('visibilitychange', () => {
            document.hidden ? stopAutoplay() : startAutoplay();
        });

        goTo(0);
        startAutoplay();
    }

    /* --------------------------------------------------------
       09. FAQ ACCORDION — only one open at a time
       -------------------------------------------------------- */
    const faqItems = $$('.faq-item');

    function closeFaq(item) {
        const btn = $('.faq-item__q', item);
        const panel = $('.faq-item__a', item);
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0px';
    }

    function openFaq(item) {
        const btn = $('.faq-item__q', item);
        const panel = $('.faq-item__a', item);
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
    }

    faqItems.forEach((item) => {
        const btn = $('.faq-item__q', item);
        const panel = $('.faq-item__a', item);
        if (!btn || !panel) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            faqItems.forEach((other) => { if (other !== item) closeFaq(other); });
            isOpen ? closeFaq(item) : openFaq(item);
        });
    });

    /* Keep an open FAQ the right height on resize */
    window.addEventListener('resize', () => {
        faqItems.forEach((item) => {
            if (item.classList.contains('is-open')) {
                const panel = $('.faq-item__a', item);
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });

    if (faqItems.length) openFaq(faqItems[0]);

    /* --------------------------------------------------------
       10. APPOINTMENT FORM — demo submission (no backend)
       -------------------------------------------------------- */
    const form = $('#appointmentForm');

    if (form) {
        const success = $('#formSuccess');
        const successName = $('#successName');

        function setError(field, message) {
            field.classList.add('has-error');
            const err = $('.field__error', field);
            if (err) err.textContent = message;
        }
        function clearError(field) {
            field.classList.remove('has-error');
            const err = $('.field__error', field);
            if (err) err.textContent = '';
        }

        $$('input, select, textarea', form).forEach((input) => {
            input.addEventListener('input', () => clearError(input.closest('.field')));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let valid = true;
            const nameField = $('#fullName');
            const emailField = $('#email');
            const phoneField = $('#phone');

            /* Demo-only validation */
            if (!nameField.value.trim()) {
                setError(nameField.closest('.field'), 'Please enter your full name.');
                valid = false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailField.value.trim())) {
                setError(emailField.closest('.field'), 'Please enter a valid email address.');
                valid = false;
            }
            if (phoneField.value.replace(/[^\d]/g, '').length < 7) {
                setError(phoneField.closest('.field'), 'Please enter a reachable phone number.');
                valid = false;
            }

            if (!valid) {
                const firstError = $('.field.has-error input, .field.has-error select', form);
                if (firstError) firstError.focus();
                return;
            }

            const button = $('button[type="submit"]', form);
            const originalHTML = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending request…';

            /* Simulated request delay for demo purposes */
            window.setTimeout(() => {
                const firstName = nameField.value.trim().split(' ')[0];
                if (successName) successName.textContent = firstName ? ' ' + firstName : '';

                success.classList.add('is-visible');
                success.setAttribute('role', 'status');
                success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });

                form.reset();
                button.disabled = false;
                button.innerHTML = originalHTML;

                window.setTimeout(() => success.classList.remove('is-visible'), 12000);
            }, 900);
        });
    }

    /* --------------------------------------------------------
       11. POLICY MODAL, BACK TO TOP, CURRENT YEAR
       -------------------------------------------------------- */
    const modal = $('#policyModal');

    function openModal() {
        if (!modal) return;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        const close = $('.modal__close', modal);
        if (close) close.focus();
    }

    function closeModal() {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');

        /* only release the scroll lock if the mobile menu is not open too */
        if (!drawer || !drawer.classList.contains('is-open')) {
            document.body.classList.remove('menu-open');
        }
        const trigger = $('button[data-modal-open]');
        if (trigger) trigger.focus();
    }

    $$('[data-modal-open]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modal) {
        $$('[data-modal-close]', modal).forEach((btn) => btn.addEventListener('click', closeModal));
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    const yearEl = $('#currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
