const API_URL = "/src/user-management/db.json";
// fetching users from mock API
export async function fetchUsers() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const users = Array.isArray(data) ? data : data.users;
    sessionStorage.setItem("users", JSON.stringify(users));

    return users;
  } catch (error) {
    console.log(error);
    throw Error;
  }
}

// get user by id
export async function fetchUserByNameOrEmail(value) {
  const stored = sessionStorage.getItem("users");

  const users = stored ? JSON.parse(stored) : await fetchUsers();
  if (!stored) sessionStorage.setItem("users", JSON.stringify(users));

  const user = users.find(
    (u) =>
      u.name.toLowerCase() === value.toLowerCase() ||
      u.email.toLowerCase() === value.toLowerCase(),
  );

  if (!user) throw new Error(`user with ${value} not found`);

  return user;
}

// save updated list to session storage
export function saveUsersToSession(users) {
  sessionStorage.setItem("users", JSON.stringify(users));
}

// save user preferences
export function savePreferences(prefs = {}) {
  sessionStorage.setItem("user-prefs", JSON.stringify(prefs));
}

// load user preferences
export function loadPreferences(
  defaults = { sort: "name-asc", role: "", status: "", search: "" },
) {
  const stored = sessionStorage.getItem("user-prefs");
  return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
}
