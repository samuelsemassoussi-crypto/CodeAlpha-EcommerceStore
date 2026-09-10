// ===== Fichier commun chargé sur toutes les pages =====
const API_BASE = "/api";

// ---------- API ----------
async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Une erreur est survenue.");
  return data;
}

// ---------- Toast ----------
function showToast(message, type = "success") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => toast.classList.add("hidden"), 2500);
}

// ---------- Auth helpers ----------
function getCurrentUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}
function isLoggedIn() {
  return !!localStorage.getItem("token");
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// ---------- Cart helpers (localStorage) ----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === product._id || i.id === product.id);
  const id = product._id || product.id;
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name: product.name, price: product.price, image: product.image, quantity });
  }
  saveCart(cart);
  showToast(`${product.name} ajouté au panier`);
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = count));
}
function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

// ---------- Navbar (injectée dans toutes les pages) ----------
function initNavbar() {
  const user = getCurrentUser();
  const loginLink = document.getElementById("navLoginLink");
  const logoutBtn = document.getElementById("navLogoutBtn");
  const greeting = document.getElementById("navGreeting");

  if (user) {
    if (loginLink) loginLink.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (greeting) {
      greeting.textContent = `Bonjour, ${user.name}`;
      greeting.classList.remove("hidden");
    }
  } else {
    if (loginLink) loginLink.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (greeting) greeting.classList.add("hidden");
  }

  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // Menu mobile
  const menuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileNavActions");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  }

  // Barre de recherche -> redirige vers l'accueil avec le terme
  const searchInput = document.getElementById("navSearchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        window.location.href = `index.html?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }

  updateCartCount();
}

document.addEventListener("DOMContentLoaded", initNavbar);
