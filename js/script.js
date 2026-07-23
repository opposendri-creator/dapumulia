// ========== DAPU MULIA - MAIN JAVASCRIPT ==========

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========== STATE ==========
    const state = {
        cart: JSON.parse(localStorage.getItem('dapuMuliaCart')) || [],
        currentFilter: 'all',
        isCartOpen: false
    };

    // ========== DOM REFS ==========
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        productsGrid: $('#productsGrid'),
        cartSidebar: $('#cartSidebar'),
        cartOverlay: $('#cartOverlay'),
        cartItems: $('#cartItems'),
        cartTotal: $('#cartTotal'),
        cartBadge: $('#cartBadge'),
        cartBtn: $('#cartBtn'),
        cartClose: $('#cartClose'),
        checkoutBtn: $('#checkoutBtn'),
        filterBtns: $$('.filter-btn'),
        toast: $('#toast'),
        toastMessage: $('#toastMessage'),
        navMenu: $('#navMenu'),
        navToggle: $('#navToggle'),
        navbar: $('.navbar')
    };

    // ========== FORMAT RUPIAH ==========
    function formatRupiah(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }

    // ========== RENDER PRODUCTS ==========
    function renderProducts(filter = 'all') {
        const filteredProducts = filter === 'all'
            ? products
            : products.filter(p => p.category === filter);

        if (filteredProducts.length === 0) {
            dom.productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <p>Tidak ada produk di kategori ini</p>
                </div>
            `;
            return;
        }

        dom.productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.bestseller ? '<span class="product-badge">Best Seller</span>' : ''}
                    <div class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryLabel(product.category)}</div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-weight">
                        <i class="fas fa-weight-scale"></i> ${product.weight}
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${formatRupiah(product.price)}</span>
                        <button class="add-to-cart" data-id="${product.id}" title="Tambah ke keranjang">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add staggered animation delay
        document.querySelectorAll('.product-card').forEach((card, i) => {
            card.style.animationDelay = `${i * 0.05}s`;
        });
    }

    // ========== GET CATEGORY LABEL ==========
    function getCategoryLabel(category) {
        const labels = {
            'kue-kering': 'Kue Kering',
            'kue-basah': 'Kue Basah',
            'roti': 'Roti & Pastry',
            'snack': 'Snack',
            'minuman': 'Minuman'
        };
        return labels[category] || category;
    }

    // ========== UPDATE CART ==========
    function updateCart() {
        // Update badge
        const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
        dom.cartBadge.textContent = totalItems;

        // Save to localStorage
        localStorage.setItem('dapuMuliaCart', JSON.stringify(state.cart));

        // Render cart items
        if (state.cart.length === 0) {
            dom.cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Keranjang masih kosong</p>
                    <span>Yuk tambah menu favoritmu!</span>
                </div>
            `;
            dom.cartTotal.textContent = 'Rp 0';
            return;
        }

        dom.cartItems.innerHTML = state.cart.map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return '';
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-price">${formatRupiah(product.price)}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn minus" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="cart-item-qty">${item.qty}</span>
                            <button class="qty-btn plus" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="cart-item-remove" data-id="${item.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate total
        const total = state.cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.qty : 0);
        }, 0);

        dom.cartTotal.textContent = formatRupiah(total);

        // Attach cart item events
        attachCartItemEvents();
    }

    // ========== ADD TO CART ==========
    function addToCart(productId) {
        const existing = state.cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            state.cart.push({ id: productId, qty: 1 });
        }
        updateCart();
        showToast('Berhasil ditambahkan ke keranjang!');
        
        // Animate the cart badge
        dom.cartBadge.style.transform = 'scale(1.5)';
        setTimeout(() => {
            dom.cartBadge.style.transform = 'scale(1)';
        }, 200);
    }

    // ========== ATTACH CART ITEM EVENTS ==========
    function attachCartItemEvents() {
        // Minus button
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const item = state.cart.find(i => i.id === id);
                if (item) {
                    if (item.qty > 1) {
                        item.qty -= 1;
                    } else {
                        state.cart = state.cart.filter(i => i.id !== id);
                    }
                    updateCart();
                }
            });
        });

        // Plus button
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const item = state.cart.find(i => i.id === id);
                if (item) {
                    item.qty += 1;
                    updateCart();
                }
            });
        });

        // Remove button
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                state.cart = state.cart.filter(i => i.id !== id);
                updateCart();
                showToast('Item dihapus dari keranjang');
            });
        });
    }

    // ========== TOGGLE CART ==========
    function toggleCart(force) {
        const shouldOpen = force !== undefined ? force : !state.isCartOpen;
        state.isCartOpen = shouldOpen;
        dom.cartSidebar.classList.toggle('active', shouldOpen);
        dom.cartOverlay.classList.toggle('active', shouldOpen);
        document.body.style.overflow = shouldOpen ? 'hidden' : '';
    }

    // ========== SHOW TOAST ==========
    function showToast(message) {
        dom.toastMessage.textContent = message;
        dom.toast.classList.add('show');
        setTimeout(() => {
            dom.toast.classList.remove('show');
        }, 3000);
    }

    // ========== CHECKOUT VIA WHATSAPP ==========
    function checkout() {
        if (state.cart.length === 0) {
            showToast('Keranjang masih kosong!');
            return;
        }

        let message = 'Halo *Dapu Mulia*! Saya mau pesan:\n\n';
        
        state.cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                message += `• ${product.name} x${item.qty} = ${formatRupiah(product.price * item.qty)}\n`;
            }
        });

        const total = state.cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.qty : 0);
        }, 0);

        message += `\n*Total: ${formatRupiah(total)}*`;
        message += '\n\nMohon info ketersediaan dan estimasi pengiriman. Terima kasih! 🙏';

        const waUrl = `https://wa.me/6281273127063?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
        
        toggleCart(false);
    }

    // ========== FILTER PRODUCTS ==========
    dom.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dom.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentFilter = btn.dataset.filter;
            renderProducts(state.currentFilter);
        });
    });

    // ========== EVENT LISTENERS ==========
    
    // Add to cart (delegated)
    dom.productsGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart');
        if (addBtn) {
            const productId = parseInt(addBtn.dataset.id);
            addToCart(productId);
        }
    });

    // Cart toggle
    dom.cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });

    dom.cartClose.addEventListener('click', () => toggleCart(false));
    dom.cartOverlay.addEventListener('click', () => toggleCart(false));

    // Checkout
    dom.checkoutBtn.addEventListener('click', checkout);

    // Nav toggle
    dom.navToggle.addEventListener('click', () => {
        dom.navMenu.classList.toggle('active');
        dom.navToggle.innerHTML = dom.navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close nav on link click
    dom.navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            dom.navMenu.classList.remove('active');
            dom.navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            dom.navbar.classList.add('scrolled');
        } else {
            dom.navbar.classList.remove('scrolled');
        }
    });

    // Close cart with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isCartOpen) {
            toggleCart(false);
        }
    });

    // ========== DASHBOARD (SIMPLE ADMIN) ==========
    // Hidden admin panel - accessible by pressing 'A' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'a' && e.ctrlKey) {
            toggleDashboard();
        }
    });

    function toggleDashboard() {
        const existing = document.querySelector('.admin-dashboard');
        if (existing) {
            existing.remove();
            return;
        }

        const totalProducts = products.length;
        const totalCategories = [...new Set(products.map(p => p.category))].length;
        const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
        const totalBestsellers = products.filter(p => p.bestseller).length;

        const dashboard = document.createElement('div');
        dashboard.className = 'admin-dashboard';
        dashboard.innerHTML = `
            <div class="admin-header">
                <h2><i class="fas fa-chart-line"></i> Dashboard Dapu Mulia</h2>
                <button class="admin-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="admin-stats">
                <div class="stat-card">
                    <i class="fas fa-box"></i>
                    <div>
                        <span class="stat-value">${totalProducts}</span>
                        <span class="stat-label">Total Produk</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-tags"></i>
                    <div>
                        <span class="stat-value">${totalCategories}</span>
                        <span class="stat-label">Kategori</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-crown"></i>
                    <div>
                        <span class="stat-value">${totalBestsellers}</span>
                        <span class="stat-label">Best Seller</span>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-money-bill-wave"></i>
                    <div>
                        <span class="stat-value">${formatRupiah(totalRevenue)}</span>
                        <span class="stat-label">Total Nilai Produk</span>
                    </div>
                </div>
            </div>
            <div class="admin-table">
                <h3>Daftar Produk</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Berat</th>
                            <th>Best Seller</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(p => `
                            <tr>
                                <td>${p.name}</td>
                                <td>${getCategoryLabel(p.category)}</td>
                                <td>${formatRupiah(p.price)}</td>
                                <td>${p.weight}</td>
                                <td>${p.bestseller ? '✅' : '❌'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="admin-footer">
                <p>Tekan <kbd>Ctrl + A</kbd> untuk menutup dashboard</p>
            </div>
        `;

        // Admin dashboard styles
        const style = document.createElement('style');
        style.textContent = `
            .admin-dashboard {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90vw;
                max-width: 900px;
                max-height: 80vh;
                background: white;
                border-radius: var(--radius);
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                z-index: 5000;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .admin-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                background: var(--primary);
                color: white;
            }
            .admin-header h2 {
                font-size: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .admin-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            .admin-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                padding: 24px;
            }
            .stat-card {
                background: var(--bg-light);
                padding: 20px;
                border-radius: var(--radius-sm);
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .stat-card i {
                font-size: 32px;
                color: var(--primary);
            }
            .stat-value {
                font-size: 24px;
                font-weight: 800;
                display: block;
                color: var(--text-dark);
            }
            .stat-label {
                font-size: 12px;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .admin-table {
                padding: 0 24px 24px;
                overflow-y: auto;
            }
            .admin-table h3 {
                font-size: 16px;
                margin-bottom: 16px;
                color: var(--text-dark);
            }
            .admin-table table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            .admin-table th {
                background: var(--primary-bg);
                color: var(--primary-dark);
                padding: 12px;
                text-align: left;
                font-weight: 600;
            }
            .admin-table td {
                padding: 10px 12px;
                border-bottom: 1px solid rgba(255,107,0,0.06);
            }
            .admin-table tbody tr:hover {
                background: var(--bg-light);
            }
            .admin-footer {
                padding: 16px 24px;
                text-align: center;
                background: var(--bg-light);
                font-size: 13px;
                color: var(--text-muted);
            }
            .admin-footer kbd {
                background: var(--text-dark);
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
            }
            @media (max-width: 768px) {
                .admin-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(dashboard);

        dashboard.querySelector('.admin-close').addEventListener('click', () => dashboard.remove());
    }

    // ========== INIT ==========
    renderProducts();
    updateCart();

    console.log('🧁 Dapu Mulia - Website Ready!');
    console.log('📊 Tekan Ctrl + A untuk buka Dashboard');
}); 

