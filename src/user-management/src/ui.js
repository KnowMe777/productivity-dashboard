// rendering users

export function renderUsers(users) {
  const userContainer = document.getElementById("usersContainer");
  const emptyState = document.getElementById("emptyState");
  const tableWrapper = document.getElementById("tableWrapper");

  if (users.length === 0) {
    userContainer.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }
  tableWrapper.classList.remove("hidden");
  emptyState.classList.add("hidden");

  userContainer.innerHTML = users
    .map(
      ({
        id,
        name,
        email,
        department,
        role,
        joiningDate,
        status,
      }) => `<tr class="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer" data-id=${id}>
  
    <td class="px-6 py-4 text-sm font-medium text-gray-900">
      ${name}
    </td>
  
    <td class="px-6 py-4 text-sm text-gray-500">
      ${email}
    </td>
  
    <td class="px-6 py-4">
      <span class="text-xs font-medium px-3 py-1 rounded-full 
        ${
          role === "admin"
            ? "bg-purple-100 text-purple-700"
            : role === "manager"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
        }">
        ${role}
      </span>
    </td>
  
    <td class="px-6 py-4">
      <span class="text-xs font-medium px-3 py-1 rounded-full 
        ${
          status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }">
        ${status}
      </span>
    </td>
  
    <td class="px-6 py-4 text-right space-x-3">
      <button class="text-gray-500 hover:text-gray-800 transition">
        <i class="fa-regular fa-eye"></i>
      </button>
      <button class="text-red-500 hover:text-red-700 transition">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </td>
  
  </tr>
`,
    )
    .join("");
}

// Populate and open modal
export function showUserModal(user) {
  const { name, email, role, department, joiningDate, status } = user;

  // Avatar initials (e.g. "Sarah Johnson" → "SJ")
  document.getElementById("modalAvatar").textContent = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  document.getElementById("modalName").textContent = name;
  document.getElementById("modalRole").textContent = role;
  document.getElementById("modalEmail").textContent = email;
  document.getElementById("modalDepartment").textContent = department;
  document.getElementById("modalJoiningDate").textContent = joiningDate;

  const statusEl = document.getElementById("modalStatus");
  statusEl.textContent = status.toUpperCase();
  statusEl.className = `text-xs font-medium px-3 py-1 rounded-md w-fit ${
    status === "active"
      ? "bg-green-100 text-green-700 border border-green-400"
      : "bg-red-100 text-red-700 border border-red-400"
  }`;

  document.getElementById("userModal").classList.remove("hidden");
}

// Close modal
export function initModal() {
  const modal = document.getElementById("userModal");

  // Close button
  document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Click outside backdrop to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Escape key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.add("hidden");
  });
}

// show/hide loading
export function setLoading(isLoading) {
  const loader = document.getElementById("loadingState");
  const userContainer = document.getElementById("usersContainer");

  if (!loader || !userContainer) return;

  loader.classList.toggle("hidden", !isLoading);
  userContainer.classList.toggle("hidden", isLoading);
}

// show/hide erroe
export function setError(hasError, message = "Failed to load users.") {
  const errorEl = document.getElementById("errorState");
  errorEl.textContent = ` ${message}`;
  errorEl.classList.toggle("hidden", !hasError);
}

// Restore saved preferences
export function restoreControls({
  search = "",
  role = "",
  status = "",
  department = "",
}) {
  document.getElementById("searchInput").value = search;
  document.getElementById("roleFilter").value = role;
  document.getElementById("departFilter").value = department;
  document.getElementById("statusFilter").value = status;
}
