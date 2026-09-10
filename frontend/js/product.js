// ===== Logique de la page détail produit =====

const productDetailContainer = document.getElementById("productDetailContainer");
const similarGrid = document.getElementById("similarGrid");
const similarTitle = document.getElementById("similarTitle");

let quantity = 1;
let currentProduct = null;

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderDetail(p) {
  currentProduct = p;
  const lowStock = p.stock <= 5;

  productDetailContainer.innerHTML = `
    <div class="product-detail">
      <div class="detail-image">
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <div class="detail-info">
        <span class="product-category">${p.category}</span>
        <h1>${p.name}</h1>
        <p class="product-desc">${p.description}</p>
        <div class="detail-price">
          ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toFixed(2)} €</span> ` : ""}
          ${p.price.toFixed(2)} €
        </div>
        <div class="detail-stock ${lowStock ? "low" : ""}">
          ${p.stock > 0 ? `✅ En stock (${p.stock} disponibles)` : "❌ Rupture de stock"}
        </div>

        <div class="qty-selector">
          <button id="qtyMinus">-</button>
          <span id="qtyValue">1</span>
          <button id="qtyPlus">+</button>
        </div>

        <button id="addToCartBtn" class="btn btn-primary btn-lg btn-block" ${p.stock === 0 ? "disabled" : ""}>
          Ajouter au panier
        </button>
      </div>
    </div>
  `;

  document.getElementById("qtyMinus").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      document.getElementById("qtyValue").textContent = quantity;
    }
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    if (quantity < p.stock) {
      quantity++;
      document.getElementById("qtyValue").textContent = quantity;
    }
  });
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(p, quantity);
  });
}

function similarCard(p) {
  const id = p._id || p.id;
  return `
    <div class="product-card">
      <a href="product.html?id=${id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <div class="product-name">${p.name}</div>
          <div class="product-footer">
            <span class="product-price">${p.price.toFixed(2)} €</span>
          </div>
        </div>
      </a>
    </div>
  `;
}

async function loadSimilar(category, excludeId) {
  try {
    const products = await apiRequest(`/products?category=${encodeURIComponent(category)}`);
    const filtered = products.filter((p) => (p._id || p.id) !== excludeId).slice(0, 4);
    if (filtered.length) {
      similarGrid.innerHTML = filtered.map(similarCard).join("");
      similarTitle.classList.remove("hidden");
    }
  } catch (err) {
    // Silencieux : les produits similaires ne sont pas critiques
  }
}

async function init() {
  const id = getProductId();
  if (!id) {
    productDetailContainer.innerHTML = `<div class="state-message">⚠️ Produit non spécifié.</div>`;
    return;
  }

  try {
    const product = await apiRequest(`/products/${id}`);
    renderDetail(product);
    loadSimilar(product.category, product._id || product.id);
  } catch (err) {
    productDetailContainer.innerHTML = `<div class="state-message">😕 Produit introuvable.</div>`;
  }
}

init();
