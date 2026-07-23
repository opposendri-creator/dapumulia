// ========== DAPU MULIA - MAIN JAVASCRIPT ==========

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========== LOAD PRODUCTS (with localStorage override) ==========
    let products = [];
    (function loadProducts() {
        const saved = localStorage.getItem('dapuMuliaProducts');
        if (saved) {
            try { products = JSON.parse(saved); } catch(e) { products = [...baseProducts]; }
        } else {
            products = [...baseProducts];
        }
    })();

    function saveProducts() {
        localStorage.setItem('dapuMuliaProducts', JSON.stringify(products));
    }

    // ========== STATE ==========
    const state = {
        cart: JSON.parse(localStorage.getItem('dapuMuliaCart')) || [],
        currentFilter: 'all',
        isCartOpen: false,
        editingProductId: null
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
        navbar: $('.navbar'),
        adminBtn: $('#adminBtn')
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
    function showToast(message, isError) {
        dom.toastMessage.textContent = message;
        dom.toast.style.background = isError ? 'var(--accent)' : 'var(--bg-dark)';
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

    // ========== ADMIN PANEL (FULL CRUD) ==========
    dom.adminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAdminPanel();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'a' && e.ctrlKey) toggleAdminPanel();
    });

    function toggleAdminPanel() {
        const existing = document.querySelector('.admin-panel');
        if (existing) {
            existing.remove();
            document.querySelector('.admin-overlay')?.remove();
            return;
        }
        openAdminPanel();
    }

    function openAdminPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'admin-overlay';
        overlay.addEventListener('click', toggleAdminPanel);
        document.body.appendChild(overlay);

        const panel = document.createElement('div');
        panel.className = 'admin-panel';
        const totalP = products.length;
        const totalCat = [...new Set(products.map(p => p.category))].length;
        const totalBest = products.filter(p => p.bestseller).length;
        const totalVal = products.reduce((s, p) => s + p.price, 0);

        panel.innerHTML = `
            <div class="admin-panel-header">
                <h2><i class="fas fa-cog"></i> Kelola Produk (${totalP})</h2>
                <div class="admin-header-actions">
                    <button class="admin-btn-small" id="exportDataBtn"><i class="fas fa-download"></i> Export data.js</button>
                    <button class="admin-btn-small admin-btn-danger" id="resetDataBtn"><i class="fas fa-undo"></i> Reset</button>
                    <button class="admin-close-btn" id="adminCloseBtn"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="admin-panel-stats">
                <div class="admin-stat-card"><i class="fas fa-box"></i><div><span class="stat-val">${totalP}</span><span class="stat-lbl">Produk</span></div></div>
                <div class="admin-stat-card"><i class="fas fa-tags"></i><div><span class="stat-val">${totalCat}</span><span class="stat-lbl">Kategori</span></div></div>
                <div class="admin-stat-card"><i class="fas fa-crown"></i><div><span class="stat-val">${totalBest}</span><span class="stat-lbl">Best Seller</span></div></div>
                <div class="admin-stat-card"><i class="fas fa-money-bill"></i><div><span class="stat-val">${formatRupiah(totalVal)}</span><span class="stat-lbl">Total Nilai</span></div></div>
            </div>
            <div class="admin-panel-toolbar">
                <button class="btn btn-primary" id="addProductBtn"><i class="fas fa-plus"></i> Tambah Produk</button>
                <div class="admin-search"><i class="fas fa-search"></i><input type="text" id="adminSearch" placeholder="Cari produk..."></div>
            </div>
            <div class="admin-panel-table">
                <table><thead><tr><th>Gambar</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Berat</th><th>Best</th><th>Aksi</th></tr></thead>
                    <tbody id="adminTableBody"></tbody>
                </table>
            </div>
            <div class="admin-panel-footer"><p>💡 Klik <i class="fas fa-edit"></i> edit | <i class="fas fa-trash"></i> hapus | Data tersimpan otomatis di browser</p></div>
        `;
        document.body.appendChild(panel);
        renderAdminTable();
        document.getElementById('adminCloseBtn').addEventListener('click', toggleAdminPanel);
        document.getElementById('addProductBtn').addEventListener('click', () => openEditModal(null));
        document.getElementById('exportDataBtn').addEventListener('click', exportDataJs);
        document.getElementById('resetDataBtn').addEventListener('click', resetData);
        document.getElementById('adminSearch').addEventListener('input', function() { renderAdminTable(this.value); });
        injectAdminStyles();
    }

    function renderAdminTable(search = '') {
        const tbody = document.getElementById('adminTableBody');
        let filtered = products;
        if (search) {
            const q = search.toLowerCase();
            filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }
        tbody.innerHTML = filtered.map(p => `
            <tr>
                <td><img src="${p.image}" alt="" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"></td>
                <td><strong>${p.name}</strong></td>
                <td>${getCategoryLabel(p.category)}</td>
                <td>${formatRupiah(p.price)}</td>
                <td>${p.weight}</td>
                <td>${p.bestseller ? '✅' : '❌'}</td>
                <td>
                    <button class="admin-action-btn edit-btn" data-id="${p.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="admin-action-btn delete-btn" data-id="${p.id}" title="Hapus"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id))));
        tbody.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id))));
    }

    function openEditModal(productId) {
        const isEdit = productId !== null && productId !== undefined;
        const product = isEdit ? products.find(p => p.id === productId) : null;
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header"><h3>${isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h3><button class="modal-close"><i class="fas fa-times"></i></button></div>
                <div class="admin-modal-body">
                    <div class="form-row">
                        <div class="form-group"><label>Nama Produk *</label><input type="text" id="editName" value="${isEdit ? product.name : ''}" placeholder="Nastar Keju"></div>
                        <div class="form-group"><label>Kategori *</label>
                            <select id="editCategory">
                                ${['kue-kering','kue-basah','roti','snack','minuman'].map(c =>
                                    `<option value="${c}" ${isEdit && product.category === c ? 'selected' : ''}>${getCategoryLabel(c)}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Harga (Rp) *</label><input type="number" id="editPrice" value="${isEdit ? product.price : ''}" placeholder="45000" min="0"></div>
                        <div class="form-group"><label>Berat *</label><input type="text" id="editWeight" value="${isEdit ? product.weight : ''}" placeholder="250g"></div>
                    </div>
                    <div class="form-group"><label>URL Gambar *</label><input type="url" id="editImage" value="${isEdit ? product.image : ''}" placeholder="https://..."><small>URL gambar online (Unsplash, Google Images, dll)</small></div>
                    <div class="form-group"><label>Deskripsi *</label><textarea id="editDescription" rows="3" placeholder="Deskripsi produk...">${isEdit ? product.description : ''}</textarea></div>
                    <div class="form-row">
                        <div class="form-group"><label>Rating (1-5)</label><input type="number" id="editRating" value="${isEdit ? product.rating : 5}" min="1" max="5"></div>
                        <div class="form-group" style="display:flex;align-items:center;gap:12px;padding-top:20px;">
                            <label style="margin:0;cursor:pointer;"><input type="checkbox" id="editBestseller" ${isEdit && product.bestseller ? 'checked' : ''}> Best Seller</label>
                        </div>
                    </div>
                </div>
                <div class="admin-modal-footer">
                    <button class="btn btn-secondary" id="modalCancelBtn">Batal</button>
                    <button class="btn btn-primary" id="modalSaveBtn"><i class="fas fa-save"></i> ${isEdit ? 'Simpan' : 'Tambah'}</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        const closeModal = () => modal.remove();
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        document.getElementById('modalSaveBtn').addEventListener('click', () => {
            const name = document.getElementById('editName').value.trim();
            const category = document.getElementById('editCategory').value;
            const price = parseInt(document.getElementById('editPrice').value);
            const weight = document.getElementById('editWeight').value.trim();
            const image = document.getElementById('editImage').value.trim();
            const description = document.getElementById('editDescription').value.trim();
            const rating = parseInt(document.getElementById('editRating').value) || 5;
            const bestseller = document.getElementById('editBestseller').checked;
            if (!name || !price || !weight || !image || !description) {
                showToast('Semua field harus diisi!', true);
                return;
            }
            if (isEdit) {
                const idx = products.findIndex(p => p.id === productId);
                if (idx !== -1) {
                    products[idx] = { ...products[idx], name, category, price, weight, image, description, rating, bestseller };
                    saveProducts();
                    showToast(`"${name}" berhasil diperbarui!`);
                }
            } else {
                const newId = Math.max(...products.map(p => p.id), 0) + 1;
                products.push({ id: newId, name, category, price, weight, image, description, rating, bestseller });
                saveProducts();
                showToast(`"${name}" berhasil ditambahkan!`);
            }
            closeModal();
            renderProducts(state.currentFilter);
            if (document.getElementById('adminSearch')) renderAdminTable(document.getElementById('adminSearch').value);
            // Update header count
            const hdr = document.querySelector('.admin-panel-header h2');
            if (hdr) hdr.textContent = `Kelola Produk (${products.length})`;
        });
    }

    function deleteProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const confirm = document.createElement('div');
        confirm.className = 'admin-modal';
        confirm.innerHTML = `
            <div class="admin-modal-content" style="max-width:400px;">
                <div class="admin-modal-header" style="background:var(--accent);"><h3><i class="fas fa-exclamation-triangle"></i> Hapus Produk</h3></div>
                <div class="admin-modal-body" style="text-align:center;padding:32px;">
                    <i class="fas fa-trash-alt" style="font-size:48px;color:var(--accent);margin-bottom:16px;"></i>
                    <p style="font-size:16px;font-weight:600;margin-bottom:8px;">Yakin ingin menghapus?</p>
                    <p style="color:var(--text-muted);">"${product.name}" akan dihapus permanen.</p>
                </div>
                <div class="admin-modal-footer" style="justify-content:center;gap:12px;">
                    <button class="btn btn-secondary" id="confirmNo">Batal</button>
                    <button class="btn btn-primary" id="confirmYes" style="background:var(--accent);">Ya, Hapus</button>
                </div>
            </div>`;
        document.body.appendChild(confirm);
        document.getElementById('confirmNo').addEventListener('click', () => confirm.remove());
        document.getElementById('confirmYes').addEventListener('click', () => {
            products = products.filter(p => p.id !== productId);
            state.cart = state.cart.filter(c => c.id !== productId);
            saveProducts();
            updateCart();
            confirm.remove();
            showToast(`"${product.name}" berhasil dihapus`);
            renderProducts(state.currentFilter);
            if (document.getElementById('adminSearch')) renderAdminTable(document.getElementById('adminSearch').value);
            const hdr = document.querySelector('.admin-panel-header h2');
            if (hdr) hdr.textContent = `Kelola Produk (${products.length})`;
        });
        confirm.addEventListener('click', (e) => { if (e.target === confirm) confirm.remove(); });
    }

    function exportDataJs() {
        const content = '// Data Produk Dapu Mulia - Auto Generated\n// Last updated: ' + new Date().toLocaleString('id-ID') + '\nconst baseProducts = ' + JSON.stringify(products, null, 4) + ';\n';
        const blob = new Blob([content], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'data.js';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ File data.js di-download! Upload ke GitHub ya.');
    }

    function resetData() {
        const confirm = document.createElement('div');
        confirm.className = 'admin-modal';
        confirm.innerHTML = `
            <div class="admin-modal-content" style="max-width:400px;">
                <div class="admin-modal-header" style="background:var(--accent);"><h3><i class="fas fa-exclamation-triangle"></i> Reset Data</h3></div>
                <div class="admin-modal-body" style="text-align:center;padding:32px;">
                    <i class="fas fa-undo" style="font-size:48px;color:var(--accent);margin-bottom:16px;"></i>
                    <p style="font-size:16px;font-weight:600;margin-bottom:8px;">Yakin mau reset data?</p>
                    <p style="color:var(--text-muted);">Semua perubahan akan hilang dan kembali ke data awal!</p>
                </div>
                <div class="admin-modal-footer" style="justify-content:center;gap:12px;">
                    <button class="btn btn-secondary" id="resetNo">Batal</button>
                    <button class="btn btn-primary" id="resetYes" style="background:var(--accent);">Ya, Reset</button>
                </div>
            </div>`;
        document.body.appendChild(confirm);
        document.getElementById('resetNo').addEventListener('click', () => confirm.remove());
        document.getElementById('resetYes').addEventListener('click', () => {
            products = [...baseProducts];
            localStorage.removeItem('dapuMuliaProducts');
            saveProducts();
            confirm.remove();
            showToast('✅ Data di-reset ke default');
            renderProducts(state.currentFilter);
            const si = document.getElementById('adminSearch');
            if (si) { si.value = ''; renderAdminTable(''); }
            toggleAdminPanel();
            setTimeout(() => openAdminPanel(), 300);
        });
        confirm.addEventListener('click', (e) => { if (e.target === confirm) confirm.remove(); });
    }

    function injectAdminStyles() {
        if (document.getElementById('adminPanelStyles')) return;
        const s = document.createElement('style');
        s.id = 'adminPanelStyles';
        s.textContent = `
            .admin-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:5000;animation:fadeIn 0.2s ease}
            .admin-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:95vw;max-width:1100px;max-height:90vh;background:#fff;border-radius:16px;z-index:5001;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.3s ease}
            .admin-panel-header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;background:var(--primary);color:#fff;border-radius:16px 16px 0 0}
            .admin-panel-header h2{font-size:20px;display:flex;align-items:center;gap:10px}
            .admin-header-actions{display:flex;align-items:center;gap:8px}
            .admin-btn-small{padding:8px 14px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;transition:var(--transition);font-family:var(--font);background:rgba(255,255,255,0.2);color:#fff}
            .admin-btn-small:hover{background:rgba(255,255,255,0.3)}
            .admin-btn-danger{background:var(--accent)}
            .admin-btn-danger:hover{background:#c62828}
            .admin-close-btn{background:0;border:none;color:#fff;font-size:24px;cursor:pointer;padding:4px 8px;transition:var(--transition)}
            .admin-close-btn:hover{transform:rotate(90deg)}
            .admin-panel-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:16px 24px;background:var(--bg-light)}
            .admin-stat-card{background:#fff;padding:14px;border-radius:10px;display:flex;align-items:center;gap:12px;border:1px solid rgba(255,107,0,0.06)}
            .admin-stat-card i{font-size:28px;color:var(--primary)}
            .stat-val{font-size:20px;font-weight:800;display:block;color:var(--text-dark)}
            .stat-lbl{font-size:11px;color:var(--text-muted);text-transform:uppercase}
            .admin-panel-toolbar{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;gap:16px}
            .admin-search{display:flex;align-items:center;gap:8px;background:var(--bg-light);padding:8px 16px;border-radius:50px;border:1px solid rgba(255,107,0,0.1)}
            .admin-search input{border:none;background:0;outline:none;font-size:14px;min-width:200px;font-family:var(--font)}
            .admin-search i{color:var(--text-muted)}
            .admin-panel-table{flex:1;overflow-y:auto;padding:0 24px}
            .admin-panel-table table{width:100%;border-collapse:collapse;font-size:13px}
            .admin-panel-table th{background:var(--primary-bg);color:var(--primary-dark);padding:12px;text-align:left;font-weight:600;position:sticky;top:0;z-index:1}
            .admin-panel-table td{padding:10px 12px;border-bottom:1px solid rgba(255,107,0,0.06);vertical-align:middle}
            .admin-panel-table tbody tr:hover{background:var(--bg-light)}
            .admin-action-btn{padding:6px 10px;border:none;border-radius:6px;cursor:pointer;transition:var(--transition);font-size:14px}
            .edit-btn{background:rgba(255,107,0,0.1);color:var(--primary)}
            .edit-btn:hover{background:var(--primary);color:#fff}
            .delete-btn{background:rgba(255,0,0,0.1);color:var(--accent)}
            .delete-btn:hover{background:var(--accent);color:#fff}
            .admin-panel-footer{padding:12px 24px;text-align:center;background:var(--bg-light);font-size:13px;color:var(--text-muted);border-radius:0 0 16px 16px}
            .admin-panel-footer i{color:var(--primary)}
            .admin-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:6000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease}
            .admin-modal-content{background:#fff;border-radius:16px;width:95vw;max-width:600px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.3s ease}
            .admin-modal-header{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:var(--primary);color:#fff;border-radius:16px 16px 0 0}
            .admin-modal-header h3{font-size:18px}
            .modal-close{background:0;border:none;color:#fff;font-size:24px;cursor:pointer}
            .admin-modal-body{padding:24px}
            .admin-modal-footer{display:flex;justify-content:flex-end;gap:12px;padding:16px 24px;background:var(--bg-light);border-radius:0 0 16px 16px}
            .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
            .form-group{margin-bottom:16px}
            .form-group label{display:block;font-size:13px;font-weight:600;color:var(--text-dark);margin-bottom:6px}
            .form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 14px;border:1px solid rgba(255,107,0,0.15);border-radius:8px;font-size:14px;font-family:var(--font);transition:var(--transition);background:#fff}
            .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--primary);outline:none;box-shadow:0 0 0 3px rgba(255,107,0,0.1)}
            .form-group small{display:block;font-size:11px;color:var(--text-muted);margin-top:4px}
            @media(max-width:768px){.admin-panel{width:98vw;max-height:95vh}.admin-panel-stats{grid-template-columns:repeat(2,1fr)}.form-row{grid-template-columns:1fr}.admin-panel-toolbar{flex-direction:column}.admin-search input{min-width:100px}.admin-header-actions{flex-wrap:wrap}.admin-btn-small{font-size:11px;padding:6px 10px}}
            @keyframes fadeIn{from{opacity:0}to{opacity:1}}
            @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        `;
        document.head.appendChild(s);
    }

    // ========== INIT ==========
    renderProducts();
    updateCart();

    console.log('🧁 Dapu Mulia - Website Ready!');
    console.log('⚙️ Klik ikon gear atau Ctrl+A untuk kelola produk');
});

