// src/uiController.js
export class UIController {
  constructor(taskManager, { taskListSelector, formSelector, errorSelector }) {
    this.taskManager = taskManager;
    this.taskList = document.querySelector(taskListSelector);
    this.form = document.querySelector(formSelector);
    this.errorDiv = document.querySelector(errorSelector);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTaskActions = this.handleTaskActions.bind(this);

    this.form && this.form.addEventListener("submit", this.handleFormSubmit);
    this.taskList &&
      this.taskList.addEventListener("click", this.handleTaskActions);
  }

  displayTasks(filter = "all") {
    const tasks = this.taskManager.getTasks(filter);
    if (!this.taskList) return;
    this.taskList.innerHTML =
      tasks.length === 0
        ? '<div class="empty-msg">No tasks to show.</div>'
        : tasks.map((t) => this._renderTask(t)).join("");
  }

  _renderTask(task) {
    const { id, title, description, completed, createdAt, updatedAt } = task;
    return `
    <div class="p-6 hover:bg-gray-50 transition-colors">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <h3 class="text-base font-semibold text-gray-900">
            Dashboard analytics
          </h3>
        </div>
        <p class="text-sm text-gray-600 ml-8 mb-3">
          Implement analytics dashboard with charts and real-time data
          visualization
        </p>
        <div class="flex items-center gap-4 ml-8">
          <span class="text-xs text-gray-500 flex items-center gap-1">
            <i class="fa-regular fa-calendar"></i>
            Due Feb 16, 2028
          </span>
          <span
            class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
          >
            Pending
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-4">
        <button
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="fa-regular fa-circle-check text-gray-400"></i>
        </button>
        <button
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="fa-regular fa-pen-to-square text-gray-400"></i>
        </button>
        <button
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="fa-regular fa-trash-can text-gray-400"></i>
        </button>
      </div>
    </div>
  </div>
    `;
  }

  _escape(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  handleFormSubmit(e) {
    e.preventDefault();
    try {
      const { title, description } = this.form.elements;
      if (!title.value.trim()) throw new Error("Title required");
      this.taskManager.createTask({
        title: title.value.trim(),
        description: description.value.trim(),
      });
      this.form.reset();
      this.displayTasks();
      this.displayError("");
    } catch (e) {
      this.displayError(e.message);
    }
  }

  handleTaskActions(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.closest(".task").dataset.id;
    try {
      if (btn.dataset.action === "toggle") {
        this.taskManager.toggleCompleted(id);
      } else if (btn.dataset.action === "delete") {
        this.taskManager.deleteTask(id);
      } else if (btn.dataset.action === "edit") {
        const newTitle = prompt(
          "Edit title:",
          this.taskManager.getTaskById(id).title,
        );
        if (newTitle !== null)
          this.taskManager.updateTask(id, { title: newTitle.trim() });
      }
      this.displayTasks();
    } catch (err) {
      this.displayError(err.message);
    }
  }

  displayError(msg) {
    if (this.errorDiv) {
      this.errorDiv.textContent = msg;
      this.errorDiv.style.display = msg ? "block" : "none";
    }
  }
}
