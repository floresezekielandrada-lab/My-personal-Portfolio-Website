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
const spaceScene = document.querySelector(".space-scene");
const sceneCanvas = document.querySelector(".scene-canvas");
let lightboxSlides = [];
let activeSlideIndex = 0;

if (window.lucide) window.lucide.createIcons();
document.querySelector("#current-year").textContent = new Date().getFullYear();

const sceneContext = sceneCanvas.getContext("2d");
if (!sceneContext) {
  console.error("The animated background could not be initialized because canvas is unavailable.");
} else {
  const sceneBands = [
    { height: 0.2, phase: 0.2, speed: 0.0003, color: "117, 229, 239" },
    { height: 0.42, phase: 2.1, speed: -0.00025, color: "112, 164, 255" },
    { height: 0.67, phase: 4.4, speed: 0.00022, color: "136, 143, 255" },
    { height: 0.86, phase: 5.7, speed: -0.00028, color: "117, 229, 239" },
  ];
  let sceneWidth = 0;
  let sceneHeight = 0;
  let sceneRatio = 1;
  let sceneParticles = [];
  let scenePointer = { x: -1000, y: -1000 };
  let sceneElapsed = 0;
  let previousFrame = 0;
  let sceneFrame = 0;

  const resizeScene = () => {
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;
    sceneRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    sceneCanvas.width = Math.round(sceneWidth * sceneRatio);
    sceneCanvas.height = Math.round(sceneHeight * sceneRatio);
    sceneContext.setTransform(sceneRatio, 0, 0, sceneRatio, 0, 0);
    const particleCount = sceneWidth < 700 ? 42 : 76;
    sceneParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * sceneWidth,
      y: Math.random() * sceneHeight,
      radius: 0.7 + Math.random() * 1.1,
      speedX: 0.025 + Math.random() * 0.09,
      speedY: (Math.random() - 0.5) * 0.06,
      phase: Math.random() * Math.PI * 2,
    }));
  };

  const drawScene = (time) => {
    sceneContext.clearRect(0, 0, sceneWidth, sceneHeight);
    sceneBands.forEach((band, bandIndex) => {
      const phase = band.phase + time * band.speed;
      const waveY = (x) => sceneHeight * band.height
        + Math.sin((x / sceneWidth) * Math.PI * 2.1 + phase) * sceneHeight * 0.055
        + Math.sin((x / sceneWidth) * Math.PI * 4.3 - phase * 1.4) * sceneHeight * 0.018;
      const gradient = sceneContext.createLinearGradient(0, sceneHeight * band.height, sceneWidth, sceneHeight * band.height);
      gradient.addColorStop(0, `rgba(${band.color}, 0)`);
      gradient.addColorStop(0.22, `rgba(${band.color}, 0.16)`);
      gradient.addColorStop(0.52, `rgba(${band.color}, 0.32)`);
      gradient.addColorStop(0.82, `rgba(${band.color}, 0.13)`);
      gradient.addColorStop(1, `rgba(${band.color}, 0)`);
      sceneContext.beginPath();
      for (let x = -20; x <= sceneWidth + 20; x += 14) {
        const y = waveY(x);
        if (x === -20) sceneContext.moveTo(x, y);
        else sceneContext.lineTo(x, y);
      }
      sceneContext.strokeStyle = gradient;
      sceneContext.lineWidth = bandIndex % 2 === 0 ? 1.35 : 0.9;
      sceneContext.shadowColor = `rgba(${band.color}, 0.35)`;
      sceneContext.shadowBlur = 12;
      sceneContext.stroke();
      sceneContext.shadowBlur = 0;

      for (let moteIndex = 0; moteIndex < 3; moteIndex += 1) {
        const progress = ((time * band.speed * 0.55 + band.phase / (Math.PI * 2) + moteIndex / 3) % 1 + 1) % 1;
        const x = progress * (sceneWidth + 100) - 50;
        const y = waveY(x);
        const glow = sceneContext.createRadialGradient(x, y, 0, x, y, 13);
        glow.addColorStop(0, `rgba(${band.color}, 0.7)`);
        glow.addColorStop(1, `rgba(${band.color}, 0)`);
        sceneContext.fillStyle = glow;
        sceneContext.fillRect(x - 13, y - 13, 26, 26);
        sceneContext.beginPath();
        sceneContext.arc(x, y, 1.5, 0, Math.PI * 2);
        sceneContext.fillStyle = "rgba(225, 250, 255, 0.8)";
        sceneContext.fill();
      }
    });

    sceneParticles.forEach((particle) => {
      if (!reducedMotion) {
        particle.x += particle.speedX;
        particle.y += particle.speedY + Math.sin(time * 0.00035 + particle.phase) * 0.12;
        if (particle.x > sceneWidth + 4) particle.x = -4;
        if (particle.y < -4) particle.y = sceneHeight + 4;
        if (particle.y > sceneHeight + 4) particle.y = -4;
      }
    });

    sceneParticles.forEach((particle, index) => {
      let nearby = 0;
      for (let otherIndex = index + 1; otherIndex < sceneParticles.length && nearby < 4; otherIndex += 1) {
        const other = sceneParticles[otherIndex];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 118) {
          sceneContext.beginPath();
          sceneContext.moveTo(particle.x, particle.y);
          sceneContext.lineTo(other.x, other.y);
          sceneContext.strokeStyle = `rgba(117, 205, 232, ${(1 - distance / 118) * 0.16})`;
          sceneContext.lineWidth = 0.7;
          sceneContext.stroke();
          nearby += 1;
        }
      }

      const pointerDistance = Math.hypot(particle.x - scenePointer.x, particle.y - scenePointer.y);
      if (pointerDistance < 145) {
        sceneContext.beginPath();
        sceneContext.moveTo(particle.x, particle.y);
        sceneContext.lineTo(scenePointer.x, scenePointer.y);
        sceneContext.strokeStyle = `rgba(117, 229, 239, ${(1 - pointerDistance / 145) * 0.22})`;
        sceneContext.stroke();
      }

      const pulse = 0.65 + (Math.sin(time * 0.001 + particle.phase) + 1) * 0.2;
      sceneContext.beginPath();
      sceneContext.arc(particle.x, particle.y, particle.radius * pulse, 0, Math.PI * 2);
      sceneContext.fillStyle = `rgba(177, 237, 255, ${0.38 + pulse * 0.3})`;
      sceneContext.fill();
    });
  };

  const animateScene = (time) => {
    if (document.hidden) {
      sceneFrame = 0;
      previousFrame = 0;
      return;
    }
    if (previousFrame) sceneElapsed += Math.min(time - previousFrame, 50);
    previousFrame = time;
    drawScene(sceneElapsed);
    sceneFrame = window.requestAnimationFrame(animateScene);
  };

  resizeScene();
  drawScene(0);
  if (!reducedMotion) sceneFrame = window.requestAnimationFrame(animateScene);
  window.addEventListener("resize", () => {
    resizeScene();
    if (reducedMotion) drawScene(0);
  }, { passive: true });
  window.addEventListener("pointermove", (event) => {
    scenePointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    scenePointer = { x: -1000, y: -1000 };
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !reducedMotion && !sceneFrame) {
      sceneFrame = window.requestAnimationFrame(animateScene);
    }
  });
}

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
  document.documentElement.classList.add("gsap-ready");
  window.gsap.utils.toArray(".reveal").forEach((element) => {
    window.gsap.fromTo(element, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: element, start: "top 90%", once: true },
    });
  });
} else if (!reducedMotion && "IntersectionObserver" in window) {
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
  const roles = ["Full-Stack Developer", "Web Designer", "Creative Developer"];
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
  spaceScene.style.setProperty("--scene-hue", `${progress * 0.48}deg`);
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
const scheduleScrollUIUpdate = () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollUI);
    scrollTicking = true;
  }
};
window.addEventListener("scroll", scheduleScrollUIUpdate, { passive: true });
window.addEventListener("portfolio:scroll", scheduleScrollUIUpdate);
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
  if (window.portfolioLenis) window.portfolioLenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
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
