import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis;

export function initAnimations() {
  // 1. Lenis Smooth Scroll
  if (!lenis) {
    lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // 2. Navbar Fade-In Animation
  const navbar = document.getElementById("navbar");
  if (navbar) {
    gsap.from(navbar, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.3,
    });
  }

  // 4. Hero Entrance (Split Text manual con efectos neón)
  const heroTitle = document.getElementById("heroTitle");
  const heroKicker = document.getElementById("heroKicker");
  if (heroTitle) {
    const text = heroTitle.innerText;
    heroTitle.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span class="char" style="display:inline-block; will-change:transform, opacity; text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);">${char === "\n" ? "<br>" : char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("");

    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(heroKicker, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });
    tl.from(
      ".char",
      {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: "power4.out",
      },
      "-=0.4",
    );
    tl.from(
      ".hero-description, #heroCtaBtn",
      {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.5",
    );
  }

  // 5. Cinematic Parallax & Text Reveal
  // Hero Parallax
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 20, // Moves down as user scrolls down
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });
  }

  // About Image Parallax
  const aboutImg = document.querySelector('.about-image img');
  if (aboutImg) {
    gsap.fromTo(aboutImg, 
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".about",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );
  }

  // About Text Reveal (Manifesto)
  const aboutTexts = document.querySelectorAll('.reveal-text');
  if (aboutTexts.length > 0) {
    gsap.from(aboutTexts, {
      opacity: 0,
      y: 20,
      stagger: 0.2, // Line by line
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".about-columns",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // 7. Add to Cart Button Pulse
  gsap.from(".btn-agregar", {
    stagger: 0.1,
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    ease: "back.out",
  });

  // 8. Hover effect en botones Add to Cart
  document.querySelectorAll(".btn-agregar").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.08,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "0 0 30px rgba(0, 212, 255, 0.8)",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // 9. Floating Bag Animation
  const cartWrapper = document.querySelector(".cart-wrapper");
  if (cartWrapper) {
    gsap.to(cartWrapper, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
}
