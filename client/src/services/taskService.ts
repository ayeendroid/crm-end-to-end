import api from "./api";

// Types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  relatedTo?: {
    type: "customer" | "lead" | "deal" | "activity";
    id: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: "todo" | "in-progress" | "blocked" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  completedDate?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags: string[];
  checklist: {
    item: string;
    completed: boolean;
  }[];
  reminders: string[];
  isRecurring: boolean;
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignedTo?: string;
  relatedToType?: string;
  relatedToId?: string;
  overdue?: boolean;
  dueToday?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface TaskResponse {
  success: boolean;
  data: Task;
}

export interface TaskStatsResponse {
  success: boolean;
  data: {
    byStatus: { _id: string; count: number }[];
    overdue: number;
    dueToday: number;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  relatedTo?: {
    type: string;
    id: string;
  };
  assignedTo: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  estimatedMinutes?: number;
  tags?: string[];
  checklist?: { item: string; completed: boolean }[];
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: string;
    interval: number;
    endDate?: string;
  };
}

// API Functions
export const getTasks = async (
  filters?: TaskFilters
): Promise<TasksResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const response = await api.get(`/tasks?${params.toString()}`);
  return response.data;
};

export const getTask = async (id: string): Promise<TaskResponse> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (
  data: CreateTaskData
): Promise<TaskResponse> => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<CreateTaskData>
): Promise<TaskResponse> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (
  id: string
): Promise<{ success: boolean; data: { message: string } }> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const updateChecklistItem = async (
  taskId: string,
  itemIndex: number,
  completed: boolean
): Promise<TaskResponse> => {
  const response = await api.patch(`/tasks/${taskId}/checklist/${itemIndex}`, {
    completed,
  });
  return response.data;
};

export const getTaskStats = async (
  userId?: string
): Promise<TaskStatsResponse> => {
  const params = userId ? `?userId=${userId}` : "";
  const response = await api.get(`/tasks/stats/summary${params}`);
  return response.data;
};

// Utility functions
export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: "gray",
    medium: "blue",
    high: "orange",
    urgent: "red",
  };
  return colors[priority] || "gray";
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    todo: "gray",
    "in-progress": "blue",
    blocked: "red",
    completed: "green",
    cancelled: "gray",
  };
  return colors[status] || "gray";
};

export const isTaskOverdue = (task: Task): boolean => {
  if (
    !task.dueDate ||
    task.status === "completed" ||
    task.status === "cancelled"
  ) {
    return false;
  }
  return new Date(task.dueDate) < new Date();
};

export const isTaskDueToday = (task: Task): boolean => {
  if (
    !task.dueDate ||
    task.status === "completed" ||
    task.status === "cancelled"
  ) {
    return false;
  }
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  return dueDate.toDateString() === today.toDateString();
};

export const formatTaskDate = (date?: string): string => {
  if (!date) return "No due date";
  const taskDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (taskDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (taskDate.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else if (taskDate < today) {
    const days = Math.floor(
      (today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} day${days > 1 ? "s" : ""} overdue`;
  } else {
    return taskDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        taskDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
};

export const getChecklistProgress = (
  task: Task
): { completed: number; total: number } => {
  const total = task.checklist?.length || 0;
  const completed =
    task.checklist?.filter((item) => item.completed).length || 0;
  return { completed, total };
};

export default {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateChecklistItem,
  getTaskStats,
  getPriorityColor,
  getStatusColor,
  isTaskOverdue,
  isTaskDueToday,
  formatTaskDate,
  getChecklistProgress,
};
