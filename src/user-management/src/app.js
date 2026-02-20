import {
  fetchUsers,
  saveUsersToSession,
  savePreferences,
  loadPreferences,
} from "./dataService.js";
import { processUsers } from "./logic.js";
import {
  renderUsers,
  setLoading,
  setError,
  restoreControls,
  showUserModal,
  initModal,
} from "./ui.js";

let allUsers = [];

// get input values from DOM
function getControlValues() {
  return {
    searchQuery: document.getElementById("searchInput").value,
    roleFilter: document.getElementById("roleFilter").value,
    statusFilter: document.getElementById("statusFilter").value,
    departmentFilter: document.getElementById("departFilter").value,
  };
}

// display users according to search or filter
function updateView() {
  const prefs = getControlValues();
  savePreferences(prefs);
  const processed = processUsers(allUsers, prefs);
  renderUsers(processed);
}

// start the app
async function init() {
  setLoading(true);
  setError(false);

  initModal();

  try {
    allUsers = await fetchUsers();

    const savedPrefs = loadPreferences();
    restoreControls(savedPrefs);

    updateView();
  } catch (error) {
    console.error("Error loading users:", error);
    setError(true, error.message);
  } finally {
    setLoading(false);
  }

  ["searchInput", "roleFilter", "statusFilter", "departFilter"].forEach(
    (id) => {
      const el = document.getElementById(id);
      el.addEventListener("input", updateView);
      el.addEventListener("change", updateView);
    },
  );

  document.getElementById("usersContainer").addEventListener("click", (e) => {
    const card = e.target.closest("[data-id]");
    if (!card) return;

    const userId = Number(card.dataset.id);
    const user = allUsers.find((u) => u.id === userId);
    if (user) showUserModal(user);
  });
}

init();
