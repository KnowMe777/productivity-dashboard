// filter user by name or email
export function createSearchFilter(query = "") {
  const q = query.toLowerCase().trim();
  return (user) => {
    const { name, email } = user;
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  };
}

// filter user by role
export function createRoleFilter(role = "") {
  return (user) => role === "" || user.role === role;
}
// filter user by department
export function createDepartmentFilter(department = "") {
  return (user) => department === "" || user.department === department;
}

// filter user by status
export function createStatusFilter(status = "") {
  return (user) => status === "" || user.status === status;
}

// apply all filters
export function processUsers(
  users,
  { searchQuery, roleFilter, statusFilter, departmentFilter },
) {
  // Drop this temporarily inside updateView() or processUsers()
  console.log("Filter value:", JSON.stringify(statusFilter));
  console.log("Sample user status:", JSON.stringify(users[0]?.status));
  return users
    .filter(createSearchFilter(searchQuery))
    .filter(createRoleFilter(roleFilter))
    .filter(createDepartmentFilter(departmentFilter))
    .filter(createStatusFilter(statusFilter));
}
