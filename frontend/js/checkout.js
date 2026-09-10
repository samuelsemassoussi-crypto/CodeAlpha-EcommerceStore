// ===== Logique de la page checkout =====

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutError = document.getElementById("checkoutError");

function renderSummary() {
  const cart = getCart();
  if (!cart.length) {
    window.location.href = "cart.html";
    return;
  }

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
      <div class="summary-row">
        <span>${item.name} x${item.quantity}</span>
        <span>${(item.price * item.quantity).toFixed(2)} €</span>
      </div>`
    )
    .join("");

  checkoutTotal.textContent = `${cartTotal().toFixed(2)} €`;
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  checkoutError.textContent = "";

  if (!isLoggedIn()) {
    window.location.href = "login.html?redirect=checkout.html";
    return;
  }

  const cart = getCart();
  const shippingAddress = {
    fullName: document.getElementById("fullName").value,
    street: document.getElementById("street").value,
    city: document.getElementById("city").value,
    postalCode: document.getElementById("postalCode").value,
    country: document.getElementById("country").value,
    phone: document.getElementById("phone").value,
  };

  const items = cart.map((i) => ({ productId: i.id, quantity: i.quantity }));

  try {
    const data = await apiRequest("/orders", {
      method: "POST",
      auth: true,
      body: { items, shippingAddress },
    });
    localStorage.removeItem("cart");
    showToast(`Commande confirmée — ${data.order.total.toFixed(2)} €`);
    setTimeout(() => (window.location.href = "index.html"), 1200);
  } catch (err) {
    checkoutError.textContent = err.message;
  }
});

if (!isLoggedIn()) {
  window.location.href = "login.html?redirect=checkout.html";
} else {
  renderSummary();
}
