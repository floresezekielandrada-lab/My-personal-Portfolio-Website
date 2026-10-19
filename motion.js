const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

const initializeLenis = (Lenis) => {
  if (reducedMotion) return;

  const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09, smoothWheel: true });
  window.portfolioLenis = lenis;

  if (gsap) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };
    window.requestAnimationFrame(raf);
  }

  lenis.on("scroll", () => {
    if (ScrollTrigger) ScrollTrigger.update();
    window.dispatchEvent(new Event("portfolio:scroll"));
  });
};

const loadLenis = async () => {
  try {
    const Lenis = (await import("https://unpkg.com/lenis@1.3.11/dist/lenis.mjs")).default;
    initializeLenis(Lenis);
  } catch (error) {
    console.error("Lenis could not be loaded; native scrolling remains available.", error);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadLenis, { once: true });
} else {
  loadLenis();
}
