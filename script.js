const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector(".site-header");
      const offset = header ? header.offsetHeight + 18 : 18;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  });
}

function initSubtleHeroMotion() {
  if (prefersReducedMotion) return;

  const heroMedia = document.querySelector(".hero__media");
  if (!heroMedia) return;

  let ticking = false;
  const update = () => {
    const rect = heroMedia.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const itemCenter = rect.top + rect.height / 2;
    const movement = Math.max(Math.min(((itemCenter - viewportCenter) / viewportCenter) * -10, 10), -10);
    heroMedia.style.transform = `translateY(${movement}px)`;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    window.requestAnimationFrame(update);
    ticking = true;
  }, { passive: true });

  update();
}

document.addEventListener("DOMContentLoaded", () => {
  initRevealAnimations();
  initSmoothAnchors();
  initSubtleHeroMotion();
});
