// task class
export class Task {
  constructor({
    id = null,
    title,
    description = "",
    completed = false,
    createdAt = null,
    updatedAt = null,
    completedAt = null,
  } = {}) {
    this.id = id ?? crypto.randomUUID();
    this.title = title.trim();
    this.description = description.trim();
    this.completed = completed;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.updatedAt = updatedAt ?? new Date().toISOString();
    this.completedAt = completedAt ?? null;
  }

  // toggle complete task
  toggleComplete() {
    this.completed = !this.completed;
    this.completedAt = this.completed ? new Date().toISOString() : null;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // update task
  update({ title, description }) {
    if (title !== undefined) this.title = title.trim();
    if (description !== undefined) this.description = description.trim();
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // serialize to plain object for localStorage
  toJSON() {
    const {
      id,
      title,
      description,
      completed,
      createdAt,
      updatedAt,
      completedAt,
    } = this;
    return {
      id,
      title,
      description,
      completed,
      createdAt,
      updatedAt,
      completedAt,
    };
  }

  static fromJSON(data) {
    return new Task({ ...data });
  }

  get formattedDate() {
    return new Date(this.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  get status() {
    return this.completed ? "Completed" : "Pending";
  }
}
