import { TaskManager } from "./taskManager.js";
import { UIController } from "./uiController.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    const tm = new TaskManager("tasks");
    const ui = new UIController(tm);

    const filename = location.pathname.split("/").pop();

    const pageToFilter = {
      "allTasks.html": "all",
      "completed.html": "completed",
      "pending.html": "pending",
    };

    const filter = pageToFilter[filename] ?? "all";
    ui.setFilter(filter);
  } catch (err) {
    console.error("TaskFlow init error:", err);
  }
});
