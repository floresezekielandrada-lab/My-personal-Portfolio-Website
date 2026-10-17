const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const galleryGrid = document.querySelector("#gallery-grid");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxPrevious = lightbox.querySelector(".lightbox-previous");
const lightboxNext = lightbox.querySelector(".lightbox-next");
const lightboxCounter = lightbox.querySelector(".lightbox-counter");
const contactForm = document.querySelector("#contact-form");
const heroVisual = document.querySelector(".hero-visual");
let lightboxSlides = [];
let activeSlideIndex = 0;

if (window.lucide) window.lucide.createIcons();
document.querySelector("#current-year").textContent = new Date().getFullYear();

if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -20px 0px" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const roleElement = document.querySelector(".typed-role");
if (!reducedMotion) {
  const roles = ["Front-End Developer", "Web Designer", "Creative Developer"];
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;
  const typeNextCharacter = () => {
    characterIndex += deleting ? -1 : 1;
    roleElement.textContent = roles[roleIndex].slice(0, characterIndex);
    if (deleting && characterIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      window.setTimeout(typeNextCharacter, 350);
      return;
    }
    if (!deleting && characterIndex === roles[roleIndex].length) {
      deleting = true;
      window.setTimeout(typeNextCharacter, 1800);
      return;
    }
    window.setTimeout(typeNextCharacter, deleting ? 38 : 70);
  };
  window.setTimeout(typeNextCharacter, 1800);

  heroVisual.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = heroVisual.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.setProperty("--parallax-x", `${offsetX * 8}px`);
    heroVisual.style.setProperty("--parallax-y", `${offsetY * 8}px`);
  });
  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--parallax-x", "0px");
    heroVisual.style.setProperty("--parallax-y", "0px");
  });
}

let scrollTicking = false;
const updateScrollUI = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  header.classList.toggle("scrolled", window.scrollY > 12);
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
  const activeSection = sections.reduce((active, section) => {
    return section.getBoundingClientRect().top <= 150 ? section : active;
  }, sections[0]);
  if (activeSection) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeSection.id}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  scrollTicking = false;
};
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollUI();

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  navigation.classList.toggle("is-open", !isExpanded);
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  navigation.classList.remove("is-open");
}));
document.addEventListener("click", (event) => {
  if (menuToggle.getAttribute("aria-expanded") === "true" &&
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    navigation.classList.remove("is-open");
  }
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
});

const filterTimers = new WeakMap();
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("is-selected", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });
    galleryGrid.querySelectorAll(".gallery-card").forEach((card) => {
      const isVisible = filter === "All" || card.dataset.category === filter;
      window.clearTimeout(filterTimers.get(card));
      if (isVisible) {
        card.classList.remove("is-hidden");
        requestAnimationFrame(() => card.classList.remove("is-filtering-out"));
      } else {
        card.classList.add("is-filtering-out");
        const timer = window.setTimeout(() => card.classList.add("is-hidden"), reducedMotion ? 0 : 250);
        filterTimers.set(card, timer);
      }
    });
  });
});

const showLightboxSlide = (index) => {
  activeSlideIndex = (index + lightboxSlides.length) % lightboxSlides.length;
  const card = lightboxSlides[activeSlideIndex];
  const thumbnail = card.querySelector("img");
  lightboxImage.src = thumbnail.currentSrc || thumbnail.src;
  lightboxImage.alt = thumbnail.alt || card.dataset.title;
  lightbox.querySelector(".lightbox-category").textContent = card.dataset.category;
  lightbox.querySelector(".lightbox-title").textContent = card.dataset.title;
  lightbox.querySelector(".lightbox-description").textContent = card.dataset.description;
  lightboxCounter.textContent = lightboxSlides.length > 1
    ? `${String(activeSlideIndex + 1).padStart(2, "0")} / ${String(lightboxSlides.length).padStart(2, "0")}`
    : "";
  lightboxPrevious.hidden = lightboxSlides.length < 2;
  lightboxNext.hidden = lightboxSlides.length < 2;
};

galleryGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".gallery-card");
  if (!card) return;
  lightboxSlides = card.dataset.category === "Projects"
    ? [...galleryGrid.querySelectorAll('.gallery-card[data-category="Projects"]')]
    : [card];
  showLightboxSlide(lightboxSlides.indexOf(card));
  lightbox.showModal();
});
lightboxPrevious.addEventListener("click", () => showLightboxSlide(activeSlideIndex - 1));
lightboxNext.addEventListener("click", () => showLightboxSlide(activeSlideIndex + 1));
lightbox.addEventListener("keydown", (event) => {
  if (lightboxSlides.length < 2) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showLightboxSlide(activeSlideIndex - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    showLightboxSlide(activeSlideIndex + 1);
  }
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  const submitButton = contactForm.querySelector(".submit-button");
  status.textContent = "";
  status.classList.remove("is-success");
  if (!contactForm.reportValidity()) return;
  const endpoint = contactForm.dataset.endpoint.trim();
  if (!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint)) {
    status.textContent = "Contact form setup is incomplete. Add your Formspree form endpoint in index.html.";
    return;
  }
  submitButton.disabled = true;
  status.textContent = "Sending your message…";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Form service returned ${response.status}`);
    contactForm.reset();
    status.classList.add("is-success");
    status.textContent = "Thanks—your message was sent successfully.";
  } catch (error) {
    console.error("Contact form submission failed:", error);
    status.textContent = "Your message could not be sent. Please try again in a moment.";
  } finally {
    submitButton.disabled = false;
  }
});
