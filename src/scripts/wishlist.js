// Wishlist Management System
// localStorage-based with future auth integration ready

class WishlistManager {
  constructor() {
    this.storageKey = "melrose_wishlist";
    this.wishlist = this.loadWishlist();
    this.init();
  }

  // Load wishlist from localStorage
  loadWishlist() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  }

  // Save wishlist to localStorage
  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
      this.updateWishlistCount();
      this.syncWishlist(); // Future auth integration
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }

  // Initialize wishlist functionality
  init() {
    this.attachEventListeners();
    this.updateWishlistButtons();
    this.updateWishlistCount();
  }

  // Attach event listeners to wishlist buttons
  attachEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".wishlist-btn")) {
        e.preventDefault();
        const button = e.target.closest(".wishlist-btn");
        this.toggleWishlistItem(button);
      }
    });
  }

  // Toggle item in wishlist
  toggleWishlistItem(button) {
    const productId = button.dataset.id;
    const productData = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
      image: button.dataset.image,
      category: button.dataset.category,
      addedAt: new Date().toISOString(),
    };

    // Check if item already exists in wishlist
    const existingIndex = this.wishlist.findIndex(
      (item) => item.id === productId,
    );

    if (existingIndex > -1) {
      // Remove from wishlist using splice
      this.wishlist.splice(existingIndex, 1);
      button.classList.remove("active");
      this.showNotification("Eliminado de favoritos", "remove");
    } else {
      // Add to wishlist using push
      this.wishlist.push(productData);
      button.classList.add("active");
      this.showNotification("Agregado a favoritos", "add");

      // Add neon pulse effect
      this.addNeonEffect(button);
    }

    this.saveWishlist();
  }

  // Update all wishlist buttons based on current state
  updateWishlistButtons() {
    const buttons = document.querySelectorAll(".wishlist-btn");
    buttons.forEach((button) => {
      const productId = button.dataset.id;
      if (this.wishlist.some((item) => item.id === productId)) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  // Update wishlist count in UI
  updateWishlistCount() {
    // Update navbar badge
    const navbarBadge = document.getElementById("wishlistBadge");
    if (navbarBadge) {
      navbarBadge.textContent = this.wishlist.length;
    }

    // Update any other wishlist count elements
    const countElements = document.querySelectorAll(".wishlist-count");
    countElements.forEach((element) => {
      element.textContent = this.wishlist.length;
    });
  }

  // Add neon effect when item is added
  addNeonEffect(button) {
    button.style.animation = "none";
    setTimeout(() => {
      button.style.animation = "";
    }, 10);
  }

  // Show notification for wishlist actions
  showNotification(message, type = "add") {
    const notification = document.createElement("div");
    notification.className = `wishlist-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "add" ? "var(--magenta)" : "var(--rojo)"};
      color: var(--blanco);
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1000;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-20px)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Get wishlist items
  getWishlist() {
    return this.wishlist;
  }

  // Clear wishlist
  clearWishlist() {
    this.wishlist = [];
    this.saveWishlist();
    this.updateWishlistButtons();
    this.showNotification("Favoritos eliminados", "remove");
  }

  // Check if product is in wishlist
  isInWishlist(productId) {
    return this.wishlist.some((item) => item.id === productId);
  }

  // Future auth integration - sync with server
  syncWishlist() {
    // TODO: Implement when authentication system is ready
    // This function will sync local wishlist with server
    /*
    if (this.isUserLoggedIn()) {
      fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ wishlist: this.wishlist })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Wishlist synced with server:', data);
      })
      .catch(error => {
        console.error('Error syncing wishlist:', error);
      });
    }
    */
  }

  // Helper functions for future auth integration
  isUserLoggedIn() {
    // TODO: Implement auth check
    return false;
  }

  getAuthToken() {
    // TODO: Implement token retrieval
    return null;
  }
}

// Initialize wishlist when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.wishlistManager = new WishlistManager();
});

// Re-initialize after Astro page transitions
document.addEventListener("astro:after-swap", () => {
  if (window.wishlistManager) {
    window.wishlistManager.init();
  } else {
    window.wishlistManager = new WishlistManager();
  }
});

// Export for use in other scripts
export { WishlistManager };
