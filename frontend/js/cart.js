// ===== Logique de la page panier =====

const cartList = document.getElementById("cartList");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryTotal = document.getElementById("summaryTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function updateQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += delta;
  const filtered = item.quantity <= 0 ? cart.filter((i) => i.id !== id) : cart;
  saveCart(filtered);
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();

  if (!cart.length) {
    cartList.innerHTML = `<div class="state-message">🛒 Votre panier est vide. <br><br><a href="index.html" class="btn btn-primary">Découvrir les produits</a></div>`;
    summarySubtotal.textContent = "0.00 €";
    summaryTotal.textContent = "0.00 €";
    return;
  }

  cartList.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-row-info">
        <div class="cart-row-name">${item.name}</div>
        <div class="cart-row-price">${item.price.toFixed(2)} € x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €</div>
      </div>
      <div class="qty-controls">
        <button data-minus="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button data-plus="${item.id}">+</button>
      </div>
      <button class="remove-item" data-remove="${item.id}">Supprimer</button>
    </div>
  `
    )
    .join("");

  cartList.querySelectorAll("[data-minus]").forEach((btn) =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.minus, -1))
  );
  cartList.querySelectorAll("[data-plus]").forEach((btn) =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.plus, 1))
  );
  cartList.querySelectorAll("[data-remove]").forEach((btn) =>
    btn.addEventListener("click", () => removeItem(btn.dataset.remove))
  );

  const total = cartTotal();
  summarySubtotal.textContent = `${total.toFixed(2)} €`;
  summaryTotal.textContent = `${total.toFixed(2)} €`;
}

checkoutBtn.addEventListener("click", () => {
  if (!getCart().length) {
    showToast("Votre panier est vide.", "error");
    return;
  }
  if (!isLoggedIn()) {
    showToast("Connectez-vous pour passer commande.", "error");
    window.location.href = "login.html?redirect=checkout.html";
    return;
  }
  window.location.href = "checkout.html";
});

renderCart();
