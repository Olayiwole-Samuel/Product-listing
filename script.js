/* Professional product listing with features:
   - 8 products
   - featured ribbon
   - add to cart (updates counter)
   - quick-view modal
   - clean, modular functions
*/
const products = [
    {
        id: 1,
        name: "Nike Air Max 2024",
        price: 120,
        featured: true,
        image: "https://i.pinimg.com/736x/56/83/9b/56839b97054984031dc2678aba9972f8.jpg",
        desc: "Lightweight performance sneakers with breathable mesh upper and responsive cushioning."
    },
    {
        id: 2,
        name: "Apple AirPods Pro 2",
        price: 249,
        featured: true,
        image: "https://i.pinimg.com/1200x/a0/ca/64/a0ca644fdd253601559b0c526b790ad6.jpg",
        desc: "Active noise cancellation, adaptive EQ, and enhanced spatial audio for immersive sound."
    },
    {
        id: 3,
        name: "Minimalist Wooden Chair",
        price: 90,
        featured: false,
        image: "https://i.pinimg.com/736x/53/64/b8/5364b8c8c006c002c25b2653de13c1b3.jpg",
        desc: "Solid wood chair with a clean modern silhouette — perfect for minimal interiors."
    },
    {
        id: 4,
        name: "Samsung Galaxy Watch 6",
        price: 199,
        featured: false,
        image: "https://i.pinimg.com/1200x/dd/64/4e/dd644e1d3cb4437812a311e8392c47d2.jpg",
        desc: "Advanced health tracking, long battery life, and a sharp OLED display."
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        price: 349,
        featured: true,
        image: "https://i.pinimg.com/736x/ee/12/bf/ee12bf005d4c7e592a7e6c9d1cbbc200.jpg",
        desc: "Industry-leading noise cancellation and premium audio quality for true listeners."
    },
    {
        id: 6,
        name: "Gaming Mechanical Keyboard",
        price: 89,
        featured: false,
        image: "https://i.pinimg.com/736x/31/26/c6/3126c66ea73dd7510721b891ff236553.jpg",
        desc: "RGB lighting, tactile switches, and durable aluminium frame for competitive play."
    },
    {
        id: 7,
        name: "Premium Office Chair",
        price: 210,
        featured: false,
        image: "https://i.pinimg.com/736x/7a/3c/5c/7a3c5ca272bf8f2e4b2ad7c0f2d97632.jpg",
        desc: "Ergonomic design with lumbar support and breathable mesh — all-day comfort."
    },
    {
        id: 8,
        name: "Classic Denim Jacket",
        price: 75,
        featured: false,
        image: "https://i.pinimg.com/736x/4d/16/96/4d1696e8d9bff04927515f0369818b37.jpg",
        desc: "Timeless denim jacket with a regular fit and reinforced stitching."
    }
];

// DOM elements
const grid = document.getElementById('product-grid');
const cartCountEl = document.getElementById('cart-count');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalAdd = document.getElementById('modal-add');
const modalClose = document.getElementById('modal-close');

let cartCount = 0;
let currentModalProductId = null;

// Render products into grid
function renderProducts(list) {
    grid.innerHTML = ''; // clear
    list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('role', 'article');
        card.innerHTML = `
      <div class="product-media">
        ${p.featured ? '<span class="ribbon">Featured</span>' : ''}
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
      </div>
      <div class="product-body">
        <div>
          <div class="title">${escapeHtml(p.name)}</div>
          <div class="category">${formatPrice(p.price)}</div>
        </div>
        <div class="card-actions">
          <button class="btn" data-action="add" data-id="${p.id}">Add to Cart</button>
          <button class="ghost" data-action="view" data-id="${p.id}">Quick View</button>
        </div>
      </div>
    `;
        grid.appendChild(card);
    });
}

// Helpers
function formatPrice(n) { return `$${n.toFixed(2)}`; }
function escapeHtml(text) { return (text + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// Add to cart handler
function addToCart(id) {
    // simple counter for MVP
    cartCount += 1;
    cartCountEl.textContent = cartCount;
    // Could store in localStorage or Firestore later
}

// Quick view handler (opens modal)
function openModal(product) {
    currentModalProductId = product.id;
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalTitle.textContent = product.name;
    modalPrice.textContent = formatPrice(product.price);
    modalDesc.textContent = product.desc;
    modal.setAttribute('aria-hidden', 'false');
    modalAdd.dataset.id = product.id;
    // focus management for accessibility
    modalAdd.focus();
}

// Close modal
function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    currentModalProductId = null;
}

// DOM event delegation for product actions
grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (action === 'add') {
        addToCart(id);
        // subtle feedback
        btn.textContent = 'Added';
        setTimeout(() => btn.textContent = 'Add to Cart', 900);
    } else if (action === 'view') {
        openModal(product);
    }
});

// Modal add to cart button
modalAdd.addEventListener('click', () => {
    const id = Number(modalAdd.dataset.id);
    addToCart(id);
});

// Close modal events
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

// Initialize
renderProducts(products);

// Optional: persist cart count using localStorage
(function loadCartFromStorage() {
    try {
        const saved = Number(localStorage.getItem('cartCount') || 0);
        if (saved > 0) { cartCount = saved; cartCountEl.textContent = cartCount; }
        // update storage when cartCount changes
        const origAdd = addToCart;
        addToCart = function (id) {
            origAdd(id);
            localStorage.setItem('cartCount', cartCount);
        };
    } catch (err) { /* ignore storage errors for privacy */ }
})();
