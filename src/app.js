import { TaskManager } from "./taskManager.js";
import { UIController } from "./uiController.js";

const newTaskBtn = document.getElementById("newTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalX = document.getElementById("closeModalX");
const closeModalBtn = document.getElementById("closeModalBtn");
const taskForm = document.getElementById("taskForm");

// Open Modal
newTaskBtn.addEventListener("click", () => {
  taskModal.classList.remove("hidden");
});

// Close Modal functions
const hideModal = () => {
  taskModal.classList.add("hidden");
  taskForm.reset(); // Clear form on close
};

closeModalX.addEventListener("click", hideModal);
closeModalBtn.addEventListener("click", hideModal);

// Close on clicking outside the modal box
window.addEventListener("click", (e) => {
  if (e.target === taskModal) hideModal();
});

///g

// Map HTML page to filter
const pageToFilter = {
  "/pages/allTasks.html": "all",
  "/pages/completed.html": "completed",
  "/pages/pending.html": "pending",
};

window.addEventListener("DOMContentLoaded", () => {
  const tm = new TaskManager("tasks");
  const ui = new UIController(tm, {
    taskListSelector: "#task-list",
    formSelector: "#task-form",
    errorSelector: "#error",
  });

  // Determine current filter by location
  const page = location.pathname;
  const filter = pageToFilter[page] || "all";
  ui.displayTasks(filter);
});
