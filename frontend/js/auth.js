// ===== Logique des pages login.html et register.html =====

function getRedirectTarget() {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect") || "index.html";
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    try {
      const data = await apiRequest("/auth/login", { method: "POST", body: { email, password } });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Connexion réussie !");
      window.location.href = getRedirectTarget();
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const errorEl = document.getElementById("registerError");
    errorEl.textContent = "";

    try {
      const data = await apiRequest("/auth/register", { method: "POST", body: { name, email, password } });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Compte créé avec succès !");
      window.location.href = getRedirectTarget();
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
}
