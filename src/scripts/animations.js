import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis;

export function initAnimations() {
  // 1. Lenis Smooth Scroll
  if (!lenis) {
    lenis = new Lenis({
      duration: 1.2,
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

  // 3. Custom Cursor (Solo Desktop)
  if (window.innerWidth > 1024) {
    const cursor = document.getElementById("customCursor");
    window.addEventListener("mousemove", (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "none",
      });
    });

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor?.classList.add("grow"));
      el.addEventListener("mouseleave", () => cursor?.classList.remove("grow"));
    });

    // Hover suave en Product Cards
    document.querySelectorAll(".product-card").forEach((card) => {
      const img = card.querySelector(".product-img");

      card.addEventListener("mouseenter", () => {
        cursor?.classList.add("grow");
        gsap.to(img, {
          scale: 1.05,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      card.addEventListener("mouseleave", () => {
        cursor?.classList.remove("grow");
        gsap.to(img, {
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });
  }

  // 3. Hero Entrance (Split Text manual)
  const heroTitle = document.getElementById("heroTitle");
  const heroKicker = document.getElementById("heroKicker");
  if (heroTitle) {
    const text = heroTitle.innerText;
    heroTitle.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span class="char" style="display:inline-block; will-change:transform, opacity;">${char === "\n" ? "<br>" : char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("");

    const tl = gsap.timeline({ delay: 0.5 });
    tl.from(heroKicker, { opacity: 0, y: 30, duration: 1, ease: "power3.out" });
    tl.from(
      ".char",
      {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
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
        duration: 1,
        ease: "power3.out",
      },
      "-=0.6",
    );
  }

  // 4. Product Mask Reveals
  const cards = gsap.utils.toArray(".product-card");
  cards.forEach((card) => {
    const mask = card.querySelector(".product-image-mask");
    const img = card.querySelector(".product-img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    if (mask) {
      tl.to(mask, {
        scaleY: 0,
        duration: 1.4,
        ease: "power4.inOut",
      });
    }

    tl.to(
      img,
      {
        scale: 1,
        duration: 1.6,
        ease: "power2.out",
      },
      0,
    );
  });

  // 5. Parallax Effect for Product Images
  gsap.utils.toArray(".product-img").forEach((img) => {
    gsap.to(img, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
