const SUPABASE_URL = 'https://nqnykxwfpuelphtxxwtn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BG5FRtP_2WJYsMyKbA9u7A_L4aLjq3l';
const ADMIN_PASSWORD = 'melrose2024';
const WHATSAPP_PHONE = '5493624645328';
const ADMIN_PATH = 'atelier-7f3k-admin.html';

const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const placeholderImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80';
const brokenImagePlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"><rect width="900" height="1200" fill="#1a1a1a"/><rect x="40" y="40" width="820" height="1120" fill="none" stroke="#2a2a2a" stroke-width="2"/><text x="50%" y="49%" text-anchor="middle" fill="#6f6f6f" font-family="Inter, Arial, sans-serif" font-size="34" letter-spacing="8">MELROSE</text><text x="50%" y="54%" text-anchor="middle" fill="#5a5a5a" font-family="Inter, Arial, sans-serif" font-size="15" letter-spacing="4">IMAGE UNAVAILABLE</text></svg>'
)}`;
const fallbackProducts = [
  { id: 'f1', nombre: 'REMERA ESSENTIAL BLACK', descripcion: 'Algodon premium', precio: 22990, categoria: 'REMERAS', talles: ['S', 'M', 'L'], imagen_url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=80', destacado: false, stock: 18 },
  { id: 'f2', nombre: 'CAMPERA BOMBER NOIR', descripcion: 'Tela tecnica', precio: 79990, categoria: 'CAMPERAS', talles: ['M', 'L', 'XL'], imagen_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', destacado: true, stock: 7 },
  { id: 'f3', nombre: 'PANTALON CARGO TACTICAL', descripcion: 'Fit relajado', precio: 56990, categoria: 'PANTALONES', talles: ['38', '40', '42'], imagen_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80', destacado: false, stock: 12 },
  { id: 'f4', nombre: 'GORRA SIGNATURE RED', descripcion: 'Bordado frontal', precio: 18990, categoria: 'ACCESORIOS', talles: ['UNICO'], imagen_url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&q=80', destacado: false, stock: 21 },
  { id: 'f5', nombre: 'REMERA LONG FIT STUDIO', descripcion: 'Corte editorial', precio: 25990, categoria: 'REMERAS', talles: ['S', 'M', 'L'], imagen_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&q=80', destacado: true, stock: 14 },
  { id: 'f6', nombre: 'BANDOLERA URBAN CORE', descripcion: 'Nylon resistente', precio: 31990, categoria: 'ACCESORIOS', talles: ['UNICO'], imagen_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80', destacado: false, stock: 9 }
];

let supabaseClient = null;
let lenis = null;

if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}
if (
  window.supabase &&
  SUPABASE_URL &&
  SUPABASE_KEY &&
  SUPABASE_URL !== 'TU_SUPABASE_URL' &&
  SUPABASE_KEY !== 'TU_SUPABASE_ANON_KEY'
) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let allProducts = [];
let cart = loadCart();
let latestProductsRequest = 0;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('melrose_cart') || '[]');
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem('melrose_cart', JSON.stringify(cart));
}

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

function ensureToastWrap() {
  let wrap = document.getElementById('toastWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  return wrap;
}

function showToast(message) {
  const wrap = ensureToastWrap();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  wrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function handleError(error, contexto) {
  console.error(`[ERROR][${contexto}]`, error);
  showToast(`Error en ${contexto}. Revisa conexion o permisos.`);
}

function setButtonLoading(button, isLoading, loadingText) {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add('btn-loading');
    return;
  }
  button.textContent = button.dataset.originalText || button.textContent;
  button.disabled = false;
  button.classList.remove('btn-loading');
}

function initSecretAdminAccess() {
  const pressed = new Set();
  window.addEventListener('keydown', (event) => {
    pressed.add(event.key.toLowerCase());
    if (pressed.has('a') && pressed.has('l')) {
      window.location.href = ADMIN_PATH;
    }
  });
  window.addEventListener('keyup', (event) => {
    pressed.delete(event.key.toLowerCase());
  });
  window.addEventListener('blur', () => pressed.clear());
}

async function getProductsFromSource() {
  if (!supabaseClient) {
    return fallbackProducts.slice();
  }
  const { data, error } = await supabaseClient.from('productos').select('*').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  if (!data || data.length === 0) {
    return fallbackProducts.slice();
  }
  return data;
}

async function cargarProductos(categoria = 'TODO') {
  const requestId = ++latestProductsRequest;
  showProductSkeleton(6);
  try {
    allProducts = await getProductsFromSource();
  } catch (error) {
    handleError(error, 'carga de productos');
    allProducts = fallbackProducts.slice();
  } finally {
    if (requestId !== latestProductsRequest) {
      return;
    }
    renderProducts(categoria);
    initProductReveal();
  }
}

function showProductSkeleton(count = 6) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: count }).map(() => `
    <article class="product-card skeleton-card is-visible">
      <div class="product-image-wrap skeleton-block"></div>
      <div class="product-content">
        <div class="skeleton-lines">
          <span class="skeleton-line w-80"></span>
          <span class="skeleton-line w-40"></span>
        </div>
        <span class="skeleton-add"></span>
      </div>
    </article>
  `).join('');
}

function initProductReveal() {
  const cards = gsap.utils.toArray('.product-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const mask = card.querySelector('.product-image-mask');
    const img = card.querySelector('img');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });

    if (mask) {
      tl.to(mask, {
        scaleY: 0,
        duration: 1.2,
        ease: "power4.inOut"
      });
    }

    tl.from(img, {
      scale: 1.2,
      duration: 1.4,
      ease: "power2.out"
    }, 0);
  });

  // Micro-interacciones Hover Orgánico
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.02, duration: 0.6, ease: "power4.out" });
      document.getElementById('customCursor')?.classList.add('grow');
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.6, ease: "power4.out" });
      document.getElementById('customCursor')?.classList.remove('grow');
    });
  });
}

function splitTextIntoChars(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  const text = element.textContent;
  element.innerHTML = text.split('').map(char => {
    return `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`;
  }).join('');
  element.setAttribute('aria-label', text); // SEO/Accessibility
}

function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  const mm = gsap.matchMedia();

  // 1. Lenis Smooth Scroll Setup
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }
  } catch (e) {
    console.warn('[LENIS] Error al inicializar:', e);
  }

  // 2. Desktop Gallery Effects
  mm.add("(min-width: 1025px)", () => {
    // Custom Cursor
    const cursor = document.getElementById('customCursor');
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "none"
      });
    });

    // Reactive Hero Title (Skew/Spacing on Scroll)
    gsap.to('.hero h1', {
      letterSpacing: "0.15em",
      skewX: -5,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Parallax Hero
    gsap.to('.hero', {
      backgroundPositionY: '20%',
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // 3. Hero Entry Sequence (Split Text)
  splitTextIntoChars('.hero h1');
  const heroTL = gsap.timeline({ delay: 0.5 });
  
  heroTL.from('.hero-kicker', { opacity: 0, y: 20, duration: 0.8 });
  heroTL.from('.char', {
    opacity: 0,
    y: 100,
    rotateX: -90,
    stagger: 0.03,
    duration: 1,
    ease: "power4.out"
  }, "-=0.4");
  
  heroTL.from('.hero-description, .hero .btn-primary', {
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out"
  }, "-=0.6");
}

function getValidTalles(product) {
  if (!Array.isArray(product?.talles)) return [];
  return product.talles
    .map((talle) => String(talle || '').trim().toUpperCase())
    .filter(Boolean);
}

function renderProducts(categoria = 'TODO') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const filtered = categoria === 'TODO'
    ? allProducts
    : allProducts.filter((item) => String(item.categoria || '').toUpperCase() === categoria);

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-msg">No hay productos en esta categoria.</p>';
    return;
  }

  grid.innerHTML = filtered.map((item) => {
    const talles = getValidTalles(item);
    const isOutOfStock = Number(item.stock || 0) <= 0;
    return `
    <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${safeText(item.id)}">
      <div class="product-image-wrap">
        <div class="product-image-mask"></div>
        <img src="${safeText(item.imagen_url || placeholderImage)}" alt="${safeText(item.nombre)}" loading="lazy" onerror="this.onerror=null;this.src='${brokenImagePlaceholder}'">
      </div>
      <div class="product-content">
        <div>
          <h3 class="product-name">${safeText(item.nombre)}</h3>
          <p class="product-price">${formatter.format(Number(item.precio || 0))}</p>
          ${talles.length ? `
          <select class="size-select" data-size-select>
            <option value="">Elegi talle</option>
            ${talles.map((talle) => `<option value="${safeText(talle)}">${safeText(talle)}</option>`).join('')}
          </select>` : ''}
        </div>
        <button class="add-btn" 
          onclick="addToCart('${safeText(item.id)}', this)" 
          ${isOutOfStock ? 'disabled' : ''} 
          aria-label="Agregar producto">
          ${isOutOfStock ? 'SIN STOCK' : '+'}
        </button>
      </div>
    </article>
  `;
  }).join('');

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;
  drawer.classList.add('open');
  overlay.classList.add('open');
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('open');
}

function openCheckoutModal() {
  document.getElementById('checkoutOverlay')?.classList.add('open');
  document.getElementById('checkoutModal')?.classList.add('open');
}

function closeCheckoutModal() {
  document.getElementById('checkoutOverlay')?.classList.remove('open');
  document.getElementById('checkoutModal')?.classList.remove('open');
}

function buildWhatsappMessage(nombre, direccion) {
  const lineItems = cart.map((item) => {
    const talle = item.talle || 'UNICO';
    return `${item.qty}x *${item.nombre}* \n   Talle: \`${talle}\` \n   ${formatter.format(Number(item.precio || 0))}`;
  }).join('\n\n');
  
  const total = cart.reduce((acc, item) => acc + Number(item.precio || 0) * item.qty, 0);
  
  return [
    '*MELROSE — NUEVA ORDEN* 🛍️',
    '---',
    `👤 *CLIENTE:* ${nombre}`,
    `📍 *ENTREGA:* ${direccion}`,
    '---',
    '*DETALLE DEL PEDIDO:*',
    lineItems,
    '---',
    `*TOTAL: ${formatter.format(total)}*`,
    '',
    '*¿Cómo te gustaría proceder con el pago?*'
  ].join('\n');
}

function finalizeOrder(nombre, direccion) {
  const checkoutSubmitBtn = document.querySelector('#checkoutForm button[type="submit"]');
  setButtonLoading(checkoutSubmitBtn, true, 'ENVIANDO...');
  const message = buildWhatsappMessage(nombre, direccion);
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  try {
    // Victoria Feedback
    const successOverlay = document.getElementById('successOverlay');
    if (successOverlay) {
      successOverlay.classList.add('show');
      
      // Confetti Minimalista
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#000000', '#888888']
        });
      }

      setTimeout(() => {
        window.open(url, '_blank');
        cart = [];
        localStorage.removeItem('melrose_cart');
        updateCartUI();
        closeCheckoutModal();
        closeCart();
        
        // Limpiar modal de exito
        setTimeout(() => {
          // successOverlay.classList.remove('show');
          window.location.href = 'index.html?checkout=ok';
        }, 3000);
      }, 2000);
    } else {
      window.open(url, '_blank');
      cart = [];
      localStorage.removeItem('melrose_cart');
      updateCartUI();
      closeCheckoutModal();
      closeCart();
      window.location.href = 'index.html?checkout=ok';
    }
  } catch (error) {
    handleError(error, 'envio por WhatsApp');
    setButtonLoading(checkoutSubmitBtn, false, 'ENVIANDO...');
  }
}

window.closeSuccessModal = function() {
  const successOverlay = document.getElementById('successOverlay');
  if (successOverlay) {
    successOverlay.classList.remove('show');
  }
};

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = String(totalItems);
    if (totalItems > 0) {
      badge.classList.add('is-visible');
    } else {
      badge.classList.remove('is-visible');
    }
  }

  const itemsWrap = document.getElementById('cartItems');
  const totalText = document.getElementById('cartTotalText');
  if (!itemsWrap || !totalText) return;

  if (cart.length === 0) {
    itemsWrap.innerHTML = `
      <div class="cart-empty">
        <p class="empty-msg">Tu bolsa de compras esta vacia.</p>
        <button class="btn-outline" id="cartExploreBtn">EXPLORAR COLECCION</button>
      </div>
    `;
    document.getElementById('cartExploreBtn')?.addEventListener('click', () => {
      closeCart();
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    });
    totalText.textContent = formatter.format(0);
    return;
  }

  let total = 0;
  itemsWrap.innerHTML = cart.map((item) => {
    total += Number(item.precio) * item.qty;
    return `
      <div class="cart-item">
        <img src="${safeText(item.imagen_url || placeholderImage)}" alt="${safeText(item.nombre)}" onerror="this.onerror=null;this.src='${brokenImagePlaceholder}'">
        <div>
          <p>${safeText(item.nombre)}</p>
          <p class="muted">Talle: ${safeText(item.talle || 'UNICO')}</p>
          <p class="muted">${formatter.format(Number(item.precio || 0))}</p>
          <div class="cart-actions">
            <div class="qty-controls">
              <button onclick="changeQty('${safeText(item.id)}', -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="changeQty('${safeText(item.id)}', 1)">+</button>
            </div>
            <button class="link-delete" onclick="removeFromCart('${safeText(item.id)}')">Quitar</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  totalText.textContent = formatter.format(total);
}

window.addToCart = function addToCart(id, triggerButton) {
  const found = allProducts.find((item) => String(item.id) === String(id));
  if (!found) return;
  const card = document.querySelector(`[data-product-id="${String(id)}"]`);
  let selectedTalle = 'UNICO';
  const validTalles = getValidTalles(found);
  const hasTalles = validTalles.length > 0;
  if (hasTalles) {
    const select = card?.querySelector('[data-size-select]');
    selectedTalle = String(select?.value || '').trim();
    if (!selectedTalle) {
      if (triggerButton) {
        const original = triggerButton.textContent;
        triggerButton.textContent = '!';
        triggerButton.classList.add('needs-size');
        setTimeout(() => {
          triggerButton.textContent = original;
          triggerButton.classList.remove('needs-size');
        }, 900);
      }
      showToast('Elegi un talle antes de agregar.');
      return;
    }
  }
  const existing = cart.find((item) => String(item.id) === String(id));
  if (existing) {
    if (existing.qty + 1 > Number(found.stock || 0)) {
      showToast('Limite de stock alcanzado.');
      return;
    }
    existing.qty += 1;
  } else {
    if (1 > Number(found.stock || 0)) {
      showToast('Producto sin stock.');
      return;
    }
    cart.push({
      id: found.id,
      nombre: found.nombre,
      precio: Number(found.precio || 0),
      imagen_url: found.imagen_url || placeholderImage,
      talle: selectedTalle,
      qty: 1
    });
  }
  saveCart();
  updateCartUI();
  const cartTrigger = document.getElementById('cartOpenBtn');
  cartTrigger?.classList.remove('pop');
  requestAnimationFrame(() => cartTrigger?.classList.add('pop'));
  openCart();
};

window.changeQty = function changeQty(id, delta) {
  cart = cart.map((item) => {
    if (String(item.id) === String(id)) {
      const found = allProducts.find(p => String(p.id) === String(id));
      const newQty = item.qty + delta;
      if (delta > 0 && found && newQty > Number(found.stock || 0)) {
        showToast('Limite de stock alcanzado.');
        return item;
      }
      return { ...item, qty: newQty };
    }
    return item;
  }).filter((item) => item.qty > 0);
  saveCart();
  updateCartUI();
};

window.removeFromCart = function removeFromCart(id) {
  cart = cart.filter((item) => String(item.id) !== String(id));
  saveCart();
  updateCartUI();
};

async function initStorePage() {
  const heroCtaBtn = document.getElementById('heroCtaBtn');
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo('#productos');
    });
  }

  // Smooth Scroll para links internos
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Blindamos la navegación: preventDefault() SIEMPRE al inicio
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      e.preventDefault();
      smoothScrollTo(targetId);
    });
  });

  await cargarProductos('TODO');
  
  // Limpiador Fantasma: Borrar productos del carrito que ya no existen en el catalogo
  const productIds = new Set(allProducts.map(p => String(p.id)));
  const originalCartLength = cart.length;
  cart = cart.filter(item => productIds.has(item.id));
  if (cart.length !== originalCartLength) {
    saveCart();
    console.log('[CART] Se eliminaron productos inexistentes del carrito.');
  }

  updateCartUI();

  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const target = event.currentTarget;
      document.querySelectorAll('.category-btn').forEach((x) => x.classList.remove('active'));
      target.classList.add('active');
      await cargarProductos(target.dataset.cat || 'TODO');
      window.scrollTo({ top: document.getElementById('productos').offsetTop - 70, behavior: 'smooth' });
    });
  });

  document.getElementById('cartOpenBtn')?.addEventListener('click', openCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('checkoutOpenBtn')?.addEventListener('click', () => {
    if (!cart.length) {
      showToast('Tu carrito esta vacio.');
      return;
    }
    openCheckoutModal();
  });
  document.getElementById('checkoutCloseBtn')?.addEventListener('click', closeCheckoutModal);
  document.getElementById('checkoutOverlay')?.addEventListener('click', closeCheckoutModal);
  document.getElementById('checkoutForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!cart.length) {
      showToast('No hay productos en el carrito.');
      closeCheckoutModal();
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nombre = String(formData.get('nombre') || '').trim();
    const direccion = String(formData.get('direccion') || '').trim();
    if (!nombre || !direccion) {
      showToast('Completa nombre y direccion/localidad.');
      return;
    }
    finalizeOrder(nombre, direccion);
    form.reset();
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('checkout') === 'ok') {
    window.history.replaceState({}, '', 'index.html');
    const successOverlay = document.getElementById('successOverlay');
    if (successOverlay) {
      successOverlay.classList.add('show');
      const text = successOverlay.querySelector('p');
      if (text) text.textContent = 'Gracias por elegir Melrose. Te contactaremos por WhatsApp.';
    } else {
      showToast('Pedido recibido. Gracias por elegir Melrose.');
    }
  }
}

function getAdminSession() {
  return sessionStorage.getItem('melrose_admin') === 'true';
}

function setAdminSession(isLogged) {
  if (isLogged) {
    sessionStorage.setItem('melrose_admin', 'true');
  } else {
    sessionStorage.removeItem('melrose_admin');
  }
}

async function listAdminProducts() {
  if (!supabaseClient) {
    return fallbackProducts.slice();
  }
  const { data, error } = await supabaseClient.from('productos').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function subirImagen(archivo) {
  if (!supabaseClient) {
    throw new Error('Supabase no esta configurado.');
  }
  if (!archivo) {
    throw new Error('No se selecciono ningun archivo.');
  }
  console.log('[ADMIN][UPLOAD] Iniciando subida de imagen...', {
    name: archivo.name,
    size: archivo.size,
    type: archivo.type
  });
  const ext = (archivo.name.split('.').pop() || 'jpg').toLowerCase();
  const safeExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg';
  const filePath = `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
  const { error: uploadError } = await supabaseClient.storage
    .from('productos')
    .upload(filePath, archivo, { upsert: false, cacheControl: '3600' });
  if (uploadError) {
    console.error('[ADMIN][UPLOAD] Error al subir imagen:', uploadError);
    throw uploadError;
  }
  const { data } = supabaseClient.storage.from('productos').getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('No se pudo obtener la URL publica de la imagen.');
  }
  console.log('[ADMIN][UPLOAD] Imagen subida correctamente:', data.publicUrl);
  return data.publicUrl;
}

async function refreshAdminTable() {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  let products = [];
  try {
    products = await listAdminProducts();
  } catch (error) {
    handleError(error, 'carga de tabla admin');
    tbody.innerHTML = '<tr><td colspan="5">Error cargando productos en admin.</td></tr>';
    return;
  }

  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="5">No hay productos para mostrar.</td></tr>';
    return;
  }

  tbody.innerHTML = products.map((item) => `
    <tr data-id="${safeText(item.id)}">
      <td>
        <span class="admin-product-name">
          <img src="${safeText(item.imagen_url || placeholderImage)}" alt="${safeText(item.nombre)}">
          ${safeText(item.nombre)}
        </span>
      </td>
      <td>${safeText(item.categoria || '-')}</td>
      <td><input type="number" min="1" value="${Number(item.precio || 0)}" data-field="precio"></td>
      <td><input type="number" min="0" value="${Number(item.stock || 0)}" data-field="stock"></td>
      <td>
        <button class="btn-outline" onclick="saveRow('${safeText(item.id)}')">GUARDAR</button>
        <button class="btn-outline" onclick="deleteRow('${safeText(item.id)}')">ELIMINAR</button>
      </td>
    </tr>
  `).join('');
}

window.saveRow = async function saveRow(id) {
  if (!supabaseClient) {
    showToast('Configura Supabase para editar.');
    return;
  }
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  const precio = Number(row.querySelector('[data-field="precio"]')?.value || 0);
  const stock = Number(row.querySelector('[data-field="stock"]')?.value || 0);
  const { error } = await supabaseClient.from('productos').update({ precio, stock }).eq('id', id);
  if (error) {
    handleError(error, 'actualizacion de producto');
    showToast(`No se pudo guardar: ${error.message}`);
    return;
  }
  await refreshAdminTable();
};

window.deleteRow = async function deleteRow(id) {
  if (!supabaseClient) {
    showToast('Configura Supabase para eliminar.');
    return;
  }
  const ok = confirm('Eliminar este producto?');
  if (!ok) return;
  const { error } = await supabaseClient.from('productos').delete().eq('id', id);
  if (error) {
    handleError(error, 'eliminacion de producto');
    showToast(`No se pudo eliminar: ${error.message}`);
    return;
  }
  await refreshAdminTable();
};

async function handleCreateProduct(event) {
  event.preventDefault();
  if (!supabaseClient) {
    showToast('Configura Supabase para crear productos.');
    return;
  }
  const form = event.currentTarget;
  const submitBtn = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  console.log('[ADMIN][CREATE] Iniciando alta de producto...');
  const imageFile = data.get('imagen_archivo');
  if (!(imageFile instanceof File) || !imageFile.size) {
    showToast('Selecciona una imagen.');
    return;
  }

  const rawPrecio = Number(data.get('precio'));
  if (!Number.isFinite(rawPrecio) || rawPrecio <= 0) {
    showToast('Precio invalido.');
    return;
  }

  const rawStock = Number(data.get('stock'));
  if (!Number.isFinite(rawStock) || rawStock < 0) {
    showToast('Stock invalido.');
    return;
  }

  const tallesRaw = data.get('talles');
  let tallesArray = [];
  try {
    tallesArray = JSON.parse(tallesRaw || '[]');
  } catch (e) {
    tallesArray = [];
  }

  console.log('[ADMIN][CREATE] Datos parseados previos al upload:', {
    nombre: String(data.get('nombre') || '').trim(),
    categoria: String(data.get('categoria') || '').trim().toUpperCase(),
    precio: rawPrecio,
    stock: rawStock,
    talles: tallesArray
  });

  let uploadedImageUrl = '';
  setButtonLoading(submitBtn, true, 'SUBIENDO...');
  try {
    uploadedImageUrl = await subirImagen(imageFile);
  } catch (error) {
    handleError(error, 'subida de imagen');
    showToast(`Error de imagen: ${error.message}`);
    setButtonLoading(submitBtn, false, 'SUBIENDO...');
    return;
  }
  const payload = {
    nombre: String(data.get('nombre') || '').trim(),
    descripcion: String(data.get('descripcion') || '').trim(),
    precio: rawPrecio,
    categoria: String(data.get('categoria') || '').trim().toUpperCase(),
    stock: rawStock,
    imagen_url: uploadedImageUrl,
    talles: tallesArray,
    destacado: Boolean(data.get('destacado'))
  };
  if (!payload.nombre || !payload.precio || !payload.categoria) {
    showToast('Completa campos obligatorios.');
    return;
  }
  console.log('[ADMIN][CREATE] Payload final a insertar:', payload);
  const { error } = await supabaseClient.from('productos').insert(payload);
  if (error) {
    handleError(error, 'alta de producto');
    showToast(`Error al agregar: ${error.message}`);
    setButtonLoading(submitBtn, false, 'SUBIENDO...');
    return;
  }
  showToast('Producto creado con exito.');
  form.reset();
  const imagePreview = document.getElementById('imagePreview');
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.classList.remove('visible');
  }
  setButtonLoading(submitBtn, false, 'SUBIENDO...');
  await refreshAdminTable();
}

async function applyAdminState() {
  const login = document.getElementById('adminLogin');
  const panel = document.getElementById('adminPanel');
  const isAuth = getAdminSession();
  login.style.display = isAuth ? 'none' : 'grid';
  panel.style.display = isAuth ? 'block' : 'none';
  if (isAuth) {
    await refreshAdminTable();
  }
}

async function initAdminPage() {
  const loginForm = document.getElementById('adminLoginForm');
  const passwordInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const productForm = document.getElementById('productForm');
  const fileInput = document.getElementById('imagenArchivo');
  const imagePreview = document.getElementById('imagePreview');

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const pass = String(passwordInput?.value || '');
    if (pass !== ADMIN_PASSWORD) {
      loginError.style.display = 'block';
      return;
    }
    loginError.style.display = 'none';
    setAdminSession(true);
    await applyAdminState();
  });

  document.getElementById('btnLogout')?.addEventListener('click', async () => {
    setAdminSession(false);
    await applyAdminState();
  });

  fileInput?.addEventListener('change', () => {
    const selected = fileInput.files && fileInput.files[0];
    if (!selected || !imagePreview) {
      return;
    }
    console.log('[ADMIN][PREVIEW] Archivo seleccionado:', {
      name: selected.name,
      size: selected.size,
      type: selected.type
    });
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = String(reader.result || '');
      imagePreview.classList.add('visible');
      console.log('[ADMIN][PREVIEW] Preview generada correctamente.');
    };
    reader.readAsDataURL(selected);
  });

  productForm?.addEventListener('submit', handleCreateProduct);
  initTagsSystem();
  await applyAdminState();
}

function initTagsSystem() {
  const container = document.getElementById('tagsContainer');
  const input = document.getElementById('tagInput');
  const btnAdd = document.getElementById('btnAddTag');
  const hidden = document.getElementById('tallesHidden');
  if (!container || !input || !hidden) return;

  let tags = [];

  const updateHidden = () => {
    hidden.value = JSON.stringify(tags);
  };

  const renderTags = () => {
    container.innerHTML = tags.map((t, index) => `
      <span class="tag">
        ${safeText(t)}
        <span class="remove-tag" onclick="removeTag(${index})">X</span>
      </span>
    `).join('');
    updateHidden();
  };

  window.removeTag = (index) => {
    tags.splice(index, 1);
    renderTags();
  };

  const addCurrentTag = () => {
    const val = input.value.trim().toUpperCase();
    if (val && !tags.includes(val)) {
      tags.push(val);
      renderTags();
    }
    input.value = '';
    input.focus();
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCurrentTag();
    }
  });

  btnAdd?.addEventListener('click', (e) => {
    e.preventDefault();
    addCurrentTag();
  });
}

function smoothScrollTo(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  const offset = 80;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  if (typeof gsap !== 'undefined' && gsap.to) {
    gsap.to(window, {
      duration: 1.25,
      scrollTo: { y: offsetPosition, autoKill: true },
      ease: "power2.inOut"
    });
  } else {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Capa de infraestructura básica (Siempre visible)
  ensureToastWrap();

  // 2. Carga de datos e inicialización de UI (Prioridad 1)
  if (document.getElementById('productsGrid')) {
    initSecretAdminAccess();
    
    // Intentamos cargar la tienda. Si la API falla, el fallback entrará en juego.
    try {
      await initStorePage();
    } catch (e) {
      console.error('[CRÍTICO] Error al inicializar tienda:', e);
    }

    // 3. Capa de Refinamiento (GSAP) - No debe bloquear la carga de datos
    try {
      if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
        initProductReveal();
      }
    } catch (e) {
      console.warn('[GSAP] Error al ejecutar animaciones:', e);
    }
  }

  if (document.getElementById('adminPanel')) {
    await initAdminPage();
  }
});
