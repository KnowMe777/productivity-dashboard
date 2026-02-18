// src/taskManager.js
import { Task } from "./task.js";

export class TaskManager {
  constructor(storageKey = "tasks") {
    this.storageKey = storageKey;
    this.tasks = this._loadTasks();
  }

  _loadTasks() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      return JSON.parse(data).map((obj) => new Task(obj));
    } catch (e) {
      console.error("Load error:", e);
      return [];
    }
  }

  _saveTasks() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    } catch (e) {
      console.error("Save error:", e);
    }
  }

  createTask({ title, description = "" }) {
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const task = new Task({ id, title, description });
    this.tasks = [...this.tasks, task];
    this._saveTasks();
    return task;
  }

  getTasks(filter = "all") {
    switch (filter) {
      case "completed":
        return this.tasks.filter((t) => t.completed);
      case "pending":
        return this.tasks.filter((t) => !t.completed);
      default:
        return [...this.tasks];
    }
  }

  getTaskById(id) {
    return this.tasks.find((t) => t.id === id);
  }

  updateTask(id, fields) {
    const task = this.getTaskById(id);
    if (!task) throw new Error("Task not found");
    task.update(fields);
    this._saveTasks();
    return task;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this._saveTasks();
  }

  toggleCompleted(id) {
    const task = this.getTaskById(id);
    if (!task) throw new Error("Task not found");
    task.update({ completed: !task.completed });
    this._saveTasks();
    return task;
  }
}
