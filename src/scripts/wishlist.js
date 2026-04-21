export class WishlistManager {
  constructor() {
    this.wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    this.updateUI();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.wishlist-btn');
      if (btn) {
        this.toggleWishlistItem(btn);
      }
    });
  }

  toggleWishlistItem(button) {
    const productId = button.dataset.id;
    const productName = button.dataset.name || 'Producto';
    const productPrice = parseFloat(button.dataset.price) || 0;
    const productImage = button.dataset.image || '';
    const productCategory = button.dataset.category || '';
    const productStock = parseInt(button.dataset.stock) || 0;

    const itemExistente = this.wishlist.find(i => i.id === productId);

    if (itemExistente) {
      // Remove from wishlist
      this.wishlist = this.wishlist.filter(item => item.id !== productId);
      button.classList.remove('active');
    } else {
      // Add to wishlist
      const item = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        category: productCategory,
        stock: productStock,
        addedAt: new Date().toISOString()
      };
      this.wishlist.push(item);
      button.classList.add('active');
    }

    this.save();
    this.updateUI();
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  save() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  updateUI() {
    // Update wishlist badge in navbar
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
      badge.textContent = this.wishlist.length;
      badge.style.display = this.wishlist.length > 0 ? 'inline-block' : 'none';
      
      // Pulse animation logic
      badge.classList.remove('pop');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('pop');
    }

    // Update wishlist items in Favorites page (if it exists)
    const wishlistContainer = document.getElementById('wishlistItems');
    if (wishlistContainer) {
      wishlistContainer.innerHTML = this.wishlist.length
        ? this.wishlist.map(item => `
            <div class="wishlist-item">
              <div class="item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
              </div>
              <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-category">${item.category}</p>
                <p class="item-price">$ ${item.price.toLocaleString('es-AR')}</p>
              </div>
              <div class="item-actions">
                <button class="btn-primary add-to-cart" 
                        data-id="${item.id}" 
                        data-name="${item.name}" 
                        data-price="${item.price}"
                        data-stock="${item.stock || 0}"
                        data-image="${item.image}">
                  AGREGAR
                </button>
                <button class="remove-btn" data-id="${item.id}">
                  ELIMINAR
                </button>
              </div>
            </div>
          `).join('')
        : '<p class="empty-wishlist">No tienes productos favoritos</p>';

      // Re-attach removal events for the favorites page rendering
      wishlistContainer.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const productId = e.target.dataset.id;
          this.wishlist = this.wishlist.filter(item => item.id !== productId);
          this.save();
          this.updateUI();
          this.initializeWishlistButtons();
        });
      });
    }
  }

  initializeWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
      const productId = button.dataset.id;
      if (this.isInWishlist(productId)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}

let wishlistManagerInstance = null;

export function initWishlist() {
  if (!wishlistManagerInstance) {
    wishlistManagerInstance = new WishlistManager();
  }
  wishlistManagerInstance.updateUI();
  wishlistManagerInstance.initializeWishlistButtons();
  window.wishlistManager = wishlistManagerInstance;
}
