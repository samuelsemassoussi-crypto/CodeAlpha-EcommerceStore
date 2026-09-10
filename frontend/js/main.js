// ===== Logique de la page d'accueil =====

const productsContainer = document.getElementById("productsContainer");
const categoryList = document.getElementById("categoryList");
const navSearchInput = document.getElementById("navSearchInput");

const CATEGORIES = ["Smartphones", "Ordinateurs", "Accessoires", "Électronique", "Mode"];

let activeCategory = "all";

function renderCategories() {
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "category-pill";
    btn.dataset.category = cat;
    btn.textContent = cat;
    categoryList.appendChild(btn);
  });

  categoryList.querySelectorAll(".category-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryList.querySelectorAll(".category-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      loadProducts();
    });
  });
}

function productCard(p) {
  const id = p._id || p.id;
  return `
    <div class="product-card">
      <a href="product.html?id=${id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </a>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <a href="product.html?id=${id}"><div class="product-name">${p.name}</div></a>
        <div class="product-desc">${p.description}</div>
        <div class="product-footer">
          <div class="price-group">
            ${p.oldPrice ? `<span class="old-price">${p.oldPrice.toFixed(2)} €</span>` : ""}
            <span class="product-price">${p.price.toFixed(2)} €</span>
          </div>
          <button class="btn btn-primary" data-add-id="${id}">Ajouter</button>
        </div>
      </div>
    </div>
  `;
}

function attachAddButtons(products) {
  productsContainer.querySelectorAll("[data-add-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.addId;
      const product = products.find((p) => (p._id || p.id) === id);
      if (product) addToCart(product);
    });
  });
}

async function loadProducts() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("search") || (navSearchInput ? navSearchInput.value.trim() : "");
  if (search && navSearchInput) navSearchInput.value = search;

  productsContainer.innerHTML = `<div class="state-message"><div class="spinner"></div>Chargement des produits...</div>`;

  try {
    const query = new URLSearchParams();
    if (activeCategory !== "all") query.set("category", activeCategory);
    if (search) query.set("search", search);

    const products = await apiRequest(`/products?${query.toString()}`);

    if (!products.length) {
      productsContainer.innerHTML = `<div class="state-message">😕 Aucun produit trouvé pour ces critères.</div>`;
      return;
    }

    productsContainer.innerHTML = products.map(productCard).join("");
    attachAddButtons(products);
  } catch (err) {
    productsContainer.innerHTML = `<div class="state-message">⚠️ Impossible de charger les produits. Vérifie que le serveur et MongoDB sont bien connectés.</div>`;
  }
}

if (navSearchInput) {
  navSearchInput.addEventListener("input", () => {
    clearTimeout(window.__searchTimeout);
    window.__searchTimeout = setTimeout(loadProducts, 350);
  });
}

renderCategories();
loadProducts();
