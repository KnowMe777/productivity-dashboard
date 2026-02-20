import { login, isAuthenticated } from "./auth.js";

if (isAuthenticated()) {
  window.location.replace("./index.html");
}

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formError = document.getElementById("formError");

function show(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hide(el) {
  el.textContent = "";
  el.classList.add("hidden");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  hide(emailError);
  hide(passwordError);
  hide(formError);

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let hasError = false;

  if (!email) {
    show(emailError, "Email is required.");
    hasError = true;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    show(emailError, "Enter a valid email address.");
    hasError = true;
  }

  if (!password) {
    show(passwordError, "Password is required.");
    hasError = true;
  }

  if (hasError) return;

  const result = login(email, password);
  if (!result.ok) {
    show(formError, result.message);
    return;
  }

  window.location.replace("./index.html");
});
