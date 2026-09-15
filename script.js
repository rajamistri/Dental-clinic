/* =========================================================
   DENTÉRA — PREMIUM DENTAL CLINIC
   Vanilla JavaScript only
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    window.addEventListener("load", function () {

        setTimeout(function () {

            const loader = document.querySelector(".page-loader");

            if (loader) {
                loader.classList.add("loaded");
            }

        }, 500);

    });


    /* =====================================================
       HEADER SCROLL STATE
    ===================================================== */

    const header = document.getElementById("siteHeader");

    function updateHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav a");

    function closeMobileMenu() {

        if (!header || !menuToggle) {
            return;
        }

        header.classList.remove("menu-active");
        menuToggle.setAttribute("aria-expanded", "false");

        document.body.classList.remove("menu-open");

    }


    if (menuToggle) {

        menuToggle.addEventListener("click", function () {

            const isOpen = header.classList.toggle("menu-active");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });

    }


    mobileNavLinks.forEach(function (link) {

        link.addEventListener("click", function () {
            closeMobileMenu();
        });

    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                10;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".reveal-up, .reveal-left, .reveal-right, .reveal-card"
    );


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        revealElements.forEach(function (element) {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll(
        "main section[id]"
    );


    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id = entry.target.id;

                    navLinks.forEach(function (link) {

                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            "#" + id
                        ) {
                            link.classList.add("active");
                        }

                    });

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );


        sections.forEach(function (section) {

            sectionObserver.observe(section);

        });

    }


    /* =====================================================
       COUNTER ANIMATION
    ===================================================== */

    const counters = document.querySelectorAll(
        "[data-count]"
    );

    let countersStarted = false;


    function animateCounters() {

        if (countersStarted) {
            return;
        }

        countersStarted = true;

        counters.forEach(function (counter) {

            const target = parseInt(
                counter.getAttribute("data-count"),
                10
            );

            const duration = target > 1000
                ? 1800
                : 1300;

            const startTime = performance.now();


            function updateCounter(currentTime) {

                const elapsed =
                    currentTime - startTime;

                const progress =
                    Math.min(elapsed / duration, 1);

                const eased =
                    1 - Math.pow(1 - progress, 4);

                const value =
                    Math.floor(target * eased);

                counter.textContent =
                    value.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent =
                        target.toLocaleString();
                }

            }


            requestAnimationFrame(updateCounter);

        });

    }


    const statsSection =
        document.querySelector(".stats-section");


    if (statsSection && "IntersectionObserver" in window) {

        const counterObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    if (entries[0].isIntersecting) {

                        animateCounters();

                        observer.disconnect();

                    }

                },
                {
                    threshold: .3
                }
            );

        counterObserver.observe(statsSection);

    } else if (statsSection) {

        animateCounters();

    }


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");


    faqItems.forEach(function (item) {

        const question =
            item.querySelector(".faq-question");


        if (!question) {
            return;
        }


        question.addEventListener("click", function () {

            const isActive =
                item.classList.contains("active");


            faqItems.forEach(function (faqItem) {

                faqItem.classList.remove("active");

            });


            if (!isActive) {
                item.classList.add("active");
            }

        });

    });


    /* =====================================================
       TESTIMONIAL SLIDER
    ===================================================== */

    const testimonialTrack =
        document.querySelector(".testimonial-track");

    const testimonialSlides =
        document.querySelectorAll(".testimonial-slide");

    const testimonialDots =
        document.querySelectorAll(".testimonial-dot");

    const testimonialPrev =
        document.querySelector(".testimonial-prev");

    const testimonialNext =
        document.querySelector(".testimonial-next");


    let currentSlide = 0;


    function updateTestimonial(index) {

        if (!testimonialTrack || !testimonialSlides.length) {
            return;
        }

        if (index < 0) {
            index = testimonialSlides.length - 1;
        }

        if (index >= testimonialSlides.length) {
            index = 0;
        }

        currentSlide = index;

        testimonialTrack.style.transform =
            "translateX(-" + (index * 100) + "%)";


        testimonialDots.forEach(function (dot, dotIndex) {

            dot.classList.toggle(
                "active",
                dotIndex === index
            );

        });

    }


    if (testimonialNext) {

        testimonialNext.addEventListener(
            "click",
            function () {

                updateTestimonial(
                    currentSlide + 1
                );

            }
        );

    }


    if (testimonialPrev) {

        testimonialPrev.addEventListener(
            "click",
            function () {

                updateTestimonial(
                    currentSlide - 1
                );

            }
        );

    }


    testimonialDots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            updateTestimonial(index);

        });

    });


    /* =====================================================
       TESTIMONIAL TOUCH SWIPE
    ===================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    if (testimonialTrack) {

        testimonialTrack.addEventListener(
            "touchstart",
            function (event) {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            {
                passive: true
            }
        );


        testimonialTrack.addEventListener(
            "touchend",
            function (event) {

                touchEndX =
                    event.changedTouches[0].screenX;

                const difference =
                    touchStartX - touchEndX;


                if (Math.abs(difference) < 50) {
                    return;
                }


                if (difference > 0) {

                    updateTestimonial(
                        currentSlide + 1
                    );

                } else {

                    updateTestimonial(
                        currentSlide - 1
                    );

                }

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       AUTO TESTIMONIAL ROTATION
    ===================================================== */

    let testimonialTimer;


    function startTestimonialTimer() {

        clearInterval(testimonialTimer);

        testimonialTimer =
            setInterval(function () {

                updateTestimonial(
                    currentSlide + 1
                );

            }, 6500);

    }


    if (testimonialSlides.length > 1) {
        startTestimonialTimer();
    }


    [testimonialNext, testimonialPrev]
        .filter(Boolean)
        .forEach(function (button) {

            button.addEventListener(
                "click",
                startTestimonialTimer
            );

        });


    /* =====================================================
       PROCESS LINE
    ===================================================== */

    const processLine =
        document.querySelector(".process-line");


    if (processLine && "IntersectionObserver" in window) {

        const processObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    if (entries[0].isIntersecting) {

                        processLine.classList.add("visible");

                        observer.disconnect();

                    }

                },
                {
                    threshold: .3
                }
            );

        processObserver.observe(processLine);

    }


    /* =====================================================
       APPOINTMENT FORM
    ===================================================== */

    const appointmentForm =
        document.getElementById("appointmentForm");

    const successMessage =
        document.getElementById("successMessage");

    const closeSuccess =
        document.getElementById("closeSuccess");


    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!appointmentForm.checkValidity()) {

                    appointmentForm.reportValidity();

                    return;

                }


                if (successMessage) {

                    successMessage.classList.add("show");

                }


                appointmentForm.reset();


                setTimeout(function () {

                    if (successMessage) {
                        successMessage.classList.remove("show");
                    }

                }, 6000);

            }
        );

    }


    if (closeSuccess) {

        closeSuccess.addEventListener(
            "click",
            function () {

                if (successMessage) {
                    successMessage.classList.remove("show");
                }

            }
        );

    }


    /* =====================================================
       MAGNETIC BUTTON EFFECT
    ===================================================== */

    const magneticButtons =
        document.querySelectorAll(
            ".magnetic-btn"
        );


    if (
        window.matchMedia &&
        window.matchMedia("(hover: hover)").matches
    ) {

        magneticButtons.forEach(function (button) {

            button.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    button.style.transform =
                        "translate(" +
                        (x * .08) +
                        "px," +
                        (y * .08) +
                        "px)";

                }
            );


            button.addEventListener(
                "mouseleave",
                function () {

                    button.style.transform =
                        "translate(0,0)";

                }
            );

        });

    }


    /* =====================================================
       SERVICE CURSOR GLOW / MOVEMENT
    ===================================================== */

    const serviceRows =
        document.querySelectorAll(".service-row");


    if (
        window.matchMedia &&
        window.matchMedia("(hover: hover)").matches
    ) {

        serviceRows.forEach(function (row) {

            row.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        row.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;


                    row.style.setProperty(
                        "--mouse-x",
                        x + "px"
                    );

                    row.style.setProperty(
                        "--mouse-y",
                        y + "px"
                    );

                }
            );

        });

    }


    /* =====================================================
       SUBTLE HERO PARALLAX
    ===================================================== */

    const heroVisual =
        document.querySelector(".hero-visual");


    if (
        heroVisual &&
        window.matchMedia &&
        window.matchMedia("(hover: hover)").matches
    ) {

        window.addEventListener(
            "mousemove",
            function (event) {

                const x =
                    (event.clientX /
                        window.innerWidth -
                        .5);

                const y =
                    (event.clientY /
                        window.innerHeight -
                        .5);


                heroVisual.style.transform =
                    "translate(" +
                    (x * 8) +
                    "px," +
                    (y * 6) +
                    "px)";

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       DATE FIELD — PREVENT PAST DATES
    ===================================================== */

    const dateInput =
        document.getElementById("date");


    if (dateInput) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        dateInput.min =
            year + "-" +
            month + "-" +
            day;

    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const currentYear =
        document.getElementById("currentYear");


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       IMAGE FALLBACK
    ===================================================== */

    const images =
        document.querySelectorAll("img");


    images.forEach(function (image) {

        image.addEventListener(
            "error",
            function () {

                image.style.background =
                    "#EDF6F7";

                image.style.objectFit =
                    "cover";

            }
        );

    });


    /* =====================================================
       INITIAL TESTIMONIAL
    ===================================================== */

    updateTestimonial(0);

});