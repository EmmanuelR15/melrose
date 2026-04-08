const SUPABASE_URL = 'https://nqnykxwfpuelphtxxwtn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BG5FRtP_2WJYsMyKbA9u7A_L4aLjq3l';
const ADMIN_PASSWORD = 'melrose2024';

const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
});

const placeholderImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80';
const fallbackProducts = [
  { id: 'f1', nombre: 'REMERA ESSENTIAL BLACK', descripcion: 'Algodon premium', precio: 22990, categoria: 'REMERAS', talles: ['S', 'M', 'L'], imagen_url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=80', destacado: false, stock: 18 },
  { id: 'f2', nombre: 'CAMPERA BOMBER NOIR', descripcion: 'Tela tecnica', precio: 79990, categoria: 'CAMPERAS', talles: ['M', 'L', 'XL'], imagen_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', destacado: true, stock: 7 },
  { id: 'f3', nombre: 'PANTALON CARGO TACTICAL', descripcion: 'Fit relajado', precio: 56990, categoria: 'PANTALONES', talles: ['38', '40', '42'], imagen_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80', destacado: false, stock: 12 },
  { id: 'f4', nombre: 'GORRA SIGNATURE RED', descripcion: 'Bordado frontal', precio: 18990, categoria: 'ACCESORIOS', talles: ['UNICO'], imagen_url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&q=80', destacado: false, stock: 21 },
  { id: 'f5', nombre: 'REMERA LONG FIT STUDIO', descripcion: 'Corte editorial', precio: 25990, categoria: 'REMERAS', talles: ['S', 'M', 'L'], imagen_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&q=80', destacado: true, stock: 14 },
  { id: 'f6', nombre: 'BANDOLERA URBAN CORE', descripcion: 'Nylon resistente', precio: 31990, categoria: 'ACCESORIOS', talles: ['UNICO'], imagen_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80', destacado: false, stock: 9 }
];

let supabaseClient = null;
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
  try {
    allProducts = await getProductsFromSource();
  } catch (error) {
    console.error('No se pudieron cargar productos:', error);
    allProducts = fallbackProducts.slice();
  }
  renderProducts(categoria);
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

  grid.innerHTML = filtered.map((item) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${safeText(item.imagen_url || placeholderImage)}" alt="${safeText(item.nombre)}" loading="lazy">
      </div>
      <div class="product-content">
        <div>
          <h3 class="product-name">${safeText(item.nombre)}</h3>
          <p class="product-price">${formatter.format(Number(item.precio || 0))}</p>
        </div>
        <button class="add-btn" onclick="addToCart('${safeText(item.id)}')" aria-label="Agregar producto">+</button>
      </div>
    </article>
  `).join('');
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

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = String(totalItems);
  }

  const itemsWrap = document.getElementById('cartItems');
  const totalText = document.getElementById('cartTotalText');
  if (!itemsWrap || !totalText) return;

  if (cart.length === 0) {
    itemsWrap.innerHTML = '<p class="empty-msg">Tu carrito esta vacio.</p>';
    totalText.textContent = formatter.format(0);
    return;
  }

  let total = 0;
  itemsWrap.innerHTML = cart.map((item) => {
    total += Number(item.precio) * item.qty;
    return `
      <div class="cart-item">
        <img src="${safeText(item.imagen_url || placeholderImage)}" alt="${safeText(item.nombre)}">
        <div>
          <p>${safeText(item.nombre)}</p>
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

window.addToCart = function addToCart(id) {
  const found = allProducts.find((item) => String(item.id) === String(id));
  if (!found) return;
  const existing = cart.find((item) => String(item.id) === String(id));
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: found.id,
      nombre: found.nombre,
      precio: Number(found.precio || 0),
      imagen_url: found.imagen_url || placeholderImage,
      qty: 1
    });
  }
  saveCart();
  updateCartUI();
  openCart();
};

window.changeQty = function changeQty(id, delta) {
  cart = cart.map((item) => {
    if (String(item.id) === String(id)) {
      return { ...item, qty: item.qty + delta };
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
    heroCtaBtn.addEventListener('click', () => {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  await cargarProductos('TODO');
  updateCartUI();

  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const target = event.currentTarget;
      document.querySelectorAll('.category-btn').forEach((x) => x.classList.remove('active'));
      target.classList.add('active');
      await cargarProductos(target.dataset.cat || 'TODO');
    });
  });

  document.getElementById('cartOpenBtn')?.addEventListener('click', openCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
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
    console.error(error);
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
    alert('Configura SUPABASE_URL y SUPABASE_KEY para editar desde admin.');
    return;
  }
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;
  const precio = Number(row.querySelector('[data-field="precio"]')?.value || 0);
  const stock = Number(row.querySelector('[data-field="stock"]')?.value || 0);
  const { error } = await supabaseClient.from('productos').update({ precio, stock }).eq('id', id);
  if (error) {
    alert(`No se pudo guardar: ${error.message}`);
    return;
  }
  await refreshAdminTable();
};

window.deleteRow = async function deleteRow(id) {
  if (!supabaseClient) {
    alert('Configura SUPABASE_URL y SUPABASE_KEY para eliminar desde admin.');
    return;
  }
  const ok = confirm('Eliminar este producto?');
  if (!ok) return;
  const { error } = await supabaseClient.from('productos').delete().eq('id', id);
  if (error) {
    alert(`No se pudo eliminar: ${error.message}`);
    return;
  }
  await refreshAdminTable();
};

async function handleCreateProduct(event) {
  event.preventDefault();
  if (!supabaseClient) {
    alert('Configura SUPABASE_URL y SUPABASE_KEY para crear productos en Supabase.');
    return;
  }
  const form = event.currentTarget;
  const data = new FormData(form);
  console.log('[ADMIN][CREATE] Iniciando alta de producto...');
  const imageFile = data.get('imagen_archivo');
  if (!(imageFile instanceof File) || !imageFile.size) {
    console.warn('[ADMIN][CREATE] Falta imagen en el formulario.');
    alert('Selecciona una imagen antes de guardar.');
    return;
  }

  const rawPrecio = Number(data.get('precio'));
  if (!Number.isFinite(rawPrecio) || rawPrecio <= 0) {
    console.warn('[ADMIN][CREATE] Precio invalido:', data.get('precio'));
    alert('El precio debe ser un numero mayor a 0.');
    return;
  }

  const rawStock = Number(data.get('stock'));
  if (!Number.isFinite(rawStock) || rawStock < 0) {
    console.warn('[ADMIN][CREATE] Stock invalido:', data.get('stock'));
    alert('El stock debe ser un numero mayor o igual a 0.');
    return;
  }

  const tallesArray = String(data.get('talles') || '')
    .split(',')
    .map((x) => x.trim().toUpperCase())
    .filter(Boolean);

  console.log('[ADMIN][CREATE] Datos parseados previos al upload:', {
    nombre: String(data.get('nombre') || '').trim(),
    categoria: String(data.get('categoria') || '').trim().toUpperCase(),
    precio: rawPrecio,
    stock: rawStock,
    talles: tallesArray
  });

  let uploadedImageUrl = '';
  try {
    uploadedImageUrl = await subirImagen(imageFile);
  } catch (error) {
    console.error('[ADMIN][CREATE] Fallo etapa upload:', error);
    alert(`No se pudo subir la imagen: ${error.message}`);
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
    console.warn('[ADMIN][CREATE] Faltan campos requeridos:', payload);
    alert('Nombre, precio y categoria son obligatorios.');
    return;
  }
  console.log('[ADMIN][CREATE] Payload final a insertar:', payload);
  const { error } = await supabaseClient.from('productos').insert(payload);
  if (error) {
    console.error('[ADMIN][CREATE] Fallo etapa insert DB:', error);
    alert(`No se pudo agregar: ${error.message}`);
    return;
  }
  console.log('[ADMIN][CREATE] Producto creado con exito.');
  alert('Producto creado correctamente.');
  form.reset();
  const imagePreview = document.getElementById('imagePreview');
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.classList.remove('visible');
  }
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
  await applyAdminState();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('productsGrid')) {
    await initStorePage();
  }
  if (document.getElementById('adminPanel')) {
    await initAdminPage();
  }
});
