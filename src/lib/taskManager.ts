export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  description?: string;
  projectId?: number;
  order: number;
  createdAt?: string;
}

// Fake data for tasks
export const initialTasks: Task[] = [
  {
    id: 1,
    title: "Loyiha rejasini tuzish",
    status: "todo",
    description: "Yangi loyiha uchun batafsil reja tuzish",
    projectId: 1,
    order: 1,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: 2,
    title: "UI dizaynini yaratish",
    status: "todo",
    description: "Figma da asosiy sahifalar uchun dizayn yaratish",
    projectId: 1,
    order: 2,
    createdAt: "2025-01-01T11:00:00Z",
  },
  {
    id: 3,
    title: "API endpointlarini yozish",
    status: "in-progress",
    description: "Backend uchun zarur API endpointlarini yaratish",
    projectId: 2,
    order: 1,
    createdAt: "2025-01-01T12:00:00Z",
  },
  {
    id: 4,
    title: "Ma'lumotlar bazasini sozlash",
    status: "done",
    description: "PostgreSQL bazasini sozlash va migrationlar",
    projectId: 2,
    order: 1,
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: 5,
    title: "Test yozish",
    status: "done",
    description: "Unit va integration testlar yozish",
    projectId: 3,
    order: 2,
    createdAt: "2025-01-01T08:00:00Z",
  },
  {
    id: 6,
    title: "Deployment sozlash",
    status: "todo",
    description: "CI/CD pipeline va deployment konfiguratsiyasi",
    projectId: 3,
    order: 3,
    createdAt: "2025-01-01T14:00:00Z",
  },
];

// Local task management functions
export class TaskManager {
  private tasks: Task[] = [...initialTasks];
  private listeners: ((tasks: Task[]) => void)[] = [];

  getTasks(): Task[] {
    return [...this.tasks];
  }

  addTask(task: Omit<Task, "id" | "createdAt" | "order">): Task {
    // Find the highest order in the same status
    const tasksInStatus = this.tasks.filter((t) => t.status === task.status);
    const maxOrder =
      tasksInStatus.length > 0
        ? Math.max(...tasksInStatus.map((t) => t.order))
        : 0;

    const newTask: Task = {
      ...task,
      id: Math.max(...this.tasks.map((t) => t.id), 0) + 1,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    this.notifyListeners();
    return newTask;
  }

  updateTask(
    id: number,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.tasks[index] = { ...this.tasks[index], ...updates };
    this.notifyListeners();
    return this.tasks[index];
  }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    this.notifyListeners();
    return true;
  }

  moveTask(taskId: number, newStatus: TaskStatus): boolean {
    return this.updateTask(taskId, { status: newStatus }) !== null;
  }

  reorderTasks(status: TaskStatus, taskIds: number[]): void {
    // Update the order of tasks in the specified status
    taskIds.forEach((taskId, index) => {
      const task = this.tasks.find((t) => t.id === taskId);
      if (task && task.status === status) {
        task.order = index + 1;
      }
    });
    this.notifyListeners();
  }

  subscribe(listener: (tasks: Task[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getTasks()));
  }
}

// Singleton instance
export const taskManager = new TaskManager();
