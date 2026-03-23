"use strict";

(function () {
    const body = document.body;
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-site-nav]");
    const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const closeMenu = () => {
        if (!menuToggle) {
            return;
        }

        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = body.classList.toggle("menu-open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (!body.classList.contains("menu-open")) {
                return;
            }

            if (header && header.contains(event.target)) {
                return;
            }

            closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 960) {
                closeMenu();
            }
        });
    }

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -40px 0px",
            },
        );

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    if ("IntersectionObserver" in window && navLinks.length > 0 && sections.length > 0) {
        const linkMap = new Map(
            navLinks.map((link) => [link.getAttribute("href").slice(1), link]),
        );

        const activateLink = (id) => {
            linkMap.forEach((link, key) => {
                link.classList.toggle("is-active", key === id);
            });
        };

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activateLink(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-45% 0px -45% 0px",
                threshold: 0.01,
            },
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"));
    const lightbox = document.querySelector("[data-lightbox]");
    const lightboxImage = document.querySelector("[data-lightbox-image]");
    const lightboxCaption = document.querySelector("[data-lightbox-caption]");
    const lightboxClose = document.querySelector("[data-lightbox-close]");
    const lightboxPrev = document.querySelector("[data-lightbox-prev]");
    const lightboxNext = document.querySelector("[data-lightbox-next]");
    const lightboxSurface = document.querySelector("[data-lightbox-surface]");

    if (!lightbox || !lightboxImage || !lightboxCaption || galleryItems.length === 0) {
        return;
    }

    const state = {
        activeIndex: 0,
        lastFocus: null,
    };

    const renderLightbox = () => {
        const activeItem = galleryItems[state.activeIndex];
        const previewImage = activeItem.querySelector("img");
        const caption = activeItem.dataset.caption || previewImage.alt || "";
        const alt = activeItem.dataset.alt || previewImage.alt || "";

        lightboxImage.src = activeItem.getAttribute("href");
        lightboxImage.alt = alt;
        lightboxCaption.textContent = caption;
    };

    const openLightbox = (index) => {
        state.activeIndex = index;
        state.lastFocus = document.activeElement;
        renderLightbox();
        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        body.classList.add("has-lightbox");
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        body.classList.remove("has-lightbox");
        lightboxImage.removeAttribute("src");

        if (state.lastFocus && typeof state.lastFocus.focus === "function") {
            state.lastFocus.focus();
        }
    };

    const stepLightbox = (direction) => {
        state.activeIndex =
            (state.activeIndex + direction + galleryItems.length) % galleryItems.length;
        renderLightbox();
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", () => stepLightbox(-1));
    lightboxNext.addEventListener("click", () => stepLightbox(1));

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (lightbox.hidden) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            stepLightbox(-1);
        } else if (event.key === "ArrowRight") {
            stepLightbox(1);
        }
    });
})();
