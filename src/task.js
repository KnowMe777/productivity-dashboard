// src/task.js
export class Task {
  constructor({
    id,
    title,
    description = "",
    completed = false,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || this.createdAt;
  }

  update(fields) {
    // Destructure fields
    const { title, description, completed } = fields;
    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (completed !== undefined) this.completed = completed;
    this.updatedAt = new Date().toISOString();
  }
}
