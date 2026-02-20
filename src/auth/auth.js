const SESSION_KEY = "12_session";

// Hardcoded demo credentials
const DEMO_USER = {
  email: "admin@mail.com",
  password: "admin123",
  name: "Admin User",
};

export function login(email, password) {
  const isValid =
    email.trim().toLowerCase() === DEMO_USER.email.toLowerCase() &&
    password === DEMO_USER.password;

  if (!isValid) return { ok: false, message: "Invalid email or password." };

  // create a session
  const session = {
    isAuthenticated: true,
    user: { email: DEMO_USER.email, name: DEMO_USER.name },
    createdAt: new Date().toISOString(),
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function logout() {
  // delete the session
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.isAuthenticated) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getSession();
}
