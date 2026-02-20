export class UIController {
  #manager;
  #currentFilter = "all";

  // cached DOM elements
  #tasksList;
  #taskModal;
  #taskForm;
  #newTaskBtn;
  #closeModalX;
  #closeModalBtn;
  #titleInput;
  #descInput;
  #statusCheckbox;
  #totalEl;
  #completedEl;
  #pendingEl;
  #progressEl;
  #titleError;

  constructor(manager) {
    this.#manager = manager;
    this.#bindElements();
    this.#bindEvents();
  }

  // get DOM reference
  #bindElements() {
    this.#tasksList = document.getElementById("tasksList");
    this.#taskModal = document.getElementById("taskModal");
    this.#taskForm = document.getElementById("taskForm");
    this.#newTaskBtn = document.getElementById("newTaskBtn");
    this.#closeModalX = document.getElementById("closeModalX");
    this.#closeModalBtn = document.getElementById("closeModalBtn");
    this.#titleInput = document.getElementById("taskTitle");
    this.#descInput = document.getElementById("taskDesc");
    this.#statusCheckbox = document.getElementById("statusPending");
    this.#totalEl = document.getElementById("total-task");
    this.#completedEl = document.getElementById("completed-task");
    this.#pendingEl = document.getElementById("pending-task");
    this.#progressEl = document.getElementById("progress");
  }

  // attach event listeners
  #bindEvents() {
    this.#newTaskBtn?.addEventListener("click", () => this.#openModal());
    this.#closeModalX?.addEventListener("click", () => this.#closeModal());
    this.#closeModalBtn?.addEventListener("click", () => this.#closeModal());
    this.#taskModal?.addEventListener("click", (e) => {
      if (e.target === this.#taskModal) this.#closeModal();
    });
    this.#taskForm?.addEventListener("submit", (e) =>
      this.#handleFormSubmit(e),
    );
    this.#tasksList?.addEventListener("click", (e) =>
      this.#handleTaskAction(e),
    );
  }

  // open modal for new task or edit task
  #openModal(task = null) {
    if (task) {
      this.#titleInput.value = task.title;
      this.#descInput.value = task.description;
      this.#statusCheckbox.checked = task.completed;
      this.#taskForm.dataset.editId = task.id;
      this.#taskModal.querySelector("h2").textContent = "Edit Task";
    } else {
      this.#taskForm.reset();
      delete this.#taskForm.dataset.editId;
      this.#taskModal.querySelector("h2").textContent = "New Task";
    }
    this.#clearErrors();
    this.#taskModal.classList.remove("hidden");
    this.#titleInput.focus();
  }

  #closeModal() {
    this.#taskModal.classList.add("hidden");
    this.#taskForm.reset();
    delete this.#taskForm.dataset.editId;
    this.#clearErrors();
  }

  // basic form validation
  #validateForm() {
    const title = this.#titleInput.value.trim();
    if (!title) {
      this.#showError("Title is required.");
      return false;
    }
    if (title.length < 3) {
      this.#showError("Title must be at least 3 characters.");
      return false;
    }
    return true;
  }

  // validation error
  #showError(msg) {
    if (!this.#titleError) {
      this.#titleError = document.createElement("p");
      this.#titleError.className = "text-red-500 text-xs mt-1";
      this.#titleInput.parentElement.appendChild(this.#titleError);
    }
    this.#titleError.textContent = msg;
    this.#titleInput.classList.add("border-red-500");
  }

  #clearErrors() {
    if (this.#titleError) this.#titleError.textContent = "";
    this.#titleInput?.classList.remove("border-red-500");
  }

  #handleFormSubmit(e) {
    e.preventDefault();
    this.#clearErrors();
    try {
      if (!this.#validateForm()) return;
      const title = this.#titleInput.value.trim();
      const description = this.#descInput.value.trim();
      const completed = this.#statusCheckbox.checked;
      const editId = this.#taskForm.dataset.editId;
      if (editId) {
        this.#manager.updateTask(editId, { title, description });
        const task = this.#manager.getTaskById(editId);
        if (task && task.completed !== completed) {
          this.#manager.toggleTask(editId);
        }
      } else {
        this.#manager.addTask({ title, description, completed });
      }
      this.#closeModal();
      this.render();
    } catch (err) {
      this.#showError(err.message);
      console.error("Form submit error:", err);
    }
  }

  // handle toggle, edit, delete
  #handleTaskAction(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    try {
      switch (action) {
        case "toggle":
          this.#manager.toggleTask(id);
          this.render();
          break;
        case "edit": {
          const task = this.#manager.getTaskById(id);
          if (task) this.#openModal(task);
          break;
        }
        case "delete":
          this.#manager.deleteTask(id);
          this.render();
          break;
      }
    } catch (err) {
      console.error("Task action error:", err);
    }
  }

  // first render
  render() {
    this.#renderStats();
    this.#renderTasks();
  }

  // render dashboard stats
  #renderStats() {
    const { total, completed, pending, progress } = this.#manager.getStats();
    if (this.#totalEl) this.#totalEl.textContent = total;
    if (this.#completedEl) this.#completedEl.textContent = completed;
    if (this.#pendingEl) this.#pendingEl.textContent = pending;
    if (this.#progressEl) this.#progressEl.textContent = `${progress}%`;
  }

  // render tasks
  #renderTasks() {
    const tasks = this.#manager.getSortedByDate(
      this.#manager.filterTasks(this.#currentFilter),
    );
    if (tasks.length === 0) {
      this.#tasksList.innerHTML = `
        <div class="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
          <i class="fa-regular fa-clipboard text-4xl mb-3 block"></i>
          <p class="text-sm font-medium">No tasks yet. Click <strong>New Task</strong> to get started!</p>
        </div>`;
      return;
    }
    this.#tasksList.innerHTML = tasks
      .map((task) => this.#taskTemplate(task))
      .join("");
  }

  // template for rendering a task
  #taskTemplate({ id, title, description, completed, formattedDate }) {
    const completedStyles = completed ? "bg-green-50/30" : "hover:bg-gray-50";
    const titleStyles = completed
      ? "text-base font-semibold text-gray-900 line-through"
      : "text-base font-semibold text-gray-900";
    const descStyles = completed
      ? "text-sm text-gray-600 mb-3 line-through"
      : "text-sm text-gray-600 mb-3";
    const statusBadge = completed
      ? `<span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>`
      : `<span class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Pending</span>`;
    const checkIcon = completed
      ? `<i class="fa-regular fa-circle-check text-green-600"></i>`
      : `<i class="fa-regular fa-circle-check text-gray-400"></i>`;

    return `
      <div class="p-6 transition-colors ${completedStyles}">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="${titleStyles}">${this.#escapeHTML(title)}</h3>
            </div>
            ${description ? `<p class="${descStyles}">${this.#escapeHTML(description)}</p>` : ""}
            <div class="flex items-center gap-4">
              <span class="text-xs text-gray-500 flex items-center gap-1">
                <i class="fa-regular fa-calendar"></i>
                Created ${formattedDate}
              </span>
              ${statusBadge}
            </div>
          </div>
          <div class="flex items-center gap-2 ml-4">
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-action="toggle" data-id="${id}"
              title="${completed ? "Mark as pending" : "Mark as complete"}">
              ${checkIcon}
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-action="edit" data-id="${id}" title="Edit task">
              <i class="fa-regular fa-pen-to-square text-gray-400"></i>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-action="delete" data-id="${id}" title="Delete task">
              <i class="fa-regular fa-trash-can text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>`;
  }

  #escapeHTML(str) {
    return str.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  setFilter(filter) {
    this.#currentFilter = filter;
    this.render();
  }
}
