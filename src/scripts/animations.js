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

  // 5. Product Mask Reveals con micro-animaciones (DISABLED - causing unwanted scroll animation)
  // const cards = gsap.utils.toArray(".product-card");
  // cards.forEach((card, index) => {
  //   const mask = card.querySelector(".product-image-mask");
  //   const img = card.querySelector(".product-img");

  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: card,
  //       start: "top 90%",
  //       toggleActions: "play none none none",
  //     },
  //   });

  //   if (mask) {
  //     tl.to(mask, {
  //       scaleY: 0,
  //       duration: 1.2,
  //       ease: "power4.inOut",
  //     });
  //   }

  //   tl.to(
  //     img,
  //     {
  //       scale: 1,
  //       opacity: 1,
  //       duration: 1.4,
  //       ease: "power2.out",
  //     },
  //     0,
  //   );

  //   // Stagger effect para cada tarjeta
  //   tl.to(
  //     card,
  //     {
  //       opacity: 1,
  //       y: 0,
  //       duration: 0.6,
  //       ease: "power3.out",
  //     },
  //     0,
  //   );
  // });

  // 6. Parallax Effect for Product Images (DISABLED - causing unwanted scroll animation)
  // gsap.utils.toArray(".product-img").forEach((img) => {
  //   gsap.to(img, {
  //     yPercent: -25,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: img,
  //       start: "top bottom",
  //       end: "bottom top",
  //       scrub: 0.8,
  //     },
  //   });
  // });

  // 7. Add to Cart Button Pulse
  gsap.from(".add-to-cart", {
    stagger: 0.1,
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    ease: "back.out",
  });

  // 8. Hover effect en botones Add to Cart
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
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
