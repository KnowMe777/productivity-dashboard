import { logout } from "./auth.js";

export function handleLogout() {
  logout();

  const isInPagesFolder = window.location.pathname.includes("/pages/");
  const loginPath = isInPagesFolder ? "../login.html" : "./login.html";
  window.location.replace(loginPath);
}

document.getElementById("logoutBtn")?.addEventListener("click", handleLogout);
