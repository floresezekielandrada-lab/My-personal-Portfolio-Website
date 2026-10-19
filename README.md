# Ezekiel Andrada Flores's portfolio

A responsive static portfolio for aspiring full-stack developer Ezekiel Andrada Flores, built with semantic HTML, custom CSS, Tailwind's CDN utility layer, Lucide icons, and vanilla JavaScript. The main portfolio uses GSAP and ScrollTrigger for scroll reveals, Lenis for smooth scrolling, and a lightweight CSS 3D-style backdrop with a perspective grid, floating orbs, and stars. GSAP and Lenis load from CDNs; an internet connection is required for those enhancements. Native scrolling remains available as a fallback.

The navigation's **Download CV** link opens `cv.html`. The **Download CV** button on that page opens the browser print dialog, where the CV can be printed or saved as a PDF.

The scroll enhancements are only loaded on `index.html`; the CV page remains independent.

## Make it yours

- Replace the sample portrait and gallery images/captions in `index.html`.
- Update the social profile URLs to your own.
- Edit the role names and gallery entries in `script.js` / `index.html` as needed.

## Enable message delivery

The contact form uses Formspree's hosted form endpoint; it does not simulate a successful send. Create a form at [Formspree](https://formspree.io/), then set the form's `data-endpoint` in `index.html` to your real endpoint (for example, `https://formspree.io/f/yourFormId`). Until configured, the form validates the fields and clearly reports that setup is incomplete. Submission errors are shown without a false success message.

## External assets

Google Fonts, Lucide icons, Tailwind's CDN build, GSAP, ScrollTrigger, Lenis, Three.js, and sample photography are loaded from their respective hosted services.
