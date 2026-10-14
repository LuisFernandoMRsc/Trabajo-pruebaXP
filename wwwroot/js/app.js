/**
 * FERROMAX PRO - Catálogo de Ferretería & Materiales
 * Frontend Client for ASP.NET Core Web API
 */

// State
let allProducts = [];
let activeCategory = 'Todas';
let searchQuery = '';
let currentSort = 'recientes';
let currentDetailProduct = null;
let searchDebounceTimer = null;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const emptyState = document.getElementById('empty-state');
const resultsCountText = document.getElementById('results-count-text');
const categoryPillsContainer = document.getElementById('category-pills-container');
const inputSearch = document.getElementById('input-search');
const btnClearSearch = document.getElementById('btn-clear-search');
const selectOrden = document.getElementById('select-orden');
const btnReload = document.getElementById('btn-reload-catalog');

// KPI elements
const kpiTotalProductos = document.getElementById('kpi-total-productos');
const kpiTotalCategorias = document.getElementById('kpi-total-categorias');
const kpiValorInventario = document.getElementById('kpi-valor-inventario');
const kpiStockCritico = document.getElementById('kpi-stock-critico');

// Modals
const modalAdd = document.getElementById('modal-add-material');
const btnOpenAdd = document.getElementById('btn-open-modal-add');
const btnEmptyAdd = document.getElementById('btn-empty-add');
const btnCloseAdd = document.getElementById('btn-close-modal-add');
const btnCancelAdd = document.getElementById('btn-cancel-modal-add');
const formAdd = document.getElementById('form-add-material');

const modalDetail = document.getElementById('modal-detail-material');
const btnCloseDetail = document.getElementById('btn-close-modal-detail');
const btnDetailClose = document.getElementById('btn-detail-close');
const btnDetailDelete = document.getElementById('btn-detail-delete');
const detailTitle = document.getElementById('detail-title');
const detailCategorySubtitle = document.getElementById('detail-category-subtitle');
const detailContent = document.getElementById('detail-content');

const toastContainer = document.getElementById('toast-container');

// Fallback images map by category or keywords
const fallbackKeywords = {
    cemento: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    pala: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    martillo: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80',
    pintura: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    arena: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    carretilla: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    acero: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
    amoladora: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&auto=format&fit=crop&q=80',
    herramienta: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80'
};

function getSmartImageUrl(item) {
    if (item.imagenUrl && item.imagenUrl.trim() !== '') {
        return item.imagenUrl.trim();
    }
    const nameLower = (item.nombre || '').toLowerCase();
    for (const key of Object.keys(fallbackKeywords)) {
        if (nameLower.includes(key)) {
            return fallbackKeywords[key];
        }
    }
    // General construction fallback
    return 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80';
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <div class="toast-msg">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// API Calls
async function fetchProductos() {
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (activeCategory && activeCategory !== 'Todas') params.append('categoria', activeCategory);
        if (currentSort) params.append('ordenar', currentSort);

        const url = `/api/productos?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        allProducts = await response.json();
        renderProductos(allProducts);
        updateResultsCount(allProducts.length);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        productGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="color: var(--accent-rose);">
                    <i class="fa-solid fa-circle-exclamation"></i>
                </div>
                <h3>Error al conectar con la API de ASP.NET Core</h3>
                <p>Verifica que el servidor esté en ejecución. (${error.message})</p>
                <button class="btn btn-outline" onclick="fetchProductos()">
                    <i class="fa-solid fa-rotate-right"></i> Reintentar
                </button>
            </div>
        `;
    }
}

async function fetchCategorias() {
    try {
        const response = await fetch('/api/productos/categorias');
        if (response.ok) {
            const categories = await response.json();
            renderCategorias(categories);
        }
    } catch (error) {
        console.warn('Error al cargar categorías:', error);
    }
}

async function fetchResumen() {
    try {
        const response = await fetch('/api/productos/resumen');
        if (response.ok) {
            const data = await response.json();
            kpiTotalProductos.textContent = data.totalProductos;
            kpiTotalCategorias.textContent = data.totalCategorias;
            kpiValorInventario.textContent = formatCurrency(data.valorTotal);
            kpiStockCritico.textContent = data.productosBajoStock;
        }
    } catch (error) {
        console.warn('Error al cargar resumen:', error);
    }
}

// Rendering
function renderCategorias(categories) {
    categoryPillsContainer.innerHTML = '';

    // "Todas" pill
    const allPill = document.createElement('button');
    allPill.className = `pill ${activeCategory === 'Todas' ? 'active' : ''}`;
    allPill.innerHTML = '<i class="fa-solid fa-border-all"></i> Todas';
    allPill.onclick = () => {
        activeCategory = 'Todas';
        updatePillsState();
        fetchProductos();
    };
    categoryPillsContainer.appendChild(allPill);

    categories.forEach(cat => {
        const pill = document.createElement('button');
        pill.className = `pill ${activeCategory === cat ? 'active' : ''}`;
        
        // Icon per category
        let icon = 'fa-tag';
        const lower = cat.toLowerCase();
        if (lower.includes('construc')) icon = 'fa-trowel-bricks';
        else if (lower.includes('herramienta')) icon = 'fa-wrench';
        else if (lower.includes('pintura')) icon = 'fa-fill-drip';
        else if (lower.includes('eléctric')) icon = 'fa-bolt';
        else if (lower.includes('plomer')) icon = 'fa-faucet-drip';
        
        pill.innerHTML = `<i class="fa-solid ${icon}"></i> ${cat}`;
        pill.onclick = () => {
            activeCategory = cat;
            updatePillsState();
            fetchProductos();
        };
        categoryPillsContainer.appendChild(pill);
    });
}

function updatePillsState() {
    const pills = categoryPillsContainer.querySelectorAll('.pill');
    pills.forEach(p => {
        const text = p.textContent.trim();
        if (text === activeCategory || (activeCategory === 'Todas' && text.includes('Todas'))) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
}

function updateResultsCount(count) {
    if (count === 0) {
        resultsCountText.textContent = 'No se encontraron resultados';
    } else {
        const catText = activeCategory === 'Todas' ? 'el catálogo' : `"${activeCategory}"`;
        resultsCountText.textContent = `Mostrando ${count} producto${count !== 1 ? 's' : ''} en ${catText}`;
    }
}

function renderProductos(products) {
    productGrid.innerHTML = '';

    if (!products || products.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    products.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imgUrl = getSmartImageUrl(item);
        const isLowStock = item.stock <= 5;

        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${imgUrl}" alt="${item.nombre}" class="card-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'card-img-placeholder\\'><i class=\\'fa-solid fa-hammer\\'></i><span>${item.categoria}</span></div>'">
                <span class="card-badge-category">${item.categoria}</span>
                <span class="card-badge-stock ${isLowStock ? 'low-stock' : ''}">
                    ${isLowStock ? '<i class="fa-solid fa-triangle-exclamation"></i> ' : ''}Stock: ${item.stock} ${item.unidadMedida || 'u.'}
                </span>
            </div>

            <div class="card-body">
                <h4 class="card-title" title="${item.nombre}">${item.nombre}</h4>
                <p class="card-desc" title="${item.descripcion}">${item.descripcion}</p>

                <div class="card-footer-info">
                    <div class="card-price-box">
                        <span class="card-price-label">Precio</span>
                        <div class="card-price-val">
                            ${formatCurrency(item.precio)}
                            <span class="card-price-unit">/ ${item.unidadMedida || 'unidad'}</span>
                        </div>
                    </div>

                    <div class="card-actions">
                        <button class="btn-card-icon btn-view" title="Ver detalles" data-id="${item.id}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-card-icon btn-delete" title="Eliminar material" data-id="${item.id}" data-name="${item.nombre}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Card action listeners
        card.querySelector('.btn-view').onclick = () => openDetailModal(item);
        card.querySelector('.btn-delete').onclick = (e) => {
            e.stopPropagation();
            confirmDelete(item.id, item.nombre);
        };

        productGrid.appendChild(card);
    });
}

// Modal Details
function openDetailModal(product) {
    currentDetailProduct = product;
    detailTitle.textContent = product.nombre;
    detailCategorySubtitle.textContent = `Categoría: ${product.categoria} | ID: #${product.id}`;

    const imgUrl = getSmartImageUrl(product);
    const totalVal = product.precio * product.stock;

    detailContent.innerHTML = `
        <img src="${imgUrl}" alt="${product.nombre}" class="detail-preview-img" onerror="this.style.display='none'">
        
        <div class="detail-info-row">
            <div>
                <span class="detail-box-label">Precio Unitario</span>
                <div class="detail-box-val highlight">${formatCurrency(product.precio)}</div>
                <small style="color: var(--text-dim);">por ${product.unidadMedida || 'unidad'}</small>
            </div>
            <div>
                <span class="detail-box-label">Stock en Bodega</span>
                <div class="detail-box-val">${product.stock} ${product.unidadMedida || 'u.'}</div>
                <small style="color: ${product.stock <= 5 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                    ${product.stock <= 5 ? 'Stock Crítico' : 'Disponible'}
                </small>
            </div>
            <div>
                <span class="detail-box-label">Valor en Inventario</span>
                <div class="detail-box-val">${formatCurrency(totalVal)}</div>
                <small style="color: var(--text-dim);">Stock x Precio</small>
            </div>
        </div>

        <div class="detail-desc-box">
            <h5 style="color: #fff; margin-bottom: 0.4rem; font-size: 0.9rem;">
                <i class="fa-solid fa-align-left"></i> Descripción del Material
            </h5>
            <p>${product.descripcion}</p>
        </div>
    `;

    modalDetail.classList.add('active');
}

function closeDetailModal() {
    modalDetail.classList.remove('active');
    currentDetailProduct = null;
}

// Create Product Form Submission
formAdd.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('form-nombre').value.trim();
    const categoria = document.getElementById('form-categoria').value.trim();
    const unidadMedida = document.getElementById('form-unidad').value;
    const precio = parseFloat(document.getElementById('form-precio').value);
    const stock = parseInt(document.getElementById('form-stock').value, 10);
    const descripcion = document.getElementById('form-descripcion').value.trim();
    const imagenUrl = document.getElementById('form-imagen').value.trim();

    if (!nombre || isNaN(precio) || isNaN(stock) || !descripcion) {
        showToast('Por favor completa los campos obligatorios.', 'error');
        return;
    }

    const payload = {
        nombre,
        categoria: categoria || 'Construcción',
        unidadMedida,
        precio,
        stock,
        descripcion,
        imagenUrl: imagenUrl || null
    };

    const submitBtn = document.getElementById('btn-submit-add');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const nuevo = await response.json();
            showToast(`¡Material "${nuevo.nombre}" agregado con éxito!`, 'success');
            formAdd.reset();
            closeAddModal();
            // Refresh
            await fetchProductos();
            await fetchCategorias();
            await fetchResumen();
        } else {
            const errData = await response.json();
            showToast('Error al agregar el material: ' + JSON.stringify(errData), 'error');
        }
    } catch (error) {
        showToast('Error de red al guardar producto: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Delete Product
async function confirmDelete(id, name) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${name}" del catálogo?`)) {
        try {
            const response = await fetch(`/api/productos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showToast(`Producto "${name}" eliminado correctamente.`, 'info');
                if (modalDetail.classList.contains('active')) {
                    closeDetailModal();
                }
                await fetchProductos();
                await fetchCategorias();
                await fetchResumen();
            } else {
                showToast('Error al eliminar el producto', 'error');
            }
        } catch (error) {
            showToast('Error al conectar con el servidor: ' + error.message, 'error');
        }
    }
}

// Modal open/close handlers
function openAddModal() {
    modalAdd.classList.add('active');
    document.getElementById('form-nombre').focus();
}

function closeAddModal() {
    modalAdd.classList.remove('active');
}

btnOpenAdd.onclick = openAddModal;
btnEmptyAdd.onclick = openAddModal;
btnCloseAdd.onclick = closeAddModal;
btnCancelAdd.onclick = closeAddModal;

btnCloseDetail.onclick = closeDetailModal;
btnDetailClose.onclick = closeDetailModal;
btnDetailDelete.onclick = () => {
    if (currentDetailProduct) {
        confirmDelete(currentDetailProduct.id, currentDetailProduct.nombre);
    }
};

// Preset image tags click
document.querySelectorAll('.preset-tag').forEach(btn => {
    btn.onclick = () => {
        const url = btn.getAttribute('data-url');
        document.getElementById('form-imagen').value = url;
    };
});

// Search input debounce
inputSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    btnClearSearch.style.display = searchQuery ? 'block' : 'none';

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        fetchProductos();
    }, 280);
});

btnClearSearch.onclick = () => {
    inputSearch.value = '';
    searchQuery = '';
    btnClearSearch.style.display = 'none';
    fetchProductos();
};

// Sort selection
selectOrden.addEventListener('change', (e) => {
    currentSort = e.target.value;
    fetchProductos();
});

// Reload button
btnReload.onclick = () => {
    btnReload.querySelector('i').classList.add('fa-spin');
    Promise.all([fetchProductos(), fetchCategorias(), fetchResumen()]).finally(() => {
        setTimeout(() => {
            btnReload.querySelector('i').classList.remove('fa-spin');
        }, 500);
    });
};

// Close modal on click outside backdrop
window.addEventListener('click', (e) => {
    if (e.target === modalAdd) closeAddModal();
    if (e.target === modalDetail) closeDetailModal();
});

// Close modal on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAddModal();
        closeDetailModal();
    }
});

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    fetchProductos();
    fetchCategorias();
    fetchResumen();
});
