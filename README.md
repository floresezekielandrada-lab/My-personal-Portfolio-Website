# Ezekiel's portfolio

A responsive static portfolio built with semantic HTML, custom CSS, Tailwind's CDN utility layer, Lucide icons, and vanilla JavaScript. Open `index.html` directly in a browser or serve this folder with any static web server.

The navigation's **Download CV** link opens `cv.html`. The **Download CV** button on that page opens the browser print dialog, where the CV can be printed or saved as a PDF.

## Make it yours

- Replace the sample portrait and gallery images/captions in `index.html`.
- Update the social profile URLs to your own.
- Edit the role names and gallery entries in `script.js` / `index.html` as needed.

## Enable message delivery

The contact form uses Formspree's hosted form endpoint; it does not simulate a successful send. Create a form at [Formspree](https://formspree.io/), then set the form's `data-endpoint` in `index.html` to your real endpoint (for example, `https://formspree.io/f/yourFormId`). Until configured, the form validates the fields and clearly reports that setup is incomplete. Submission errors are shown without a false success message.

## External assets

Google Fonts, Lucide icons, Tailwind's CDN build, and sample photography are loaded from their respective hosted services.
