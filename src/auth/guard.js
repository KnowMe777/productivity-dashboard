import { isAuthenticated } from "./auth.js";

export function requireAuth() {
  if (!isAuthenticated()) {
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const loginPath = isInPagesFolder ? "../login.html" : "./login.html";

    window.location.replace(loginPath);
  }
}

requireAuth();
